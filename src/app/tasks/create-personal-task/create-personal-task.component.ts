import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Attachment } from 'src/shared/Models/attachment.model';
import { State } from '../../dashboard/states/main.reducer';
import * as MainActions from '../../dashboard/states/main.actions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TaskService } from 'src/shared/services/task.services';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';
import { SocketService } from 'src/shared/services/socket.service';
import { Observable } from 'rxjs';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-create-personal-task',
  templateUrl: './create-personal-task.component.html',
  styleUrls: ['./create-personal-task.component.scss'],
})
export class CreatePersonalTaskComponent implements OnInit {
  Form: FormGroup;
  attachments: Attachment[] = [];
  Socket$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<CreatePersonalTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngxService: NgxUiLoaderService,
    private taskservice: TaskService,
    private formBuilder: FormBuilder,
    private socketservice: SocketService,
    private store: Store<State>,
    public dialog: MatDialog
  ) {
    this.Form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.Socket$ = this.socketservice.socketInstanceObservable;
  }

  validateStartDate(event: any) {
    const currentdate = new Date();
    const startdate = new Date(event.target.value);

    if (startdate < currentdate) {
      this.Form.get('startDate').setValue(
        moment().format('YYYY-MM-DDTHH:mm:ss')
      );
      this.alertWithError('NEW TASK', 'THE START DATE MUST BE CURRENT OR MORE');
    }
  }

  validateEndDate(event: any) {
    const startdate = new Date(this.Form.get('startDate').value);
    const enddate = new Date(event.target.value);

    if (enddate < startdate) {
      this.Form.get('endDate').setValue(
        moment().add(1, 'days').format('YYYY-MM-DDTHH:mm:ss')
      );
      this.alertWithError(
        'NEW TASK',
        'THE END DATE MUST BE MORE THAN THE START DATE'
      );
    }
  }

  newtask() {
    if (this.Form.valid) {
      this.validateProjectDate();
    } else {
      this.Form.markAllAsTouched();
      this.alertWithError('NEW TASK', 'COMPLETE THE TASK DETAILS TO SUBMIT');
    }
  }

  validateProjectDate() {
    const startdate = new Date(this.Form.get('startDate').value);
    const enddate = new Date(this.Form.get('endDate').value);

    if (enddate < startdate) {
      this.Form.get('endDate').setValue(
        moment().add(1, 'days').format('YYYY-MM-DDTHH:mm:ss')
      );
      this.alertWithError(
        'NEW TASK',
        'THE END DATE MUST BE MORE THAN THE START DATE'
      );
    } else {
      this.confirmProjectSubmission();
    }
  }

  confirmProjectSubmission() {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'NEW TASK WIL BE CREATED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, create!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitProject();
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

  submitProject() {
    this.ngxService.start();

    const postbody = {
      title: this.Form.get('title').value,
      description: this.Form.get('description').value,
      startDate: new Date(this.Form.get('startDate').value).toString(),
      endDate: new Date(this.Form.get('endDate').value).toString(),
      attachments: this.attachments,
    };

    const sub = this.taskservice.saveTask(postbody).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.store.dispatch(
            MainActions.AddNewTask({ task: response['data'] })
          );
          this.ngxService.stop();
          this.alertWithSuccess('NEW TASK', 'NEW TASK CREATED');
          this.sendNewProjectMessage();
          this.close();
          sub.unsubscribe();
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.ngxService.stop();
        this.alertWithError('NEW PROJECT', message.toUpperCase());
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

  sendNewProjectMessage() {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('NewPersonalTaskCreated', {
          author: JSON.parse(localStorage.getItem('authUser')),
        });
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
