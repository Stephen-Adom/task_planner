import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/shared/Models/User.model';
import { getAllUsers, getSelectedMembers, State } from '../states/main.reducer';
import * as MainActions from '../states/main.actions';
import { Members } from 'src/shared/Models/members.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-members-list-dialog',
  templateUrl: './members-list-dialog.component.html',
  styleUrls: ['./members-list-dialog.component.scss'],
})
export class MembersListDialogComponent implements OnInit {
  AllUsers$: Observable<User[]>;
  authUser: User;
  selectedMembers: Members[] = [];

  constructor(
    public dialogRef: MatDialogRef<MembersListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<State>
  ) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
  }

  ngOnInit(): void {
    this.getSelectedMembers();
    this.AllUsers$ = this.store.select(getAllUsers);
  }

  submit() {
    this.store.dispatch(
      MainActions.AddSelectedMembers({ users: this.selectedMembers })
    );
    this.close();
  }

  addMember(user: User) {
    const existingUser = this.selectedMembers.find(
      (item) => item.member_uuid === user.uuid
    );
    if (existingUser) {
      const index = this.selectedMembers.indexOf(existingUser);
      this.selectedMembers.splice(index, 1);
    } else {
      if (this.selectedMembers.length >= 5) {
        this.alertWithError(
          'PROJECT INFO',
          'MAXIMUM NUMBER OF PARTICIPANTS / MEMBERS MUST BE 5'
        );
      } else {
        this.selectedMembers.push({
          firstname: user.firstname,
          image: user.image,
          lastname: user.lastname,
          userType: user.userType,
          member_email: user.email,
          member_uuid: user.uuid,
        });
      }
    }
  }

  checkIfExist(user: User) {
    return this.selectedMembers.find((item) => item.member_uuid === user.uuid);
  }

  getSelectedMembers() {
    let members: Members[] = [];
    this.store.select(getSelectedMembers).subscribe((users) => {
      members = users;
    });
    this.selectedMembers = [...members];
    this.addUserToList();
    console.log(this.selectedMembers);
  }

  addUserToList() {
    if (this.authUser) {
      if (this.authUser.userType === 'USER') {
        this.selectedMembers.push({
          firstname: this.authUser.firstname,
          image: this.authUser.image,
          lastname: this.authUser.lastname,
          userType: this.authUser.userType,
          member_email: this.authUser.email,
          member_uuid: this.authUser.uuid,
        });

        console.log(this.selectedMembers);
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  alertWithError(title: string, content: string) {
    swalWithBootstrapButtons.fire({
      icon: 'error',
      title: title,
      text: content,
    });
  }
}
