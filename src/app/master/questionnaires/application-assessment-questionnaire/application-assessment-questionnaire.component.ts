import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbdConfirmationModal } from 'src/app/common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
import { QuestionaireService } from 'src/app/common/Services/questionaire.service';
import { MinNumberValidator } from 'src/app/common/Validators/min-number-validator';
import { AppServerDetailsComponent } from '../app-server-details/app-server-details.component';
import { FileUploadModalComponent } from 'src/app/common/Modal/file-upload-modal/file-upload-modal.component';

declare var $: any;

@Component({
  selector: 'app-application-assessment-questionnaire',
  templateUrl: './application-assessment-questionnaire.component.html',
  styleUrls: ['./application-assessment-questionnaire.component.css']
})
export class ApplicationAssessmentQuestionnaireComponent implements OnInit {

  @Output() onUpload: EventEmitter<any> = new EventEmitter<any>();

  appAssessmentQuestionnaireForm: FormGroup;
  migrationOptions_dropdownSettings:IDropdownSettings = {};

  appAssessmentDetail:any;
  appDetails:any;
  appIntegration: any[];
  databaseServers: any[];
  appDocumentation: any[];
  errorInValidForm:boolean= false;
  masterappData: any;
  isDataAvailable:boolean = false;
  showUploadedArchitectureText:boolean = true;
  fileToUpload_architecture: File | null = null;
  application_architecture_diagram_text:any;
  platform_change_others: boolean = false;
  performance_scalability_others:boolean = false;
  security_requirement_others:boolean = false;
  app_integration_protocol_others:boolean = false;
  cicd_pipeline_others:boolean = false;
  dropdown_others_values:any={};
  formStatus: any = '';
  isServerValuesreadOnly:any = false;

  regexp_number = /^(0|[1-9]\d*)(\.\d+)?$/
  regexp_email = /\S+@\S+\.\S+/
  regexp_percentage =/^\d+(\.\d+)?$/
  regexp_designation=/^.{1,50}$/

  appDetailsFields:any = [];
  modernRequirementsFields:any = [];
  otherRequirementsFields:any = [];
  webServerFields:any = [];
  docStatusFields:any = [];
  disableServerDetails: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private spinner: NgxSpinnerService,
              private activatedroute:ActivatedRoute,
              private databaseListService: DatabaseListService,
              private questionaireService:QuestionaireService) { }

  ngOnInit() {
    this.spinner.show();
    this.appAssessmentQuestionnaireForm = this.formBuilder.group({});

    this.migrationOptions_dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3
    };

    this.activatedroute.queryParams.subscribe(queryParams => {
      this.appDetails=queryParams;
       this.getMasterAppDetails();

    });

    // let reqObj = {'appId':this.appDetails['appId'],'appName':this.appDetails['appName']};
    // this.databaseListService.getApplicationServerDetails(reqObj).subscribe(response => {
    //   if (response.length > 0){
    //     this.isServerValuesreadOnly = true;
    //   }
    //   });
    this.getAppDetails();

    // this.spinner.hide();
  }

  ngAfterViewInit(){
    this.getAppDetails();
  }
  ngOnChanges(): void {
    this.getAppDetails();
  }

  getMasterAppDetails(){

    //this.spinner.show();
    this.databaseListService.getMasterAppAssessmentetails({}).subscribe(response => {

      if (response){
        this.masterappData = response;
        this.createFormControls();
        this.setFieldsSectionWise();
        this.appAssessmentQuestionnaireForm.addControl('application_id', new FormControl('',[Validators.required,]));
        this.appAssessmentQuestionnaireForm.addControl('application_name', new FormControl('',[Validators.required,]));
        this.appAssessmentQuestionnaireForm.addControl('all_servers', new FormControl('',[]));
        this.appAssessmentQuestionnaireForm.addControl('server_separately', new FormControl('',[]));
        this.appAssessmentQuestionnaireForm.get('application_id').patchValue(this.appDetails['appId']);
        this.appAssessmentQuestionnaireForm.get('application_name').patchValue(this.appDetails['appName']);
      }

    });

  }
  createFormControls(){

    for (let i in this.masterappData){
      let appData = this.masterappData[i];
      for(let j in appData){
        this.appAssessmentQuestionnaireForm.addControl(appData[j].form_control_name, new FormControl([], this.getValidatorsForControls(appData[j])));
        if(appData[j].input_type == 'multi_select'){
          let key = appData[j].form_control_name+'_others';
          this.dropdown_others_values[key] = false;
          this.appAssessmentQuestionnaireForm.addControl(key, new FormControl([],[]));
        }
        if(appData[j].form_control_name == 'testing'){
          appData[j].error_msg = "Invalid format. Hint: Enter a number between 0 to 9999"
        }
        else if (appData[j].form_control_name == 'integration_points' || appData[j].form_control_name == 'server_count' || appData[j].form_control_name == 'app_databases'){
          appData[j].error_msg = "Invalid format. Hint: Enter a number between 0 to 99"
        }
        else if (appData[j].form_control_name == 'testcases_documented' || appData[j].form_control_name == 'testcases_automated' ){
          appData[j].error_msg = "Invalid format. Hint: Enter a number between 0 to 100"
        }
      }
    }
  }

  radioChange(e) {
    if (e.currentTarget.id == 'server_separately' && e.target.checked) {
      const modalRef = this.modalService.open(NgbdConfirmationModal);
      modalRef.componentInstance.data = {msg : 'Selecting to enter CPU, RAM and Storage details for each server separately will clear the total CPU, RAM and storage details entered for all servers. Do you wish to continue?', title : 'Confirmation',okButtonLabel : 'Ok',cancelButtonLabel:'Cancel'};
      modalRef.result.then((result) => {
        if ( result === 'ok') {
          this.appAssessmentQuestionnaireForm.get('servers_core').patchValue(0);
          this.appAssessmentQuestionnaireForm.get('servers_ram').patchValue(0);
          this.appAssessmentQuestionnaireForm.get('servers_storage').patchValue(0);
          this.isServerValuesreadOnly = true;
          this.disableServerDetails = false;
        } else {
          e.target.checked = false;
          let item = document.getElementById('all_servers');
          if (item) {
            item['checked'] = true;
          }
          this.isServerValuesreadOnly = false;
          this.disableServerDetails = true;
        }
      });
    } else {
        const modalRef = this.modalService.open(NgbdConfirmationModal);
        modalRef.componentInstance.data = {msg : 'Selecting to enter total CPU, RAM and Storage details for all servers will remove the details entered manually for each server. Do you wish to continue?', title : 'Confirmation',okButtonLabel : 'Ok',cancelButtonLabel:'Cancel'};
        modalRef.result.then((result) => {
          if ( result === 'ok') {
            this.isServerValuesreadOnly = false;
            this.disableServerDetails = true;
            this.deleteAllServerDetails();
            this.appAssessmentQuestionnaireForm.get('servers_core').patchValue(0);
            this.appAssessmentQuestionnaireForm.get('servers_ram').patchValue(0);
            this.appAssessmentQuestionnaireForm.get('servers_storage').patchValue(0);
            // this.appAssessmentQuestionnaireForm.get('server_count').patchValue(0);
            this.appAssessmentQuestionnaireForm.get('server_separately').reset();
          } else {
            e.target.checked = false;
            let item = document.getElementById('server_separately');
            if (item) {
              item['checked'] = true;
            }
            this.isServerValuesreadOnly = true;
            this.disableServerDetails = false;
          }
        });
    }
  }

  async deleteAllServerDetails() {
    this.spinner.show();
    let reqObj = {'appId':this.getControlValue('application_id'),'appName':this.getControlValue('application_name')};
    let res = await this.databaseListService.getApplicationServerDetails(reqObj).toPromise();
    if (res && res.length>0) {
      let count = 0;
      res.forEach(async server => {
        let reqObj = {'appId':this.getControlValue('application_id'),'appName':this.getControlValue('application_name'),'appServerDetailId':server.server_id};
        let respo = await this.databaseListService.removeApplicationServerDetails(reqObj).toPromise();
        if(respo['status']){
          count++;
        }
        if (res.length == count) {
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.openAlert('Some server may failed to delete.');
        }
      });
    } else {
      this.spinner.hide();
    }
  }

  setFieldsSectionWise() {
    if (this.masterappData && this.masterappData.length>0) {
      this.webServerFields.push({
        "column_length": "4",
        "column_span": 1,
        "description": "Sum of total RAM across all production web/app and other application servers",
        "form_control_name": "all_servers",
        "help_tip": "Please enter the sum of RAM (in GB) in all Web (e.g. Tomcat) and App servers (e.g. WebSpear, WebLogic, JBoss) application is deployed in Production ",
        "input_type": "radio",
        "is_question_numeric": true,
        "mandatory": false,
        "options": [],
        "question_column": 2,
        "checked": true,
        "question_id": 23,
        "row_span": 1,
        "title": "Enter total Cores, RAM and Storage for all servers"
      },
      {
        "column_length": "4",
        "column_span": 1,
        "description": "Sum of total storage provisioned across all production web/app and other application servers",
        "form_control_name": "server_separately",
        "help_tip": "Please enter the sum of storage (in GB) provisioned in all Web (e.g. Tomcat) and App servers (e.g. WebSpear, WebLogic, JBoss) application is deployed in Production ",
        "input_type": "radio",
        "is_question_numeric": true,
        "mandatory": false,
        "options": [],
        "question_column": 3,
        "checked": false,
        "question_id": 24,
        "row_span": 1,
        "title": "Enter Cores, RAM and Storage details of each server separately"
      });
      this.masterappData.forEach(appData => {
        if (appData && appData.length>0) {
          appData.forEach(field => {
            if (field && field.form_control_name == 'application_id'
             || field && field.form_control_name == 'application_name'
             || field && field.form_control_name == 'application_location'
             || field && field.form_control_name == 'application_description'
             || field && field.form_control_name == 'application_architecture_diagram'
             || field && field.form_control_name == 'app_technical_stack'
             || field && field.form_control_name == 'business_criticality'
             || field && field.form_control_name == 'application_roadmap'
             || field && field.form_control_name == 'application_cutover'
             || field && field.form_control_name == 'application_maintenance_window'
             ) {
              this.appDetailsFields.push(field);
            } else if (field && field.form_control_name == 'platform_change'
            || field && field.form_control_name == 'performance_scalability'
            || field && field.form_control_name == 'security_requirement'
            || field && field.form_control_name == 'app_integration_protocol'
            || field && field.form_control_name == 'integration_points'
            || field && field.form_control_name == 'database_details'
            || field && field.form_control_name == 'app_databases'
            ) {
             this.modernRequirementsFields.push(field);
           } else if (field && field.form_control_name == 'uat_duration'
           || field && field.form_control_name == 'warranty_duration'
           || field && field.form_control_name == 'additional_requirements'
           ) {
            this.otherRequirementsFields.push(field);
          } else if (field && field.form_control_name == 'server_count'
          || field && field.form_control_name == 'servers_core'
          || field && field.form_control_name == 'servers_ram'
          || field && field.form_control_name == 'servers_storage'
          ) {
           this.webServerFields.push(field);
            } else if (field && field.form_control_name == 'document_artifacts'
            || field && field.form_control_name == 'dev_env_synced'
            || field && field.form_control_name == 'cicd_pipeline'
            || field && field.form_control_name == 'testing'
            || field && field.form_control_name == 'testcases_documented'
            || field && field.form_control_name == 'testcases_automated'
            ) {
              this.docStatusFields.push(field);
            }
          });
        }
      });
      let appDetailsTemp = [];
      appDetailsTemp.push(this.appDetailsFields.find(x => x.form_control_name == 'application_id'));
      appDetailsTemp.push(this.appDetailsFields.find(x => x.form_control_name == 'application_name'));
      appDetailsTemp.push(this.appDetailsFields.find(x => x.form_control_name == 'application_location'));
      appDetailsTemp.push(this.appDetailsFields.find(x => x.form_control_name == 'application_description'));
      appDetailsTemp.push(this.appDetailsFields.find(x => x.form_control_name == 'application_architecture_diagram'));
      appDetailsTemp.push(this.appDetailsFields.find(x => x.form_control_name == 'app_technical_stack'));
      appDetailsTemp.push(this.appDetailsFields.find(x => x.form_control_name == 'business_criticality'));
      appDetailsTemp.push(this.appDetailsFields.find(x => x.form_control_name == 'application_roadmap'));
      appDetailsTemp.push(this.appDetailsFields.find(x => x.form_control_name == 'application_cutover'));
      appDetailsTemp.push(this.appDetailsFields.find(x => x.form_control_name == 'application_maintenance_window'));
      this.appDetailsFields = [];
      this.appDetailsFields = appDetailsTemp;

      let modernRequirementsFieldsTemp = [];
      modernRequirementsFieldsTemp.push(this.modernRequirementsFields.find(x => x.form_control_name == 'platform_change'));
      modernRequirementsFieldsTemp.push(this.modernRequirementsFields.find(x => x.form_control_name == 'performance_scalability'));
      modernRequirementsFieldsTemp.push(this.modernRequirementsFields.find(x => x.form_control_name == 'security_requirement'));
      modernRequirementsFieldsTemp.push(this.modernRequirementsFields.find(x => x.form_control_name == 'app_integration_protocol'));
      modernRequirementsFieldsTemp.push(this.modernRequirementsFields.find(x => x.form_control_name == 'integration_points'));
      modernRequirementsFieldsTemp.push(this.modernRequirementsFields.find(x => x.form_control_name == 'database_details'));
      modernRequirementsFieldsTemp.push(this.modernRequirementsFields.find(x => x.form_control_name == 'app_databases'));
      this.modernRequirementsFields = [];
      this.modernRequirementsFields = modernRequirementsFieldsTemp;

      let otherRequirementsFieldsTemp = [];
      otherRequirementsFieldsTemp.push(this.otherRequirementsFields.find(x => x.form_control_name == 'uat_duration'));
      otherRequirementsFieldsTemp.push(this.otherRequirementsFields.find(x => x.form_control_name == 'warranty_duration'));
      otherRequirementsFieldsTemp.push(this.otherRequirementsFields.find(x => x.form_control_name == 'additional_requirements'));
      this.otherRequirementsFields = [];
      this.otherRequirementsFields = otherRequirementsFieldsTemp;

      let webServerFieldsTemp = [];
      webServerFieldsTemp.push(this.webServerFields.find(x => x.form_control_name == 'all_servers'));
      webServerFieldsTemp.push(this.webServerFields.find(x => x.form_control_name == 'server_separately'));
      webServerFieldsTemp.push(this.webServerFields.find(x => x.form_control_name == 'server_count'));
      webServerFieldsTemp.push(this.webServerFields.find(x => x.form_control_name == 'servers_core'));
      webServerFieldsTemp.push(this.webServerFields.find(x => x.form_control_name == 'servers_ram'));
      webServerFieldsTemp.push(this.webServerFields.find(x => x.form_control_name == 'servers_storage'));
      this.webServerFields = [];
      this.webServerFields = webServerFieldsTemp;

      let docStatusFieldsTemp = [];
      docStatusFieldsTemp.push(this.docStatusFields.find(x => x.form_control_name == 'document_artifacts'));
      docStatusFieldsTemp.push(this.docStatusFields.find(x => x.form_control_name == 'dev_env_synced'));
      docStatusFieldsTemp.push(this.docStatusFields.find(x => x.form_control_name == 'cicd_pipeline'));
      docStatusFieldsTemp.push(this.docStatusFields.find(x => x.form_control_name == 'testing'));
      docStatusFieldsTemp.push(this.docStatusFields.find(x => x.form_control_name == 'testcases_documented'));
      docStatusFieldsTemp.push(this.docStatusFields.find(x => x.form_control_name == 'testcases_automated'));
      this.docStatusFields = [];
      this.docStatusFields = docStatusFieldsTemp;
    }
  }

  getControlValue(key){
    return this.appAssessmentQuestionnaireForm.get(key).value;
  }

  isControlInValid(key){
    return this.appAssessmentQuestionnaireForm.get(key).invalid && this.appAssessmentQuestionnaireForm.get(key).dirty;

  }
  getValidatorsForControls(control){
    let validators:any[] = [];
    if(control.mandatory){
      validators.push(Validators.required);
    }
    if(control.is_question_numeric){
        validators.push(Validators.pattern(this.regexp_number));
        if(control.form_control_name == 'testing'){
          validators.push(MinNumberValidator.range(0,9999));
        }
        else if (control.form_control_name == 'integration_points' || control.form_control_name == 'server_count' || control.form_control_name == 'app_databases'){
          validators.push(MinNumberValidator.range(0,99));
        }
        else if (control.form_control_name == 'testcases_documented' || control.form_control_name == 'testcases_automated'){
          validators.push(MinNumberValidator.range(0,100));
        }

    }

    return validators;
  }

  clearValues(controls){

    for (let i in this.masterappData){
      let appData = this.masterappData[i];
      for(let j in appData){
        if (appData[j].form_control_name != 'application_id' && appData[j].form_control_name != 'application_name'){
          this.appAssessmentQuestionnaireForm.get(appData[j].form_control_name).reset();
        }
      }
    }
    this.application_architecture_diagram_text = '';

    for (let k in this.dropdown_others_values){
        this.dropdown_others_values[k] = false;
    }
    Object.keys(this.dropdown_others_values).forEach(key => {
      if(key.includes("_others")){
        this.appAssessmentQuestionnaireForm.get(key).reset();
      }
    });
  }

  getAppDetails(){
    //this.spinner.show();
    let reqObj = {'appId':this.appDetails['appId'],'appName':this.appDetails['appName']};
    this.spinner.show();
    this.databaseListService.getAppAssessmentetails(reqObj).subscribe(response => {

      if (response.length > 0){
        let appData = response[0];
        // let serverCountValueFromDB = appData['server_count'];
        this.formStatus = appData['questionnaire_status'];
        Object.keys(appData).forEach(key => {
          if (key != 'application_architecture_diagram' && key != 'application_id' && key != 'application_name' && key!='questionnaire_status' && this.appAssessmentQuestionnaireForm.get(key)){

            this.appAssessmentQuestionnaireForm.get(key).patchValue(appData[key]);
            // if(this.getControlValue('server_count')==serverCountValueFromDB){

            // }
            // else{
            //   if (key != 'application_architecture_diagram' && key != 'application_id' && key != 'application_name' && key!='questionnaire_status' && key!='server_count'){
            //     this.appAssessmentQuestionnaireForm.get(key).patchValue(appData[key]);
            //   }
            // }
          }
          if (key.indexOf('_others')){
            if (appData[key]){
              this.dropdown_others_values[key] = true;
            }
          }
          if (key == 'application_architecture_diagram'){
            this.application_architecture_diagram_text = appData[key];
            //this.appAssessmentQuestionnaireForm.get(key).patchValue(appData[key]);
            this.showUploadedArchitectureText = true;
          }
        });


      }
      this.isDataAvailable = true;
      this.spinner.hide();
    });

  }

  setControlValue(data){

  }

  clear(){
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {msg : 'Are you sure you want to clear the entered details?', title : 'Confirmation',okButtonLabel : 'Ok',cancelButtonLabel:'Cancel'};
    modalRef.result.then((result) => {
      if ( result === 'ok') {
        this.clearValues(this.masterappData);

        //this.getAppDetails();
      }
    });
    this.errorInValidForm = false;
    this.isServerValuesreadOnly = false;
  }

  openAlert(msg,lgPopup=true){
    let modalRef;
    if(lgPopup){
      modalRef = this.modalService.open(DmapAlertDialogModal, {size: 'lg', scrollable: true});
    }
    else{
      modalRef = this.modalService.open(DmapAlertDialogModal);
    }

    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

  validateFormControls(controls){
    let isValid = true;
    for (let i in this.masterappData){
      let appData = this.masterappData[i];
      for(let j in appData){
      if(this.appAssessmentQuestionnaireForm.get(appData[j].form_control_name).invalid){
        this.appAssessmentQuestionnaireForm.get(appData[j].form_control_name).markAsTouched();
        this.appAssessmentQuestionnaireForm.get(appData[j].form_control_name).markAsDirty();
        isValid = false
      }
    }
  }
    return isValid;
  }

  submitForm(action){
    this.spinner.show();
    let isFormValid = true;
    if(action == 'submit'){
      if(!this.appAssessmentQuestionnaireForm.valid){
        this.getFormValidationErrors()
        this.spinner.hide();
        this.errorInValidForm = true;
        return;
      }
    }else if(action == 'save'){
      isFormValid = true;
    }

    if(isFormValid){
      if (this.fileToUpload_architecture != null){
        let appId = this.appAssessmentQuestionnaireForm.get('application_id');
        this.databaseListService.postArchitectureFile(appId,this.fileToUpload_architecture).subscribe(response => {
        if(response){
          this.submit(action);
        }else{
          this.openAlert("Failed to upload the file");
        }
        }, error => {
        });
      }
      else{
        this.submit(action);
      }
    }
    this.spinner.hide();
  }

  async submit(action){
    let reqObj = {'appId':this.getControlValue('application_id'),'appName':this.getControlValue('application_name')};
    let res = await this.databaseListService.getApplicationServerDetails(reqObj).toPromise();
    if (!this.disableServerDetails && action == 'submit' && res.length != this.getControlValue('server_count')) {
      this.openAlert(`You have entered details for ${res.length} servers. Please enter details for remaining ${this.getControlValue('server_count') - res.length} servers before submitting the form`);
      return;
    }
    this.spinner.show();
    let req_obj:any = {};
    delete this.appAssessmentQuestionnaireForm.value['all_servers'];
    delete this.appAssessmentQuestionnaireForm.value['server_separately'];
    req_obj = this.appAssessmentQuestionnaireForm.value;
    console.log(req_obj);
    req_obj['action'] = action;

    if (this.application_architecture_diagram_text != null && this.application_architecture_diagram_text != ''){
      req_obj['application_architecture_diagram'] = this.application_architecture_diagram_text;
    }
    else{
      req_obj['application_architecture_diagram'] = '';
    }
    this.databaseListService.submitAppAssessmentetails(req_obj).subscribe(response=>{

      if(response.status){
        this.formStatus = response['questionnaire_status'];
        this.getAppDetails();
        this.spinner.hide();
        this.errorInValidForm = false;
        if(action == 'save'){
          this.openAlert("Application assessment details saved successfully.",false);
        }else{
          this.openAlert("Application assessment details submitted successfully.",false);
        }

      }else{
        this.openAlert(response.message);
      }

    });

  }

  getFormValidationErrors() {
    let labels={
    application_location: 'Application Location',
    application_description: 'Application Description & Special Considerations',
    business_criticality: 'Business Criticality',
    platform_change: 'Change of Platform',
    performance_scalability: 'Performance Scalability',
    security_requirement: 'Security Requirement',
    application_roadmap: 'Application Roadmap',
    application_cutover: 'Application Cutover',
    application_maintenance_window: 'Application Maintenance Window',
    app_integration_protocol: 'Application Integration Protocol',
    integration_points: 'Integration Points',
    testing: 'Number of Test Cases',
    database_details: 'Database Details',
    app_databases: 'Number of Databases',
    app_technical_stack: 'Application Technical Stack',
    document_artifacts: 'Documentation',
    cicd_pipeline: 'CICD pipeline',
    server_count: 'Server Count',
    servers_core: 'Number of Core in all Servers',
    servers_ram: 'RAM in all Servers',
    servers_storage: 'Storage in all Servers',
    testcases_documented: 'Percentage of Test Cases Documented',
    testcases_automated: 'Percentage of Test Cases Automated',
    dev_env_synced: 'Is Dev environment code in sync with production codebase',
    uat_duration: 'UAT Duration',
    warranty_duration: 'Warranty Duration'
    }
    let unfilled_fields = []

    Object.keys(this.appAssessmentQuestionnaireForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.appAssessmentQuestionnaireForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
         console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          if(keyError== 'required')
            unfilled_fields.push(labels[key])
        });
      }
    });
    let message = "Please fill the below required(*) fields before submitting:<br> "
    if(unfilled_fields.length>0){
      for (let i = 0; i < unfilled_fields.length; i++) {
        message = message+'- '+unfilled_fields[i] + '<br>'
      }

      this.openAlert(message)

    }


  }


  onItemSelect(item: any,key) {
    if (item == 'Others'){
      this.dropdown_others_values[key+'_others'] = !this.dropdown_others_values[key+'_others'];
    }
  }



  onSelectAll(items: any,key) {
    if (items.includes('Others')){
      this.dropdown_others_values[key+'_others'] = true;
    }
  }
  onDeSelectAll(items: any,key) {
    this.dropdown_others_values[key+'_others'] = false;
  }
  handleFileInput(files: FileList) {
    this.showUploadedArchitectureText = true;
    this.fileToUpload_architecture = files.item(0);
    this.application_architecture_diagram_text = this.fileToUpload_architecture.name;
  }

  serverCount(){
    let appServerDetails;
    let currentServerDetailsCount;
    let server_count = this.getControlValue('server_count');
    if (!server_count || server_count == 0) {
      this.openAlert("Please enter valid server count before continuing to add details for each server.");
      return;
    }
    this.spinner.show();
    let reqObj = {'appId':this.getControlValue('application_id'),'appName':this.getControlValue('application_name')};
    this.databaseListService.getApplicationServerDetails(reqObj).subscribe(response => {
      if (response.length > 0){
        appServerDetails = response;
        currentServerDetailsCount = response.length

      }
      const modalRef = this.modalService.open(AppServerDetailsComponent, {size: 'lg', scrollable: true});
      modalRef.componentInstance.data = {'title':'Enter Infra Structure Details','server_count':server_count,'appServerDetails':appServerDetails,'currentServerDetailsCount':currentServerDetailsCount};
      modalRef.result.then((result) => {
        if(result > 0){
          this.isServerValuesreadOnly = true;
        }
        else{
          if (this.disableServerDetails) {
            this.isServerValuesreadOnly = false;
          } else {
            this.appAssessmentQuestionnaireForm.get('servers_core').patchValue(0);
            this.appAssessmentQuestionnaireForm.get('servers_ram').patchValue(0);
            this.appAssessmentQuestionnaireForm.get('servers_storage').patchValue(0);
            this.isServerValuesreadOnly = true;
          }
        }
        // this.getAppDetails();
        let obj = {'appName':this.getControlValue('application_name')};
        this.databaseListService.getServerRequiredValuesByApplication(obj).subscribe(response => {

          if (response.length > 0){
            let appData = response[0];
            let serverCountValue = appData['server_count'];
            console.log(serverCountValue,'serverCountValue');
            Object.keys(appData).forEach(key => {
              if (key == 'servers_core' || key == 'servers_ram' || key == 'servers_storage'){

                this.appAssessmentQuestionnaireForm.get(key).patchValue(appData[key] ? appData[key] : 0);
                console.log(appData[key],'appData[key]')
              }
            });
          }
        });

      });
      // modalRef.componentInstance.updatedValues.subscribe(
      // );
      this.spinner.hide();
      });



  }

  opneUploadModal() {


    const appId = this.appAssessmentQuestionnaireForm.get('application_id').value;
    const appName = this.appAssessmentQuestionnaireForm.get('application_name').value;

    const modalRef = this.modalService.open(FileUploadModalComponent, {
      size: 'lg',
      scrollable: true,
    });

    modalRef.componentInstance.data = {
      appId: appId,
      appName: appName,
      fileType: 'appIntakeExcel',
      sampleFile: '/assets/sampleTemplates/AppIntakeExcel.xlsx',
      isSampleFileShow: true,
      message:
        'Please click the icon to browse or drag & drop excel file to upload multiple schemas at once.',
    };

    modalRef.result.then((result) => {
      if (result == 'ok') {
        this.getAppDetails();
        this.openAlert('File uploaded successfully.', true);
      } else {
        if (result != 'cancel')
          this.openAlert('Something went wrong. Please try again.');
      }
    });
  }
}
