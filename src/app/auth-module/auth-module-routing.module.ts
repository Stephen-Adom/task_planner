import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AuthModuleComponent } from './auth-module.component';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { EmailVerificationSuccessComponent } from './email-verification-success/email-verification-success.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthModuleComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
      {
        path: 'complete-registration',
        component: CompleteRegistrationComponent,
      },
      {
        path: 'email-verification',
        component: EmailVerificationComponent,
      },
      {
        path: 'email-verification/success',
        component: EmailVerificationSuccessComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthModuleRoutingModule {}
