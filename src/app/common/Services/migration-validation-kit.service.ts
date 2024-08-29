import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppConfigService } from '../../common/Services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class MigrationValidationKitService {

  constructor(private http: HttpClient, private config: AppConfigService) { }

  uploadfile(obj: any, name) {

    let userUrl = null;
    // let httpOption = {
    //   headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
    // };
    if (name == 'sourceTargetSchema') {
      userUrl = this.config.host + '/taskDBConnections?task_id=' + obj['task_id'];
    } else if (name == 'migrationTreatment') {
      userUrl = this.config.host + '/taskUpdateMetada?task_id=' + obj['task_id'];
    } else if (name == 'dataValidationInput') {
      //userUrl = this.config.host + '/dmDBConnections';
      userUrl = this.config.host + '/upload_data_validation_input?task_id=' + obj['task_id'];
    } else if (name == 'schemaValidationInput') {
      //userUrl = this.config.host + '/dmDBConnections';
      userUrl = this.config.host + '/upload_schema_validation_input?task_id=' + obj['task_id'];
    }
     else if (name == 'dataMigrationVM') {
      userUrl = this.config.host + '/dmVmdetails';
    }
    else if (name == 'globalSourceAndTarget'){
      userUrl = this.config.host + '/globalDBConnections';
    }
    else if (name == 'globalMigTreatmentFileInput'){
      userUrl = this.config.host + '/globalUpdateMetada';
    }

    if(name == 'dataMigrationVM' || name == 'globalSourceAndTarget' || name == 'globalMigTreatmentFileInput'){
      return this.http.post(userUrl, obj);
    }
    else{
      return this.http.post(userUrl, obj.file);
    }

  }


  getSchemaValidationTasks(){
    return this.http.get(this.config.host + '/get_schema_validation_tasks');
  }

  runSchemaValidation(obj){
    return this.http.post(this.config.host + '/run_schema_validation',obj);
  }

  runDataValidation(obj){
    return this.http.post(this.config.host + '/run_data_validation',obj);
  }

  downloadDataValidationReports(obj){
    return this.downloadValidationReport('/download_data_validation_reports', obj);
  }
  downloadSchemaValidationReports(obj){
    return this.downloadValidationReport('/download_schema_validation_reports', obj);
  }

  getNewMigrationTaskTableData() {
    return this.http.get(this.config.host + '/getTaskDetails');
  }

  getMigrationTask() {
    return this.http.get(this.config.host + '/getTaskDetails');
  }

  getTaskDetailsbyId(id) {
    return this.http.get(this.config.host + '/getTaskDetailsbyId?task_id=' + id);
  }


  deleteTaskId(id) {
    return this.http.post(this.config.host + '/deleteTaskId?task_id=', { "task_id": id });
  }

  runMigrationTask(id) {
    return this.http.get(this.config.host + '/runMigrationTask?task_id=' + id);
  }

  validateRunMigrationTask(reqObj) {
    return this.http.post(this.config.host + '/validate_by_task_id' , reqObj);
  }

  createNewTask(payload) {
    return this.http.post(this.config.host + '/save_migration_task', payload);
  }

  generateTaskId() {
    return this.http.post(this.config.host + '/generate_new_migration_task_id', {});
  }


  getRunDataMigrationTableData() {
    return this.http.get(this.config.host + '/getTaskDetailsbyId');
  }

  deleteMigrationTaskById(id: any) {
    return this.http.delete(this.config.host + '/deleteTaskId?task_id=' + id);
  }

  runMigrationTaskNew(id: any) {
    return this.http.post(this.config.host + '/runTaskId', id);
  }

  // prefix rdm stands for - Run Data Migration
  rdmValidateSourceDB(taskId){
    return this.http.get(this.config.host + '/validate_dm_source_data?task_id='+taskId);
  }

  rdmGenerateDBMigrationConfFile(taskId) {
    return this.http.get(this.config.host + '/generate_ora2pg_conf_files?task_id='+taskId);
  }

  rdmDeployMigrationPackageOnVM(taskId) {
    return this.http.get(this.config.host + '/deploy_dm_dependencies?task_id='+taskId);
  }

  rdmStartDataMigration(taskId) {
    return this.http.get(this.config.host + '/start_data_migration?task_id='+taskId);
  }
  reRunDataMigration(taskId) {
    return this.http.get(this.config.host + '/re_run_data_migration?task_id='+taskId);
  }
  
  reRunDataValidation(taskId) {
    return this.http.get(this.config.host + '/re_run_data_validation?task_id='+taskId);
  }

  reRunSchemaValidation(taskId) {
    return this.http.get(this.config.host + '/re_run_schema_validation?task_id='+taskId);
  }

  runDataMigration(id: any) {
    return this.http.post(this.config.host + '/runTaskId', id);
  }

  getTaskNameAndId() {
    return this.http.get(this.config.host + '/get_all_task_ids');
  }

  getMigrationHistoryTableData() {
    return this.http.get(`${this.config.host}/get_migration_history`);
  }

  getMasterTableDetails() {
    return this.http.post(`${this.config.host}/getMasterTableDetails`,{});
  }

  downloadVMDetails(){
    return this.downloadFile('/downloadVMDetails');
  }

  executeSourceDBMetaData(obj) {
    return this.http.post(`${this.config.host}/taskUpdateSourceMetada`, obj);
  }

  downloadSourceDBSchema(obj) {
    return this.http.get(this.config.host + '/downloadTableDetails?task_id=' + obj['task_id'], {
      responseType: 'blob'
    });
  }

  downloadSourceDBDetails(obj) {
    return this.http.get(this.config.host + '/downloadTableData?task_id=' + obj['task_id']);
  }


  downloadValidateSourceDatabase(task_id) {
    return this.http.get(this.config.host + '/download_source_validation_reports?task_id=' +task_id, {
      responseType: 'blob'
    });
  }

  executeGlobalUpdateSourceMetada(name){
    return this.http.post(`${this.config.host}/globalUpdateSourceMetada`, name);
  }

  downloadGlobalTableDetails(name){
    return this.downloadFile('/downloadGlobalTableDetails');
  }

  getEnvData(){
    return this.http.get(`${this.config.host}/get_db_environments`);
  }

  getValidationExcel(task_id, task_type){
    return this.http.get(this.config.host + '/download_validation_reports_excel?task_id='+task_id+'&task_type='+task_type, {responseType: 'blob'});
  }

  private downloadFile(endpoint: string) {
    return this.http.get(`${this.config.host}${endpoint}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  private downloadValidationReport(endpoint: string, obj: any) {
    return this.http.post(`${this.config.host}${endpoint}`, obj, {
      responseType: 'blob'
    });
  }
}
