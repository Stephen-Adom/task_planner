import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import {
  getAllGroupParticipants,
  getGroupMessages,
  getSelectedChat,
  State,
} from 'src/app/dashboard/states/main.reducer';
import { User } from 'src/shared/Models/User.model';
import { SocketService } from 'src/shared/services/socket.service';
import * as MainActions from '../../../dashboard/states/main.actions';
import { EditChatInfoComponent } from '../../edit-chat-info/edit-chat-info.component';

@Component({
  selector: 'app-chat-messages-box',
  templateUrl: './chat-messages-box.component.html',
  styleUrls: ['./chat-messages-box.component.scss'],
})
export class ChatMessagesBoxComponent implements OnInit {
  @ViewChild('chat_container_messages') chat_container: ElementRef;
  SelectedChatSub: Subscription = new Subscription();
  Socket$: Observable<any>;
  Messages$: Observable<any[]>;
  Members$: Observable<any[]>;

  ChatGroup: any;
  Form: FormGroup;
  authUser: User;
  typing = false;
  typingMessage: string;
  LastMessageId: string;
  Messages: any;
  todayMessageExist = false;
  isEmojiPickerVisible = false;
  attachments: any[] = [];

  constructor(
    private socketservice: SocketService,
    private formBuilder: FormBuilder,
    private store: Store<State>,
    private dialog: MatDialog
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

    this.SelectedChatSub = this.store
      .select(getSelectedChat)
      .subscribe((chat) => {
        if (chat) {
          this.ChatGroup = chat;
          this.clearMessagingInfo();
          this.refetchMessages();
          this.store.dispatch(
            MainActions.FetchGroupParticipants({ id: this.ChatGroup._id })
          );
        }
      });

    this.Members$ = this.store.select(getAllGroupParticipants);

    // this.Messages$ = this.store.select(getGroupMessages).pipe(
    //   map((messages: any) =>
    //     messages.filter((message) => message.group_id === this.ChatGroup._id)
    //   ),
    //   share()
    // );

    // this.groupMessagesByDate();
    this.ListenToSocketMessages();
  }

  // SEND MESSAGE THAT USE IS TYPING
  sendTypingMessage() {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        socket.emit('userTyping', { user: this.authUser });
      }
    });
  }

  //SEND MESSAGE TO GROUP
  sendMessage() {
    if (this.Form.valid || this.attachments.length) {
      this.Socket$.subscribe((socket) => {
        if (socket) {
          console.log(this.Form, socket, 'sucscs');
          socket.emit('groupMessage', {
            message: this.Form.get('message').value,
            group: this.ChatGroup._id,
            lastMessageid: this.LastMessageId,
            attachments: this.attachments,
          });
          this.Form.reset();
          this.attachments = [];
        }
      });
    }
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

  groupMessagesByDate() {
    this.Messages$.subscribe((messages) => {
      if (messages.length) {
        this.Messages = this.groupBy(messages, 'createdAt');
        this.scrollToBottom();
        this.checkIfTodayMessagesExist();
        console.log(this.Messages['2021-11-01'], Object.keys(this.Messages));
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

  // LISTENING TO SOCKET MESSAGES
  ListenToSocketMessages() {
    this.Socket$.subscribe((socket) => {
      if (socket) {
        //USER IS TYPING A MESSAGE
        socket.on('userTypingSent', (user) => {
          this.typing = true;
          this.typingMessage = `${user.firstname} is Typing...`;
        });

        // LISTEN TO MESSAGE RECEIVED
        socket.on('groupMessageSent', (message) => {
          this.UpdateLastMessage(message.session);
          this.AddNewMessage(message.message);
          this.LastMessageId = message.message._id;
          this.scrollToBottom();
          socket.emit('stopTyping');
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
      const messageArray = this.Messages[moment().format('YYYY-MM-DD')];
      const messageExist = messageArray.find(
        (parentMessage) => parentMessage._id === message._id
      );
      if (messageExist) {
        const index = messageArray.indexOf(messageExist);
        messageArray[index] = message;
      } else {
        this.Messages[moment().format('YYYY-MM-DD')].push(message);
      }
    } else {
      this.store.dispatch(MainActions.AddNewGroupMessage({ message: message }));
    }
  }

  UpdateLastMessage(session: any) {
    this.store.dispatch(
      MainActions.UpdateGroupChatLastMessage({ group: session })
    );
  }

  scrollToBottom(): void {
    try {
      this.chat_container.nativeElement.scrollTop =
        this.chat_container.nativeElement.scrollHeight;
    } catch (err) {}
  }

  clearMessagingInfo() {
    this.Messages = null;
    this.todayMessageExist = false;
    this.LastMessageId = null;
  }

  refetchMessages() {
    this.Messages$ = this.store.select(getGroupMessages).pipe(
      map((messages: any) =>
        messages.filter((message) => message.group_id === this.ChatGroup._id)
      ),
      share()
    );

    this.groupMessagesByDate();
  }

  updateInfo() {
    const dialogRef = this.dialog.open(EditChatInfoComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      disableClose: true,
      data: { chat: this.ChatGroup },
    });

    dialogRef.afterClosed().subscribe((data) => {
      return;
    });
  }

  ngOnDestroy(): void {
    this.SelectedChatSub.unsubscribe();
  }
}
