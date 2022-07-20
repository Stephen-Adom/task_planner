import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ActivitiesService } from 'src/shared/services/activities.services';
import { ChatService } from 'src/shared/services/chat.services';
import { TaskService } from 'src/shared/services/task.services';
import { UserService } from 'src/shared/services/user.services';
import * as MainActions from './main.actions';

@Injectable({ providedIn: 'root' })
export class MainEffects {
  constructor(
    private taskservice: TaskService,
    private userservice: UserService,
    private chatservice: ChatService,
    private activityservice: ActivitiesService,
    private actions$: Actions
  ) {}

  FetchAllGroupProjects$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchAllGroupProjects),
      mergeMap(() =>
        this.taskservice.getAllGroupProjects().pipe(
          map((projects) =>
            MainActions.FetchAllGroupProjectsSuccess({ projects })
          ),
          catchError((error) =>
            of(MainActions.FetchAllGroupProjectsFail({ error }))
          )
        )
      )
    );
  });

  FetchPendingGroupTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchPendingGroupTasks),
      mergeMap(() =>
        this.taskservice.getPendingGroupTasks().pipe(
          map((tasks) => MainActions.FetchPendingGroupTasksSuccess({ tasks })),
          catchError((error) =>
            of(MainActions.FetchPendingGroupTasksFails({ error }))
          )
        )
      )
    );
  });

  FetchInProgressGroupTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchInprogressGroupTasks),
      mergeMap(() =>
        this.taskservice.getInProgressGroupTasks().pipe(
          map((tasks) =>
            MainActions.FetchInprogressGroupTasksSuccess({ tasks })
          ),
          catchError((error) =>
            of(MainActions.FetchInprogressGroupTasksFails({ error }))
          )
        )
      )
    );
  });

  FetchCompletedGroupTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchCompletedGroupTasks),
      mergeMap(() =>
        this.taskservice.getCompletedGroupTasks().pipe(
          map((tasks) =>
            MainActions.FetchCompletedGroupTasksSuccess({ tasks })
          ),
          catchError((error) =>
            of(MainActions.FetchCompletedGroupTasksFails({ error }))
          )
        )
      )
    );
  });

  FetchUserCompletedGroupTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchUserCompletedGroupTasks),
      mergeMap(() =>
        this.taskservice.getUserCompletedGroupTasks().pipe(
          map((tasks) =>
            MainActions.FetchUserCompletedGroupTasksSuccess({ tasks })
          ),
          catchError((error) =>
            of(MainActions.FetchUserCompletedGroupTasksFails({ error }))
          )
        )
      )
    );
  });

  FetchCancelledGroupTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchCancelledGroupTasks),
      mergeMap(() =>
        this.taskservice.getCancelledGroupTasks().pipe(
          map((tasks) =>
            MainActions.FetchCancelledGroupTasksSuccess({ tasks })
          ),
          catchError((error) =>
            of(MainActions.FetchCancelledGroupTasksFails({ error }))
          )
        )
      )
    );
  });

  FetchAllUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchAllUsers),
      mergeMap(() =>
        this.userservice.getAllUsers().pipe(
          map((users) => MainActions.FetchAllUsersSuccess({ users })),
          catchError((error) => of(MainActions.FetchAllUsersFail({ error })))
        )
      )
    );
  });

  FetchUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchMemberInfo),
      mergeMap((user) =>
        this.userservice.getUser(user.id).pipe(
          map((user) => MainActions.FetchMemberInfoSuccess({ user })),
          catchError((error) => of(MainActions.FetchMemberInfoFail({ error })))
        )
      )
    );
  });

  FetchAllPersonalTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchAllPersonalTasks),
      mergeMap(() =>
        this.taskservice.getAllPersonalTasks().pipe(
          map((tasks) => MainActions.FetchAllPersonalTasksSuccess({ tasks })),
          catchError((error) =>
            of(MainActions.FetchAllPersonalTasksFail({ error }))
          )
        )
      )
    );
  });

  FetchPendingTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchPendingTasks),
      mergeMap(() =>
        this.taskservice.getPendingTasks().pipe(
          map((tasks) => MainActions.FetchPendingTasksSuccess({ tasks })),
          catchError((error) =>
            of(MainActions.FetchPendingTasksFails({ error }))
          )
        )
      )
    );
  });

  FetchInProgressTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchInprogressTasks),
      mergeMap(() =>
        this.taskservice.getInProgressTasks().pipe(
          map((tasks) => MainActions.FetchInprogressTasksSuccess({ tasks })),
          catchError((error) =>
            of(MainActions.FetchInprogressTasksFails({ error }))
          )
        )
      )
    );
  });

  FetchCompletedTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchCompletedTasks),
      mergeMap(() =>
        this.taskservice.getCompletedTasks().pipe(
          map((tasks) => MainActions.FetchCompletedTasksSuccess({ tasks })),
          catchError((error) =>
            of(MainActions.FetchCompletedTasksFails({ error }))
          )
        )
      )
    );
  });

  FetchCancelledTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchCancelledTasks),
      mergeMap(() =>
        this.taskservice.getCancelledTasks().pipe(
          map((tasks) => MainActions.FetchCancelledTasksSuccess({ tasks })),
          catchError((error) =>
            of(MainActions.FetchCancelledTasksFails({ error }))
          )
        )
      )
    );
  });

  FetchGroupParticipants$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchGroupParticipants),
      mergeMap((group) =>
        this.chatservice.getGroupPariticipantsChat(group.id).pipe(
          map((participants) =>
            MainActions.FetchGroupParticipantsSuccess({ participants })
          ),
          catchError((error) =>
            of(MainActions.FetchGroupParticipantsFail({ error }))
          )
        )
      )
    );
  });

  FetchGroupSessions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchUserGroupChats),
      mergeMap((project) =>
        this.chatservice.getGroupSession(project.id).pipe(
          map((session) => MainActions.FetchUserGroupChatsSuccess({ session })),
          catchError((error) =>
            of(MainActions.FetchUserGroupChatsFail({ error }))
          )
        )
      )
    );
  });

  // FetchGroupMessages$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(MainActions.FetchAllGroupMessages),
  //     mergeMap((project) =>
  //       this.chatservice.getGroupMessages().pipe(
  //         map((messages) =>
  //           MainActions.FetchAllGroupMessagesSuccess({ messages })
  //         ),
  //         catchError((error) =>
  //           of(MainActions.FetchAllGroupMessagesFail({ error }))
  //         )
  //       )
  //     )
  //   );
  // });

  FetchGroupProjectAttachments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchGroupProjectAttachments),
      mergeMap(() =>
        this.taskservice.groupAttachments().pipe(
          map((attachments) =>
            MainActions.FetchGroupProjectAttachmentsSuccess({ attachments })
          ),
          catchError((error) =>
            of(MainActions.FetchGroupProjectAttachmentsFail({ error }))
          )
        )
      )
    );
  });

  FetchPersonalTaskAttachments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchPersonalTaskAttachments),
      mergeMap(() =>
        this.taskservice.personalAttachments().pipe(
          map((attachments) =>
            MainActions.FetchPersonalTaskAttachmentsSuccess({ attachments })
          ),
          catchError((error) =>
            of(MainActions.FetchPersonalTaskAttachmentsFail({ error }))
          )
        )
      )
    );
  });

  FetchAllActivities$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchAllActivities),
      mergeMap(() =>
        this.activityservice.getAllActivities().pipe(
          map((activities) =>
            MainActions.FetchAllActivitiesSuccess({ activities })
          ),
          catchError((error) =>
            of(MainActions.FetchAllActivitiesFail({ error }))
          )
        )
      )
    );
  });

  FetchUserSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MainActions.FetchUserSettings),
      mergeMap((user) =>
        this.userservice.getUserSettings(user.id).pipe(
          map((settings) => MainActions.FetchUserSettingsSuccess({ settings })),
          catchError((error) =>
            of(MainActions.FetchUserSettingsFail({ error }))
          )
        )
      )
    );
  });
}
