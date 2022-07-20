import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable } from 'rxjs';
import { User } from 'src/shared/Models/User.model';
import {
  getMemberProfile,
  getMemberSettings,
  getUserInfo,
  State,
} from '../../dashboard/states/main.reducer';
import * as MainActions from '../../dashboard/states/main.actions';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-member',
  templateUrl: './view-member.component.html',
  styleUrls: ['./view-member.component.scss'],
})
export class ViewMemberComponent implements OnInit {
  MemberProfile$: Observable<User>;
  AuthInfo$: Observable<User>;
  member_id: string;
  Settings$: Observable<any>;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.MemberProfile$ = this.store.select(getMemberProfile);
    this.Settings$ = this.store.select(getMemberSettings);

    this.route.paramMap.subscribe((param) => {
      this.member_id = param.get('id');
      this.store.dispatch(MainActions.FetchMemberInfo({ id: this.member_id }));
      this.FetchUserSettings();
    });

    this.AuthInfo$ = this.store.select(getUserInfo);
  }

  FetchUserSettings() {
    this.MemberProfile$.subscribe((member) => {
      if (member) {
        this.store.dispatch(MainActions.FetchUserSettings({ id: member._id }));
      }
    });
  }

  formatLoginDate(logindate: string) {
    if (logindate) {
      return moment(new Date(logindate)).format('llll');
    } else {
      return null;
    }
  }

  editprofile(user: User) {
    this.router.navigate(['/members/all-members/edit', user.uuid]);
  }

  back() {
    this.location.back();
  }
}
