import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { AuthService } from 'src/shared/services/auth.services';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Store } from '@ngrx/store';
import { State } from '../auth-state/auth.reducer';
import * as AuthActions from '../auth-state/auth.actions';
import { MatDialog } from '@angular/material/dialog';
import { EmailVerificationMessageComponent } from '../email-verification-message/email-verification-message.component';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  Form: FormGroup;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;

  constructor(
    private authservice: AuthService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private store: Store<State>,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.Form = this.formBuilder.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phonenumber: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
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
        localStorage.setItem('settings', JSON.stringify(message.data.settings));

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
    console.log(this.Form);
    if (this.Form.valid) {
      this.submitInfo();
    } else {
      this.Form.markAllAsTouched();
      this.alertWithError('REGISTRATION', 'COMPLETE THE FORM TO REGISTER');
    }
  }

  submitInfo() {
    const phone = this.Form.get('phonenumber').value;
    console.log(phone);
    const postBody = {
      firstname: this.Form.get('firstname').value,
      lastname: this.Form.get('lastname').value,
      email: this.Form.get('email').value,
      phonenumber: phone.number,
      password: this.Form.get('password').value,
      confirmPassword: this.Form.get('confirmPassword').value,
    };

    this.ngxService.start();

    const sub = this.authservice.register(postBody).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          this.ngxService.stop();
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
          // this.showEmailVerificationMessage();
        }
      },
      (error: HttpErrorResponse) => {
        this.ngxService.stop();
        const message = error.error.message;
        this.alertWithError('REGISTRATION', message.toUpperCase());
        sub.unsubscribe();
      }
    );
  }

  showEmailVerificationMessage() {
    const dialogRef = this.dialog.open(EmailVerificationMessageComponent, {
      width: '600px',
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
