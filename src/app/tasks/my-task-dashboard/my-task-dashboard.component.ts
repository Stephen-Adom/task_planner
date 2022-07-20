import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { CreatePersonalTaskComponent } from '../create-personal-task/create-personal-task.component';
import {
  getCanceledPersonalTasks,
  getCanceledPersonalTasksNum,
  getCompletedPersonalTasks,
  getCompletedPersonalTasksNum,
  getInProgressPersonalTasks,
  getInProgressPersonalTasksNum,
  getPendingPersonalTasks,
  getPendingPersonalTasksNum,
  getTotalActiveTasks,
  State,
} from '../../dashboard/states/main.reducer';
import * as MainActions from '../../dashboard/states/main.actions';
import { Observable } from 'rxjs';
import { PersonalTasks } from 'src/shared/Models/task.model';
import { User } from 'src/shared/Models/User.model';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TaskService } from 'src/shared/services/task.services';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SocketService } from 'src/shared/services/socket.service';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-my-task-dashboard',
  templateUrl: './my-task-dashboard.component.html',
  styleUrls: ['./my-task-dashboard.component.scss'],
})
export class MyTaskDashboardComponent implements OnInit {
  PendingTasks$: Observable<PersonalTasks[]>;
  PendingTasksNum$: Observable<number>;
  ProgressTasks$: Observable<PersonalTasks[]>;
  ProgressTasksNum$: Observable<number>;
  CompletedTasks$: Observable<PersonalTasks[]>;
  CompletedTasksNum$: Observable<number>;
  CanceledTasks$: Observable<PersonalTasks[]>;
  CanceledTasksNum$: Observable<number>;
  ActiveTasksNum$: Observable<number>;
  Socket$: Observable<any>;

  AuthUser: User;

  constructor(
    private dialog: MatDialog,
    private store: Store<State>,
    private ngxService: NgxUiLoaderService,
    private socketservice: SocketService,
    private taskservice: TaskService
  ) {
    if (localStorage.getItem('authUser')) {
      this.AuthUser = JSON.parse(localStorage.getItem('authUser'));
    }
  }

  ngOnInit(): void {
    this.PendingTasks$ = this.store.select(getPendingPersonalTasks);
    this.PendingTasksNum$ = this.store.select(getPendingPersonalTasksNum);
    this.ProgressTasks$ = this.store.select(getInProgressPersonalTasks);
    this.ProgressTasksNum$ = this.store.select(getInProgressPersonalTasksNum);
    this.CompletedTasks$ = this.store.select(getCompletedPersonalTasks);
    this.CompletedTasksNum$ = this.store.select(getCompletedPersonalTasksNum);
    this.CanceledTasks$ = this.store.select(getCanceledPersonalTasks);
    this.CanceledTasksNum$ = this.store.select(getCanceledPersonalTasksNum);
    this.ActiveTasksNum$ = this.store.select(getTotalActiveTasks);
    this.fetchTasks();
  }

  addNewTask() {
    const dialogRef = this.dialog.open(CreatePersonalTaskComponent, {
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

  fetchTasks() {
    this.store.dispatch(MainActions.FetchPendingTasks());
    this.store.dispatch(MainActions.FetchInprogressTasks());
    this.store.dispatch(MainActions.FetchCompletedTasks());
    this.store.dispatch(MainActions.FetchCancelledTasks());
  }

  formateStartDate(date) {
    const dateObj = new Date(date);
    return moment(dateObj).format('lll');
  }

  /**COMPLETE IN PROGRESS TASK  */
  completeTask(project: PersonalTasks) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'THE CURRENT TASK WLL BE COMPLETED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitCompleteTask(project);
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

  submitCompleteTask(project: PersonalTasks) {
    this.ngxService.start();

    const sub = this.taskservice.completeTask(project._id).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.updateInprogressTaskStore(project);
          this.store.dispatch(
            MainActions.AddCompletedTask({ task: response['data'] })
          );
          this.sendProjectCompletedMessage(response['data']);
          this.ngxService.stop();
          sub.unsubscribe();
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.alertWithError('TASK UPDATE', message.toUppperCase());
        this.ngxService.stop();
        sub.unsubscribe;
      }
    );
  }

  updateInprogressTaskStore(project: PersonalTasks) {
    let tasks: PersonalTasks[] = [];
    this.PendingTasks$.subscribe((items) => (tasks = items));

    if (tasks.length) {
      let newTaskArray = [...tasks];
      const index = newTaskArray.findIndex((item) => item._id === project._id);
      newTaskArray.splice(index, 1);
      this.store.dispatch(
        MainActions.UpdateInprogressTasks({ tasks: newTaskArray })
      );
    }
  }
  /**COMPLETE IN PROGRESS PROJECT  */

  /** CANCEL PENDING PROJECT */
  cancelPendingTasks(project: PersonalTasks) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'THE CURRENT TASK WIL BE CANCELLED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, cancel!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitCancelPendingTask(project);
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

  submitCancelPendingTask(project: PersonalTasks) {
    this.ngxService.start();

    const sub = this.taskservice.cancelTask(project._id).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.updatePendingTaskStore(project);
          this.store.dispatch(
            MainActions.AddCancelledTask({ task: response['data'] })
          );
          this.sendProjectCancelledMessage(response['data']);
          this.ngxService.stop();
          sub.unsubscribe();
        }
      },
      (error: HttpErrorResponse) => {
        const message = error.error.message;
        this.alertWithError('TASK UPDATE', message.toUpperCase());
        this.ngxService.stop();
        sub.unsubscribe();
      }
    );
  }

  updatePendingTaskStore(pendingproject: PersonalTasks) {
    let tasks: PersonalTasks[] = [];
    this.PendingTasks$.subscribe((items) => (tasks = items));

    if (tasks.length) {
      let newTaskArray = [...tasks];
      const index = newTaskArray.findIndex(
        (item) => item._id === pendingproject._id
      );
      newTaskArray.splice(index, 1);
      this.store.dispatch(
        MainActions.UpdatePendingTasks({ tasks: newTaskArray })
      );
    }
  }
  /** CANCEL PENDING PROJECT */

  /** CANCEL IN PROGRESS PROJECT */
  cancelProgressTask(project: PersonalTasks) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'THE CURRENT TASK WIL BE CANCELLED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, cancel!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitCancelProgressTask(project);
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

  submitCancelProgressTask(project: PersonalTasks) {
    this.ngxService.start();

    const sub = this.taskservice.cancelTask(project._id).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.updateInprogressTaskStore(project);
          this.store.dispatch(
            MainActions.AddCancelledTask({ task: response['data'] })
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
  /** CANCEL IN PROGRESS TASK */

  /** START PERSONAL TASK */
  startTask(project: PersonalTasks) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'THE TASK WIL BE STARTED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, start!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitStartTask(project);
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

  submitStartTask(project: PersonalTasks) {
    this.ngxService.start();

    const sub = this.taskservice.startTask(project._id).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.ngxService.stop();
          this.updatePendingStore(project);
          this.store.dispatch(
            MainActions.AddProgressTask({ task: response['data'] })
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

  updatePendingStore(pendingproject: PersonalTasks) {
    let tasks: PersonalTasks[] = [];
    this.PendingTasks$.subscribe((items) => (tasks = items));

    if (tasks.length) {
      let newTaskArray = [...tasks];
      const index = newTaskArray.findIndex(
        (item) => item._id === pendingproject._id
      );
      newTaskArray.splice(index, 1);
      this.store.dispatch(
        MainActions.UpdatePendingTasks({ tasks: newTaskArray })
      );
    }
  }
  /** START PERSONAL TASK */

  sendProjectStartMessage(project: PersonalTasks) {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('PersonalProjectStarted', {
          author: this.AuthUser,
          project,
        });
      }
    });
  }

  sendProjectCancelledMessage(project: PersonalTasks) {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('PersonalProjectCancelled', {
          author: this.AuthUser,
          project,
        });
      }
    });
  }

  sendProjectCompletedMessage(project: PersonalTasks) {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('PersonalProjectCompleted', {
          author: this.AuthUser,
          project,
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
