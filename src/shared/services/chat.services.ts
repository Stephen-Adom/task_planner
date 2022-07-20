import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatService {
  header = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    }),
  };

  constructor(private http: HttpClient) {}

  createGroupChat(data: any) {
    const url = environment.serverUri + '/chat/group/create';
    return this.http.post(url, data, this.header);
  }

  verifyGroupChat(id: String) {
    const url = environment.serverUri + '/chat/group/verify/' + id;
    return this.http.get(url, this.header);
  }

  getGroupPariticipantsChat(id: String) {
    const url = environment.serverUri + '/chat/group/participants/' + id;
    return this.http.get(url, this.header);
  }

  getGroupSession(id: String) {
    const url = environment.serverUri + '/chat/group/session/' + id;
    return this.http.get(url, this.header);
  }

  getGroupMessages(projectid: string) {
    const url = environment.serverUri + '/chat/group/messages/' + projectid;
    return this.http.get(url, this.header);
  }

  updateChatInfo(chatid: string, postbody: any) {
    const url = environment.serverUri + '/chat/group/edit/' + chatid;
    return this.http.patch(url, postbody, this.header);
  }

  // PERSONAL CHATS ROUTES
  createChat(postbody: any) {
    const url = environment.serverUri + '/chat/save';
    return this.http.post(url, postbody, this.header);
  }
}
