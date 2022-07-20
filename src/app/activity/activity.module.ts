import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityComponent } from './activity.component';
import { ActivityOverviewComponent } from './activity-overview/activity-overview.component';
import { ActivityNavbarComponent } from './activity-navbar/activity-navbar.component';
import { NoActivityComponent } from './no-activity/no-activity.component';
import { ActivitiesService } from 'src/shared/services/activities.services';

@NgModule({
  declarations: [
    ActivityComponent,
    ActivityOverviewComponent,
    ActivityNavbarComponent,
    NoActivityComponent,
  ],
  imports: [CommonModule, ActivityRoutingModule],
  providers: [ActivitiesService],
})
export class ActivityModule {}
