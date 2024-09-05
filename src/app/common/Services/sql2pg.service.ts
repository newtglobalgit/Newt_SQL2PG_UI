import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.postWithHeadersSourceDbdetails(
      this.config.host + '/testSourceDB',
      sourceDbdetails
    );
  }

  testTargetDbConnection(targetDbdetails: any): Observable<any> {
    return this.postWithHeadersTargetDbdetails(
      this.config.host + '/testTargetDB',
      targetDbdetails
    );
  }

  private postWithHeadersTargetDbdetails(
    url: string,
    targetDbdetails: any
  ): Observable<any> {
    return this.http
      .post(url, targetDbdetails, {
        headers: this.setHeaders(),
      })
      .pipe((data) => data);
  }

  private postWithHeadersSourceDbdetails(
    url: string,
    sourceDbdetails: any
  ): Observable<any> {
    return this.http
      .post(url, sourceDbdetails, {
        headers: this.setHeaders(),
      })
      .pipe((data) => data);
  }

  senddbconfigDetails(dbcredentialsdata: any) {
    return this.postWithHeadersDBSetupDetails(
      this.config.host + '/dbSetup',
      dbcredentialsdata
    );
  }

  private postWithHeadersDBSetupDetails(
    url: string,
    DBSetupdetails: any
  ): Observable<any> {
    return this.http
      .post(url, DBSetupdetails, {
        headers: this.setHeaders(),
      })
      .pipe((data) => data);
  }

  getDMAPVersionDetails() {
    return this.http.get(this.config.host + '/getDMAPVersionDetails');
  }

  getLicenseDetails() {
    return this.http.get(this.config.host + '/fetchLicenseDetails');
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
