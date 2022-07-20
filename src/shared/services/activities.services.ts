import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  header = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    }),
  };

  constructor(private http: HttpClient) {}

  getAllActivities() {
    const url = environment.serverUri + '/activity/all';
    return this.http.get(url, this.header);
  }

  updateActivity(id: string) {
    const url = environment.serverUri + '/activity/update/' + id;
    return this.http.get(url, this.header);
  }
}
