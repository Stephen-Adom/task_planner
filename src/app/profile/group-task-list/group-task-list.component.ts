import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable } from 'rxjs';
import {
  getAllGroupTasks,
  getAllGroupTasksNum,
  getUserCompletedProjectsTotal,
  State,
} from 'src/app/dashboard/states/main.reducer';
import { GroupTasks } from 'src/shared/Models/task.model';
import * as MainActions from '../../dashboard/states/main.actions';

@Component({
  selector: 'app-group-task-list',
  templateUrl: './group-task-list.component.html',
  styleUrls: ['./group-task-list.component.scss'],
})
export class GroupTaskListComponent implements OnInit {
  GroupProjects$: Observable<GroupTasks[]>;
  GroupProjectsNum$: Observable<number>;
  gaugeType = 'full';
  gaugeValue: string;
  gaugeLabel: string;
  gaugeAppendText = '%';
  thick: any = 10;
  max: any = 100;
  min: any = 0;

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.GroupProjects$ = this.store.select(getAllGroupTasks);
    this.GroupProjectsNum$ = this.store.select(getAllGroupTasksNum);
    this.store.select(getUserCompletedProjectsTotal).subscribe((data) => {
      if (data) {
        console.log(data);
        this.calculateCompletedTasks(data);
      }
    });

    this.FetchTasks();
  }

  formateDate(date: string) {
    const dateObj = new Date(date);
    return moment(dateObj).format('lll');
  }

  calculateCompletedTasks(data: number) {
    this.GroupProjectsNum$.subscribe((total) => {
      if (total) {
        this.gaugeLabel = `Completed: ${data}`;

        const value = (Number(data) / total) * 100;
        this.gaugeValue = value.toFixed(1);
      }
    });
  }

  FetchTasks() {
    this.store.dispatch(MainActions.FetchAllGroupProjects());
    this.store.dispatch(MainActions.FetchUserCompletedGroupTasks());
  }
}
