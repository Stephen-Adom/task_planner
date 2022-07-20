import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-out-dialog',
  templateUrl: './sign-out-dialog.component.html',
  styleUrls: ['./sign-out-dialog.component.scss']
})
export class SignOutDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SignOutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  signout() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }

}
