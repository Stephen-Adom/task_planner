import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { MembersRoutingModule } from './members-routing.module';
import { MembersComponent } from './members.component';
import { ViewMemberComponent } from './view-member/view-member.component';
import { AllMembersComponent } from './all-members/all-members.component';
import { MembersNavbarComponent } from './members-navbar/members-navbar.component';
import { EditMemberProfileComponent } from './edit-member-profile/edit-member-profile.component';
import { UserService } from 'src/shared/services/user.services';

@NgModule({
  declarations: [
    MembersComponent,
    ViewMemberComponent,
    AllMembersComponent,
    MembersNavbarComponent,
    EditMemberProfileComponent,
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    NgxIntlTelInputModule,
  ],
  providers: [UserService],
})
export class MembersModule {}
