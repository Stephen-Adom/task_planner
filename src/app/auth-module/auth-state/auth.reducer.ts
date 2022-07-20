import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface State {
  auth: AuthState;
}

export interface AuthState {
  error: any;
  authUser: any;
  loading: boolean;
  settings: any;
}

const initialState: AuthState = {
  error: null,
  authUser: JSON.parse(localStorage.getItem('authUser')),
  loading: false,
  settings: JSON.parse(localStorage.getItem('settings')),
};

const getAuthFeatureState = createFeatureSelector<AuthState>('auth');

export const getAuthUserInfo = createSelector(getAuthFeatureState, (state) => {
  if (state.authUser) {
    return state.authUser;
  }
});

export const getAuthUserSettings = createSelector(
  getAuthFeatureState,
  (state) => {
    if (state.authUser) {
      return state.settings;
    }
  }
);

export const authReducer = createReducer(
  initialState,
  on(AuthActions.StoreUserCredentials, (state: AuthState, action) => {
    return {
      ...state,
      authUser: action.user,
      error: null,
      loading: false,
    };
  }),
  on(AuthActions.StoreUserSettings, (state: AuthState, action) => {
    return {
      ...state,
      settings: action.settings,
      error: null,
      loading: false,
    };
  })
);
