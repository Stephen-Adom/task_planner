import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { UserService } from 'src/shared/services/user.services';
import Swal from 'sweetalert2/dist/sweetalert2.js';
var resizebase64 = require('resize-base64');

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss'],
})
export class CompleteRegistrationComponent implements OnInit {
  @ViewChild('stepper')
  private stepper!: MatStepper;

  defaultImg: string | ArrayBuffer = 'assets/images/media/users/100_6.jpg';

  constructor(private router: Router, private userservice: UserService) {}

  ngOnInit(): void {}

  nextStep() {
    this.stepper.next();
  }

  previousStep() {
    this.stepper.previous();
  }

  dashboard() {
    this.router.navigate(['/dashboard']);
  }

  updateprofile(event) {
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
        this.resizeImage(reader.result, 100, 100).then((result: string) => {
          this.defaultImg = result;
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
      image: this.defaultImg,
    };
    const sub = this.userservice.updateUserProfile(postBody).subscribe(
      (response) => {},
      (error: HttpErrorResponse) => {
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
