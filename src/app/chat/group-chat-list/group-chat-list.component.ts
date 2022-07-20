import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StartChatDialogComponent } from 'src/app/dashboard/start-chat-dialog/start-chat-dialog.component';
import { getAllGroupTasks } from 'src/app/dashboard/states/main.reducer';
import { State } from 'src/app/state/app.state';
import { GroupTasks } from 'src/shared/Models/task.model';

@Component({
  selector: 'app-group-chat-list',
  templateUrl: './group-chat-list.component.html',
  styleUrls: ['./group-chat-list.component.scss'],
})
export class GroupChatListComponent implements OnInit {
  UserGroupProjects$: Observable<GroupTasks[]>;

  constructor(
    public dialogRef: MatDialogRef<GroupChatListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private store: Store<State>
  ) {}

  ngOnInit(): void {
    this.UserGroupProjects$ = this.store.select(getAllGroupTasks);
  }

  close() {
    this.dialogRef.close();
  }

  createProject(project: GroupTasks) {
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
}
