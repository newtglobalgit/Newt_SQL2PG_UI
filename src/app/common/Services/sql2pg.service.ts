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

  getDMAPVersionDetails() {
    return this.http.get(this.config.host + '/getDMAPVersionDetails');
  }
}
