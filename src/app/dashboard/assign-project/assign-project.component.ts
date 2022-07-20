import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GroupTasks } from 'src/shared/Models/task.model';
import { User } from 'src/shared/Models/User.model';
import { TaskService } from 'src/shared/services/task.services';
import {
  getAllPendingGroupTasks,
  getAllPendingGroupTasksNumber,
  State,
} from '../states/main.reducer';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HttpErrorResponse } from '@angular/common/http';
import * as MainActions from '../states/main.actions';
import { SocketService } from 'src/shared/services/socket.service';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-assign-project',
  templateUrl: './assign-project.component.html',
  styleUrls: ['./assign-project.component.scss'],
})
export class AssignProjectComponent implements OnInit {
  PendingProjects$: Observable<GroupTasks[]>;
  PendingProjectsNum$: Observable<number>;
  member: User;
  AssignedProject: GroupTasks;
  Socket$: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<AssignProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socketservice: SocketService,
    private store: Store<State>,
    private taskservice: TaskService,
    private ngxService: NgxUiLoaderService
  ) {
    this.member = this.data.user;
  }

  ngOnInit(): void {
    this.PendingProjects$ = this.store.select(getAllPendingGroupTasks);
    this.PendingProjectsNum$ = this.store.select(getAllPendingGroupTasksNumber);
    this.Socket$ = this.socketservice.socketInstanceObservable;
  }

  getProjectCharacter(project: GroupTasks) {
    return project.title.charAt(0).toUpperCase();
  }

  close() {
    this.dialogRef.close();
  }

  selectProject(project: GroupTasks) {
    const existingMember = project.members.find(
      (item) => item.member_uuid === this.member.uuid
    );

    if (existingMember) {
      this.alertWithError('PROJECT ASSIGNMENT', 'USER IS ALREADY A MEMBER');
      this.AssignedProject = null;
    } else {
      this.AssignedProject = project;
    }
  }

  submit() {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'NEW MEMBER WIL BE ASSIGN TO THIS PROJECT!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, assign!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitAssignment();
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

  submitAssignment() {
    this.ngxService.start();

    const postbody = {
      member: this.member,
    };

    const sub = this.taskservice
      .assignProject(this.AssignedProject._id, postbody)
      .subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.ngxService.stop();
            this.alertWithSuccess('PROJECT ASSIGNMENT', response['message']);
            this.store.dispatch(MainActions.FetchPendingGroupTasks());
            this.sendProjectAssignedMessage(this.AssignedProject, this.member);
            sub.unsubscribe();
            this.close();
          }
        },
        (error: HttpErrorResponse) => {
          this.ngxService.stop();
          console.log(error);
          const message = error.error.message;
          this.alertWithError('PROJECT ASSIGNMENT', message.toUpperCase());
          sub.unsubscribe();
        }
      );
  }

  sendProjectAssignedMessage(assignedproject: GroupTasks, newmember: User) {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('NewMemberAssignedToProject', {
          author: JSON.parse(localStorage.getItem('authUser')),
          project: assignedproject,
          member: newmember,
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
