import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  getAllGroupChats,
  getAllPersonalChats,
  getGroupMessages,
  State,
} from 'src/app/dashboard/states/main.reducer';
import { User } from 'src/shared/Models/User.model';
import * as MainActions from '../../../dashboard/states/main.actions';

@Component({
  selector: 'app-chat-session',
  templateUrl: './chat-session.component.html',
  styleUrls: ['./chat-session.component.scss'],
})
export class ChatSessionComponent implements OnInit {
  GroupChats$: Observable<any[]>;
  Chats$: Observable<any[]>;
  authUser: User;
  selectedChat: any;
  selectedPersonalChat: any;
  messagelenth = 20;
  tabType = 'chat';

  constructor(private store: Store<State>) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
  }

  ngOnInit(): void {
    this.GroupChats$ = this.store.select(getAllGroupChats);
    this.Chats$ = this.store.select(getAllPersonalChats);
  }

  // select chat to start messaging
  selectChat(chat: any) {
    this.store.dispatch(MainActions.SelectChat({ chat }));
    this.selectedChat = chat;
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

  UnreadMessageLength(chat: any) {
    return this.store.select(getGroupMessages).pipe(
      map((messages: any) =>
        messages.filter((message) => message.group_id === chat._id)
      ),
      map((messages) => {
        return messages.length;
      })
    );
  }

  formatMessagelength(message: string): any {
    if (message) {
      return (
        message.slice(0, this.messagelenth) +
        (message.length > this.messagelenth ? '...' : '')
      );
    }
  }

  ChangeTab(type: string) {
    this.tabType = type;
  }

  selectPersonalChat(chat: any) {
    this.store.dispatch(MainActions.SelectPersonalChat({ chat }));
    this.selectedPersonalChat = chat;
    console.log(this.selectedPersonalChat);
  }
}
