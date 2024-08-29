import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { AppConfigService } from './app-config.service';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient, private config:AppConfigService) { }

  updateNodeType(node_details:any): Observable<any>{
    return this.http.post(this.config.host+'/update_node_type', node_details);
  }
  getTimeZoneDetails(): Observable<any> {
    return this.http.get(this.config.host+'/getTimezones');
  }
}
