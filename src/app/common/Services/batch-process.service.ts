import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class BatchProcessService {

  constructor(private http: HttpClient, private config:AppConfigService) { }

  submitSchemasForBatchProcess(request:any, processType:any): Observable<any> {
    let url:string = '';
    
    if(processType == 'Assessment'){ url = '/assessmentBatch'}
    else if(processType == 'Discovery'){ url = '/discoveryBatch'}

    return this.http.post<any>(this.config.host + url, {userid:sessionStorage.getItem("user_id"),RUN_ID: request});
  }
}
