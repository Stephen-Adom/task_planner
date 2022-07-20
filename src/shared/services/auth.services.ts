import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  header = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  login(login: any) {
    const url = environment.serverUri + '/auth/login';
    return this.http.post(url, login, this.header);
  }

  register(register: any) {
    const url = environment.serverUri + '/auth/register';
    return this.http.post(url, register, this.header);
  }

  refreshToken(token: any) {
    const url = environment.serverUri + '/auth/refresh-token';
    return this.http.post(url, token, this.header);
  }

  resetPassword(email: any) {
    const url = environment.serverUri + '/auth/reset-password';
    return this.http.post(url, email, this.header);
  }

  verifyEmailToken(token: any) {
    const url = environment.serverUri + '/auth/email-token-verification';
    return this.http.post(url, token, this.header);
  }

  getUserCountry() {
    const url = environment.geolocationUri;
    return this.http.get(url, this.header);
  }

  googleSignUp() {
    const url = environment.serverUri + '/auth/google';
    return this.http.get(url, this.header);
  }

  googleSignUpCallback() {
    const url = environment.serverUri + '/auth/google/callback';
    return this.http.get(url, this.header);
  }
}
