import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { SignOutDialogComponent } from './sign-out-dialog/sign-out-dialog.component';
import { AllProjectsDashboardComponent } from './all-projects-dashboard/all-projects-dashboard.component';
import { CreateNewTaskComponent } from './create-new-task/create-new-task.component';
import { MembersListDialogComponent } from './members-list-dialog/members-list-dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppHttpInterceptor } from 'src/shared/interceptor/validate-token';
import { TaskService } from 'src/shared/services/task.services';
import { AuthService } from 'src/shared/services/auth.services';
import { mainReducer } from './states/main.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MainEffects } from './states/main.effects';
import { UserService } from 'src/shared/services/user.services';
import { AssignProjectComponent } from './assign-project/assign-project.component';
import { StartChatDialogComponent } from './start-chat-dialog/start-chat-dialog.component';
import { ChatService } from 'src/shared/services/chat.services';
import { NavbarComponent } from './navbar/navbar.component';
import { authReducer } from '../auth-module/auth-state/auth.reducer';
import { NoTaskAlertComponent } from './no-task-alert/no-task-alert.component';
import { SocketService } from 'src/shared/services/socket.service';
import { ActivitiesService } from 'src/shared/services/activities.services';
import { AlertBubbleComponent } from './alert-bubble/alert-bubble.component';
import { GroupProjectViewComponent } from './group-project-view/group-project-view.component';
import { AddNewMemberToGroupComponent } from './add-new-member-to-group/add-new-member-to-group.component';
import { AddGroupAttachmentComponent } from './add-group-attachment/add-group-attachment.component';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    SignOutDialogComponent,
    AllProjectsDashboardComponent,
    CreateNewTaskComponent,
    MembersListDialogComponent,
    AssignProjectComponent,
    StartChatDialogComponent,
    NavbarComponent,
    NoTaskAlertComponent,
    AlertBubbleComponent,
    GroupProjectViewComponent,
    AddNewMemberToGroupComponent,
    AddGroupAttachmentComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forFeature('main', mainReducer),
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([MainEffects]),
    MatTooltipModule,
    DragDropModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    },
    TaskService,
    AuthService,
    UserService,
    ChatService,
    SocketService,
    ActivitiesService,
  ],
  entryComponents: [
    SignOutDialogComponent,
    CreateNewTaskComponent,
    MembersListDialogComponent,
    AssignProjectComponent,
    StartChatDialogComponent,
    GroupProjectViewComponent,
    AddNewMemberToGroupComponent,
    AddGroupAttachmentComponent,
  ],
})
export class DashboardModule {}
