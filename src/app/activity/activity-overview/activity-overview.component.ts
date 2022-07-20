import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { getAllActivities, State } from 'src/app/dashboard/states/main.reducer';
import { ActivitiesService } from 'src/shared/services/activities.services';
import * as MainActions from '../../dashboard/states/main.actions';

@Component({
  selector: 'app-activity-overview',
  templateUrl: './activity-overview.component.html',
  styleUrls: ['./activity-overview.component.scss'],
})
export class ActivityOverviewComponent implements OnInit {
  AllActivities$: Observable<any[]>;
  ActivitiesSub = new Subscription();

  constructor(
    private store: Store<State>,
    private activitiesservice: ActivitiesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.AllActivities$ = this.store.select(getAllActivities);
    this.FetchActivities();
    this.GetUnreadActivities();
  }

  FetchActivities() {
    this.store.dispatch(MainActions.FetchAllActivities());
  }

  formateDate(date) {
    const dateObj = new Date(date);
    return moment(dateObj).format('lll');
  }

  GetUnreadActivities() {
    if (window.location.pathname === '/activity/overview') {
      let unread = [];
      this.ActivitiesSub = this.AllActivities$.pipe(
        map((activities) => {
          return activities.filter((activity) => activity.read === false);
        })
      ).subscribe((data) => {
        if (data.length) {
          unread = data;
          this.MarkActivitiesAsRead(unread);
          this.ActivitiesSub.unsubscribe();
        }
      });
    }
  }

  MarkActivitiesAsRead(unread: any[]) {
    let read = [];
    let promise: Promise<any>;
    unread.forEach((activity) => {
      promise = new Promise((resolve, reject) => {
        const sub = this.activitiesservice
          .updateActivity(activity._id)
          .subscribe(
            (response) => {
              if (response['status'] === 200) {
                read.push(response['data']);
                sub.unsubscribe();

                if (unread.length == read.length) {
                  return resolve(read);
                }
              }
            },
            (error: HttpErrorResponse) => {
              console.log(error.error.message);
              sub.unsubscribe();
              return reject();
            }
          );
      });
    });

    promise.then((result) => {
      if (result.length) {
        this.FetchActivities();
      }
    });
  }
}
