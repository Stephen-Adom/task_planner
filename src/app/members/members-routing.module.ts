import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllMembersComponent } from './all-members/all-members.component';
import { EditMemberProfileComponent } from './edit-member-profile/edit-member-profile.component';
import { MembersComponent } from './members.component';
import { ViewMemberComponent } from './view-member/view-member.component';

const routes: Routes = [
  {
    path: '',
    component: MembersComponent,
    children: [
      {
        path: 'all-members',
        component: AllMembersComponent,
      },
      {
        path: 'all-members/view/:id',
        component: ViewMemberComponent,
      },
      {
        path: 'all-members/edit/:id',
        component: EditMemberProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembersRoutingModule {}
