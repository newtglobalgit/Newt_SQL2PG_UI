import { Injectable } from '@angular/core';
import pre_performanceBenchMark from '../../../assets/json/pre_dataMigrationPerformance.json';
import post_performanceBenchMark from '../../../assets/json/dataMigrationPerformance.json';
import { Observable } from "rxjs";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment.js';
import { AppConfigService } from './app-config.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class DatabaseDataMigrationService {
  data:any;
  header = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };
  constructor(private http: HttpClient, private config:AppConfigService) { }

  getCompleteReport(reqObj:any): Observable<any> {
    return this.http.post(this.config.host+'/dataMigrationReport', reqObj, this.header).pipe(data => data);
  }

  runCodePerformanceTest(reqObj:any){
    return this.http.post(this.config.host+'/runCodePerformanceTest', reqObj, this.header);
  }

  getCodePerformanceTestDetails(reqObj:any) {
    return this.http.post(this.config.host+'/getCodePerformanceTestReport',reqObj );    
  }

  getCodePerformanceObjectName(reqObj:any) {
    return this.http.post(this.config.host+'/getCodePerformanceTestObjectNames',reqObj );    
  }

  getBackup(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/backup',reqObj);
  }

  getRestore(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/restore',reqObj);
  }
  getBackupList(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/getBackupList',reqObj);
  }
  getRestoreList(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/getRestoreList',reqObj);
  }
  deleteBackupId(reqObj:any): Observable<any>{
    return this.http.delete(this.config.host+'/backup?backup_id='+reqObj.backup_id+'&RUN_ID='+reqObj.run_id);
  }
  deleteRestoreId(reqObj:any): Observable<any>{
    return this.http.delete(this.config.host+'/restore?restore_id='+reqObj.restore_id+'&RUN_ID='+reqObj.run_id);
  }
  
  dataReValidation(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/dataValidation', reqObj, this.header).pipe(data => data);
  }

  revertDataMigrationStatus(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/dataMigrationNotCompleted', reqObj, this.header).pipe(data => data);
  }

  getDataMigrationSettings(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/getOra2PGDataMigrationSettings', reqObj, this.header).pipe(data => data);
  }

  setDataMigrationSettings(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/updateOra2PGDataMigrationSettings', reqObj, this.header).pipe(data => data);
  }

  getOra2PGDataDumpPath(){    
    return this.http.get(this.config.host+'/getOra2PGDataDumpPath');
  }

  uploadfile(obj:any){
    console.log(obj,"reqobj")
    // let httpOption = {
    //   headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
    // };

    return this.http.post(this.config.host+'/uploadOra2PGConfFile?run_id='+obj.run_id, obj.file);
  }
  downloadPerformaceParamatersFile(reqObj:any): Observable<any> {

    return this.http.get(this.config.host+'/downloadPerformanceParameters?RUN_ID='+reqObj.RUN_ID+'&reportType='+reqObj.reportType,{
     responseType: 'blob'
    }); 
  }
  
  getDataMigrationDumpFileDetails(reqObj:any){
    return this.http.get(this.config.host+'/getDataMigrationDumpFileDetails?RUN_ID='+reqObj.RUN_ID);
  }

  downloadDataMigrationDump(reqObj:any): Observable<any> {

    return this.http.get(this.config.host+'/downloadDataMigrationDump?RUN_ID='+reqObj.RUN_ID+'&file_name='+reqObj.file_name,{
     responseType: 'blob'
    }); 
  }

  getValidationCompleteReport(reqObj:any): Observable<any>{
    //return this.http.get<any>('/assets/json/logicalValidation.json').pipe(data=>data);
    return this.http.post(this.config.host+'/getLogicalValidationDtls', reqObj, this.header).pipe(data => data);
  }

  logicalValidation(reqObj:any): Observable<any>{
    return this.http.post(this.config.host+'/logicalValidation', reqObj, this.header).pipe(data => data);
    //return this.http.get<any>('/assets/json/success.json').pipe(data=>data); 
  }
  getNumericTables(reqObj:any):Observable<any>{
    return this.http.post(this.config.host+'/getTableForValidation', reqObj, this.header).pipe(data => data);
   // return this.http.get<any>('/assets/json/tables.json').pipe(data=>data); 
  }

  getDataMigrationStatus(reqObj:any){
    return this.http.get(this.config.host+'/getDataMigrationDetails?task_id='+reqObj['task_id']+'&dm_id='+reqObj['dm_id']);
  }

  getDataMigrationStatusbyMaxDmId(reqObj:any){
    return this.http.get(this.config.host+'/getDataMigrationDetailsByMaxDmId?task_id='+reqObj['task_id']);
  }

  getDataValidationStatus(reqObj:any){
    return this.http.get(this.config.host+'/getDataValidationDetails?task_id='+reqObj['task_id']);
  }

  getDataValidationStatusbyDmId(reqObj:any){
    return this.http.get(this.config.host+'/getDataValidationDetailsDmId?task_id='+reqObj['task_id']+'&dm_id='+reqObj['dm_id']);
  }

  getErrorDetails(reqObj:any){
    return this.http.post(this.config.host+'/datavalidation_execution_task_error',reqObj); 
  }

  getSvErrorDetails(reqObj:any){
    return this.http.post(this.config.host+'/schema_validation_execution_task_error',reqObj); 
  }

  getSchemavalidationStatus(reqObj:any){
    return this.http.get(this.config.host+'/getSchemaValidationDetails?task_id='+reqObj['task_id']);
  }

  getSchemavalidationStatusbyDmId(reqObj:any){
    return this.http.get(this.config.host+'/getSchemaValidationDetailsDMId?task_id='+reqObj['task_id']+'&dm_id='+reqObj['dm_id']);
  }

  private downloadReport(endpoint: string, reqObj: any) {
    return this.http.post(`${this.config.host}/${endpoint}`, reqObj, {
      responseType: 'blob'
    });
  }

  downloadValidationReport(reqObj:any){
    return this.downloadReport('downloadValidationReport', reqObj);
  }

  downloadMigrationReport(reqObj:any){
    return this.downloadReport('downloadMigrationReport', reqObj);

  }
  downloadDMLogFile(reqObj:any){
    return this.downloadReport('downloadDMLogFile', reqObj);
  }
}
