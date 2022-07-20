import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/shared/Models/User.model';
import { getAllUsers, State } from '../states/main.reducer';
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
  selector: 'app-add-new-member-to-group',
  templateUrl: './add-new-member-to-group.component.html',
  styleUrls: ['./add-new-member-to-group.component.scss'],
})
export class AddNewMemberToGroupComponent implements OnInit {
  AllUsers$: Observable<User[]>;
  authUser: User;
  selectedMembers: Members[] = [];
  newMembers: Members[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddNewMemberToGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<State>
  ) {
    this.selectedMembers = [...data['members']];

    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
  }

  ngOnInit(): void {
    this.AllUsers$ = this.store.select(getAllUsers);
  }

  submit() {
    if (this.selectedMembers.length > 5) {
      this.alertWithError(
        'PROJECT INFO',
        'MAXIMUM NUMBER OF PARTICIPANTS / MEMBERS MUST BE 5'
      );
      console.log(this.selectedMembers);
    } else {
      this.dialogRef.close({ members: this.newMembers });
    }
  }

  addMember(user: User, event: any) {
    const existingUser = this.selectedMembers.find(
      (item) => item.member_uuid === user.uuid
    );

    if (event.target.checked) {
      if (this.selectedMembers.length >= 5) {
        this.alertWithError(
          'PROJECT INFO',
          'MAXIMUM NUMBER OF PARTICIPANTS / MEMBERS MUST BE 5'
        );
      } else {
        const member: Members = {
          firstname: user.firstname,
          image: user.image,
          lastname: user.lastname,
          userType: user.userType,
          member_email: user.email,
          member_uuid: user.uuid,
        };
        this.selectedMembers.push(member);
        this.newMembers.push(member);
      }
    } else {
      if (existingUser) {
        const index = this.selectedMembers.indexOf(existingUser);
        const index2 = this.newMembers.indexOf(existingUser);
        this.selectedMembers.splice(index, 1);
        this.newMembers.splice(index2, 1);
      }
    }
  }

  checkIfExist(user: User) {
    return this.selectedMembers.find((item) => item.member_uuid === user.uuid);
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
