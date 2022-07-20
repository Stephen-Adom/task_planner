import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewTaskComponent } from '../create-new-task/create-new-task.component';

@Component({
  selector: 'app-no-task-alert',
  templateUrl: './no-task-alert.component.html',
  styleUrls: ['./no-task-alert.component.scss'],
})
export class NoTaskAlertComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  addNewTask() {
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
}
