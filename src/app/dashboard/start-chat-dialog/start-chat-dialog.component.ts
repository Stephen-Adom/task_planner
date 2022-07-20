import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GroupTasks } from 'src/shared/Models/task.model';
import { ChatService } from 'src/shared/services/chat.services';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { getAllGroupChats, State } from '../states/main.reducer';
import * as MainActions from '../states/main.actions';
import { Observable } from 'rxjs';
import { User } from 'src/shared/Models/User.model';
import { SocketService } from 'src/shared/services/socket.service';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-start-chat-dialog',
  templateUrl: './start-chat-dialog.component.html',
  styleUrls: ['./start-chat-dialog.component.scss'],
})
export class StartChatDialogComponent implements OnInit {
  ChatSessions$: Observable<any[]>;
  default_img = 'assets/images/media/default/default.jpg';
  Form: FormGroup;
  file_data: '';
  file_name: '';
  project: GroupTasks;
  authUser: User;
  Socket$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<StartChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngxService: NgxUiLoaderService,
    private socketservice: SocketService,
    private chatservice: ChatService,
    private formBuilder: FormBuilder,
    private store: Store<State>,
    private router: Router
  ) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
    this.project = data.project;

    this.Form = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.Socket$ = this.socketservice.socketInstanceObservable;
    this.ChatSessions$ = this.store.select(getAllGroupChats);
    console.log(this.project);
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.Form.valid) {
      this.verifyIfUserBelongs();
    } else {
      this.Form.markAllAsTouched();
      this.alertWithError('CHAT SESSION', 'ENTER YOUR GROUP NAME');
    }
  }

  verifyIfUserBelongs() {
    const exist = this.project.members.find(
      (member) => member.member_uuid === this.authUser.uuid
    );

    if (exist) {
      this.verifyIfChatExist();
    } else {
      this.alertWithError(
        'GROUP CHAT',
        'SORRY, YOU DONT BELONG TO THIS GROUP PROJECT'
      );
    }
  }

  verifyIfChatExist() {
    this.ngxService.start();

    const sub = this.chatservice.verifyGroupChat(this.project._id).subscribe(
      (response) => {
        if (response['status'] === 200) {
          if (response['data']) {
            this.ngxService.stop();
            this.router.navigate(['/chat/session']);
          } else {
            this.ngxService.stop();
            this.submitInfo();
          }
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.ngxService.stop();
        this.alertWithError('CHAT SESSION', message.toUpperCase());
        sub.unsubscribe();
      }
    );
  }

  submitInfo() {
    this.ngxService.start();

    const postBody = {
      name: this.Form.get('name').value,
      project: this.project,
      image: this.file_data,
    };

    const sub = this.chatservice.createGroupChat(postBody).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.ngxService.stop();
          this.close();
          this.alertWithSuccess('CHAT SESSION', 'NEW SESSION CREATED');
          this.store.dispatch(
            MainActions.AddGroupChat({ group: response['data'] })
          );
          this.JoinChatToRoom(response['data']);
          this.router.navigate(['/chat/session']);
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.ngxService.stop();
        this.alertWithError('CHAT SESSION', message.toUpperCase());
        sub.unsubscribe();
      }
    );
  }

  uploadAttachment(event) {
    const file = event.target.files[0];
    console.log(file);
    this.readBase64(file).then((data) => {
      this.default_img = data;
      this.file_data = data;
      this.file_name = file.name;
    });
  }

  readBase64(file): Promise<any> {
    const reader = new FileReader();
    const future = new Promise((resolve, reject) => {
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );
      reader.addEventListener(
        'error',
        function (event) {
          reject(event);
        },
        false
      );

      reader.readAsDataURL(file);
    });
    return future;
  }

  JoinChatToRoom(chat: any) {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('joinRoom', {
          user: this.authUser.uuid,
          room: chat._id,
        });
      }
    });
  }

  alertWithError(title: string, content: string) {
    swalWithBootstrapButtons.fire({
      icon: 'error',
      title: title,
      text: content,
    });
  }

  alertWithSuccess(title: string, content: string) {
    swalWithBootstrapButtons.fire({
      icon: 'success',
      title: title,
      text: content,
    });
  }
}
