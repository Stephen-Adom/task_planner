import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getUserInfo, State } from 'src/app/dashboard/states/main.reducer';
import { User } from 'src/shared/Models/User.model';

@Component({
  selector: 'app-attachment-navbar',
  templateUrl: './attachment-navbar.component.html',
  styleUrls: ['./attachment-navbar.component.scss'],
})
export class AttachmentNavbarComponent implements OnInit {
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
