import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private loginService: LoginService) {}

  canActivate(): Observable<boolean> {
    return this.loginService.getNodeType().pipe(
      map(data => {
        if (data.node_type === "analytics_worker") {
          return false;
        } else {          
          return true;
        }
      })
    );
  }
}