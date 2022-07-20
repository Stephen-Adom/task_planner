import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { CreatePersonalTaskComponent } from './create-personal-task/create-personal-task.component';
import { MyTaskDashboardComponent } from './my-task-dashboard/my-task-dashboard.component';
import { NoPersonalTaskComponent } from './no-personal-task/no-personal-task.component';

@NgModule({
  declarations: [
    TasksComponent,
    CreatePersonalTaskComponent,
    MyTaskDashboardComponent,
    NoPersonalTaskComponent,
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  entryComponents: [CreatePersonalTaskComponent],
})
export class TasksModule {}
