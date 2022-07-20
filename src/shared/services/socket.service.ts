import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socketInstance = new BehaviorSubject<any>(null);

  socketInstanceObservable = this.socketInstance.asObservable();

  constructor() {}

  sendSocketInstance(socket: any) {
    this.socketInstance.next(socket);
  }
}
