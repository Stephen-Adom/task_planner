import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/shared/Guards/auth.guard';
import { AllProjectsDashboardComponent } from './all-projects-dashboard/all-projects-dashboard.component';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: HomeComponent,
      },
      {
        path: 'all-projects',
        component: AllProjectsDashboardComponent,
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('../chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'task',
        loadChildren: () =>
          import('../tasks/tasks.module').then((m) => m.TasksModule),
      },
      {
        path: 'members',
        loadChildren: () =>
          import('../members/members.module').then((m) => m.MembersModule),
      },
      {
        path: 'attachment',
        loadChildren: () =>
          import('../attachment/attachment.module').then(
            (m) => m.AttachmentModule
          ),
      },
      {
        path: 'activity',
        loadChildren: () =>
          import('../activity/activity.module').then((m) => m.ActivityModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
