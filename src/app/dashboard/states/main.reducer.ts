import { HttpErrorResponse } from '@angular/common/http';
import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { AuthState } from 'src/app/auth-module/auth-state/auth.reducer';
import { Members } from 'src/shared/Models/members.model';
import { GroupTasks, PersonalTasks } from 'src/shared/Models/task.model';
import { User } from 'src/shared/Models/User.model';
import * as MainActions from './main.actions';

export interface State {
  main: MainState;
}

export interface MainState {
  error: HttpErrorResponse;
  allGroupTasks: GroupTasks[];
  pendingGroupTasks: GroupTasks[];
  pendingGroupTaskNum: number;
  inProgressGroupTasks: GroupTasks[];
  inProgressGroupTaskNum: number;
  cancelledGroupTasks: GroupTasks[];
  cancelledGroupTasksNum: number;
  completedGroupTasks: GroupTasks[];
  completedGroupTasksNum: number;
  allUsers: User[];
  allUsersNum: number;
  selectedMembers: Members[];
  memberProfile: User;
  allPersonalTasks: PersonalTasks[];
  pendingPersonalTasks: PersonalTasks[];
  pendingPersonalTaskNum: number;
  inProgressPersonalTasks: PersonalTasks[];
  inProgressPersonalTaskNum: number;
  completedPersonalTasks: PersonalTasks[];
  completedPersonalTasksNum: number;
  canceledPersonalTasks: PersonalTasks[];
  canceledPersonalTasksNum: number;

  userCompletedGroupProject: GroupTasks[];
  userCompletedGroupProjectNum: number;

  groupChats: any[];
  groupParticipants: any[];
  groupMessages: any[];
  lastMessageId: string;
  selectedChat: any;

  personalChats: any[];
  selectedPersonalChat: any;
  personalMessages: any[];
  unreadPersonalMessagesCount: any;
  onlineUsers: string[];

  groupAttachments: any;
  personalAttachments: any;

  allActivites: any[];

  showAlert: boolean;
  alertMessage: any;

  userSettings: any;
}

const initialState: MainState = {
  allGroupTasks: [],
  pendingGroupTasks: [],
  pendingGroupTaskNum: 0,
  inProgressGroupTasks: [],
  inProgressGroupTaskNum: 0,
  cancelledGroupTasks: [],
  cancelledGroupTasksNum: 0,
  completedGroupTasks: [],
  completedGroupTasksNum: 0,
  error: null,
  allUsers: [],
  allUsersNum: 0,
  selectedMembers: [],
  memberProfile: null,

  allPersonalTasks: [],
  pendingPersonalTasks: [],
  pendingPersonalTaskNum: 0,
  inProgressPersonalTasks: [],
  inProgressPersonalTaskNum: 0,
  completedPersonalTasks: [],
  completedPersonalTasksNum: 0,
  canceledPersonalTasks: [],
  canceledPersonalTasksNum: 0,

  userCompletedGroupProject: [],
  userCompletedGroupProjectNum: 0,

  groupChats: [],
  groupParticipants: [],
  groupMessages: [],
  lastMessageId: '',
  selectedChat: null,

  personalChats: [],
  selectedPersonalChat: null,
  personalMessages: [],
  unreadPersonalMessagesCount: null,
  onlineUsers: [],

  groupAttachments: null,
  personalAttachments: null,

  allActivites: [],

  showAlert: false,
  alertMessage: null,

  userSettings: null,
};

const getMainFeatureState = createFeatureSelector<MainState>('main');
const getAuthFeatureState = createFeatureSelector<AuthState>('auth');

/** SELECTORS */

export const getAlertState = createSelector(
  getMainFeatureState,
  (state) => state.showAlert
);

export const getAlertMessage = createSelector(
  getMainFeatureState,
  (state) => state.alertMessage
);

export const getUserSettings = createSelector(
  getAuthFeatureState,
  (state) => state.settings
);

export const getUserInfo = createSelector(
  getAuthFeatureState,
  (state) => state.authUser
);

export const getAllGroupTasks = createSelector(
  getMainFeatureState,
  (state) => state.allGroupTasks
);

export const getAllGroupTasksNum = createSelector(
  getMainFeatureState,
  (state) => state.allGroupTasks.length
);

export const getAllPendingGroupTasks = createSelector(
  getMainFeatureState,
  (state) => state.pendingGroupTasks
);

export const getAllPendingGroupTasksNumber = createSelector(
  getMainFeatureState,
  (state) => state.pendingGroupTaskNum
);

export const getAllUsers = createSelector(
  getMainFeatureState,
  (state) => state.allUsers
);

export const getAllUsersNum = createSelector(
  getMainFeatureState,
  (state) => state.allUsersNum
);

export const getSelectedMembers = createSelector(
  getMainFeatureState,
  (state) => state.selectedMembers
);

export const getAllInProgressGroupTasks = createSelector(
  getMainFeatureState,
  (state) => state.inProgressGroupTasks
);

export const getAllInProgressGroupTasksNumber = createSelector(
  getMainFeatureState,
  (state) => state.inProgressGroupTaskNum
);

export const getAllCompletedGroupTask = createSelector(
  getMainFeatureState,
  (state) => state.completedGroupTasks
);

export const getAllCompletedGroupTaskNumber = createSelector(
  getMainFeatureState,
  (state) => state.completedGroupTasksNum
);

export const getAllCancelledGroupTask = createSelector(
  getMainFeatureState,
  (state) => state.cancelledGroupTasks
);

export const getAllCancelledGroupTaskNumber = createSelector(
  getMainFeatureState,
  (state) => state.cancelledGroupTasksNum
);

export const getMemberProfile = createSelector(
  getMainFeatureState,
  (state) => state.memberProfile
);

export const getTotalActiveProjects = createSelector(
  getMainFeatureState,
  (state) => state.inProgressGroupTaskNum + state.pendingGroupTaskNum
);

export const getAllPersonalTasks = createSelector(
  getMainFeatureState,
  (state) => state.allPersonalTasks
);

export const getAllPersonalTasksNum = createSelector(
  getMainFeatureState,
  (state) => state.allPersonalTasks.length
);

export const getPendingPersonalTasks = createSelector(
  getMainFeatureState,
  (state) => state.pendingPersonalTasks
);

export const getPendingPersonalTasksNum = createSelector(
  getMainFeatureState,
  (state) => state.pendingPersonalTaskNum
);

export const getInProgressPersonalTasks = createSelector(
  getMainFeatureState,
  (state) => state.inProgressPersonalTasks
);

export const getInProgressPersonalTasksNum = createSelector(
  getMainFeatureState,
  (state) => state.inProgressPersonalTaskNum
);

export const getCompletedPersonalTasks = createSelector(
  getMainFeatureState,
  (state) => state.completedPersonalTasks
);

export const getCompletedPersonalTasksNum = createSelector(
  getMainFeatureState,
  (state) => state.completedPersonalTasksNum
);

export const getCanceledPersonalTasks = createSelector(
  getMainFeatureState,
  (state) => state.canceledPersonalTasks
);

export const getCanceledPersonalTasksNum = createSelector(
  getMainFeatureState,
  (state) => state.canceledPersonalTasksNum
);

export const getTotalActiveTasks = createSelector(
  getMainFeatureState,
  (state) => state.pendingPersonalTaskNum + state.inProgressPersonalTaskNum
);

export const getAllGroupChats = createSelector(
  getMainFeatureState,
  (state) => state!.groupChats
);

export const getAllGroupParticipants = createSelector(
  getMainFeatureState,
  (state) => state!.groupParticipants
);

export const getGroupMessages = createSelector(
  getMainFeatureState,
  (state) => state!.groupMessages
);

export const getLastMessageId = createSelector(
  getMainFeatureState,
  (state) => state!.lastMessageId
);

export const getGroupAttachments = createSelector(
  getMainFeatureState,
  (state) => state.groupAttachments
);

export const getPersonalAttachments = createSelector(
  getMainFeatureState,
  (state) => state.personalAttachments
);

export const getUserCompletedProjectsTotal = createSelector(
  getMainFeatureState,
  (state) => state.userCompletedGroupProjectNum
);

export const getAllActivities = createSelector(
  getMainFeatureState,
  (state) => state.allActivites
);

export const getSelectedChat = createSelector(
  getMainFeatureState,
  (state) => state.selectedChat
);

export const getMemberSettings = createSelector(
  getMainFeatureState,
  (state) => state.userSettings
);

export const getAllPersonalChats = createSelector(
  getMainFeatureState,
  (state) => state.personalChats
);

export const getSelectedPersonalChat = createSelector(
  getMainFeatureState,
  (state) => state.selectedPersonalChat
);

export const getAllPersonalMessgaes = createSelector(
  getMainFeatureState,
  (state) => state.personalMessages
);

export const getAllPersonalMessageCounts = createSelector(
  getMainFeatureState,
  (state) => state.unreadPersonalMessagesCount
);

export const getAllOnlineUsers = createSelector(
  getMainFeatureState,
  (state) => state.onlineUsers
);

/** SELECTORS */

/** REDUCERS */

export const mainReducer = createReducer(
  initialState,

  on(MainActions.ShowAlert, (state: MainState) => {
    return {
      ...state,
      showAlert: !state.showAlert,
    };
  }),

  on(MainActions.AlertMessage, (state: MainState, action) => {
    return {
      ...state,
      alertMessage: action.message,
    };
  }),

  on(MainActions.FetchAllGroupProjectsSuccess, (state: MainState, action) => {
    return {
      ...state,
      allGroupTasks: action.projects['data'],
      error: null,
    };
  }),
  on(MainActions.FetchAllGroupProjectsFail, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(MainActions.FetchPendingGroupTasksSuccess, (state: MainState, action) => {
    return {
      ...state,
      pendingGroupTasks: action.tasks['data'],
      pendingGroupTaskNum: action.tasks['data'].length,
      error: null,
    };
  }),
  on(MainActions.FetchPendingGroupTasksFails, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(
    MainActions.FetchInprogressGroupTasksSuccess,
    (state: MainState, action) => {
      return {
        ...state,
        inProgressGroupTasks: action.tasks['data'],
        inProgressGroupTaskNum: action.tasks['data'].length,
        error: null,
      };
    }
  ),
  on(MainActions.FetchInprogressGroupTasksFails, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(
    MainActions.FetchCompletedGroupTasksSuccess,
    (state: MainState, action) => {
      return {
        ...state,
        completedGroupTasks: action.tasks['data'],
        completedGroupTasksNum: action.tasks['data'].length,
        error: null,
      };
    }
  ),
  on(MainActions.FetchCompletedGroupTasksFails, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(
    MainActions.FetchCancelledGroupTasksSuccess,
    (state: MainState, action) => {
      return {
        ...state,
        cancelledGroupTasks: action.tasks['data'],
        cancelledGroupTasksNum: action.tasks['data'].length,
        error: null,
      };
    }
  ),
  on(MainActions.FetchCancelledGroupTasksFails, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(
    MainActions.FetchUserCompletedGroupTasksSuccess,
    (state: MainState, action) => {
      return {
        ...state,
        userCompletedGroupProject: action.tasks['data'],
        userCompletedGroupProjectNum: action.tasks['data'].length,
        error: null,
      };
    }
  ),
  on(
    MainActions.FetchUserCompletedGroupTasksFails,
    (state: MainState, action) => {
      return {
        ...state,
        error: action.error,
      };
    }
  ),

  on(MainActions.FetchAllUsersSuccess, (state: MainState, action) => {
    return {
      ...state,
      allUsers: action.users['data'],
      allUsersNum: action.users['data'].length,
      error: null,
    };
  }),
  on(MainActions.FetchAllUsersFail, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(MainActions.AddSelectedMembers, (state: MainState, action) => {
    return {
      ...state,
      selectedMembers: action.users,
    };
  }),
  on(MainActions.RemoveMember, (state: MainState, action) => {
    return {
      ...state,
      selectedMembers: action.users,
    };
  }),
  on(MainActions.AddNewProject, (state: MainState, action) => {
    return {
      ...state,
      pendingGroupTasks: [...state.pendingGroupTasks, action.project],
      pendingGroupTaskNum: state.pendingGroupTaskNum + 1,
      error: null,
    };
  }),
  on(MainActions.UpdatePendingProject, (state: MainState, action) => {
    return {
      ...state,
      pendingGroupTasks: action.projects,
      pendingGroupTaskNum: action.projects.length,
      error: null,
    };
  }),
  on(MainActions.AddProgressProject, (state: MainState, action) => {
    return {
      ...state,
      inProgressGroupTasks: [...state.inProgressGroupTasks, action.project],
      inProgressGroupTaskNum: state.inProgressGroupTaskNum + 1,
      error: null,
    };
  }),
  on(MainActions.AddCancelledProject, (state: MainState, action) => {
    return {
      ...state,
      cancelledGroupTasks: [...state.cancelledGroupTasks, action.task],
      cancelledGroupTasksNum: state.cancelledGroupTasksNum + 1,
      error: null,
    };
  }),
  on(MainActions.ClearSelectedMembers, (state: MainState) => {
    return {
      ...state,
      selectedMembers: [],
    };
  }),

  on(MainActions.AddCompletedProject, (state: MainState, action) => {
    return {
      ...state,
      completedGroupTasks: [...state.completedGroupTasks, action.task],
      completedGroupTasksNum: state.completedGroupTasksNum + 1,
      error: null,
    };
  }),
  on(MainActions.UpdateInprogressProjects, (state: MainState, action) => {
    return {
      ...state,
      inProgressGroupTasks: action.projects,
      inProgressGroupTaskNum: state.inProgressGroupTasks.length,
      error: null,
    };
  }),

  on(MainActions.ViewMemberProfile, (state: MainState, action) => {
    return {
      ...state,
      memberProfile: action.member,
      error: null,
    };
  }),

  on(MainActions.FetchMemberInfoSuccess, (state: MainState, action) => {
    return {
      ...state,
      memberProfile: action.user['data'],
      error: null,
    };
  }),
  on(MainActions.FetchMemberInfoFail, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(MainActions.FetchPendingTasksSuccess, (state: MainState, action) => {
    return {
      ...state,
      pendingPersonalTasks: action.tasks['data'],
      pendingPersonalTaskNum: action.tasks['data'].length,
      error: null,
    };
  }),
  on(MainActions.FetchPendingTasksFails, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(MainActions.FetchInprogressTasksSuccess, (state: MainState, action) => {
    return {
      ...state,
      inProgressPersonalTasks: action.tasks['data'],
      inProgressPersonalTaskNum: action.tasks['data'].length,
      error: null,
    };
  }),
  on(MainActions.FetchInprogressTasksFails, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(MainActions.FetchCompletedTasksSuccess, (state: MainState, action) => {
    return {
      ...state,
      completedPersonalTasks: action.tasks['data'],
      completedPersonalTasksNum: action.tasks['data'].length,
      error: null,
    };
  }),
  on(MainActions.FetchCompletedTasksFails, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(MainActions.FetchCancelledTasksSuccess, (state: MainState, action) => {
    return {
      ...state,
      canceledPersonalTasks: action.tasks['data'],
      canceledPersonalTasksNum: action.tasks['data'].length,
      error: null,
    };
  }),
  on(MainActions.FetchCancelledTasksFails, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(MainActions.AddNewTask, (state: MainState, action) => {
    return {
      ...state,
      pendingPersonalTasks: [...state.pendingPersonalTasks, action.task],
      pendingPersonalTaskNum: state.pendingPersonalTaskNum + 1,
      error: null,
    };
  }),

  on(MainActions.UpdateInprogressTasks, (state: MainState, action) => {
    return {
      ...state,
      inProgressPersonalTasks: action.tasks,
      inProgressPersonalTaskNum: state.inProgressPersonalTasks.length,
      error: null,
    };
  }),

  on(MainActions.UpdatePendingTasks, (state: MainState, action) => {
    return {
      ...state,
      pendingPersonalTasks: action.tasks,
      pendingPersonalTaskNum: state.pendingPersonalTasks.length,
      error: null,
    };
  }),

  on(MainActions.AddProgressTask, (state: MainState, action) => {
    return {
      ...state,
      inProgressPersonalTasks: [...state.inProgressPersonalTasks, action.task],
      inProgressPersonalTaskNum: state.inProgressPersonalTaskNum + 1,
      error: null,
    };
  }),

  on(MainActions.AddCancelledTask, (state: MainState, action) => {
    return {
      ...state,
      canceledPersonalTasks: [...state.canceledPersonalTasks, action.task],
      canceledPersonalTasksNum: state.canceledPersonalTasksNum + 1,
      error: null,
    };
  }),

  on(MainActions.AddCompletedTask, (state: MainState, action) => {
    return {
      ...state,
      completedPersonalTasks: [...state.completedPersonalTasks, action.task],
      completedPersonalTasksNum: state.completedPersonalTasksNum + 1,
      error: null,
    };
  }),

  on(MainActions.FetchAllPersonalTasksSuccess, (state: MainState, action) => {
    return {
      ...state,
      allPersonalTasks: action.tasks['data'],
      error: null,
    };
  }),
  on(MainActions.FetchAllPersonalTasksFail, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(MainActions.AddGroupChat, (state: MainState, action) => {
    const newGroup = action.group;
    let currentChatList = [...state.groupChats];
    const groupExit = currentChatList.find(
      (group) => group._id === newGroup._id
    );
    if (!groupExit) {
      currentChatList.push(newGroup);
    }
    return {
      ...state,
      groupChats: currentChatList,
    };
  }),

  on(MainActions.UpdateGroupChat, (state: MainState, action) => {
    const newGroup = action.chat;
    let currentChatList = [...state.groupChats];
    const groupExit = currentChatList.find(
      (group) => group._id === newGroup._id
    );

    const index = currentChatList.indexOf(groupExit);
    currentChatList[index] = newGroup;

    return {
      ...state,
      groupChats: currentChatList,
    };
  }),

  on(MainActions.FetchGroupParticipantsSuccess, (state: MainState, action) => {
    return {
      ...state,
      groupParticipants: action.participants['data'],
      error: null,
    };
  }),
  on(MainActions.FetchGroupParticipantsFail, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(
    MainActions.FetchUserGroupChatsSuccess,
    (state: MainState, action): any => {
      const currentSessions = [...state.groupChats];
      const chatSession = action.session['data'];
      const availableSession = currentSessions.find(
        (session) => session._id === chatSession._id
      );

      if (!availableSession) {
        return {
          ...state,
          groupChats: [...state.groupChats, action.session['data']],
          error: null,
        };
      }
    }
  ),
  on(MainActions.FetchUserGroupChatsFail, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(MainActions.AddNewGroupMessage, (state: MainState, action) => {
    let currentGroupMessages = [...state.groupMessages];
    let previousmessage = currentGroupMessages.find(
      (item) => item._id === action.message._id
    );
    if (previousmessage) {
      const index = currentGroupMessages.indexOf(previousmessage);
      currentGroupMessages[index] = action.message;
    } else {
      currentGroupMessages.push(action.message);
    }
    return {
      ...state,
      groupMessages: currentGroupMessages,
      lastMessageId: action.message?._id,
      error: null,
    };
  }),

  on(MainActions.FetchAllGroupMessagesSuccess, (state: MainState, action) => {
    return {
      ...state,
      groupMessages: action.messages['data'],
      error: null,
    };
  }),

  on(MainActions.FetchAllGroupMessagesFail, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  on(MainActions.UpdateGroupChatLastMessage, (state: MainState, action) => {
    let currentGroups = [...state.groupChats];
    let group = currentGroups.find((item) => item._id === action.group._id);
    const index = currentGroups.indexOf(group);
    currentGroups.splice(index, 1);
    currentGroups.unshift(action.group);
    return {
      ...state,
      groupChats: currentGroups,
    };
  }),

  on(MainActions.SelectChat, (state: MainState, action) => {
    return {
      ...state,
      selectedChat: action.chat,
    };
  }),

  on(
    MainActions.FetchGroupProjectAttachmentsSuccess,
    (state: MainState, action) => {
      return {
        ...state,
        groupAttachments: action.attachments['data'],
        error: null,
      };
    }
  ),

  on(
    MainActions.FetchGroupProjectAttachmentsFail,
    (state: MainState, action) => {
      return {
        ...state,
        error: action.error,
      };
    }
  ),

  on(
    MainActions.FetchPersonalTaskAttachmentsSuccess,
    (state: MainState, action) => {
      return {
        ...state,
        personalAttachments: action.attachments['data'],
        error: null,
      };
    }
  ),

  on(
    MainActions.FetchPersonalTaskAttachmentsFail,
    (state: MainState, action) => {
      return {
        ...state,
        error: action.error,
      };
    }
  ),

  on(MainActions.UpdateGroupProjectAttachments, (state: MainState, action) => {
    const newattachment = action.attachments;
    let currentAttachments = [...state.groupAttachments];

    const oldattachment = currentAttachments.find(
      (attachment) => attachment._id === newattachment._id
    );
    const index = currentAttachments.indexOf(oldattachment);
    currentAttachments[index] = newattachment;

    console.log(index, oldattachment, newattachment);
    return {
      ...state,
      groupAttachments: currentAttachments,
      error: null,
    };
  }),

  on(MainActions.UpdatePersonalTaskAttachments, (state: MainState, action) => {
    const newattachment = action.attachments;
    let currentAttachments = [...state.personalAttachments];

    const oldattachment = currentAttachments.find(
      (attachment) => attachment._id === newattachment._id
    );
    const index = currentAttachments.indexOf(oldattachment);
    currentAttachments[index] = newattachment;

    console.log(index, oldattachment, newattachment);
    return {
      ...state,
      personalAttachments: currentAttachments,
      error: null,
    };
  }),

  // ACTIVITIES REDUCERS
  on(MainActions.FetchAllActivitiesSuccess, (state: MainState, action) => {
    return {
      ...state,
      allActivites: action.activities['data'],
      error: null,
    };
  }),
  on(MainActions.FetchAllActivitiesFail, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),
  on(MainActions.AddNewActivity, (state: MainState, action) => {
    const currentActivities = [...state.allActivites];
    currentActivities.unshift(action.activity);
    return {
      ...state,
      allActivites: currentActivities,
    };
  }),

  on(MainActions.UpdateActivity, (state: MainState, action) => {
    const currentActivities = [...state.allActivites];
    let activity = currentActivities.find(
      (item) => item._id === action.activity._id
    );
    const index = currentActivities.indexOf(activity);

    currentActivities[index] = action.activity;
    console.log(currentActivities);
    return {
      ...state,
      allActivites: currentActivities,
    };
  }),

  // SETTINGS
  on(MainActions.FetchUserSettingsSuccess, (state: MainState, action) => {
    return {
      ...state,
      userSettings: action.settings['data'],
      error: null,
    };
  }),
  on(MainActions.FetchUserSettingsFail, (state: MainState, action) => {
    return {
      ...state,
      error: action.error,
    };
  }),

  // PERSONAL CHAT ACTIONS
  on(MainActions.AddNewChat, (state: MainState, action) => {
    return {
      ...state,
      personalChats: [...state.personalChats, action.chat],
      error: null,
    };
  }),
  on(MainActions.FetchAllChatsSuccess, (state: MainState, action) => {
    return {
      ...state,
      personalChats: action.chats,
      error: null,
    };
  }),

  on(MainActions.SelectPersonalChat, (state: MainState, action) => {
    return {
      ...state,
      selectedPersonalChat: action.chat,
    };
  }),
  on(MainActions.AddNewPersonalMessage, (state: MainState, action) => {
    let currentPersonalMessages = [...state.personalMessages];
    let previousmessage = currentPersonalMessages.find(
      (item) => item._id === action.message._id
    );
    if (previousmessage) {
      const index = currentPersonalMessages.indexOf(previousmessage);
      currentPersonalMessages[index] = action.message;
    } else {
      currentPersonalMessages.push(action.message);
    }
    return {
      ...state,
      personalMessages: currentPersonalMessages,
      error: null,
    };
  }),
  on(MainActions.FetchAllPersonalMessages, (state: MainState, action) => {
    return {
      ...state,
      personalMessages: action.messages,
    };
  }),
  on(MainActions.UpdatePersonalChatLastMessage, (state: MainState, action) => {
    let currentchats = [...state.personalChats];
    let chat = currentchats.find((item) => item._id === action.chat._id);
    const index = currentchats.indexOf(chat);
    currentchats.splice(index, 1);
    currentchats.unshift(action.chat);
    return {
      ...state,
      personalChats: currentchats,
    };
  }),
  on(MainActions.UpdatePersonalMessagingCounts, (state: MainState, action) => {
    return {
      ...state,
      unreadPersonalMessagesCount: action.counts,
      error: null,
    };
  }),
  on(MainActions.UpdatePersonalChatMessage, (state: MainState, action) => {
    let currentmessages = [...state.personalMessages];
    let message = currentmessages.find(
      (item) => item._id === action.message._id
    );
    const index = currentmessages.indexOf(message);
    currentmessages[index] = action.message;
    return {
      ...state,
      personalMessages: currentmessages,
      error: null,
    };
  }),

  on(MainActions.AddUsersToOnlineList, (state: MainState, action) => {
    return {
      ...state,
      onlineUsers: action.rooms,
      error: null,
    };
  }),

  on(MainActions.RemoveUserFromOnlineList, (state: MainState, action) => {
    const currentOnline = [...state.onlineUsers];
    const userExist = currentOnline.find((user) => user === action.id);
    const index = currentOnline.findIndex((user) => user === userExist);
    if (userExist) {
      currentOnline.splice(index, 1);
    }
    return {
      ...state,
      onlineUsers: currentOnline,
    };
  })
);
