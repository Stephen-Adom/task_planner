import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getUserInfo, State } from 'src/app/dashboard/states/main.reducer';
import { User } from 'src/shared/Models/User.model';

@Component({
  selector: 'app-profile-navbar',
  templateUrl: './profile-navbar.component.html',
  styleUrls: ['./profile-navbar.component.scss'],
})
export class ProfileNavbarComponent implements OnInit {
  authUser: User;
  AuthUser$: Observable<User>;

  constructor(private store: Store<State>) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
  }

  ngOnInit(): void {
    this.AuthUser$ = this.store.select(getUserInfo);
  }
}
