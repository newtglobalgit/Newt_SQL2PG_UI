import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  // canActivate(): Observable<boolean> {
  //   let reqObj = { auth_token: sessionStorage.getItem('auth_token') };
  //   return this.authService.checkTokenValidity(reqObj).pipe(
  //     map((data) => {
  //       if (data.valid === false) {
  //         this.router.navigate(['/login']);
  //         return of(false);
  //       }
  //       return of(true);
  //     })
  //   );
  // }

  canActivate(): Observable<boolean> {
    let reqObj = { auth_token: sessionStorage.getItem('auth_token') };
    return this.authService.checkTokenValidity(reqObj).pipe(
      map((data) => {
        if (data.valid === false) {
          this.router.navigate(['/login']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
