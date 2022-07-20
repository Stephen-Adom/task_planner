import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable } from 'rxjs';
import {
  getGroupAttachments,
  getPersonalAttachments,
  State,
} from 'src/app/dashboard/states/main.reducer';
import { Attachment } from 'src/shared/Models/attachment.model';
import * as MainActions from '../../dashboard/states/main.actions';
import { AttachmentListComponent } from '../attachment-list/attachment-list.component';
import { PersonalAttachmentListComponent } from '../personal-attachment-list/personal-attachment-list.component';

@Component({
  selector: 'app-attachment-overview',
  templateUrl: './attachment-overview.component.html',
  styleUrls: ['./attachment-overview.component.scss'],
})
export class AttachmentOverviewComponent implements OnInit {
  GroupAttachments$: Observable<any>;
  PersonalAttachments$: Observable<any>;

  constructor(private store: Store<State>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.GroupAttachments$ = this.store.select(getGroupAttachments);
    this.PersonalAttachments$ = this.store.select(getPersonalAttachments);

    this.FetchAttachments();
  }

  FetchAttachments() {
    this.store.dispatch(MainActions.FetchGroupProjectAttachments());
    this.store.dispatch(MainActions.FetchPersonalTaskAttachments());
  }

  formateDate(date) {
    const dateObj = new Date(date);
    return moment(dateObj).format('ll');
  }

  viewAttachments(attachments: Attachment[], group) {
    const dialogRef = this.dialog.open(AttachmentListComponent, {
      width: '700px',
      panelClass: 'custom-dialog',
      disableClose: false,
      data: { attachments, group },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
      } else {
        return;
      }
    });
  }

  viewPersonalAttachments(attachments: Attachment[], group) {
    const dialogRef = this.dialog.open(PersonalAttachmentListComponent, {
      width: '700px',
      panelClass: 'custom-dialog',
      disableClose: false,
      data: { attachments, group },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
      } else {
        return;
      }
    });
  }
}
