import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import moment from 'moment';
import { Attachment } from 'src/shared/Models/attachment.model';
import { AddAttachmentComponent } from '../add-attachment/add-attachment.component';
import { ViewDocumentComponent } from '../view-document/view-document.component';

@Component({
  selector: 'app-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.scss'],
})
export class AttachmentListComponent implements OnInit {
  Attachments: Attachment[] = [];
  Group: any;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AttachmentListComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.Attachments = data['attachments'];
    this.Group = data['group'];
    console.log(data['attachments'], this.Group);
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }

  formateDate(date) {
    const dateObj = new Date(date);
    return moment(dateObj).format('ll');
  }

  viewDocument(file: string) {
    const dialogRef = this.dialog.open(ViewDocumentComponent, {
      width: '1000px',
      panelClass: 'custom-dialog',
      disableClose: false,
      data: { document: file },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
      } else {
        return;
      }
    });
  }

  download(base64String: string, name: string) {
    const linkSource = base64String;
    const downloadLink = document.createElement('a');
    const fileName = name;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  addAttachment() {
    const dialogRef = this.dialog.open(AddAttachmentComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      disableClose: true,
      data: { group: this.Group },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data?.attachments) {
        this.Attachments = data?.attachments;
      } else {
        return;
      }
    });
  }
}
