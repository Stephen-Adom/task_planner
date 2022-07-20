import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Attachment } from 'src/shared/Models/attachment.model';
import { State } from '../../dashboard/states/main.reducer';
import * as MainActions from '../../dashboard/states/main.actions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TaskService } from 'src/shared/services/task.services';
import { HttpErrorResponse } from '@angular/common/http';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-add-personal-attachment',
  templateUrl: './add-personal-attachment.component.html',
  styleUrls: ['./add-personal-attachment.component.scss'],
})
export class AddPersonalAttachmentComponent implements OnInit {
  attachments: Attachment[] = [];
  group: any;
  Socket$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<AddPersonalAttachmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngxService: NgxUiLoaderService,
    private taskservice: TaskService,
    private store: Store<State>,
    public dialog: MatDialog
  ) {
    this.group = data['group'];
  }

  ngOnInit(): void {}

  newattachment() {
    this.confirmProjectSubmission();
  }

  confirmProjectSubmission() {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'NEW ATTACHMENT WILL BE ADDED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, add!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitAttachment();
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your current operation is cancelled :)',
            'info'
          );
          this.close();
        }
      });
  }

  submitAttachment() {
    this.ngxService.start();

    const postbody = {
      attachments: this.attachments,
    };

    const sub = this.taskservice
      .updatePersonalAttachments(this.group._id, postbody)
      .subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.ngxService.stop();
            this.store.dispatch(
              MainActions.UpdatePersonalTaskAttachments({
                attachments: response['data'],
              })
            );
            this.alertWithSuccess(
              'PROJECT ATTACHMENT',
              'ATTACHMENT(S) UPDATED'
            );
            this.dialogRef.close({
              attachments: response['data']['attachments'],
            });
            sub.unsubscribe();
          }
        },
        (error: HttpErrorResponse) => {
          const message = error.error.message;
          this.ngxService.stop();
          this.alertWithError('PROJECT ATTACHMENT', message);
          sub.unsubscribe();
        }
      );
  }

  close() {
    this.dialogRef.close();
  }

  uploadAttachment(event) {
    const files = event.target.files;
    for (const file of files) {
      this.readBase64(file).then((data) => {
        this.attachments.push({
          name: file.name,
          file: data,
          filetype: file.type,
          filesize: file.size,
        });
      });
    }
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
