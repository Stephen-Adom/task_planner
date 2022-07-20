import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Attachment } from 'src/shared/Models/attachment.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-add-group-attachment',
  templateUrl: './add-group-attachment.component.html',
  styleUrls: ['./add-group-attachment.component.scss'],
})
export class AddGroupAttachmentComponent implements OnInit {
  attachments: Attachment[] = [];
  Socket$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<AddGroupAttachmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  submit() {
    this.dialogRef.close({ attachments: this.attachments });
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
