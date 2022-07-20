import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/shared/services/auth.services';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { State } from '../auth-state/auth.reducer';
import * as AuthActions from '../auth-state/auth.actions';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
  constructor(
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private authservice: AuthService,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.getToken();
  }

  getToken() {
    const url = this.router.url;
    const urlArray = url.split('?');
    const tokenKey = urlArray[1];
    const token = tokenKey.split('=')[1];
    window.history.pushState(
      {},
      document.title,
      '/' + `auth/email-verification`
    );
    this.verifyToken(token);
  }

  verifyToken(token) {
    this.ngxService.start();

    const postBody = {
      token: token,
    };

    const sub = this.authservice.verifyEmailToken(postBody).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('authUser', JSON.stringify(response.data));

          console.log(response.data);

          this.store.dispatch(
            AuthActions.StoreUserCredentials({
              user: response['data'],
            })
          );

          this.router.navigate(['/auth/email-verification/success']);
        }
      },
      (error: HttpErrorResponse) => {
        this.ngxService.stop();
        const message = error.error.message;
        this.alertWithError('EMAIL VERIFICATION', message);
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
