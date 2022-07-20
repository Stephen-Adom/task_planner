import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { count, map } from 'rxjs/operators';
import {
  getAllActivities,
  getUserInfo,
  State,
} from 'src/app/dashboard/states/main.reducer';
import { User } from 'src/shared/Models/User.model';

@Component({
  selector: 'app-activity-navbar',
  templateUrl: './activity-navbar.component.html',
  styleUrls: ['./activity-navbar.component.scss'],
})
export class ActivityNavbarComponent implements OnInit {
  authUser: User;
  AuthUser$: Observable<User>;
  AllActivities$: Observable<number>;

  constructor(private store: Store<State>) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
  }

  ngOnInit(): void {
    this.AuthUser$ = this.store.select(getUserInfo);
    this.AllActivities$ = this.store
      .select(getAllActivities)
      .pipe(map((activities) => activities.length));
  }
}
