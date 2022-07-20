import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {
  getAllGroupChats,
  getAllGroupParticipants,
  getAllGroupTasks,
  getGroupMessages,
  getLastMessageId,
  State,
} from 'src/app/dashboard/states/main.reducer';
import { User } from 'src/shared/Models/User.model';
import * as MainActions from '../../dashboard/states/main.actions';
import { io } from 'socket.io-client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, map, share, tap } from 'rxjs/operators';
import moment from 'moment';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss'],
})
export class GroupChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chat_container_messages') chat_container: ElementRef;
  @ViewChild('main_chat_box') chat_box: ElementRef;

  authUser: User;
  GroupSub = new Subscription();
  GroupProjectsSub = new Subscription();
  GroupSessions: any;
  online = false;
  ActiveSession: any;
  Form: FormGroup;
  socket: any = io('http://localhost:3000');
  typing = false;
  typingMessage: string;
  isEmojiPickerVisible: boolean;
  Messages: any;
  LastMessageId: string;

  Participants$: Observable<any[]>;
  Messages$: Observable<any[]>;
  GroupChat$: Observable<any[]>;
  LastMessage$: Observable<string>;

  constructor(
    private store: Store<State>,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder
  ) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }

    this.store.dispatch(MainActions.FetchAllGroupProjects());

    this.Form = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.InitializeSocket();
    // FETCH ALL GROUP PROJECTS THAT AUTH USER BELONGS IN
    this.GroupProjectsSub = this.store
      .select(getAllGroupTasks)
      .pipe(
        map((projects: any) => {
          projects.map((project) =>
            this.store.dispatch(
              MainActions.FetchUserGroupChats({ id: project._id })
            )
          );
        })
      )
      .subscribe((response) => {});

    // // FETCH GROUP CHAT SESSIONS
    this.GroupChat$ = this.store.select(getAllGroupChats).pipe(
      tap((chats) => {
        this.ActiveSession = chats[0];
      }),
      share()
    );

    this.Participants$ = this.store.select(getAllGroupParticipants);

    this.Messages$ = this.store.select(getGroupMessages).pipe(
      filter((messages: any) =>
        messages.filter(
          (message) => message.group_id === this.ActiveSession._id
        )
      ),
      share()
    );

    this.store.select(getLastMessageId).subscribe((id) => {
      if (id) {
        this.LastMessageId = id;
      }
    });

    this.FetchChatMeta();
    this.formatMessages();
  }

  FetchChatMeta() {
    this.GroupChat$.subscribe((sessions) => {
      if (sessions) {
        this.JoinChatsToRooms(sessions);
        this.fetchGroupParticipants();
        this.fetchGroupMessages();
      }
    });
  }

  fetchGroupParticipants() {
    if (this.ActiveSession) {
      this.store.dispatch(
        MainActions.FetchGroupParticipants({ id: this.ActiveSession._id })
      );
    }
  }

  fetchGroupMessages() {
    if (this.ActiveSession) {
      this.store.dispatch(MainActions.FetchAllGroupMessages());
    }
  }

  JoinChatsToRooms(chats) {
    chats.forEach((session) => {
      this.socket.emit('joinRoom', {
        user: this.authUser.uuid,
        room: session._id,
      });
    });
  }

  formatMessages() {
    this.Messages$.subscribe((response) => {
      if (response) {
        this.Messages = this.groupBy(response, 'createdAt');
        this.scrollToBottom();
      }
    });
  }

  groupBy = (array, key) => {
    // Return the reduced array
    return array.reduce((result, currentItem) => {
      // If an array already present for key, push it to the array. Otherwise create an array and push the object.
      (result[currentItem[key].split('T')[0]] =
        result[currentItem[key].split('T')[0]] || []).push(currentItem);
      // return the current iteration `result` value, this will be the next iteration's `result` value and accumulate
      return result;
    }, {}); // Empty object is the initial value for result object
  };

  checkIfActive(group) {
    return this.ActiveSession._id === group._id;
  }

  formatTime(createdAt) {
    return moment(new Date(createdAt)).format('LT');
  }

  formatLastMessageTime(createdAt) {
    const currentdate = moment().format('YYYY-MM-DD');
    const date = moment(new Date(createdAt)).format('YYYY-MM-DD');
    if (moment(date).isBefore(currentdate)) {
      return moment(new Date(createdAt)).format('ll');
    }
    return moment(new Date(createdAt)).format('LT');
  }

  formatMessageCategoryDate(date?: any) {
    return moment(new Date(date)).format('ll');
  }

  addEmoji(event) {
    if (this.Form.get('message').value) {
      this.Form.get('message').setValue(
        `${this.Form.get('message').value}${event.emoji.native}`
      );
      this.isEmojiPickerVisible = false;
    } else {
      this.Form.get('message').setValue(`${event.emoji.native}`);
      this.isEmojiPickerVisible = false;
    }
  }

  checkDays(key, index) {
    return (
      moment(new Date(this.Messages[key][index].createdAt)).format('LT') ===
      moment(new Date(this.Messages[key][index + 1].createdAt)).format('LT')
    );
  }

  back() {
    this.location.back();
  }

  InitializeSocket() {
    this.socket.onAny((event, ...args) => {
      // console.log(event, args);
    });

    this.socket.on('groupMessageSent', (message) => {
      this.UpdateLastMessage(message.session);
      this.store.dispatch(
        MainActions.AddNewGroupMessage({ message: message.message })
      );
      this.scrollToBottom();
      this.socket.emit('stopTyping');
    });

    this.socket.on('connected', () => {
      this.online = true;
    });

    this.socket.on('userTyping', (user) => {
      this.typing = true;
      this.typingMessage = `${user.firstname} is Typing...`;
    });

    this.socket.on('stopTyping', () => {
      this.typing = false;
      this.typingMessage = '';
    });
  }

  sendTypingMessage() {
    this.socket.emit('userTyping', { user: this.authUser });
  }

  sendMessage() {
    if (this.Form.valid) {
      this.socket.emit('groupMessage', {
        message: this.Form.get('message').value,
        group: this.ActiveSession._id,
        lastMessageid: this.LastMessageId,
      });
      console.log('sending message');
      this.Form.reset();
    }
  }

  UpdateLastMessage(session) {
    // this.store.dispatch(
    //   MainActions.UpdateGroupChatLastMessage({ group: session })
    // );
    console.log(session);
  }

  ngAfterViewInit() {
    // console.log(this.chat_box.nativeElement.scrollHeight);
  }

  ngOnDestroy(): void {
    this.GroupSub.unsubscribe();
    this.GroupProjectsSub.unsubscribe();
  }

  scrollToBottom(): void {
    try {
      this.chat_container.nativeElement.scrollTop =
        this.chat_box.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
