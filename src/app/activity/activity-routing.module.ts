import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityOverviewComponent } from './activity-overview/activity-overview.component';
import { ActivityComponent } from './activity.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityComponent,
    children: [
      {
        path: 'overview',
        component: ActivityOverviewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityRoutingModule {}
