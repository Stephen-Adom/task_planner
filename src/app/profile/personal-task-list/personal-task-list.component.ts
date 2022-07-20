import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  getAllPersonalTasks,
  getAllPersonalTasksNum,
  getCompletedPersonalTasksNum,
  State,
} from 'src/app/dashboard/states/main.reducer';
import { PersonalTasks } from 'src/shared/Models/task.model';
import * as MainActions from '../../dashboard/states/main.actions';

@Component({
  selector: 'app-personal-task-list',
  templateUrl: './personal-task-list.component.html',
  styleUrls: ['./personal-task-list.component.scss'],
})
export class PersonalTaskListComponent implements OnInit {
  gaugeType: NgxGaugeType = 'full';
  gaugeValue: any;
  gaugeLabel: string;
  gaugeAppendText = '%';
  thick: any = 10;
  max: any = 100;
  min: any = 0;
  totalPersonalTask: number;

  PersonalTasks$: Observable<PersonalTasks[]>;
  PersonalTasksNum$: Observable<number>;

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.PersonalTasks$ = this.store.select(getAllPersonalTasks);
    this.PersonalTasksNum$ = this.store.select(getAllPersonalTasksNum);
    this.store.select(getCompletedPersonalTasksNum).subscribe((data) => {
      this.calculateCompletedTasks(data);
    });

    this.FetchTasks();
  }

  formateDate(date: string) {
    const dateObj = new Date(date);
    return moment(dateObj).format('lll');
  }

  calculateCompletedTasks(data: number) {
    this.PersonalTasksNum$.subscribe((totalTasks) => {
      if (totalTasks) {
        this.gaugeLabel = `Completed: ${data}`;
        const value = (Number(data) / totalTasks) * 100;
        this.gaugeValue = Number(value.toFixed(1));
      }
    });
  }

  FetchTasks() {
    this.store.dispatch(MainActions.FetchAllPersonalTasks());
    this.store.dispatch(MainActions.FetchCompletedTasks());
  }
}
