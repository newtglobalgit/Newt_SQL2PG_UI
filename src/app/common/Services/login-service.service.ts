import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient, private config: AppConfigService) {}

  activateLicense(reqObj: any): Observable<any> {
    return this.http.post(this.config.host + '/getLicenseDetails', reqObj);
  }
}
