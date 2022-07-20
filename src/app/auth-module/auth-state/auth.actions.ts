import { createAction, props } from '@ngrx/store';
import { User } from 'src/shared/Models/User.model';

export const StoreUserCredentials = createAction(
  '[Auth] Store Auth User Credentials',
  props<{ user: User }>()
);

export const StoreUserSettings = createAction(
  '[Auth] Store User Settings',
  props<{ settings: any }>()
);
