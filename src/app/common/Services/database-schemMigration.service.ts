import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})


export class DatabaseSchemaMigrationService{

  isRefreshSchemaData:boolean = false;
  header = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  $refreshSchemaReportChanged = new BehaviorSubject<boolean>(this.isRefreshSchemaData)
  $refreshSchemaReportChangedObj = this.$refreshSchemaReportChanged.asObservable();
  
  constructor(private http: HttpClient, private config:AppConfigService) { }


  getCompleteReport(reqObj:any): Observable<any> {
    return this.http.post(this.config.host+'/schemaMigrationReport', reqObj, this.header).pipe(data => data);
  }

  getObjectValidation(reqObj:any):Observable<any>{
    return this.http.post(this.config.host+'/objectValidation', reqObj, this.header).pipe(data => data);
    
  }

  getObjectReValidation(reqObj:any):Observable<any>{
    return this.http.post(this.config.host+'/objectReValidation', reqObj, this.header).pipe(data => data);
    
  }

  generateValidationReports(reqObj:any):Observable<any>{
    return this.fetchReport('run_validation_for_schema', reqObj);
  }

  downloadValidationReports(reqObj:any):Observable<any>{
    return this.fetchReport('download_validation_reports_for_schema', reqObj);
  }

  getOra2pgErrors(reqObj:any):Observable<any>{
    return this.http.post(this.config.host+'/geterrorDetails', reqObj, this.header).pipe(data => data);
    
  }

  sendDataMigrationStatus(reqObj:any): Observable<any> {
    return this.http.post(this.config.host+'/dataMigration', reqObj, this.header).pipe(data => data); 
  }

  downloadScripts(reqObj:any): Observable<any> {
    
    return this.http.get(this.config.host+'/downloadScript?RUN_ID='+reqObj.RUN_ID+'&object_name='+reqObj.object_name,{
     responseType: 'blob'
    }); 
  }

  downloadErrorscripts(reqObj: any): Observable<any> {
    return this.http.get(this.config.host + '/downloadErrorscripts?RUN_ID=' + reqObj.RUN_ID + '&object_name=' + reqObj.object_type + '&object_type=' + reqObj.object_name +'&schema_name=' + reqObj.schema_name, {
      responseType: 'blob'
    });
  }
  

  
  moveToCompletion(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/moveObjectToCompleted',reqObj);
  }

  revertmoveToCompletion(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/moveObjectToNotCompleted',reqObj);
  }

  downloadLogs(reqObj:any): Observable<any> {
    return this.fetchReport('getOra2PGDataMigrationLogfile', reqObj);
  }

  startDataMigration(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/runDataMigration',reqObj);
  }

  downloadORA2PGConfFile(reqObj:any): Observable<any> {
    return this.fetchReport('getOra2PGConffile', reqObj);
  }

  private fetchReport(endpoint: string, reqObj: any): Observable<any> {
    return this.http.get(`${this.config.host}/${endpoint}?RUN_ID=${reqObj.RUN_ID}`, {
      responseType: 'blob'
    });
  }
  
  
  /* 

  startAssessment(reqObj:any):Observable<any>{
    return this.http.post(this.userUrl+'/assessment', reqObj, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(data => data);
  } */


  /* getReValidatedReport(runId:any){return schemaMigrationValidateReport["objectValidation"];} */

 /*  getReValidatedReportInProgress(runId:any){return schemaMigrationValidateInProgressReport["objectValidation"];} */

}