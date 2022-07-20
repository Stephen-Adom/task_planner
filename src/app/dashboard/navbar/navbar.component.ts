import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/shared/Models/User.model';
import { getUserInfo, State } from '../states/main.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
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
