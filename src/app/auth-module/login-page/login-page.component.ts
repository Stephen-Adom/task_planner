import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as AuthActions from '../auth-state/auth.actions';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/shared/services/auth.services';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { State } from '../auth-state/auth.reducer';
import { Router } from '@angular/router';
import { ConfirmEmailDialogComponent } from '../confirm-email-dialog/confirm-email-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  Form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private authservice: AuthService,
    private store: Store<State>,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  googleSignup() {
    const url = environment.serverUri + '/auth/google';

    window.open(
      url,
      'mywindow',
      'location=1,status=1,scrollbars=1, width=700,height=700'
    );

    let listener = window.addEventListener('message', (message) => {
      if (message.data.user && message.data.accessToken) {
        localStorage.setItem('accessToken', message.data.accessToken);
        localStorage.setItem('refreshToken', message.data.refreshToken);
        localStorage.setItem('authUser', JSON.stringify(message.data.user));

        this.store.dispatch(
          AuthActions.StoreUserCredentials({
            user: message.data.user,
          })
        );

        this.router.navigate(['/dashboard']);
      }
    });
  }

  submit() {
    if (this.Form.valid) {
      this.submitLoginInfo();
    } else {
      this.Form.markAllAsTouched();
      this.alertWithError(
        'AUTH LOGIN',
        'ENTER YOUR USERNAME AND PASSWORD TO LOGIN'
      );
    }
  }

  submitLoginInfo() {
    this.ngxService.start();

    const sub = this.authservice.login(this.Form.value).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('authUser', JSON.stringify(response.data));
          localStorage.setItem('settings', JSON.stringify(response.settings));

          console.log(response.data);

          this.store.dispatch(
            AuthActions.StoreUserCredentials({
              user: response['data'],
            })
          );

          this.store.dispatch(
            AuthActions.StoreUserSettings({
              settings: response['settings'],
            })
          );

          this.router.navigate(['/dashboard']);
        }
        this.ngxService.stop();
        sub.unsubscribe();
      },
      (error: HttpErrorResponse) => {
        this.ngxService.stop();
        const message = error.error.message;
        this.alertWithError('AUTH LOGIN', message.toUpperCase());
        sub.unsubscribe();
      }
    );
  }

  forgotPassword() {
    const dialogRef = this.dialog.open(ConfirmEmailDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.submitted) {
      } else {
        return;
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
