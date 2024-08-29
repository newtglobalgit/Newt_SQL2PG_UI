import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseSchemaDiscoveryService {

  constructor(private http: HttpClient, private config:AppConfigService) { }
  
  getCompleteReport(reqObj:any): Observable<any> {
    return this.http.post(this.config.host+'/discoveryReport', reqObj, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(data => data);
  }
}
