import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable } from 'rxjs';
import { getUserSettings } from 'src/app/dashboard/states/main.reducer';
import { State } from 'src/app/state/app.state';
import { User } from 'src/shared/Models/User.model';
import * as MainActions from '../../dashboard/states/main.actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  AuthUser: User;
  Settings$: Observable<any>;

  constructor(private router: Router, private store: Store<State>) {
    if (localStorage.getItem('authUser')) {
      this.AuthUser = JSON.parse(localStorage.getItem('authUser'));
    }
  }

  ngOnInit(): void {
    this.Settings$ = this.store.select(getUserSettings);
  }

  formateDate(date: string) {
    const dateObj = new Date(date);
    return moment(dateObj).format('lll');
  }

  editprofile(profile: User) {
    this.store.dispatch(MainActions.ViewMemberProfile({ member: profile }));
    this.router.navigate(['/profile/overview/edit', profile.uuid]);
  }
}
