import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Members } from 'src/shared/Models/members.model';
import { GroupTasks, PersonalTasks } from 'src/shared/Models/task.model';
import { User } from 'src/shared/Models/User.model';

export const ShowAlert = createAction('[Main] Show Alert Info');

export const AlertMessage = createAction(
  '[Main], Alert Message',
  props<{ message: any }>()
);

export const FetchAllGroupProjects = createAction(
  '[Main] Fetch All Group Projects'
);

export const FetchAllGroupProjectsSuccess = createAction(
  '[Main] Fetch All Group Projects Success',
  props<{ projects: any }>()
);

export const FetchAllGroupProjectsFail = createAction(
  '[Main] Fetch All Group Projects Fail',
  props<{ error: any }>()
);

// PENDING GROUP TASK ROUTES

export const FetchPendingGroupTasks = createAction(
  '[Main] Fetch Pending Group Tasks'
);

export const FetchPendingGroupTasksSuccess = createAction(
  '[Main] Fetch Pending Group Tasks Success',
  props<{ tasks: any }>()
);

export const FetchPendingGroupTasksFails = createAction(
  '[Main] Fetch Pending Group Tasks',
  props<{ error: HttpErrorResponse }>()
);

// IN PROGRESS GROUP TASK ROUTES
export const FetchInprogressGroupTasks = createAction(
  '[Main] Fetch In Progress Group Tasks'
);

export const FetchInprogressGroupTasksSuccess = createAction(
  '[Main] Fetch In Progress Group Tasks Success',
  props<{ tasks: any }>()
);

export const FetchInprogressGroupTasksFails = createAction(
  '[Main] Fetch In Progress Group Tasks',
  props<{ error: HttpErrorResponse }>()
);

// COMPLETED GROUP TASK ROUTES
export const FetchCompletedGroupTasks = createAction(
  '[Main] Fetch Completed Group Tasks'
);

export const FetchCompletedGroupTasksSuccess = createAction(
  '[Main] Fetch Completed Group Tasks Success',
  props<{ tasks: any }>()
);

export const FetchCompletedGroupTasksFails = createAction(
  '[Main] Fetch Completed Group Tasks',
  props<{ error: HttpErrorResponse }>()
);

export const FetchUserCompletedGroupTasks = createAction(
  '[Main] Fetch User Completed Group Tasks'
);

export const FetchUserCompletedGroupTasksSuccess = createAction(
  '[Main] Fetch User Completed Group Tasks Success',
  props<{ tasks: any }>()
);

export const FetchUserCompletedGroupTasksFails = createAction(
  '[Main] Fetch User Completed Group Tasks',
  props<{ error: HttpErrorResponse }>()
);

// CANCELLED GROUP TASK ROUTES
export const FetchCancelledGroupTasks = createAction(
  '[Main] Fetch Cancelled Group Tasks'
);

export const FetchCancelledGroupTasksSuccess = createAction(
  '[Main] Fetch Cancelled Group Tasks Success',
  props<{ tasks: any }>()
);

export const FetchCancelledGroupTasksFails = createAction(
  '[Main] Fetch Cancelled Group Tasks',
  props<{ error: HttpErrorResponse }>()
);

export const FetchAllUsers = createAction('[Main] Fetch All Users');

export const FetchAllUsersSuccess = createAction(
  '[Main] Fetch All Users Success',
  props<{ users: any }>()
);

export const FetchAllUsersFail = createAction(
  '[Main] Fetch All Users Fail',
  props<{ error: HttpErrorResponse }>()
);

export const AddSelectedMembers = createAction(
  '[Main] Add Selected Members for Project',
  props<{ users: Members[] }>()
);

export const RemoveMember = createAction(
  '[Main] Remove Member',
  props<{ users: Members[] }>()
);

export const ClearSelectedMembers = createAction(
  '[Main] Clear Selected Members'
);

export const AddNewProject = createAction(
  '[Main] Add New Project to Store',
  props<{ project: GroupTasks }>()
);

export const UpdatePendingProject = createAction(
  '[Main] Update Pending Project',
  props<{ projects: GroupTasks[] }>()
);

export const AddProgressProject = createAction(
  '[Main] Add Progress Project',
  props<{ project: GroupTasks }>()
);

export const AddCancelledProject = createAction(
  '[Main] Add Cancelled Project',
  props<{ task: GroupTasks }>()
);

export const AddCompletedProject = createAction(
  '[Main] Add Completed Project',
  props<{ task: GroupTasks }>()
);

export const UpdateInprogressProjects = createAction(
  '[Main] Update InProgress Project in Store',
  props<{ projects: GroupTasks[] }>()
);

export const ViewMemberProfile = createAction(
  '[Main] View Member Profile',
  props<{ member: User }>()
);

export const FetchMemberInfo = createAction(
  '[Main] Fetch Member Info from DB',
  props<{ id: string }>()
);

export const FetchMemberInfoSuccess = createAction(
  '[Main] Fetch Member Info From DB Success',
  props<{ user: any }>()
);

export const FetchMemberInfoFail = createAction(
  '[Main] Fetch Member Info From DB Fail',
  props<{ error: HttpErrorResponse }>()
);

export const FetchAllPersonalTasks = createAction(
  '[Main] Fetch All Personal Tasks'
);

export const FetchAllPersonalTasksSuccess = createAction(
  '[Main] Fetch All Personal Tasks Success',
  props<{ tasks: any }>()
);

export const FetchAllPersonalTasksFail = createAction(
  '[Main] Fetch All Personal Tasks Fail',
  props<{ error: any }>()
);

// PENDING PERSONAL TASK ROUTES

export const FetchPendingTasks = createAction('[Main] Fetch Pending Tasks');

export const FetchPendingTasksSuccess = createAction(
  '[Main] Fetch Pending Tasks Success',
  props<{ tasks: any }>()
);

export const FetchPendingTasksFails = createAction(
  '[Main] Fetch Pending Tasks',
  props<{ error: HttpErrorResponse }>()
);

// IN PROGRESS PERSONAL TASK ROUTES
export const FetchInprogressTasks = createAction(
  '[Main] Fetch In Progress Tasks'
);

export const FetchInprogressTasksSuccess = createAction(
  '[Main] Fetch In Progress Tasks Success',
  props<{ tasks: any }>()
);

export const FetchInprogressTasksFails = createAction(
  '[Main] Fetch In Progress Tasks',
  props<{ error: HttpErrorResponse }>()
);

// COMPLETED PERSONAL TASK ROUTES
export const FetchCompletedTasks = createAction('[Main] Fetch Completed Tasks');

export const FetchCompletedTasksSuccess = createAction(
  '[Main] Fetch Completed Tasks Success',
  props<{ tasks: any }>()
);

export const FetchCompletedTasksFails = createAction(
  '[Main] Fetch Completed Tasks',
  props<{ error: HttpErrorResponse }>()
);

// CANCELLED PERSONAL TASK ROUTES
export const FetchCancelledTasks = createAction('[Main] Fetch Cancelled Tasks');

export const FetchCancelledTasksSuccess = createAction(
  '[Main] Fetch Cancelled Tasks Success',
  props<{ tasks: any }>()
);

export const FetchCancelledTasksFails = createAction(
  '[Main] Fetch Cancelled Tasks',
  props<{ error: HttpErrorResponse }>()
);

export const AddNewTask = createAction(
  '[Main] Add New Task to Store',
  props<{ task: PersonalTasks }>()
);

export const UpdateInprogressTasks = createAction(
  '[Main] Update InProgress Personal Task in Store',
  props<{ tasks: PersonalTasks[] }>()
);

export const UpdatePendingTasks = createAction(
  '[Main] Update Pending Personal Task in Store',
  props<{ tasks: PersonalTasks[] }>()
);

export const AddProgressTask = createAction(
  '[Main] Add In-Progress Task',
  props<{ task: PersonalTasks }>()
);

export const AddCancelledTask = createAction(
  '[Main] Add Cancelled Project',
  props<{ task: PersonalTasks }>()
);

export const AddCompletedTask = createAction(
  '[Main] Add Completed Project',
  props<{ task: PersonalTasks }>()
);

// ATTACHMENT ACTIONS

export const FetchGroupProjectAttachments = createAction(
  '[Main] Fetch Group Project Attachments'
);

export const FetchGroupProjectAttachmentsSuccess = createAction(
  '[Main] Fetch Group Project Attachments Success',
  props<{ attachments: any }>()
);

export const FetchGroupProjectAttachmentsFail = createAction(
  '[Main] Fetch Group Project Attachments Fail',
  props<{ error: any }>()
);

export const FetchPersonalTaskAttachments = createAction(
  '[Main] Fetch Personal Task Attachments'
);

export const FetchPersonalTaskAttachmentsSuccess = createAction(
  '[Main] Fetch Personal Task Attachments Success',
  props<{ attachments: any }>()
);

export const FetchPersonalTaskAttachmentsFail = createAction(
  '[Main] Fetch Personal Task Attachments Fail',
  props<{ error: any }>()
);

export const UpdateGroupProjectAttachments = createAction(
  '[Main] Update Group Project Attachments',
  props<{ attachments: any }>()
);

export const UpdatePersonalTaskAttachments = createAction(
  '[Main] Update Personal Task Attachments',
  props<{ attachments: any }>()
);

// CHATS ACTIONS

export const AddGroupChat = createAction(
  '[Main] Add New Group Chat',
  props<{ group: any }>()
);

export const UpdateGroupChat = createAction(
  '[Main] Update Chat Info',
  props<{ chat: any }>()
);

export const FetchGroupParticipants = createAction(
  '[Main] Fetch Group Participants',
  props<{ id: String }>()
);

export const FetchGroupParticipantsSuccess = createAction(
  '[Main] Fetch Group Participants Success',
  props<{ participants: any }>()
);

export const FetchGroupParticipantsFail = createAction(
  '[Main] Fetch Group Participants Fail',
  props<{ error: any }>()
);

export const FetchUserGroupChats = createAction(
  '[Main] Fetch User Group Chats',
  props<{ id: String }>()
);

export const FetchUserGroupChatsSuccess = createAction(
  '[Main] Fetch User Group Chats Success',
  props<{ session: any }>()
);

export const FetchUserGroupChatsFail = createAction(
  '[Main] Fetch User Group Chats Fail',
  props<{ error: any }>()
);

export const AddNewGroupMessage = createAction(
  '[Main] Add New Group Message',
  props<{ message: any }>()
);

export const FetchAllGroupMessages = createAction(
  '[Main] Fetch All Group Messages'
);

export const FetchAllGroupMessagesSuccess = createAction(
  '[Main] Fetch All Group Messages Success',
  props<{ messages: any }>()
);

export const FetchAllGroupMessagesFail = createAction(
  '[Main] Fetch All Group Messages Fail',
  props<{ error: any }>()
);

export const UpdateGroupChatLastMessage = createAction(
  '[Main] Update Group Chat Last Message',
  props<{ group: any }>()
);

export const SelectChat = createAction(
  '[Main] Select Chat',
  props<{ chat: any }>()
);

// PERSONAL CHATS

export const FetchAllChats = createAction('[Main] Fetch All Chat');

export const FetchAllChatsSuccess = createAction(
  '[Main] Fetch All Chat Success',
  props<{ chats: any }>()
);

export const FetchAllChatsFail = createAction(
  '[Main] Fetch All Chat Fail',
  props<{ error: any }>()
);

export const AddNewChat = createAction(
  '[Main] Add New Chat',
  props<{ chat: any }>()
);

export const SelectPersonalChat = createAction(
  '[Main] Select Personal Chat',
  props<{ chat: any }>()
);

export const AddNewPersonalMessage = createAction(
  '[Main] Add New Personal Message',
  props<{ message: any }>()
);

export const FetchAllPersonalMessages = createAction(
  '[Main] Fetch All Personal Messages',
  props<{ messages: any[] }>()
);

export const UpdatePersonalChatLastMessage = createAction(
  '[Main] Update Personal Chat Last Message',
  props<{ chat: any }>()
);

export const UpdatePersonalMessagingCounts = createAction(
  '[Main] Update Personal Messaging Counts',
  props<{ counts: any }>()
);

export const UpdatePersonalChatMessage = createAction(
  '[Main] Update Personal Chat Message',
  props<{ message: any }>()
);

export const AddUsersToOnlineList = createAction(
  '[Main] Add Users To Online List',
  props<{ rooms: string[] }>()
);

export const RemoveUserFromOnlineList = createAction(
  '[Main] Remove User From Online List',
  props<{ id: string }>()
);

// ACTIVITIES ACTIONS
export const FetchAllActivities = createAction('[Main] Fetch All Activities');

export const FetchAllActivitiesSuccess = createAction(
  '[Main] Fetch All Activities Success',
  props<{ activities: any }>()
);

export const FetchAllActivitiesFail = createAction(
  '[Main] Fetch All Activities Fail',
  props<{ error: any }>()
);

export const AddNewActivity = createAction(
  '[Main] Add New Activity',
  props<{ activity: any }>()
);

export const UpdateActivity = createAction(
  '[Main] Update Activity',
  props<{ activity: any }>()
);

// SETTINGS ROUTE
export const FetchUserSettings = createAction(
  '[Main] Fetch User Settings',
  props<{ id: string }>()
);

export const FetchUserSettingsSuccess = createAction(
  '[Main] Fetch User Settings Success',
  props<{ settings: any }>()
);

export const FetchUserSettingsFail = createAction(
  '[Main] Fetch User Settings Fail',
  props<{ error: any }>()
);
