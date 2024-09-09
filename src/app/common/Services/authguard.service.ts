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

  canActivate(): Observable<boolean> {
    let reqObj = { auth_token: sessionStorage.getItem('auth_token') };
    return this.authService.checkTokenValidity(reqObj).pipe(
      catchError((error) => {
        if (!error.valid) {
          this.router.navigate(['/login']);
          return of(false);
        }
        return of(true);
      })
    );
  }
}
