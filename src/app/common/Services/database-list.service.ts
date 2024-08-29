import { EventEmitter } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

import * as _ from 'underscore';
import { BehaviorSubject } from 'rxjs';
import { Observable } from "rxjs";
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { AppConfigService } from './app-config.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class DatabaseListService {
  private userUrl:string;
  dblistObject:any={};
  savedTableData: any[] = [];
  batchDetailsData: any[] = [];
  showBatchTab  = false ;
  showDBMigPage = false;
  runAnalytics:false;
  schemasNotFound:boolean=false;
  uniqueStages:any = [];

  savedWorkerNodeSelection:any[] = [];

  $savedTableDataChanged = new BehaviorSubject<any[]>(this.savedTableData)
  $savedTableDataChangedObj = this.$savedTableDataChanged.asObservable();

  $savedWorkerNodeSelectionChanged = new BehaviorSubject<any[]>(this.savedWorkerNodeSelection)
  $savedWorkerNodeSelectionChangedObj = this.$savedWorkerNodeSelectionChanged.asObservable();


  $savedbatchDetailsDataChanged = new BehaviorSubject<any[]>(this.batchDetailsData)
  $savedbatchDetailsDataChangedObj = this.$savedbatchDetailsDataChanged.asObservable();


  constructor(private http: HttpClient, private config:AppConfigService) { }

  /* Methods related to radio button in dmap table for Exisiting Migration */

  setSavedTableDataStatus(data:any){
    let index = _.findIndex(this.savedTableData, {"runId":data.runId});
    this.savedTableData[index].stepStatus = data.stepStatus;
    this.savedTableData[index].step = data.step;
    this.savedTableData[index].migrationStep = data.migrationStep;
    this.savedTableData[index].errors = data.errors;
    this.savedTableData[index].targetDBName = data.targetDBName;
    this.savedTableData[index].selectedWorkerNode = data.selectedWorkerNode;
    this.savedTableData[index].workerNode = data.workerNode;
    this.$savedTableDataChanged.next(this.savedTableData.slice());
  }

  getSavedTableDataCount(){
    return this.savedTableData.length;
  }

  setShowSecondDiv(showDBMigPage){
    this.showDBMigPage= showDBMigPage;
  }

  getShowSecondDiv(){
    return this.showDBMigPage;
  }

  getSavedCheckedDBRecords(){
    return this.savedTableData.slice();
  }

  setUniqueStages(uniqueStages){
    this.uniqueStages = uniqueStages;
  }

  getUniqueStages(){
    return this.uniqueStages;
  }

  setschemasNotFound(schemasNotFound){
    this.schemasNotFound = schemasNotFound;
  }

  getschemasNotFound(){
    return this.schemasNotFound;
  }

  removeAllCheckedDBRecords(){
    this.savedTableData = [];
    this.$savedTableDataChanged.next(this.savedTableData.slice());
  }

  addCheckedRecord(data:any){
    this.savedTableData.push(data);
    this.savedTableData[0].isAccordianExpanded = false;
    this.$savedTableDataChanged.next(this.savedTableData.slice());
  }

  addWorkerNodeSelection(data:any){
    this.savedWorkerNodeSelection.push(data);
    this.$savedWorkerNodeSelectionChanged.next(this.savedWorkerNodeSelection.slice());
  }

  getRunAnalyticsAllowed(){
    return this.runAnalytics;
  }
  setRunAnalyticsAllowed(runAnalytics:any){
    this.runAnalytics = runAnalytics;
  }



  setIsAccordianExpanded(runId:any, isAccordianExpanded:boolean){
    let x = _.findIndex(this.savedTableData, {runId:runId});

    if(x >= 0){
      this.savedTableData[x].isAccordianExpanded = isAccordianExpanded;
      this.$savedTableDataChanged.next(this.savedTableData.slice());
    }
  }

  setShowBatchDetails(showBatchTab:any){
    this.showBatchTab = showBatchTab;
  }

  getShowBatchDetails(){
    return this.showBatchTab;
  }

  /* Since the Top EXPORT button has been removed. We dont need below method. But keeping it temp */
  setCurrentViewInSavedCheckedDBRecords(data:any, currentReportView:any){
    let index = _.findIndex(this.savedTableData, {runId:data.runId});

    if(index >= 0){
      this.savedTableData[index].currentReportView = currentReportView;
      this.$savedTableDataChanged.next(this.savedTableData.slice());
    }
  }

  /* End */


  uploadfile(obj:any){
    let userUrl = null;
    let dbName = sessionStorage['dbName']
    // let httpOption = {
    //   headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
    // };

    if(obj.fileType == 'databaseConfig'){
      //userUrl = this.config.host+'/handle_form?userId='+obj.userId;
      userUrl = this.config.host+'/analytics_upload_schemas?userId='+obj.userId;
    }else if(obj.fileType == 'restoreDMAP'){
      userUrl = this.config.host+'/dmapRestore?dbNodeIP='+obj.dbNodeIP+'&appNodeIP='+obj.appNodeIP+'&appNodePort='+obj.appNodePort+'&restoreApp='+obj.restoreApp;
    }else if(obj.fileType == 'masterSchemaUpload'){
      userUrl = this.config.host+'/analytics_upload_schemas?userId='+obj.userId;
    }else if(obj.fileType == 'applicationQuestionnaire'){
      userUrl = this.config.host+'/uploadApplication?appId='+obj.appId;
    }else if(obj.fileType == 'dbMigrationQuestionnaire'){
      userUrl = this.config.host+'/uploadDatabase?dbName='+obj.dbName;
    }else if(obj.fileType == 'tcoQuestionnaire'){
      userUrl = this.config.host+'/uploadTco';
    }else if(obj.fileType == 'awrReport'){
      userUrl = this.config.host+'/uploadAWR?db_name='+dbName;
    }else if(obj.fileType == 'dbScriptReport'){
      userUrl = this.config.host+'/uploadDBOracleLog?db_name='+dbName;
    }
    else if(obj.fileType == 'databaseDetails'){
      userUrl = this.config.host+'/uploadDatabaseDetails';
    }
    else if(obj.fileType == 'dbScripts'){
      userUrl = this.config.host+'/upload_dbscripts?db_name='+obj.dbName+'&script_name='+obj.scriptName;
    }
    else if(obj.fileType == 'uploadCopilot'){
      userUrl = this.config.host+'/upload_copilot_sql?run_id='+obj.run_id;
    }
    else if(obj.fileType == 'appIntakeExcel'){
      userUrl = this.config.host+'/app_assessment_excel_submit?application_id='+obj.appId+'&application_name='+obj.appName;
    }
    else{
      userUrl = this.config.host+'/uploadCodePerformanceTestInputData?run_id='+obj.run_id+'&object_type='+obj.object_type;
    }

    return this.http.post(userUrl, obj.file);
  }

  senddbconfigDetails( reqObj:any, targetOption:any ): Observable<any> {
    let url:string = '';
    if(targetOption == 'existing') url = '/dbconfig';
    if(targetOption == 'new') url = '/createTargetDB';
    return this.http.post(this.config.host+url, reqObj, httpOptions);
  }

  getDBlist(): Observable<any> {
    this.dblistObject.user_id = sessionStorage['user_id'];
    return this.http.post<any>(this.config.host + '/dblist', this.dblistObject, httpOptions,);
  }

  updateconfigDetails( dbconfig_details:any ): Observable<any> {
    return this.http.post(this.config.host+'/update_target', dbconfig_details,httpOptions);
  }

  private setHeaders(): HttpHeaders {
    return new HttpHeaders().set('Content-Type', 'application/json');
  }

  private postWithHeaders(url: string, reqObj: any): Observable<any> {
    return this.http.post(url, reqObj, {
      headers: this.setHeaders()
    }).pipe(data => data);
  }

  private getWithHeaders(url: string): Observable<any> {
    return this.http.get(url, {
      headers: this.setHeaders()
    }).pipe(data => data);
  }
  private postWithHeadersSourceDbdetails(url: string, sourceDbdetails: any): Observable<any> {
    return this.http.post(url, sourceDbdetails, {
      headers: this.setHeaders()
    }).pipe(data => data);
  }
  private postWithHeadersTargetDbdetails(url: string, targetDbdetails: any): Observable<any> {
    return this.http.post(url, targetDbdetails, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(data => data);
  }


  startDiscovery(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host + '/discovery', reqObj);
  }

  startAssessment(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host + '/assessment', reqObj);
  }

  startSchemaConversion(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host + '/schemaMigration', reqObj);
  }

  deleteDBItem(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host + '/delete', reqObj);
  }

  getPriorities(reqObj:any){
    return this.postWithHeaders(this.config.host + '/get_priorities', reqObj);
  }

  savetPriorities(reqObj:any){
    return this.postWithHeaders(this.config.host + '/add_priorities', reqObj);

  }
  getTargetEnv(){
    return this.http.get(this.config.host+'/getTargetEnvironment');
  }

  clearErrorStatus(reqObj:any){
    return this.postWithHeaders(this.config.host+'/clearErrorStatus', reqObj);

  }

  testSourceDbConnection( sourceDbdetails:any ): Observable<any> {
    return this.postWithHeadersSourceDbdetails(this.config.host + '/testSourceDB', sourceDbdetails);
  }

  testTargetDbConnection( targetDbdetails:any ): Observable<any> {
    return this.postWithHeadersTargetDbdetails(this.config.host + '/testTargetDB', targetDbdetails);
  }


  testAzureAndSourceDbConnection( reqObj:any ): Observable<any> {
    return this.postWithHeaders(this.config.host+'/testAzure', reqObj);
  }

  testNewDbConnection( sourceDbdetails:any ): Observable<any> {
    return this.postWithHeadersSourceDbdetails(this.config.host + '/test_target_conn_using_details', sourceDbdetails);
  }

  saveNewDbConnection( targetDbdetails:any ): Observable<any> {
    return this.postWithHeadersTargetDbdetails(this.config.host + '/target_details', targetDbdetails);
  }

  saveSourceDbConnection( sourceDbdetails:any ): Observable<any> {
    return this.postWithHeadersSourceDbdetails(this.config.host + '/source_details', sourceDbdetails);
  }

  getPerformanceThreshold(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/getCodePerformanceThresholdValues', reqObj);
  }

  updatePerformanceThreshold(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/updateCodePerformanceThresholdValues', reqObj);
  }
  updateSchemaUsername(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/schemaOwnerShip', reqObj);
  }

  getAzureResourceGroupLocations(){
    return this.http.get(this.config.host+'/getAzureLocations').pipe(
      (data:any) => {
        for(let i in data){
          data[i]['label'] = data[i].locationName;
          data[i]['value'] = data[i].locationCode;
        }
        return data;
      });
  }

  backupDMAP(appBackupRequired: boolean) {
    return this.http.get(this.config.host + '/dmapBackup', {
      responseType: 'blob',
      params: { appBackupRequired: appBackupRequired }
    });
  }

  checkBackupStatus(){
    return this.http.get(this.config.host+'/get_backup_status')
  }

  backupDMAP_(){
    return this.http.get(this.config.host+'/dmapBackup')
  }

  restoreWorkerNode(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/restoreWorkerNode', reqObj);
  }

  downloadDMKit(platform){
    return this.http.get(this.config.host+'/dataMigrationKit?platform='+platform,{responseType: 'blob'})
  }
  schemaValidationDMKit(platform){
    return this.http.get(this.config.host+'/schemaValidationKit?platform='+platform,{responseType: 'blob'})
  }
  dataValidationDMKit(platform){
    return this.http.get(this.config.host+'/dataValidationKit?platform='+platform,{responseType: 'blob'})
  }

  // getbatchDetails(): Observable<any> {

  //   return this.http.get('assets/json/batchProcessesDetails.json', {
  //     headers: new HttpHeaders().set('Content-Type', 'application/json')
  //   }).pipe(data => data);
  // }

   getbatchDetails(): Observable<any> {
   let user_id = sessionStorage['user_id'];

    return this.http.get(this.config.host+'/get_batch_details?user_id='+user_id)
  }

  resumeBatch(reqObj:any){
    let user_id = sessionStorage['user_id'];
    return this.http.get(this.config.host+'/resume_batch?batch_id='+reqObj+'&user_id='+user_id)
  }

  restartschemaConversion(reqObj:any){
    return this.postWithHeaders(this.config.host+'/reset_status', reqObj);
  }

  submitSynonymMigrationMode(reqObj:any){
    return this.postWithHeaders(this.config.host+'/save_synonym_migration_mode', reqObj);
  }

  startManually(reqObj:any){
    return this.postWithHeaders(this.config.host+'/start_manually', reqObj);
  }

  //  getWorkerNodeDetails(): Observable<any> {

  //   return this.http.get(this.config.host+'/getAppWorkerNodeDetails');
  // }

  getDbNodes(): Observable<any> {
    return this.http.get(this.config.host + '/getDbNodes', {
    }).pipe(data => data);
  }

  resyncWorkerNode(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/resyncWorkerNode', reqObj);
  }

  updateMasterNode(reqObj:any): Observable<any> {
    return this.http.post(this.config.host+'/update_master_node_details', reqObj, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(data => data);
  }

  deleteWorkerNode(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/deleteWorkerNode', reqObj);
  }


  updateWorkerNodeDetails(reqObj): Observable<any>{
    return this.postWithHeaders(this.config.host+'/update_worker_node_details', reqObj);
  }

  testWorkerNodeConnection(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/testWorkerNodeConnection', reqObj);
  }

  getMasterAnalyticsDetails(): Observable<any> {
    return this.getWithHeaders(this.config.host + '/analytics_dashboard');
    // return this.http.get('assets/json/masterAnalytics.json', {
    //   headers: new HttpHeaders().set('Content-Type', 'application/json')
    // }).pipe(data => data);
  }

  getMasterSchemaDetails(): Observable<any> {
    return this.getWithHeaders(this.config.host + '/masterNodeSchemaList');
  }
  assignWorkerNode(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/assignWorkerNode', reqObj);
  }

  replaceWorkerNode(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/replaceWorkerNode', reqObj);
  }

  generateAnalyticsReport(): Observable<any> {
    return this.http.get(this.config.host+'/generateAnalyticsReport');
  }
  validateAnalyticsReport(): Observable<any> {
    return this.http.get(this.config.host+'/validateAnalyticsReport');
  }

  getSchemaDetails(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/analytics_dashboard', reqObj);
  }

  submitsettingDetails(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/updateAnalyticsSettings', reqObj);
  }
  submitDMAPsettingDetails(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/updateDMAPSettings', reqObj);
  }

 getAnalyticsSettingDetails(): Observable<any> {
    return this.http.get(this.config.host+'/getanalyticsSettings');
  }

  getAnalyticsStatus(): Observable<any> {
    return this.getWithHeaders(this.config.host + '/run_analytics_allowed');
  }

  updateWorkerNodePassword(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/update_worker_node_password', reqObj);
  }

  submitEmailsettingDetails(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/updateAnalyticsEmailSettings', reqObj);
  }

  testEmailsettingDetails(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/test_email_connection', reqObj);
  }
  downloadSchemaReport(){
    return this.http.get(this.config.host+'/download_reports',{responseType: 'blob'})
  }
  downloadAnalyticsSummaryReport(){
    return this.http.get(this.config.host+'/downloadAnalyticsExcel',{responseType: 'blob'})
  }

  downloadWorkerNodeLogs(reqObj:any){
    return this.http.post(this.config.host+'/download_logs',reqObj, {responseType: 'blob'})
  }

  getSelectedNodeLogFiles(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_log_files', reqObj);
  }

  getLogFileContent(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/openLogFile', reqObj);
  }

  emailReports(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/emailReports', reqObj);
  }

  getClientName(): Observable<any>{
    return this.getWithHeaders(this.config.host + '/getClientName');
  }

  downloadBusinessCaseReport(){
    return this.http.get(this.config.host+'/download_business_case_report',{responseType: 'blob'})
  }

  downloadDBAPPReport(){
    return this.http.get(this.config.host+'/download_db_app_report',{responseType: 'blob'})
  }

  downloadAzureCostReport(){
    return this.http.get(this.config.host+'/download_azure_cost_report',{responseType: 'blob'})
  }

  downloadOnPremOracleCostReport(){
    return this.http.get(this.config.host+'/download_on_prem_oracle_cost_report',{responseType: 'blob'})
  }
  downloadAzureAppCostReport(){
    return this.http.get(this.config.host+'/download_azure_app_cost_report',{responseType: 'blob'})
  }
  downloadDBPerformanceReport(){
    return this.http.get(this.config.host+'/download_db_performance_report',{responseType: 'blob'})
  }
  downloadAppDBReport(){
    return this.http.get(this.config.host+'/download_db_app_db_assessment_report',{responseType: 'blob'})
  }
  downloadCurrentAppReport(){
    return this.http.get(this.config.host+'/download_on_prem_app_cost_report',{responseType: 'blob'})
  }
  downloadROIOneTimeMigrationReport(){
    return this.http.get(this.config.host+'/download_roi_one_time_migration_cost_report',{responseType: 'blob'})
  }
  downloadDiscoveryPdfReport(runId:any,stage:any){
    return this.http.get(this.config.host+'/download_pdf_report?runId='+runId+'&stage='+stage,{responseType: 'blob'})
  }
  getCurrencyDetails(): Observable<any> {
    return this.http.get(this.config.host+'/getCurrencyValues');
  }
  validateResponse(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/validateDownloads', reqObj);
  }
  resetRerunCount(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/resetWorkerErrorRerunCount', reqObj);
  }

  deleteSchema(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/deleteMasterSchema', reqObj);

  }
  getOfflineVmDetails(): Observable<any> {
    return this.http.get(this.config.host+'/analytics_details');

  }

  getTargetDetails(runId:any): Observable<any>{
    return this.http.get(this.config.host+'/target_details?RUN_ID='+runId)}

  getDbLinkDetails(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host+'/getDbLinkDtls', reqObj);

  }

  deleteDbLinkDetails(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host+'/deleteDbLinkDtls', reqObj);
  }

  updateDbLinkDetails(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host+'/updateDbLinkDtls', reqObj);
  }


  getAppDBDetails(): Observable<any> {
    return this.getWithHeaders(this.config.host + '/appDbDetails');
  }

  downloadArtifacts(reqObj:any){
    return this.http.post(this.config.host+'/download_artifacts',reqObj, {responseType: 'blob'})
  }

  getAPPQuestionnaireDetails(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_app_questionnaire_details', reqObj);
  }

  setAPPQuestionnaireDetails(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/update_app_questionnaire_details', reqObj);
  }

  postFile(appId:any,fileToUpload: File,fileToUploadd: File): Observable<any> {
    const formData: FormData = new FormData();
    let fileupload_name = '';
    let fileuploadd_name = '' ;
    if (fileToUpload !=null){
      fileupload_name = fileToUpload.name
      formData.append('application_architecture_diagram', fileToUpload, fileupload_name);
    }
    if (fileToUploadd !=null){
      fileuploadd_name = fileToUploadd.name
      formData.append('application_deployment_diagram', fileToUploadd, fileuploadd_name);
    }

    return this.http.post(this.config.host+'/update_app_questionnaire_diagrams?appId='+appId, formData);
  }

  getTcoDetails():Observable<any>{
    return this.getWithHeaders(this.config.host + '/get_tco_questionnaire_dtls');

  }
  uploadTcoDetails(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host+'/upload_tco_questionnaire', reqObj);
  }
  getDbDetails(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_db_questionnaire_dtls', reqObj);
  }
  uploadDbDetails(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host+'/upload_db_questionnaire', reqObj);
  }
  testProdDbConnection( reqObj:any ): Observable<any> {
    return this.postWithHeaders(this.config.host+'/dbscripts_test_prod_connection', reqObj);
  }
  submitProdDbDetails( reqObj:any ): Observable<any> {
    return this.postWithHeaders(this.config.host+'/execute_dbscripts', reqObj);
  }
  getProdDbDetails( reqObj:any ): Observable<any> {
    return this.http.get(this.config.host+'/execute_dbscripts?db_name='+reqObj['db_name']+'&script_name='+reqObj['script_name'],{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(data => data);
  }

  getScriptDetails( reqObj:any ): Observable<any> {
    return this.http.get(this.config.host+'/dbscripts?db_name='+reqObj['db_name'],{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(data => data);
  }
  downloadDbScript(reqObj:any): Observable<any> {

    return this.http.get(this.config.host+'/download_dbscripts?db_name='+reqObj['db_name']+'&script_name='+reqObj['script_name'],{
     responseType: 'blob'
    });
  }


  getEmailReminderSettings(): Observable<any> {
  return this.http.get(this.config.host+'/email_remainder');
  }
  submitEmailRemindergDetails(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/email_remainder', reqObj);
  }
  sendEmailReminder(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/confirm_email_remainder', reqObj);
  }
  sendEmailReminderManually(): Observable<any> {
    return this.getWithHeaders(this.config.host + '/send_email_remainder');
  }

  getSchemaMigrationData(): Observable<any> {

    return this.http.get(this.config.host+'/get_schema_migration_list');
  }
  updateSchemaMigrationData(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/update_schema_migration_list', reqObj);
  }

  getMultipleSchemasDelete(): Observable<any> {

    return this.http.get(this.config.host+'/get_schemas_to_delete');
  }
  mutiple_schema_delete(reqObj:any): Promise<any>{
    return this.http.post(this.config.host+'/mutiple_schema_delete', reqObj, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).toPromise();
  }
  get_short_questionnaire_data(): Observable<any> {
    return this.getWithHeaders(this.config.host + '/get_short_questionnaire_data');
  }

  submit_short_questionnaire_data(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/submit_short_questionnaire_data', reqObj);
  }

  get_questionnaire_status(): Observable<any> {
    return this.getWithHeaders(this.config.host + '/get_questionnaire_status');
  }

  getAppAssessmentetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_app_assessment_questionnaire_details', reqObj);
  }

  getInterfaceAssessmentetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_interface_assessment_questionnaire_details', reqObj);
  }

  getAppServerDetailsResponse(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_app_server_details_response', reqObj);

  }
  getMasterAppAssessmentetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_master_app_assessment_questionnaire_details', reqObj);

  }
  getMasterInterfaceQuestionnaireDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_master_interface_questionnaire_details', reqObj);
  }
  submitAppAssessmentetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/submit_app_assessment_questionnaire_details', reqObj);
  }

  getMasterAskFormDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_ask_Form', reqObj);
  }

  submitAskForm(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/submit_ask_form', reqObj);
  }
  downloadAskFormPdf(reqObj){
    return this.http.get(this.config.host+'/download_ask_form_pdf_report?ask_assement_id='+reqObj['ask_assement_id'],{responseType: 'blob'})
  }

  postArchitectureFile(appId,fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    let fileupload_name = '';
    if (fileToUpload !=null){
      fileupload_name = fileToUpload.name
      formData.append('application_architecture_diagram', fileToUpload, fileupload_name);
    }
    return this.http.post(this.config.host+'/update_app_architecture_diagram?appId='+appId, formData);
  }

  getMasterInterfacetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_master_interface_questionnaire_details', reqObj);
  }
  getAddServerDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_add_server_questionnaire_details', reqObj);
  }

  getInterfaceDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_interface_questionnaire_details', reqObj);
  }

  getServerDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_app_server_questionnaire_details', reqObj);
  }

  submitAppInterfaceetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/submit_interface_questionnaire_details', reqObj);
  }

  submitAddServerDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/submit_add_server_questionnaire_details', reqObj);
  }

  getAppInterfaceDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_application_interface_details', reqObj);
  }

  getApplicationInterfaceDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_interface_details_by_application', reqObj);
  }

  getApplicationServerDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_app_server_details_by_application', reqObj);
  }

  getServerRequiredValuesByApplication(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_server_required_values_by_application', reqObj);
  }

  removeApplicationInterfaceDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/delete_interface_details_by_application', reqObj);
  }

  removeApplicationServerDetails(reqObj):Observable<any>{
    return this.postWithHeaders(this.config.host+'/delete_server_details_by_application', reqObj);
  }

  get_database_details_data(): Observable<any> {
    return this.getWithHeaders(this.config.host + '/get_database_details_data');
  }

  submit_database_details_questionnaire_data(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/submit_database_details_data', reqObj);
  }

  submit_database_prod_details(reqObj:any): Observable<any> {
    return this.postWithHeaders(this.config.host+'/update_prod_db_performance', reqObj); 
  }

  getWorkerNodeDetails(): Observable<any> {
    return this.http.get(this.config.host+'/getWorkerNodeDetails');
  }

  submitworkerNodeDetails(reqObj:any): Observable<any>{
    return this.postWithHeaders(this.config.host+'/submitWorkerNodeDetails', reqObj);
  }

  getViewDBAnalyticsStatus(reqObj): Observable<any> {
    return this.postWithHeaders(this.config.host+'/viewDBAnalyticsStatus', reqObj);
  }

  runDBAnalytics(reqObj){
    return this.postWithHeaders(this.config.host+'/runDBAnalytics', reqObj);
  }

  getEnableRunAnalytics(): Observable<any> {
    return this.http.get(this.config.host+'/enableRunDBAnalytics');
  }


  deleteInterface(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host+'/delete_interface_details_by_application', reqObj);
  }

  getInterfaceQuestionnaireId():Observable<any>{
    return this.http.get(this.config.host+'/get_interface_questionnaire_id');
  }

  getInterfaceList(reqObj:any):Observable<any>{
    return this.postWithHeaders(this.config.host+'/get_interface_details_by_application', reqObj);
  }

  getEnableDiscoverAll(): Observable<any> {
    return this.http.get(this.config.host+'/enableDiscoverAll');
  }

  discoverAll(): Observable<any> {
    return this.http.get(this.config.host+'/discoverAll');
  }

  getPreAssessmentStatus(): Observable<any> {
    return this.http.get(this.config.host+'/preAssessmentStatus');
  }

  downloadPreAssessmentReport(): Observable<any> {
    return this.http.get(this.config.host+'/downloadPreAssessmentReport',{responseType: 'blob'});
  }

  download_utility(reqObj){
    return this.http.get(this.config.host+'/downlad_dmap_utilities?utility=' + reqObj['utility']+'&os_type='+reqObj['os_type'],
    {responseType: 'blob'})
  }
  download_db_copilot(){
    return this.http.get(this.config.host+'/download_dmap_copilot_script',
      {responseType: 'blob'})
  }
}

