import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class DataMigrationService {

  constructor(private http: HttpClient, private config:AppConfigService) { }

  private setHeaders(contentType:string): HttpHeaders {
    return new HttpHeaders().set('Content-Type', contentType);
  }

  private postWithHeaders(url: string, reqObj: any, contentType:string): Observable<any> {
    return this.http.post(url, reqObj, {
      headers: this.setHeaders(contentType)
    }).pipe(data => data);
  }

  private getWithHeaders(url: string, contentType:string): Observable<any> {
    return this.http.get(url, {
      headers: this.setHeaders(contentType)
    }).pipe(data => data);
  }

  fetchSavedDMSettings(reqObj:any) {
    return this.getWithHeaders(this.config.host+`/getUpdateDmSettings?task_id=${reqObj}`, 'application/json');
  }

  updateDMSettings(requestPayload:any) {
    return this.postWithHeaders(this.config.host+'/UpdateDmSettings', requestPayload, 'application/json');
  }

  getConfFiles(request:any) {
    return this.postWithHeaders(this.config.host+'/showConfFiles', request, 'application/json');
  }

  downloadConfFiles(request:any) {
    //return this.postWithHeaders(this.config.host+'/downloadConfFile', request, 'text/plain');
    return this.http.post(this.config.host+'/downloadConfFile', request, {
      responseType: 'blob'
    }).pipe(data => data);
  }

  uploadRemediatedConfFiles(formData:any) {
    // return this.postWithHeaders(this.config.host+'/uploadConfFile', formData, 'application/json');
    return this.http.post(this.config.host+'/uploadConfFile', formData);
  }
}
