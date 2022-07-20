import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  header = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    }),
  };

  constructor(private http: HttpClient) {}

  updateUserProfile(image: any) {
    const url = environment.serverUri + '/user/profile/update';
    return this.http.post(url, image, this.header);
  }

  getAllUsers() {
    const url = environment.serverUri + '/user/all';
    return this.http.get(url, this.header);
  }

  getUser(id: string) {
    const url = environment.serverUri + '/user/' + id;
    return this.http.get(url, this.header);
  }

  updateInfo(info: any) {
    const url = environment.serverUri + '/user/info/update';
    return this.http.post(url, info, this.header);
  }

  updateReceiveAlert(info: any) {
    const url = environment.serverUri + '/user/notification/receive_alert';
    return this.http.post(url, info, this.header);
  }

  updateAlertType(info: any) {
    const url = environment.serverUri + '/user/notification/type';
    return this.http.post(url, info, this.header);
  }

  updateAppTheme(theme: any) {
    const url = environment.serverUri + '/user/notification/theme';
    return this.http.post(url, theme, this.header);
  }

  updatePassword(password: any) {
    const url = environment.serverUri + '/user/password/change';
    return this.http.post(url, password, this.header);
  }

  getUserSettings(id: string) {
    const url = environment.serverUri + '/user/settings/' + id;
    return this.http.get(url, this.header);
  }
}
