import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  getAllOnlineUsers,
  getAllPersonalChats,
  getAllPersonalMessageCounts,
  getAllPersonalMessgaes,
  State,
} from 'src/app/dashboard/states/main.reducer';
import { User } from 'src/shared/Models/User.model';
import { SocketService } from 'src/shared/services/socket.service';
import * as MainActions from '../../../dashboard/states/main.actions';

@Component({
  selector: 'app-personal-chat-sessions',
  templateUrl: './personal-chat-sessions.component.html',
  styleUrls: ['./personal-chat-sessions.component.scss'],
})
export class PersonalChatSessionsComponent implements OnInit {
  Chats$: Observable<any[]>;
  Messages$: Observable<any[]>;
  MessageCounts$: Observable<any>;
  authUser: User;
  selectedPersonalChat: any;
  messagelenth = 20;
  Socket$: Observable<any>;
  UnreadChatsCounts: any[] = [];
  onlineUsers: string[] = [];

  constructor(
    private socketservice: SocketService,
    private store: Store<State>
  ) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
  }

  ngOnInit(): void {
    this.Socket$ = this.socketservice.socketInstanceObservable;
    this.Chats$ = this.store.select(getAllPersonalChats);
    this.Messages$ = this.store.select(getAllPersonalMessgaes);
    this.MessageCounts$ = this.store.select(getAllPersonalMessageCounts);
    this.store.select(getAllOnlineUsers).subscribe((onlineusers) => {
      this.onlineUsers = onlineusers;
    });
    this.listenToSocketEvents();
  }

  formatLastMessageTime(createdAt: string): any {
    if (createdAt) {
      const currentdate = moment().format('YYYY-MM-DD');
      const date = moment(new Date(createdAt)).format('YYYY-MM-DD');
      if (moment(date).isBefore(currentdate)) {
        return moment(new Date(createdAt)).format('ll');
      }
      return moment(new Date(createdAt)).format('LT');
    }
  }

  formatMessagelength(message: string): any {
    if (message) {
      return (
        message.slice(0, this.messagelenth) +
        (message.length > this.messagelenth ? '...' : '')
      );
    }
  }

  selectPersonalChat(chat: any) {
    this.store.dispatch(MainActions.SelectPersonalChat({ chat }));
    this.selectedPersonalChat = chat;
  }

  getTotalUnread(chat: any, id: string) {
    return this.MessageCounts$.pipe(
      map((counts) =>
        counts.filter((count) => count.chat_id === chat._id && count._id === id)
      ),
      map((count) => count?.[0]?.count)
    );
  }

  getUserStatus(id: string) {
    const online = this.onlineUsers.find((user) => user === id);
    if (online) {
      return true;
    } else {
      return false;
    }
  }

  listenToSocketEvents() {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('fetchUnreadMessages', { authid: this.authUser.uuid });
        // LISTEN TO MESSAGE RECEIVED
        socket.on('sendPersonalMessageSuccess', ({ session }) => {
          this.updateChatSession(session);
          socket.emit('stopTyping');
          socket.emit('fetchUnreadMessages', { authid: this.authUser.uuid });
        });

        socket.on('fetchUnreadMessagesSuccess', ({ unreadMessageCounts }) => {
          this.store.dispatch(
            MainActions.UpdatePersonalMessagingCounts({
              counts: unreadMessageCounts,
            })
          );
        });
      }
    });
  }

  updateChatSession(session) {
    this.store.dispatch(
      MainActions.UpdatePersonalChatLastMessage({ chat: session })
    );
  }
}
