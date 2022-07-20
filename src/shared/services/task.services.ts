import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  header = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    }),
  };

  constructor(private http: HttpClient) {}

  /** GROUP TASK ROUTES */

  getAllGroupProjects() {
    const url = environment.serverUri + '/task/group_task/all';
    return this.http.get(url, this.header);
  }

  assignLeader(id: string, body: any) {
    const url = environment.serverUri + '/task/group_task/assign/' + id;
    return this.http.patch(url, body, this.header);
  }

  getPendingGroupTasks() {
    const url = environment.serverUri + '/task/group_task/pending';
    return this.http.get(url, this.header);
  }

  getInProgressGroupTasks() {
    const url = environment.serverUri + '/task/group_task/in_progress';
    return this.http.get(url, this.header);
  }

  getCompletedGroupTasks() {
    const url = environment.serverUri + '/task/group_task/completed';
    return this.http.get(url, this.header);
  }

  getUserCompletedGroupTasks() {
    const url = environment.serverUri + '/task/group_task/user/completed';
    return this.http.get(url, this.header);
  }

  getCancelledGroupTasks() {
    const url = environment.serverUri + '/task/group_task/cancelled';
    return this.http.get(url, this.header);
  }

  saveProject(postbody: any) {
    const url = environment.serverUri + '/task/group_task/save';
    return this.http.post(url, postbody, this.header);
  }

  startProject(id: String) {
    const url = environment.serverUri + '/task/group_task/start/' + id;
    return this.http.put(url, this.header);
  }

  cancelProject(id: String) {
    const url = environment.serverUri + '/task/group_task/cancel/' + id;
    return this.http.patch(url, this.header);
  }

  completeProject(id: String) {
    const url = environment.serverUri + '/task/group_task/complete/' + id;
    return this.http.patch(url, this.header);
  }

  assignProject(project_id: String, postbody: any) {
    const url = environment.serverUri + '/task/group_task/assign/' + project_id;
    return this.http.post(url, postbody, this.header);
  }

  addProjectMembers(project_id: String, postbody: any) {
    const url =
      environment.serverUri + '/task/group_task/assign/members/' + project_id;
    return this.http.patch(url, postbody, this.header);
  }

  removeProjectMembers(project_id: String, postbody: any) {
    const url =
      environment.serverUri + '/task/group_task/remove/member/' + project_id;
    return this.http.patch(url, postbody, this.header);
  }

  addProjectAttachment(project_id: String, postbody: any) {
    const url =
      environment.serverUri +
      '/task/group_task/attachment/update/' +
      project_id;
    return this.http.patch(url, postbody, this.header);
  }

  removeProjectAttachment(project_id: String, postbody: any) {
    const url =
      environment.serverUri +
      '/task/group_task/attachment/remove/' +
      project_id;
    return this.http.patch(url, postbody, this.header);
  }

  /** GROUP TASK ROUTES */

  /** PERSONAL TASK ROUTES */

  getAllPersonalTasks() {
    const url = environment.serverUri + '/task/personal_task/all';
    return this.http.get(url, this.header);
  }

  getPendingTasks() {
    const url = environment.serverUri + '/task/personal_task/pending';
    return this.http.get(url, this.header);
  }

  getInProgressTasks() {
    const url = environment.serverUri + '/task/personal_task/in_progress';
    return this.http.get(url, this.header);
  }

  getCompletedTasks() {
    const url = environment.serverUri + '/task/personal_task/completed';
    return this.http.get(url, this.header);
  }

  getCancelledTasks() {
    const url = environment.serverUri + '/task/personal_task/cancelled';
    return this.http.get(url, this.header);
  }

  saveTask(postbody: any) {
    const url = environment.serverUri + '/task/personal_task/save';
    return this.http.post(url, postbody, this.header);
  }

  startTask(id: String) {
    const url = environment.serverUri + '/task/personal_task/start/' + id;
    return this.http.patch(url, this.header);
  }

  cancelTask(id: String) {
    const url = environment.serverUri + '/task/personal_task/cancel/' + id;
    return this.http.patch(url, this.header);
  }

  completeTask(id: String) {
    const url = environment.serverUri + '/task/personal_task/complete/' + id;
    return this.http.patch(url, this.header);
  }

  /** PERSONAL TASK ROUTES */

  /** ATTACHMENT ROUTES */
  groupAttachments() {
    const url = environment.serverUri + '/task/attachment/group';
    return this.http.get(url, this.header);
  }

  personalAttachments() {
    const url = environment.serverUri + '/task/attachment/personal';
    return this.http.get(url, this.header);
  }

  updateAttachments(id: string, body: any) {
    const url = environment.serverUri + '/task/attachment/update/' + id;
    return this.http.patch(url, body, this.header);
  }

  updatePersonalAttachments(id: string, body: any) {
    const url =
      environment.serverUri + '/task/attachment/personal/update/' + id;
    return this.http.patch(url, body, this.header);
  }
  /** ATTACHMENT ROUTES */
}
