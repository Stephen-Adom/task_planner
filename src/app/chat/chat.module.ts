import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { ChatService } from 'src/shared/services/chat.services';
import { ChatSessionComponent } from './groupChat/chat-session/chat-session.component';
import { WelcomePageComponent } from './groupChat/welcome-page/welcome-page.component';
import { GroupChatListComponent } from './group-chat-list/group-chat-list.component';
import { EditChatInfoComponent } from './edit-chat-info/edit-chat-info.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ChooseChatTypeComponent } from './choose-chat-type/choose-chat-type.component';
import { ChatMessagesBoxComponent } from './groupChat/chat-messages-box/chat-messages-box.component';
import { PersonalChatSessionsComponent } from './one-on-one-chat/personal-chat-sessions/personal-chat-sessions.component';
import { PersonalMessagesBoxComponent } from './one-on-one-chat/personal-messages-box/personal-messages-box.component';

@NgModule({
  declarations: [
    ChatComponent,
    GroupChatComponent,
    ChatSessionComponent,
    WelcomePageComponent,
    ChatMessagesBoxComponent,
    GroupChatListComponent,
    EditChatInfoComponent,
    UsersListComponent,
    PersonalMessagesBoxComponent,
    ChooseChatTypeComponent,
    PersonalChatSessionsComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    PickerModule,
    MatTooltipModule,
  ],
  providers: [ChatService],
  entryComponents: [GroupChatListComponent, UsersListComponent],
})
export class ChatModule {}
