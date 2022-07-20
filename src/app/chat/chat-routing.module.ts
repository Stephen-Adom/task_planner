import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatSessionComponent } from './groupChat/chat-session/chat-session.component';
import { ChatComponent } from './chat.component';
import { ChooseChatTypeComponent } from './choose-chat-type/choose-chat-type.component';
import { PersonalChatSessionsComponent } from './one-on-one-chat/personal-chat-sessions/personal-chat-sessions.component';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    children: [
      {
        path: 'group/session',
        component: ChatSessionComponent,
      },
      {
        path: 'session',
        component: PersonalChatSessionsComponent,
      },
      {
        path: '',
        component: ChooseChatTypeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
