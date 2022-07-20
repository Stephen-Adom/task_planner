import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/shared/Models/User.model';
import {
  getAllUsers,
  getSelectedMembers,
  State,
} from '../../dashboard/states/main.reducer';
import * as MainActions from '../../dashboard/states/main.actions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ChatService } from 'src/shared/services/chat.services';
import { HttpErrorResponse } from '@angular/common/http';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  AllUsers$: Observable<User[]>;
  authUser: User;
  selectedUser: User;

  constructor(
    public dialogRef: MatDialogRef<UsersListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngxService: NgxUiLoaderService,
    private chatservice: ChatService,
    private store: Store<State>
  ) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
  }

  ngOnInit(): void {
    this.AllUsers$ = this.store.select(getAllUsers);
  }

  addUser(user: User) {
    this.selectedUser = user;
  }

  checkIfExist(user: User): any {
    if (this.selectedUser) {
      return this.selectedUser.uuid === user.uuid;
    }
  }

  close() {
    this.dialogRef.close();
  }

  addChat() {
    this.createChatObject();
  }

  createChatObject() {
    this.ngxService.start();

    const postbody = {
      receiver: {
        user_id: this.selectedUser.uuid,
        firstname: this.selectedUser.firstname,
        lastname: this.selectedUser.lastname,
        image: this.selectedUser.image,
      },
      sender: {
        user_id: this.authUser.uuid,
        firstname: this.authUser.firstname,
        lastname: this.authUser.lastname,
        image: this.authUser.image,
      },
    };

    const sub = this.chatservice.createChat(postbody).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.ngxService.stop();
          sub.unsubscribe();
          this.store.dispatch(
            MainActions.AddNewChat({ chat: response['data'] })
          );
          this.dialogRef.close();
        }
      },
      (error: HttpErrorResponse) => {
        this.alertWithError('NEW CHAT', error['error']['message']);
        this.ngxService.stop();
        sub.unsubscribe();
      }
    );
  }

  alertWithError(title: string, content: string) {
    swalWithBootstrapButtons.fire({
      icon: 'error',
      title: title,
      text: content,
    });
  }
}
