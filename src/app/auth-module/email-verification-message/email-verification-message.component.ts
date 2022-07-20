import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-email-verification-message',
  templateUrl: './email-verification-message.component.html',
  styleUrls: ['./email-verification-message.component.scss'],
})
export class EmailVerificationMessageComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EmailVerificationMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
}
