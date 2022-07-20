import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreatePersonalTaskComponent } from '../create-personal-task/create-personal-task.component';

@Component({
  selector: 'app-no-personal-task',
  templateUrl: './no-personal-task.component.html',
  styleUrls: ['./no-personal-task.component.scss'],
})
export class NoPersonalTaskComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

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
}
