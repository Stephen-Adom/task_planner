import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { OverviewComponent } from './overview/overview.component';
import { PersonalTaskListComponent } from './personal-task-list/personal-task-list.component';
import { GroupTaskListComponent } from './group-task-list/group-task-list.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UserService } from 'src/shared/services/user.services';
import { ProfileNavbarComponent } from './profile-navbar/profile-navbar.component';
import { SettingsOverviewComponent } from './settings-overview/settings-overview.component';

@NgModule({
  declarations: [
    ProfileComponent,
    OverviewComponent,
    PersonalTaskListComponent,
    GroupTaskListComponent,
    EditProfileComponent,
    ProfileNavbarComponent,
    SettingsOverviewComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NgxGaugeModule,
    NgxIntlTelInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [UserService],
})
export class ProfileModule {}
