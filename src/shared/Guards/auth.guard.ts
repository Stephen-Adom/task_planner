import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  helper = new JwtHelperService();

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!localStorage.getItem('accessToken')) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    if (localStorage.getItem('accessToken')) {
      const isExpired = this.helper.isTokenExpired(
        localStorage.getItem('accessToken')
      );
      console.log(isExpired);

      if (isExpired) {
        this.clearTokens();
        this.router.navigate(['/auth/login']);
        return false;
      }
    }

    return true;
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
  }
}
