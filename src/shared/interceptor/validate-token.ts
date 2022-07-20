import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.services';
import { Router } from '@angular/router';
import { switchMap, catchError, mergeMap, filter, take } from 'rxjs/operators';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  helper = new JwtHelperService();
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authservice: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    if (localStorage.getItem('accessToken')) {
      req = this.addTokenHeader(req, localStorage.getItem('accessToken'));
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const postbody = {
        token: localStorage.getItem('refreshToken'),
      };

      return this.authservice.refreshToken(postbody).pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.saveTokenToStorage(token);
          this.refreshTokenSubject.next(token.accessToken);
          return next.handle(this.addTokenHeader(request, token.accessToken));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addTokenHeader(request, jwt));
        })
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Node.js Express back-end */
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }

  private saveTokenToStorage(data: any) {
    localStorage.setItem('accessToken', data['accessToken']);
    localStorage.setItem('refreshToken', data['refreshToken']);
    localStorage.setItem('authUser', JSON.stringify(data['data']));
  }
}
