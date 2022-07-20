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
var resizebase64 = require('resize-base64');

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-edit-member-profile',
  templateUrl: './edit-member-profile.component.html',
  styleUrls: ['./edit-member-profile.component.scss'],
})
export class EditMemberProfileComponent implements OnInit {
  MemberProfile$: Observable<User>;
  member_id: string;
  profileImg: string = 'assets/images/media/default/default.jpg';
  Form: FormGroup;

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;

  constructor(
    private location: Location,
    private store: Store<State>,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userservice: UserService
  ) {
    this.Form = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phonenumber: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.MemberProfile$ = this.store.select(getMemberProfile);
    this.route.paramMap.subscribe((param) => {
      this.member_id = param.get('id');
      this.store.dispatch(MainActions.FetchMemberInfo({ id: this.member_id }));
    });

    this.populateForm();
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
          localStorage.setItem('authUser', JSON.stringify(response.data));
        }
      },
      (error: HttpErrorResponse) => {
        this.alertWithError('PROFILE UPDATE', error.error.message);
        console.log(error);
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
