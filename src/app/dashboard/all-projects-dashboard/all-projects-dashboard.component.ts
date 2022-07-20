import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable } from 'rxjs';
import { GroupTasks } from 'src/shared/Models/task.model';
import {
  getAllCancelledGroupTask,
  getAllCancelledGroupTaskNumber,
  getAllCompletedGroupTask,
  getAllCompletedGroupTaskNumber,
  getAllInProgressGroupTasks,
  getAllInProgressGroupTasksNumber,
  getAllPendingGroupTasks,
  getAllPendingGroupTasksNumber,
  getTotalActiveProjects,
  State,
} from '../states/main.reducer';
import * as MainActions from '../states/main.actions';
import { CreateNewTaskComponent } from '../create-new-task/create-new-task.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TaskService } from 'src/shared/services/task.services';
import { HttpErrorResponse } from '@angular/common/http';
import { SocketService } from 'src/shared/services/socket.service';
import { User } from 'src/shared/Models/User.model';
import { GroupProjectViewComponent } from '../group-project-view/group-project-view.component';
import { StartChatDialogComponent } from '../start-chat-dialog/start-chat-dialog.component';
import { ChatService } from 'src/shared/services/chat.services';
import { Router } from '@angular/router';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-all-projects-dashboard',
  templateUrl: './all-projects-dashboard.component.html',
  styleUrls: ['./all-projects-dashboard.component.scss'],
})
export class AllProjectsDashboardComponent implements OnInit {
  PendingGroupTasks$: Observable<GroupTasks[]>;
  PendingGroupTasksNumber$: Observable<Number>;
  InProgressGroupTasks$: Observable<GroupTasks[]>;
  InProgressGroupTasksNumber$: Observable<Number>;
  CompletedGroupTasks$: Observable<GroupTasks[]>;
  CompletedGroupTasksNumber$: Observable<number>;
  TotalActiveProjects$: Observable<number>;
  CancelledGroupTasks$: Observable<GroupTasks[]>;
  CancelledGroupTasksNumber$: Observable<number>;
  Socket$: Observable<any>;
  authUser: User;

  constructor(
    private store: Store<State>,
    private dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private socketservice: SocketService,
    private chatservice: ChatService,
    private router: Router,
    private taskservice: TaskService
  ) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
  }

  ngOnInit(): void {
    this.PendingGroupTasksNumber$ = this.store.select(
      getAllPendingGroupTasksNumber
    );
    this.PendingGroupTasks$ = this.store.select(getAllPendingGroupTasks);
    this.InProgressGroupTasks$ = this.store.select(getAllInProgressGroupTasks);
    this.InProgressGroupTasksNumber$ = this.store.select(
      getAllInProgressGroupTasksNumber
    );
    this.CompletedGroupTasks$ = this.store.select(getAllCompletedGroupTask);
    this.CompletedGroupTasksNumber$ = this.store.select(
      getAllCompletedGroupTaskNumber
    );
    this.TotalActiveProjects$ = this.store.select(getTotalActiveProjects);
    this.CancelledGroupTasks$ = this.store.select(getAllCancelledGroupTask);
    this.CancelledGroupTasksNumber$ = this.store.select(
      getAllCancelledGroupTaskNumber
    );

    this.fetchAllTasks();
  }

  formateStartDate(date) {
    const dateObj = new Date(date);
    return moment(dateObj).format('lll');
  }

  addProject() {
    const dialogRef = this.dialog.open(CreateNewTaskComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
      } else {
        return;
      }
    });
  }

  startProject(project: GroupTasks) {
    this.verifyProjectLeader(project);
  }

  verifyProjectLeader(project: GroupTasks) {
    if (project.leader === this.authUser.uuid) {
      swalWithBootstrapButtons
        .fire({
          title: 'ARE YOU SURE?',
          text: 'THE PROJECT WIL BE STARTED!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, start!',
          cancelButtonText: 'No, close!',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.submitStartProject(project);
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
    } else {
      this.alertWithError(
        'PROJECT STATUS',
        'YOU ARE NOT AUTHORISED TO START THE PROJECT. CONTACT THE PROJECT LEADER'
      );
    }
  }

  submitStartProject(project: GroupTasks) {
    this.ngxService.start();

    const sub = this.taskservice.startProject(project._id).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.ngxService.stop();
          this.updatePendingStore(project);
          this.store.dispatch(
            MainActions.AddProgressProject({ project: response['data'] })
          );
          this.sendProjectStartMessage(response['data']);
          sub.unsubscribe();
        }
      },
      (error: HttpErrorResponse) => {
        this.ngxService.stop();
        const message = error.error.message;
        this.alertWithError('PROJECT UPDATE', message.toUpperCase());
        sub.unsubscribe();
      }
    );
  }

  updatePendingStore(pendingproject: GroupTasks) {
    let tasks: GroupTasks[] = [];
    this.PendingGroupTasks$.subscribe((items) => (tasks = items));

    if (tasks.length) {
      let newTaskArray = [...tasks];
      const index = newTaskArray.findIndex(
        (item) => item._id === pendingproject._id
      );
      newTaskArray.splice(index, 1);
      this.store.dispatch(
        MainActions.UpdatePendingProject({ projects: newTaskArray })
      );
    }
  }

  /** CANCEL PROJECT */
  cancelPendingProject(project: GroupTasks) {
    this.verifyProjectLeaderToCancelPendingProject(project);
  }

  verifyProjectLeaderToCancelPendingProject(project: GroupTasks) {
    if (project.leader === this.authUser.uuid) {
      this.confirmPendingCancel(project);
    } else {
      this.alertWithError(
        'PROJECT STATUS',
        'YOU ARE NOT AUTHORISED TO CANCEL THE PROJECT. CONTACT THE PROJECT LEADER'
      );
    }
  }

  confirmPendingCancel(project: GroupTasks) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'THE CURRENT PROJECT WIL BE CANCELLED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, cancel!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitCancelPendingProject(project);
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

  submitCancelPendingProject(project: GroupTasks) {
    this.ngxService.start();

    const sub = this.taskservice.cancelProject(project._id).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.updatePendingStore(project);
          this.store.dispatch(
            MainActions.AddCancelledProject({ task: response['data'] })
          );
          this.sendProjectCancelledMessage(response['data']);
          this.ngxService.stop();
          sub.unsubscribe();
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.alertWithError('PROJECT UPDATE', message.toUpperCase());
        this.ngxService.stop();
        sub.unsubscribe();
      }
    );
  }
  /** CANCEL PROJECT */

  /**COMPLETE IN PROGRESS PROJECT  */
  completeProject(project: GroupTasks) {
    this.verifyProjectLeaderToComplete(project);
  }

  verifyProjectLeaderToComplete(project: GroupTasks) {
    if (project.leader === this.authUser.uuid) {
      swalWithBootstrapButtons
        .fire({
          title: 'ARE YOU SURE?',
          text: 'THE CURRENT PROJECT WLL BE COMPLETED!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, submit!',
          cancelButtonText: 'No, close!',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.submitCompleteProject(project);
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
    } else {
      this.alertWithError(
        'PROJECT STATUS',
        'YOU ARE NOT AUTHORISED TO COMPLETE THE PROJECT. CONTACT THE PROJECT LEADER'
      );
    }
  }
  submitCompleteProject(project: GroupTasks) {
    this.ngxService.start();

    const sub = this.taskservice.completeProject(project._id).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.updateInprogressProjectStore(project);
          this.store.dispatch(
            MainActions.AddCompletedProject({ task: response['data'] })
          );
          this.sendProjectCompletedMessage(response['data']);
          this.ngxService.stop();
          sub.unsubscribe();
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.alertWithError('PROJECT UPDATE', message.toUppperCase());
        this.ngxService.stop();
        sub.unsubscribe;
      }
    );
  }

  updateInprogressProjectStore(project: GroupTasks) {
    let tasks: GroupTasks[] = [];
    this.InProgressGroupTasks$.subscribe((items) => (tasks = items));

    if (tasks.length) {
      let newTaskArray = [...tasks];
      const index = newTaskArray.findIndex((item) => item._id === project._id);
      newTaskArray.splice(index, 1);
      this.store.dispatch(
        MainActions.UpdateInprogressProjects({ projects: newTaskArray })
      );
    }
  }
  /**COMPLETE IN PROGRESS PROJECT  */

  /** CANCEL IN PROGRESS PROJECT */
  cancelProgressProject(project: GroupTasks) {
    this.verifyProjectLeaderToCancelProgressProject(project);
  }

  verifyProjectLeaderToCancelProgressProject(project: GroupTasks) {
    if (project.leader === this.authUser.uuid) {
      this.confirmProgressCancel(project);
    } else {
      this.alertWithError(
        'PROJECT STATUS',
        'YOU ARE NOT AUTHORISED TO CANCEL THE PROJECT. CONTACT THE PROJECT LEADER'
      );
    }
  }

  confirmProgressCancel(project: GroupTasks) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'THE CURRENT PROJECT WIL BE CANCELED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, cancel!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitCancelProgressProject(project);
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

  submitCancelProgressProject(project: GroupTasks) {
    this.ngxService.start();

    const sub = this.taskservice.cancelProject(project._id).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.updateInprogressProjectStore(project);
          this.store.dispatch(
            MainActions.AddCancelledProject({ task: response['data'] })
          );
          this.sendProjectCancelledMessage(response['data']);
          this.ngxService.stop();
          sub.unsubscribe();
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.alertWithError('PROJECT UPDATE', message.toUpperCase());
        this.ngxService.stop();
        sub.unsubscribe();
      }
    );
  }
  /** CANCEL IN PROGRESS PROJECT */

  sendProjectStartMessage(project: GroupTasks) {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('GroupProjectStarted', { author: this.authUser, project });
      }
    });
  }

  sendProjectCancelledMessage(project: GroupTasks) {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('GroupProjectCancelled', {
          author: this.authUser,
          project,
        });
      }
    });
  }

  sendProjectCompletedMessage(project: GroupTasks) {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('GroupProjectCompleted', {
          author: this.authUser,
          project,
        });
      }
    });
  }

  startGroupChat(project) {
    this.verifyChatSession(project);
  }

  verifyChatSession(project: GroupTasks) {
    this.ngxService.start();

    const sub = this.chatservice.verifyGroupChat(project._id).subscribe(
      (response) => {
        if (response['status'] === 200) {
          if (response['data']) {
            this.store.dispatch(
              MainActions.AddGroupChat({ group: response['data'] })
            );
            this.router.navigate(['/chat/group_chat']);
          } else {
            this.createNewChatSession(project);
          }
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.ngxService.stop();
        this.alertWithError('CHAT SESSION', message.toUpperCase());
        sub.unsubscribe();
      }
    );
  }

  createNewChatSession(project: GroupTasks) {
    const dialogRef = this.dialog.open(StartChatDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      disableClose: true,
      data: { project },
    });

    dialogRef.afterClosed().subscribe((data) => {
      return;
    });
  }

  viewProject(project: GroupTasks) {
    const dialogRef = this.dialog.open(GroupProjectViewComponent, {
      width: '1500px',
      panelClass: 'custom-dialog',
      disableClose: true,
      data: { project },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
      } else {
        return;
      }
    });
  }

  fetchAllTasks() {
    this.store.dispatch(MainActions.FetchPendingGroupTasks());
    this.store.dispatch(MainActions.FetchInprogressGroupTasks());
    this.store.dispatch(MainActions.FetchCompletedGroupTasks());
    this.store.dispatch(MainActions.FetchCancelledGroupTasks());
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
