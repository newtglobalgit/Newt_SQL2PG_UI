import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class DatabaseSchemaAssesmentService{
  data:any;

  constructor(private http: HttpClient, private config:AppConfigService) { }
  
  getCompleteReport(reqObj:any): Observable<any> {
    return this.http.post(this.config.host+'/assessmentReport', reqObj, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(data => data);
  }

  getStaticAnalysisObjects(): Observable<any> {   
    
    return this.http.get('assets/json/newAssessmentReport.json', {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(data => data);
  }
  downloadCopilotSQL(run_id){
    return this.http.get(this.config.host+'/download_copilot_sql?run_id='+run_id,{responseType: 'blob'})
  }


}