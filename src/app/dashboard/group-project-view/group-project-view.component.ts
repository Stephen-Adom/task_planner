import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Attachment } from 'src/shared/Models/attachment.model';
import { Members } from 'src/shared/Models/members.model';
import { GroupTasks } from 'src/shared/Models/task.model';
import { TaskService } from 'src/shared/services/task.services';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AddGroupAttachmentComponent } from '../add-group-attachment/add-group-attachment.component';
import { AddNewMemberToGroupComponent } from '../add-new-member-to-group/add-new-member-to-group.component';
import { State } from '../states/main.reducer';
import * as MainActions from '../states/main.actions';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-group-project-view',
  templateUrl: './group-project-view.component.html',
  styleUrls: ['./group-project-view.component.scss'],
})
export class GroupProjectViewComponent implements OnInit {
  project: GroupTasks;
  diff: number;
  members: Members[] = [];
  leader: Members;

  constructor(
    public dialogRef: MatDialogRef<GroupProjectViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ngxService: NgxUiLoaderService,
    private taskservice: TaskService,
    private dialog: MatDialog,
    private store: Store<State>
  ) {
    this.project = data['project'];
  }

  ngOnInit(): void {
    this.getDateDiff();
    this.sortProjectLeader();
  }

  getDateDiff() {
    if (this.project) {
      this.diff = moment
        .duration(
          moment(new Date(this.project.endDate)).diff(
            moment(new Date(this.project.startDate))
          )
        )
        .asDays();

      console.log(this.diff);
    }
  }

  sortProjectLeader() {
    this.members = [];
    if (this.project) {
      if (this.project.members.length) {
        this.project.members.forEach((member) => {
          if (member.member_uuid === this.project.leader) {
            this.leader = member;
          } else {
            this.members.push(member);
          }
        });
        console.log(this.leader, this.members);
      }
    }
  }

  formatDate(date: string) {
    return moment(new Date(date)).format('lll');
  }

  getAbbrev(title: string) {
    const titlearray = title.split(' ');
    if (titlearray[1]) {
      return (
        titlearray[0].charAt(0).toUpperCase() +
        titlearray[1].charAt(0).toUpperCase()
      );
    } else {
      return titlearray[0].charAt(0).toUpperCase();
    }
  }

  assignLeader(member: Members) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: `You want to assign ${member.firstname} ${member.lastname} As Project Leader?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, assign!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitAssignedInfo(member);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          console.log(event);
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your current operation is cancelled :)',
            'info'
          );
        }
      });
  }

  submitAssignedInfo(member) {
    this.ngxService.start();
    const postbody = {
      leader: member.member_uuid,
    };
    const sub = this.taskservice
      .assignLeader(this.project._id, postbody)
      .subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.ngxService.stop();
            this.project = response['data'];
            this.sortProjectLeader();
            this.alertWithSuccess('PROJECT', 'NEW PROJECT LEADER ASSIGNED');
            this.updateStore();
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

  // REMOVE MEMBER FROM GROUP
  removeMember(member: Members) {
    this.confirmMemberRemoval(member);
  }

  // CONFIRM MEMBER REMOVAL
  confirmMemberRemoval(member: Members) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: `${member.firstname} ${member.lastname} Will Be Removed from this Project?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitMemberRemoval(member);
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

  submitMemberRemoval(member: Members) {
    this.ngxService.start();

    const postbody = {
      member: member,
    };

    const sub = this.taskservice
      .removeProjectMembers(this.project._id, postbody)
      .subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.ngxService.stop();
            this.project = response['data'];
            this.sortProjectLeader();
            this.alertWithSuccess('PROJECT', 'PROJECT MEMBER REMOVED');
            this.updateStore();
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

  addMember() {
    const dialogRef = this.dialog.open(AddNewMemberToGroupComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      disableClose: true,
      data: { members: this.project.members },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.members) {
        this.confirmSubmitMembers(data?.members);
      }
    });
  }

  confirmSubmitMembers(members: Members[]) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'NEW MEMBERS WILL BE ASSIGNED TO THIS PROJECT!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit!',
        cancelButtonText: 'No, close!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitMembersInfo(members);
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

  submitMembersInfo(members: Members[]) {
    this.ngxService.start();

    const postbody = {
      members: members,
    };

    const sub = this.taskservice
      .addProjectMembers(this.project._id, postbody)
      .subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.ngxService.stop();
            this.project = response['data'];
            this.sortProjectLeader();
            this.alertWithSuccess('PROJECT', 'NEW MEMBERS ASSIGNED');
            this.updateStore();
            sub.unsubscribe();
          }
        },
        (error: HttpErrorResponse) => {
          const message = error.error.message;
          this.ngxService.stop();
          this.alertWithError('PROJECT', message.toUpperCase());
          sub.unsubscribe();
        }
      );
  }

  addAttachment() {
    const dialogRef = this.dialog.open(AddGroupAttachmentComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.attachments) {
        this.confirmProjectAttachment(data?.attachments);
      } else {
        return;
      }
    });
  }

  confirmProjectAttachment(attachments: Attachment[]) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'NEW ATTACHMENT WILL BE ADDED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, add!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitAttachment(attachments);
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

  submitAttachment(attachments: Attachment[]) {
    this.ngxService.start();

    const postbody = {
      attachments: attachments,
    };

    const sub = this.taskservice
      .addProjectAttachment(this.project._id, postbody)
      .subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.ngxService.stop();
            this.project = response['data'];
            this.sortProjectLeader();
            this.alertWithSuccess('PROJECT', 'ATTACHMENT ADDED');
            this.updateStore();
            sub.unsubscribe();
          }
        },
        (error: HttpErrorResponse) => {
          const message = error.error.message;
          this.ngxService.stop();
          this.alertWithError('PROJECT ATTACHMENT', message.toUpperCase());
          sub.unsubscribe();
        }
      );
  }

  removeAttachment(attachment: Attachment) {
    this.confirmAttachmentRemoval(attachment);
  }

  confirmAttachmentRemoval(attachment: Attachment) {
    swalWithBootstrapButtons
      .fire({
        title: 'ARE YOU SURE?',
        text: 'ATTACHMENT WILL BE REMOVED!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, add!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.submitAttachmentRemoval(attachment);
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

  submitAttachmentRemoval(attachment: Attachment) {
    this.ngxService.start();

    const postbody = { attachment };

    const sub = this.taskservice
      .removeProjectAttachment(this.project._id, postbody)
      .subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.ngxService.stop();
            this.project = response['data'];
            this.sortProjectLeader();
            this.alertWithSuccess('PROJECT', 'ATTACHMENT REMOVED');
            this.updateStore();
            sub.unsubscribe();
          }
        },
        (error: HttpErrorResponse) => {
          const message = error.error.message;
          this.ngxService.stop();
          this.alertWithError('PROJECT ATTACHMENT', message.toUpperCase());
          sub.unsubscribe();
        }
      );
  }

  updateStore() {
    if (this.project.status === 'Pending') {
      this.store.dispatch(MainActions.FetchPendingGroupTasks());
    } else if (this.project.status === 'In_progress') {
      this.store.dispatch(MainActions.FetchInprogressGroupTasks());
    } else {
      this.store.dispatch(MainActions.FetchCompletedGroupTasks());
    }
  }

  close() {
    this.dialogRef.close();
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
