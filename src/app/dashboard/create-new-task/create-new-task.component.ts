import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Attachment } from 'src/shared/Models/attachment.model';
import { Members } from 'src/shared/Models/members.model';
import { User } from 'src/shared/Models/User.model';
import { MembersListDialogComponent } from '../members-list-dialog/members-list-dialog.component';
import { getSelectedMembers, State } from '../states/main.reducer';
import * as MainActions from '../states/main.actions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TaskService } from 'src/shared/services/task.services';
import { HttpErrorResponse } from '@angular/common/http';
import moment from 'moment';
import { SocketService } from 'src/shared/services/socket.service';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-create-new-task',
  templateUrl: './create-new-task.component.html',
  styleUrls: ['./create-new-task.component.scss'],
})
export class CreateNewTaskComponent implements OnInit {
  Form: FormGroup;
  attachments: Attachment[] = [];

  SelectedMembers$: Observable<Members[]>;
  Socket$: Observable<any>;
  leader: any;
  authUser: User;

  constructor(
    public dialogRef: MatDialogRef<CreateNewTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngxService: NgxUiLoaderService,
    private socketservice: SocketService,
    private taskservice: TaskService,
    private formBuilder: FormBuilder,
    private store: Store<State>,
    public dialog: MatDialog
  ) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }

    this.Form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.assignLeader();

    this.SelectedMembers$ = this.store.select(getSelectedMembers);

    this.Socket$ = this.socketservice.socketInstanceObservable;
  }

  assignLeader() {
    if (this.authUser) {
      if (this.authUser.userType === 'USER') {
        this.leader = {
          name: this.authUser.firstname + ' ' + this.authUser.lastname,
          uuid: this.authUser.uuid,
        };
      }
    }
  }

  validateStartDate(event: any) {
    const currentdate = new Date();
    const startdate = new Date(event.target.value);

    if (startdate < currentdate) {
      this.Form.get('startDate').setValue(
        moment().format('YYYY-MM-DDTHH:mm:ss')
      );
      this.alertWithError(
        'NEW PROJECT',
        'THE START DATE MUST BE CURRENT OR MORE'
      );
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
        'NEW PROJECT',
        'THE END DATE MUST BE MORE THAN THE START DATE'
      );
    }
  }

  selectLeader(member: Members) {
    this.leader = {
      name: member.firstname + ' ' + member.lastname,
      uuid: member.member_uuid,
    };
  }

  newtask() {
    if (this.Form.valid) {
      if (this.leader) {
        this.validateProject();
      } else {
        this.alertWithError('NEW PROJECT', 'SELECT PROJECT LEADER');
      }
    } else {
      this.Form.markAllAsTouched();
      this.alertWithError(
        'NEW PROJECT',
        'COMPLETE THE PROJECT DETAILS TO SUBMIT'
      );
    }
  }

  validateProject() {
    let members: Members[] = [];
    this.SelectedMembers$.subscribe((users) => (members = users));

    if (members.length) {
      this.validateProjectDate();
    } else {
      this.alertWithError(
        'NEW PROJECT',
        'ADD PARTICIPANT / MEMBERS FOR THIS PROJECT'
      );
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
        'NEW PROJECT',
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
        text: 'NEW PROJECT WIL BE CREATED!',
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

    let members: Members[] = [];
    this.SelectedMembers$.subscribe((users) => (members = users));

    if (members.length) {
      const postbody = {
        title: this.Form.get('title').value,
        description: this.Form.get('description').value,
        startDate: new Date(this.Form.get('startDate').value).toString(),
        endDate: new Date(this.Form.get('endDate').value).toString(),
        members: members,
        leader: this.leader.uuid,
        attachments: this.attachments,
      };

      const sub = this.taskservice.saveProject(postbody).subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.store.dispatch(
              MainActions.AddNewProject({ project: response['data'] })
            );
            this.ngxService.stop();
            this.store.dispatch(MainActions.ClearSelectedMembers());
            this.alertWithSuccess('NEW PROJECT', 'NEW PROJECT CREATED');
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
  }

  sendNewProjectMessage() {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('NewProjectCreated', {
          author: JSON.parse(localStorage.getItem('authUser')),
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  addMember() {
    const dialogRef = this.dialog.open(MembersListDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data) => {
      return;
    });
  }

  removeMember(user?: User) {
    let members: Members[] = [];

    this.SelectedMembers$.subscribe((users) => (members = users));

    if (members.length) {
      const allmemberArray = [...members];
      const index = allmemberArray.findIndex(
        (item) => item.member_uuid === user.uuid
      );
      allmemberArray.splice(index, 1);
      this.store.dispatch(MainActions.RemoveMember({ users: allmemberArray }));
    }
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
