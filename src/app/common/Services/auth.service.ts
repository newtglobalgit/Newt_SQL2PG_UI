import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/common/Services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private config: AppConfigService) {}

  private setHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

  checkTokenValidity(token: any): Observable<any> {
    return this.http.post(this.config.host + '/check_token_validity', token);
  }
}
