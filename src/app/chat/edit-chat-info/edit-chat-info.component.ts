import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { State } from 'src/app/dashboard/states/main.reducer';
import { User } from 'src/shared/Models/User.model';
import { ChatService } from 'src/shared/services/chat.services';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as MainActions from '../../dashboard/states/main.actions';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-edit-chat-info',
  templateUrl: './edit-chat-info.component.html',
  styleUrls: ['./edit-chat-info.component.scss'],
})
export class EditChatInfoComponent implements OnInit {
  default_img = 'assets/images/media/default/default.jpg';
  authUser: User;
  chat: any;
  Form: FormGroup;
  file_data: '';
  file_name: '';

  constructor(
    public dialogRef: MatDialogRef<EditChatInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngxService: NgxUiLoaderService,
    private chatservice: ChatService,
    private formBuilder: FormBuilder,
    private store: Store<State>
  ) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
    this.chat = data.chat;
    this.default_img = this.chat.image
      ? this.chat.image
      : 'assets/images/media/default/default.jpg';

    this.Form = this.formBuilder.group({
      name: [this.chat.name, Validators.required],
    });
  }

  ngOnInit(): void {}

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

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.Form.valid) {
      this.confirmSubmit();
    } else {
      this.Form.markAllAsTouched();
      this.alertWithError(
        'CHAT INFO',
        'ENTER CHAT GROUP NAME OR IMAGE TO SUBMIT'
      );
    }
  }

  confirmSubmit() {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'THE CHAT INFO WIL BE UPDATED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitChatInfo();
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your current operation is cancelled :)',
            'info'
          );
        }
      });
  }

  submitChatInfo() {
    this.ngxService.start();

    const postbody = {
      name: this.Form.get('name')?.value,
      image: this.file_data,
    };

    const sub = this.chatservice
      .updateChatInfo(this.chat._id, postbody)
      .subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.ngxService.stop();
            this.store.dispatch(
              MainActions.UpdateGroupChat({ chat: response['data'] })
            );
            this.dialogRef.close();
          }
        },
        (error: HttpErrorResponse) => {
          this.ngxService.stop();
          this.alertWithError('CHAT INFO', error['error']['message']);
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

  alertWithSuccess(title: string, content: string) {
    swalWithBootstrapButtons.fire({
      icon: 'success',
      title: title,
      text: content,
    });
  }
}
