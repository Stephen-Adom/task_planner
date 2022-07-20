import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/shared/services/auth.services';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-confirm-email-dialog',
  templateUrl: './confirm-email-dialog.component.html',
  styleUrls: ['./confirm-email-dialog.component.scss'],
})
export class ConfirmEmailDialogComponent implements OnInit {
  Form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ConfirmEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    public dialog: MatDialog
  ) {
    this.Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.Form.valid) {
      this.confirmSubmission();
    } else {
      this.Form.markAllAsTouched();
      this.alertWithError('FORGOT PASSWORD', 'COMPLETE THE FORM TO CONTINUE');
    }
  }

  confirmSubmission() {
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: 'A Request for Reset Password will be Sent!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1bc5bd',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitEmail();
        }
      });
  }

  submitEmail() {
    this.ngxService.start();

    const postBody = {
      email: this.Form.get('email').value,
    };

    const sub = this.authservice.resetPassword(postBody).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.alertWithSuccess('FORGOT PASSWORD', response['message']);
          this.close();
        }
        this.ngxService.stop();
        sub.unsubscribe();
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.alertWithError('FORGOT PASSWORD', message.toUpperCase());
        this.ngxService.stop();
        sub.unsubscribe();
      }
    );
  }

  close() {
    this.dialogRef.close();
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
