import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AppConfigService } from 'src/app/common/Services/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class Sql2PgService {
  genAiActivated: boolean = false;
  constructor(private http: HttpClient, private config: AppConfigService) {}

  testSourceDbConnection(sourceDbdetails: any): Observable<any> {
    return this.http.post(this.config.host + '/testSourceDB', sourceDbdetails);
  }

  testTargetDbConnection(targetDbdetails: any): Observable<any> {
    return this.http.post(this.config.host + '/testTargetDB', targetDbdetails);
  }

  senddbconfigDetails(dbcredentialsdata: any): Observable<any> {
    return this.http.post(this.config.host + '/dbSetup', dbcredentialsdata);
  }

  getDBAssessmentData(): Observable<any> {
    return this.http.get(this.config.host + '/getdbSetup');
  }

  startDiscovery(RUN_ID: any): Observable<any> {
    const payload = { RUN_ID: String(RUN_ID) };
    return this.http.post(this.config.host + '/discovery', payload);
  }

  startAssessment(RUN_ID: any,enable_genai: string): Observable<any> {
    const payload = { RUN_ID: String(RUN_ID), Enable_Genai: enable_genai };
    return this.http.post(this.config.host + '/assessment', payload);
  }

  getDiscoveryWebPageReport(RUN_ID: any): Observable<any> {
    const payload = { RUN_ID: RUN_ID };
    return this.http.post(this.config.host + '/discoveryReport', payload);
  }

  downloadDiscoveryPdfReport(details: any): Observable<any> {
    return this.http.post(
      this.config.host + '/generateDisoveryReport',
      details
    );
  }

  getAssessmentWebPageReport(RUN_ID: any): Observable<any> {
    const payload = { RUN_ID: RUN_ID };
    return this.http.post(this.config.host + '/assessmentReport', payload);
  }

  downloadAssessmentPdfReport(details: any): Observable<any> {
    return this.http.post(
      this.config.host + '/generateAssessmentReport',
      details
    );
  }

  getDMAPVersionDetails() {
    return this.http.get(this.config.host + '/getDMAPVersionDetails');
  }

  getLicenseDetails() {
    return this.http.get(this.config.host + '/fetchLicenseDetails');
  }

  backupDMAP() {
    return this.http.get(this.config.host + '/backup_mssql2pg', {
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

  getMultipleSchemasToDelete(): Observable<any> {
    return this.http.get(this.config.host + '/get_schemas_to_delete');
  }

  mutiple_schema_delete(reqObj: any): Promise<any> {
    return this.http
      .post(this.config.host + '/mutiple_schema_delete', reqObj, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .toPromise();
  }
}
