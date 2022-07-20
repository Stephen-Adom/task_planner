import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';

import { MatDialogModule } from '@angular/material/dialog';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AuthModuleRoutingModule } from './auth-module-routing.module';
import { AuthModuleComponent } from './auth-module.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './auth-state/auth.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { ConfirmEmailDialogComponent } from './confirm-email-dialog/confirm-email-dialog.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { EmailVerificationSuccessComponent } from './email-verification-success/email-verification-success.component';
import { EmailVerificationMessageComponent } from './email-verification-message/email-verification-message.component';

//SHARED SERVICES
import { AuthService } from 'src/shared/services/auth.services';
import { UserService } from 'src/shared/services/user.services';
import { AuthGuard } from 'src/shared/Guards/auth.guard';

@NgModule({
  declarations: [
    AuthModuleComponent,
    LoginPageComponent,
    RegisterPageComponent,
    CompleteRegistrationComponent,
    ConfirmEmailDialogComponent,
    EmailVerificationComponent,
    EmailVerificationSuccessComponent,
    EmailVerificationMessageComponent,
  ],
  imports: [
    CommonModule,
    AuthModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    StoreModule.forFeature('auth', authReducer),
    HttpClientModule,
    StoreDevtoolsModule.instrument({
      name: 'ARIA PLANNER DEV TOOLS',
      maxAge: 25,
      logOnly: environment.production,
    }),
    MatDialogModule,
    NgxIntlTelInputModule,
  ],
  providers: [AuthService, UserService, AuthGuard],
  entryComponents: [
    ConfirmEmailDialogComponent,
    EmailVerificationMessageComponent,
  ],
})
export class AuthModuleModule {}
