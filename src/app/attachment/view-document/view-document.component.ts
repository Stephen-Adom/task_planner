import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss'],
})
export class ViewDocumentComponent implements OnInit {
  pdfSrc: string;

  constructor(
    private dialogRef: MatDialogRef<ViewDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.pdfSrc = data['document'];
  }

  ngOnInit(): void {}
}
