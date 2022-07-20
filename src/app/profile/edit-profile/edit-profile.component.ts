import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { Observable } from 'rxjs';
import { getMemberProfile } from 'src/app/dashboard/states/main.reducer';
import { State } from 'src/app/state/app.state';
import { User } from 'src/shared/Models/User.model';
import * as MainActions from '../../dashboard/states/main.actions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/shared/services/user.services';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as AuthActions from '../../auth-module/auth-state/auth.actions';
import { ConfirmPasswordValidator } from './confirm-password.validator';
var resizebase64 = require('resize-base64');

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  MemberProfile$: Observable<User>;
  member_id: string;
  profileImg: string = 'assets/images/media/default/default.jpg';
  Form: FormGroup;
  AlertForm: FormGroup;
  PasswordForm: FormGroup;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;

  notification_type: string;
  settings: any;
  theme: string;

  constructor(
    private location: Location,
    private store: Store<State>,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userservice: UserService,
    private ngxService: NgxUiLoaderService
  ) {
    if (localStorage.getItem('settings')) {
      this.settings = JSON.parse(localStorage.getItem('settings'));
      this.notification_type = this.settings['notification_type'];
      this.theme = this.settings['theme'];
    }

    this.Form = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phonenumber: ['', Validators.required],
    });

    this.AlertForm = this.formBuilder.group({
      receive_notification: [this.settings['receive_notification']],
    });

    this.PasswordForm = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  ngOnInit(): void {
    this.MemberProfile$ = this.store.select(getMemberProfile);
    this.route.paramMap.subscribe((param) => {
      this.member_id = param.get('id');
      this.store.dispatch(MainActions.FetchMemberInfo({ id: this.member_id }));
    });

    this.populateForm();

    this.AlertForm.get('receive_notification').valueChanges.subscribe(
      (data) => {
        this.sendAlertToDatabase(data);
      }
    );
  }

  back() {
    this.location.back();
  }

  populateForm() {
    this.MemberProfile$.subscribe((profile) => {
      if (profile) {
        this.profileImg = profile.image
          ? profile.image
          : 'assets/images/media/default/default.jpg';

        this.Form.patchValue({
          firstname: profile.firstname,
          lastname: profile.lastname,
          email: profile.email,
          phonenumber: profile.phonenumber,
        });
      }
    });
  }

  updatephoto(event) {
    const file = event.target.files[0];

    if (file.size / 1024 / 1024 > 5) {
      this.alertWithError(
        'IMAGE UPLOAD',
        'FILE SHOULD NOT BE GREATER THAN 5MB'
      );
      return;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.resizeImage(reader.result, 300, 300).then((result: string) => {
          console.log(result);
          this.profileImg = result;
          this.updateUserImageToDB();
        });
      };
    }
  }

  resizeImage(base64Str, width, height) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.src = base64Str;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const data = ctx.canvas.toDataURL();
        resolve(data);
      };
      img.onerror = (error) => reject(error);
    });
  }

  updateUserImageToDB() {
    const postBody = {
      image: this.profileImg,
    };
    const sub = this.userservice.updateUserProfile(postBody).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          this.store.dispatch(
            MainActions.FetchMemberInfo({ id: this.member_id })
          );
          this.store.dispatch(
            AuthActions.StoreUserCredentials({ user: response.data })
          );
          localStorage.setItem('authUser', JSON.stringify(response.data));
        }
      },
      (error: HttpErrorResponse) => {
        this.alertWithError('PROFILE UPDATE', error.error.message);
        console.log(error);
      }
    );
  }

  updateInfo() {
    if (this.Form.valid) {
      this.confirmSubmit();
    } else {
      this.Form.markAllAsTouched();
      this.alertWithError(
        'PROFILE UPDATE',
        'COMPLETE YOUR PROFILE INFO TO UPDATE'
      );
    }
  }

  confirmSubmit() {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'YOUR PROFILE INFO WILL BE UPDATED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitInfo();
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

  submitInfo() {
    this.ngxService.start();

    const phone = this.Form.get('phonenumber')?.value;

    const posbody = {
      firstname: this.Form.get('firstname')?.value,
      lastname: this.Form.get('lastname')?.value,
      email: this.Form.get('email')?.value,
      phonenumber: phone.e164Number,
    };

    const sub = this.userservice.updateInfo(posbody).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          this.ngxService.stop();
          this.store.dispatch(
            AuthActions.StoreUserCredentials({ user: response.data })
          );
          localStorage.setItem('authUser', JSON.stringify(response.data));
          this.alertWithSuccess('PROFILE UPDATE', 'PROFILE UPDATED');
        }
      },
      (error: HttpErrorResponse) => {
        this.ngxService.stop();
        const message = error.error.message;
        this.alertWithError('PROFILE UPDATE', message.toUpperCase());
        sub.unsubscribe();
      }
    );
  }

  // UPDATE RECEIVE NOTIFICATION
  sendAlertToDatabase(alert: boolean) {
    const postbody = {
      receive_notification: alert,
    };
    const sub = this.userservice.updateReceiveAlert(postbody).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          this.store.dispatch(
            AuthActions.StoreUserSettings({ settings: response.data })
          );
          localStorage.setItem('settings', JSON.stringify(response.data));
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.alertWithError('NOTIFICATION ALERT', message.toUpperCase());
        sub.unsubscribe();
      }
    );
  }

  // SELECT NOTIFICATION TYPE

  selectNotificationType(type: string) {
    this.notification_type = type;

    this.updateNotificationType();
  }

  updateNotificationType() {
    const postbody = {
      notification_type: this.notification_type,
    };
    const sub = this.userservice.updateAlertType(postbody).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          this.notification_type = response.data['notification_type'];
          this.store.dispatch(
            AuthActions.StoreUserSettings({ settings: response.data })
          );
          localStorage.setItem('settings', JSON.stringify(response.data));
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.alertWithError('NOTIFICATION ALERT', message.toUpperCase());
        sub.unsubscribe();
      }
    );
  }

  // UPDATE APP THEME
  changeThemeType(theme: string) {
    this.theme = theme;

    this.UpdateThemeInDatabase();
  }

  UpdateThemeInDatabase() {
    const postbody = {
      theme: this.theme,
    };
    const sub = this.userservice.updateAppTheme(postbody).subscribe(
      (response: any) => {
        if (response['status'] === 200) {
          this.theme = response.data['theme'];
          this.store.dispatch(
            AuthActions.StoreUserSettings({ settings: response.data })
          );
          localStorage.setItem('settings', JSON.stringify(response.data));
          window.location.reload();
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.alertWithError('NOTIFICATION ALERT', message.toUpperCase());
        sub.unsubscribe();
      }
    );
  }

  // UPDATE PASSWORD

  updatePassword() {
    if (this.PasswordForm.valid) {
      this.confirmPasswordChange();
    } else {
      this.PasswordForm.markAllAsTouched();
      this.alertWithError(
        'CHANGE PASSWORD',
        'ENTER YOUR CURRENT AND NEW PASSWORD TO UPDATE'
      );
    }
  }

  confirmPasswordChange() {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'YOUR PASSWORD INFO WILL BE UPDATED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitPasswordInfo();
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

  submitPasswordInfo() {
    this.ngxService.start();

    const postbody = {
      currentPassword: this.PasswordForm.get('currentPassword')?.value,
      newPassword: this.PasswordForm.get('newPassword')?.value,
    };

    const sub = this.userservice.updatePassword(postbody).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.ngxService.stop();
          this.PasswordForm.reset();
          this.alertWithSuccess('PASSWORD UPDATE', 'SUCCESSFUL');
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.alertWithError('PASSWORD UPDATE', message.toUpperCase());
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
