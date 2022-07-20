import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/shared/Models/User.model';
import { getAllUsers, State } from '../../dashboard/states/main.reducer';
import * as MainActions from '../../dashboard/states/main.actions';

@Component({
  selector: 'app-all-members',
  templateUrl: './all-members.component.html',
  styleUrls: ['./all-members.component.scss'],
})
export class AllMembersComponent implements OnInit {
  AllUsers$: Observable<User[]>;

  constructor(private store: Store<State>, private router: Router) {}

  ngOnInit(): void {
    this.AllUsers$ = this.store.select(getAllUsers);

    this.fetchUsers();
  }

  viewprofile(user: User) {
    this.router.navigate(['/members/all-members/view', user.uuid]);
  }

  deleteMember(user: User) {}

  fetchUsers() {
    this.store.dispatch(MainActions.FetchAllUsers());
  }
}
