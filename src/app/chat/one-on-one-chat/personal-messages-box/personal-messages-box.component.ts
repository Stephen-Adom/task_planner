import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import {
  getAllOnlineUsers,
  getAllPersonalMessgaes,
  getSelectedPersonalChat,
  State,
} from 'src/app/dashboard/states/main.reducer';
import { User } from 'src/shared/Models/User.model';
import { SocketService } from 'src/shared/services/socket.service';
import * as MainActions from '../../../dashboard/states/main.actions';

@Component({
  selector: 'app-personal-messages-box',
  templateUrl: './personal-messages-box.component.html',
  styleUrls: ['./personal-messages-box.component.scss'],
})
export class PersonalMessagesBoxComponent implements OnInit {
  @ViewChild('chat_container_messages') chat_container: ElementRef;
  SelectedChat: any;
  Messages$: Observable<any[]>;
  Socket$: Observable<any>;
  authUser: User;
  Form: FormGroup;

  typing = false;
  typingMessage: string;
  attachments: any[] = [];
  isEmojiPickerVisible = false;
  Messages: any;
  todayMessageExist = false;
  onlineUsers: string[] = [];

  constructor(
    private socketservice: SocketService,
    private formBuilder: FormBuilder,
    private store: Store<State>
  ) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }

    this.Form = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.Socket$ = this.socketservice.socketInstanceObservable;

    this.store.select(getSelectedPersonalChat).subscribe((chat) => {
      if (chat) {
        this.SelectedChat = chat;
        this.clearMessagingInfo();
        this.refetchMessages();
      }
    });

    this.store.select(getAllOnlineUsers).subscribe((onlineusers) => {
      this.onlineUsers = onlineusers;
    });

    // this.Messages$ = this.store
    //   .select(getAllPersonalMessgaes)
    //   .pipe(
    //     map((messages: any) =>
    //       messages.filter(
    //         (message) => message.chat_id === this.SelectedChat._id
    //       )
    //     )
    //   );

    // this.groupMessagesByDate();

    this.ListenToSocketMessages();
  }

  getUserStatus(id: string) {
    const online = this.onlineUsers.find((user) => user === id);
    if (online) {
      return true;
    } else {
      return false;
    }
  }

  formatGroupDate(date: string) {
    if (moment(new Date(date)).format('dddd') === moment().format('dddd')) {
      return 'Today';
    } else {
      return moment(new Date(date)).format('ll');
    }
  }

  formatTime(createdAt: string) {
    return moment(new Date(createdAt)).format('LT');
  }

  clearMessagingInfo() {
    this.Messages = null;
    this.todayMessageExist = false;
  }

  refetchMessages() {
    this.Messages$ = this.store.select(getAllPersonalMessgaes).pipe(
      map((messages: any) =>
        messages.filter((message) => message.chat_id === this.SelectedChat._id)
      ),
      tap(() => this.MarkAllUnreadMessages(this.SelectedChat._id)),
      share()
    );

    this.groupMessagesByDate();
  }

  groupMessagesByDate() {
    this.Messages$.subscribe((messages) => {
      if (messages.length) {
        this.Messages = this.groupBy(messages, 'createdAt');
        this.scrollToBottom();
        this.checkIfTodayMessagesExist();
      }
    });
  }

  checkIfTodayMessagesExist() {
    if (this.Messages) {
      const dates = Object.keys(this.Messages);
      dates.forEach((date) => {
        if (date === moment().format('YYYY-MM-DD')) {
          this.todayMessageExist = true;
        }
      });

      console.log(this.todayMessageExist);
    }
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

  scrollToBottom(): void {
    try {
      this.chat_container.nativeElement.scrollTop =
        this.chat_container.nativeElement.scrollHeight;
    } catch (err) {}
  }

  // SEND MESSAGE THAT USE IS TYPING
  sendTypingMessage() {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('userTyping', { user: this.authUser });
      }
    });
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

  uploadAttachment(event) {
    const files = event.target.files;
    for (const file of files) {
      this.readBase64(file).then((data) => {
        this.attachments.push({
          file: data,
          meta: {
            name: file.name,
            type: file.type,
            size: file.size,
          },
        });

        console.log(this.attachments);
      });
    }
  }

  deleteAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  readBase64(file): Promise<any> {
    const reader = new FileReader();
    const future = new Promise((resolve, reject) => {
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );
      reader.addEventListener(
        'error',
        function (event) {
          reject(event);
        },
        false
      );

      reader.readAsDataURL(file);
    });
    return future;
  }

  //SEND MESSAGE TO GROUP
  sendMessage() {
    if (this.Form.valid || this.attachments.length) {
      this.Socket$.subscribe((socket) => {
        if (socket) {
          socket.emit('sendPersonalMessage', {
            message: this.Form.get('message').value,
            receiver:
              this.authUser.uuid !== this.SelectedChat.receiver.user_id
                ? this.SelectedChat.receiver.user_id
                : this.SelectedChat.sender.user_id,
            sender: this.authUser.uuid,
            attachments: this.attachments,
            chat: this.SelectedChat._id,
          });
          this.Form.reset();
          this.attachments = [];
        }
      });
    }
  }

  ListenToSocketMessages() {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        //USER IS TYPING A MESSAGE
        socket.on('userTypingSent', (user) => {
          this.typing = true;
          this.typingMessage = `${user.firstname} is Typing...`;
        });

        // LISTEN TO MESSAGE RECEIVED
        socket.on('sendPersonalMessageSuccess', ({ message }) => {
          console.log(message);
          this.scrollToBottom();
          this.AddNewMessage(message);
          this.messageIsRead(message, socket);
          socket.emit('stopTyping');
        });

        socket.on('messageIsReadSuccess', ({ message }) => {
          this.UpdateReadMessage(message);
          socket.emit('fetchUnreadMessages', { authid: this.authUser.uuid });
        });

        socket.on('markAllUnreadMessagesSuccess', ({ updatedMessages }) => {
          this.Messages = this.groupBy(updatedMessages, 'createdAt');
          this.scrollToBottom();
          socket.emit('fetchUnreadMessages', { authid: this.authUser.uuid });
          this.checkIfTodayMessagesExist();
        });

        socket.on('stopTypingSent', () => {
          this.typing = false;
          this.typingMessage = '';
        });
      }
    });
  }

  AddNewMessage(message: any) {
    if (this.todayMessageExist === true) {
      this.Messages[moment().format('YYYY-MM-DD')].push(message);
    } else {
      console.log(message);
      this.store.dispatch(MainActions.AddNewPersonalMessage({ message }));
    }
  }

  messageIsRead(message: any, socket: any) {
    if (message.receiver === this.authUser.uuid) {
      socket.emit('messageIsRead', { message });
    }
  }

  UpdateReadMessage(message: any) {
    const messageArray = this.Messages[moment().format('YYYY-MM-DD')];
    const messageExist = messageArray.find(
      (parentMessage) => parentMessage._id === message._id
    );
    if (messageExist) {
      const index = messageArray.indexOf(messageExist);
      messageArray[index] = message;
    }
    this.store.dispatch(MainActions.UpdatePersonalChatMessage({ message }));
  }

  MarkAllUnreadMessages(chatid: string) {
    const sender =
      this.SelectedChat.sender.user_id === this.authUser.uuid
        ? this.SelectedChat.receiver.user_id
        : this.SelectedChat.sender.user_id;

    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('markAllUnreadMessages', { sender, chatid });
      }
    });
  }
}
