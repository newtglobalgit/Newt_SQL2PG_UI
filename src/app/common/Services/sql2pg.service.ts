import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AppConfigService } from 'src/app/common/Services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class Sql2PgService {
 

  constructor(private http: HttpClient, private config: AppConfigService) {}

  private setHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

 

  testSourceDbConnection(sourceDbdetails: any): Observable<any> {
    return this.http.post( this.config.host + '/testSourceDB',
      sourceDbdetails);
  }
  

  testTargetDbConnection(targetDbdetails: any): Observable<any> {
    return this.http.post(this.config.host + '/testTargetDB', targetDbdetails);
  }
  


  senddbconfigDetails(dbcredentialsdata: any): Observable<any> {
    return this.http.post(this.config.host + '/dbSetup', dbcredentialsdata);
  }

  
  getDBAssessmentData(current_run_id: any): Observable<any> {
    return this.http.get(this.config.host + '/getdbSetup?run_id=' + current_run_id);
  }
  
  getDMAPVersionDetails() {
    return this.http.get(this.config.host + '/getDMAPVersionDetails');
  }

  getLicenseDetails() {
    return this.http.get(this.config.host + '/getLicenseDetails');
  }

  backupDMAP() {
    return this.http.get(this.config.host + '/dmapBackup', {
      responseType: 'blob',
    });
  }

  checkBackupStatus() {
    return this.http.get(this.config.host + '/get_backup_status');
  }

  saveGenAiDetails(genAidata: any): Observable<any> {
    return this.http.post(
      this.config.host + '/insert_gen_ai_details',
      genAidata
    );
  }

  saveServiceAccountDetails(serviceAccountdata: any): Observable<any> {
    return this.http.post(
      this.config.host + '/activate_gen_ai_key',
      serviceAccountdata
    );
  }

  fetchGenAiDetails() {
    return this.http.get(this.config.host + '/fetch_gen_ai_details');
  }
}
