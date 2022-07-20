import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SignOutDialogComponent } from './sign-out-dialog/sign-out-dialog.component';
import {
  getAllActivities,
  getAllGroupChats,
  getAllGroupTasks,
  getAllPersonalMessageCounts,
  getAllUsers,
  getUserSettings,
  State,
} from './states/main.reducer';
import { io } from 'socket.io-client';
import * as MainActions from './states/main.actions';
import { SocketService } from 'src/shared/services/socket.service';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GroupTasks } from 'src/shared/Models/task.model';
import { ChatService } from 'src/shared/services/chat.services';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/shared/Models/User.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  UserGroupProjectsSub: Subscription = new Subscription();
  GroupChatsSub: Subscription = new Subscription();
  GroupChats$: Observable<any[]>;
  Members$: Observable<User[]>;
  UnreadChats$: Observable<number>;

  authUser: User;
  theme: Theme;
  UnreadActivites$: Observable<number>;
  socket: any = io('http://localhost:3000');

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private socketservice: SocketService,
    private chatservice: ChatService,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<State>
  ) {
    if (localStorage.getItem('authUser')) {
      this.authUser = JSON.parse(localStorage.getItem('authUser'));
    }
    this.socketservice.sendSocketInstance(this.socket);
  }

  ngOnInit(): void {
    this.InitializeSocket();

    this.store.select(getUserSettings).subscribe((settings) => {
      if (settings) {
        this.theme = settings['theme'];
      }
    });

    this.Members$ = this.store.select(getAllUsers);

    this.UnreadActivites$ = this.store.select(getAllActivities).pipe(
      map((activities) => {
        return activities.filter((activity) => activity.read === false);
      }),
      map((activities) => activities.length)
    );

    this.GroupChats$ = this.store.select(getAllGroupChats);

    this.UnreadChats$ = this.store.select(getAllPersonalMessageCounts).pipe(
      map((unreads) => {
        if (unreads) {
          return unreads.length;
        }
      })
    );

    this.UserGroupProjectsSub = this.store
      .select(getAllGroupTasks)
      .subscribe((projects) => {
        if (projects.length) {
          this.fetchProjectChatSessions(projects);
        }
      });

    this.initializetheme();
    this.FetchActivities();
    this.FetchAuthUserGroupProjects();
    this.FetchChatMessages();
  }

  initializetheme = (): void =>
    this.renderer.addClass(this.document.body, this.theme);

  toggletheme() {
    this.document.body.classList.replace(
      this.theme,
      this.theme === 'dark-theme'
        ? (this.theme = 'light-theme')
        : (this.theme = 'dark-theme')
    );
  }

  logout() {
    const dialogRef = this.dialog.open(SignOutDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.disconnectUser();
        // this.removeCredentials();
      }
    });
  }

  disconnectUser() {
    this.socket.emit('leaveChannel', { authid: this.authUser.uuid });
    this.removeCredentials();
  }

  removeCredentials() {
    localStorage.removeItem('authUser');
    localStorage.removeItem('settings');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/auth/login']);
  }

  FetchActivities() {
    this.store.dispatch(MainActions.FetchAllActivities());
  }

  FetchAuthUserGroupProjects() {
    this.store.dispatch(MainActions.FetchAllGroupProjects());
  }

  fetchProjectChatSessions(projects: GroupTasks[]) {
    projects.forEach((project) => {
      const sub = this.chatservice.getGroupSession(project._id).subscribe(
        (response) => {
          if (response['status'] === 200) {
            if (response['data']) {
              this.store.dispatch(
                MainActions.AddGroupChat({ group: response['data'] })
              );
              this.JoinUserToChatRoom(response['data']);
            }
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          sub.unsubscribe();
        }
      );
    });
  }

  FetchChatMessages() {
    this.GroupChatsSub = this.GroupChats$.subscribe((chats) => {
      if (chats.length) {
        this.FetchMessages(chats);
        // this.GroupChatsSub.unsubscribe();
      }
    });
  }

  FetchMessages(chats: any[]) {
    chats.forEach((chat) => {
      const sub = this.chatservice.getGroupMessages(chat._id).subscribe(
        (response) => {
          if (response['status'] === 200) {
            this.AddMessagesToStore(response['data']);
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          sub.unsubscribe();
        }
      );
    });
  }

  AddMessagesToStore(messages: any[]) {
    if (messages.length) {
      messages.forEach((message) => {
        this.store.dispatch(MainActions.AddNewGroupMessage({ message }));
      });
    }
  }

  InitializeSocket() {
    this.socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    this.socket.emit('joinChannel', { authid: this.authUser.uuid });

    this.socket.on('joinChannelSuccess', ({ rooms }) => {
      this.store.dispatch(MainActions.AddUsersToOnlineList({ rooms }));
      this.socket.emit('fetchMyMessages', { authid: this.authUser.uuid });
    });

    this.socket.on('fetchMyMessagesSuccess', ({ messages }) => {
      this.store.dispatch(MainActions.FetchAllPersonalMessages({ messages }));
    });

    this.socket.on('NewActivitySaved', ({ activity }) => {
      this.store.dispatch(MainActions.AddNewActivity({ activity }));
      this.store.dispatch(
        MainActions.AlertMessage({
          message: {
            title: 'NEW PROJECT',
            message: activity.activity,
          },
        })
      );
      this.store.dispatch(MainActions.ShowAlert());
      console.log(activity);
    });

    this.socket.on('NewMemberAssignedToProjectSuccess', ({ activity }) => {
      this.store.dispatch(MainActions.AddNewActivity({ activity }));
      this.store.dispatch(
        MainActions.AlertMessage({
          message: {
            title: 'USER ASSIGNED',
            message: activity.activity,
          },
        })
      );
      this.store.dispatch(MainActions.ShowAlert());
      console.log(activity);
    });

    this.socket.on('GroupProjectStartedSuccess', ({ activity }) => {
      this.store.dispatch(MainActions.AddNewActivity({ activity }));
      this.store.dispatch(
        MainActions.AlertMessage({
          message: {
            title: 'GROUP PROJECT STARTED',
            message: activity.activity,
          },
        })
      );
      this.store.dispatch(MainActions.ShowAlert());
      console.log(activity);
    });

    this.socket.on('GroupProjectCancelledSuccess', ({ activity }) => {
      this.store.dispatch(MainActions.AddNewActivity({ activity }));
      this.store.dispatch(
        MainActions.AlertMessage({
          message: {
            title: 'GROUP PROJECT CANCELLED',
            message: activity.activity,
          },
        })
      );
      this.store.dispatch(MainActions.ShowAlert());
      console.log(activity);
    });

    this.socket.on('GroupProjectCompletedSuccess', ({ activity }) => {
      this.store.dispatch(MainActions.AddNewActivity({ activity }));
      this.store.dispatch(
        MainActions.AlertMessage({
          message: {
            title: 'GROUP PROJECT COMPLETED',
            message: activity.activity,
          },
        })
      );
      this.store.dispatch(MainActions.ShowAlert());
      console.log(activity);
    });

    this.socket.on('PersonalProjectStartedSuccess', ({ activity }) => {
      this.store.dispatch(MainActions.AddNewActivity({ activity }));
      this.store.dispatch(
        MainActions.AlertMessage({
          message: {
            title: 'PERSONAL TASK COMPLETED',
            message: activity.activity,
          },
        })
      );
      this.store.dispatch(MainActions.ShowAlert());
      console.log(activity);
    });

    this.socket.on('PersonalProjectCancelledSuccess', ({ activity }) => {
      this.store.dispatch(MainActions.AddNewActivity({ activity }));
      this.store.dispatch(
        MainActions.AlertMessage({
          message: {
            title: 'PERSONAL TASK CANCELED',
            message: activity.activity,
          },
        })
      );
      this.store.dispatch(MainActions.ShowAlert());
      console.log(activity);
    });

    this.socket.on('PersonalProjectCompletedSuccess', ({ activity }) => {
      this.store.dispatch(MainActions.AddNewActivity({ activity }));
      this.store.dispatch(
        MainActions.AlertMessage({
          message: {
            title: 'PERSONAL TASK COMPLETED',
            message: activity.activity,
          },
        })
      );
      this.store.dispatch(MainActions.ShowAlert());
      console.log(activity);
    });

    this.socket.on('NewPersonalTaskCreatedSuccess', ({ activity }) => {
      this.store.dispatch(MainActions.AddNewActivity({ activity }));
      this.store.dispatch(
        MainActions.AlertMessage({
          message: {
            title: 'NEW PERSONAL TASK',
            message: activity.activity,
          },
        })
      );
      this.store.dispatch(MainActions.ShowAlert());
      console.log(activity);
    });

    // FETCH PERSONAL CHATS
    this.socket.emit('fetchMyChats', { uuid: this.authUser.uuid });

    this.socket.on('fetchMyChatsSuccess', ({ chats }) => {
      if (chats?.length) {
        this.store.dispatch(MainActions.FetchAllChatsSuccess({ chats }));
      }
    });

    // FETCH UNREAD MESSAGES COUNTS
    this.socket.emit('fetchUnreadMessages', { authid: this.authUser.uuid });

    // FETCH UNREAD MESSAGES COUNTS SUCCESS
    this.socket.on('fetchUnreadMessagesSuccess', ({ unreadMessageCounts }) => {
      this.store.dispatch(
        MainActions.UpdatePersonalMessagingCounts({
          counts: unreadMessageCounts,
        })
      );
    });

    // LISTEN TO MESSAGE RECEIVED
    this.socket.on('sendPersonalMessageSuccess', ({ message }) => {
      if (this.router.url !== '/chat/session') {
        this.notifyUser(message);
      }
    });

    this.socket.on('leaveChannelSuccess', ({ authid }) => {
      console.log('user loggged out');
      this.store.dispatch(MainActions.RemoveUserFromOnlineList({ id: authid }));
    });
  }

  JoinUserToChatRoom(groupChat: any) {
    this.socket.emit('joinRoom', {
      user: this.authUser.uuid,
      room: groupChat._id,
    });
  }

  notifyUser(newmessage: any) {
    this.store.dispatch(MainActions.ShowAlert());
    this.store.dispatch(
      MainActions.AlertMessage({
        message: {
          sender: null,
          message: newmessage.message,
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.UserGroupProjectsSub.unsubscribe();
  }
}

export type Theme = 'light-theme' | 'dark-theme';
