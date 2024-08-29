import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbdConfirmationModal } from 'src/app/common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { FileUploadModalComponent } from 'src/app/common/Modal/file-upload-modal/file-upload-modal.component';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
import { QuestionaireService } from 'src/app/common/Services/questionaire.service';
declare var $: any;
import 'jqueryui';
import { PopupDraggableService } from 'src/app/common/Services/popup-draggable.service';

@Component({
  selector: 'app-database-questionnaire',
  templateUrl: './database-questionnaire.component.html',
  styleUrls: ['./database-questionnaire.component.css']
})
export class DatabaseQuestionnaireComponent implements OnInit {

isDbDetailClicked = true;

dbDetails:any;
dbQuestionnaireForm: FormGroup;
analyticsStatus: any;
dbStatus: any;
dbDetailData:any;

dbDetailsControls:any;
dbCommonDetailConrols: any[];
dbOwnerDetailConrols: any[];
dbHardwareDetailConrols: any[];
dbEnvDetailConrols: any[];
dboracleLicenseDetailConrols: any[];

fnDetailsControls:any;
fnAppRelatedDailConrols:any[] = []
fnOracleTechDetailConrols:any[] = []
fnOracleSecurityDetailConrols:any[] = []
fnHrDrMigDetailConrols:any[] = []

errorInValidForm:boolean= false;
formStatus: any = '';

constructor(private activatedroute:ActivatedRoute,
            private formBuilder: FormBuilder,
            private modalService: NgbModal,
            private spinner: NgxSpinnerService,
            private databaseListService: DatabaseListService,
            private _PopupDraggableService: PopupDraggableService,
            private questionaireService:QuestionaireService) {}

ngOnInit() {
  this._PopupDraggableService.enableDraggablePopup();
  this.dbQuestionnaireForm = this.formBuilder.group({});

  this.dbDetailsControls = this.questionaireService.getDBFields();

  this.dbCommonDetailConrols = this.dbDetailsControls.DBCommonDetails;
  this.dbOwnerDetailConrols = this.dbDetailsControls.DBDetails[0].controls;
  this.dbHardwareDetailConrols = this.dbDetailsControls.DBDetails[1].controls;
  this.dbEnvDetailConrols = this.dbDetailsControls.DBDetails[2].controls;
  this.dboracleLicenseDetailConrols = this.dbDetailsControls.DBDetails[3].controls;
  
  this.fnDetailsControls = this.questionaireService.getfunctionalDetails();
  
  this.fnAppRelatedDailConrols = this.fnDetailsControls.FNDetail[0].controls;
  this.fnOracleTechDetailConrols = this.fnDetailsControls.FNDetail[1].controls;
  this.fnOracleSecurityDetailConrols = this.fnDetailsControls.FNDetail[2].controls;
  this.fnHrDrMigDetailConrols = this.fnDetailsControls.FNDetail[3].controls; 

  this.createFormControls();  

  this.activatedroute.queryParams.subscribe(queryParams => {
    this.dbDetails=queryParams;
    this.dbQuestionnaireForm.get('db_name').patchValue(this.dbDetails['dbName']);
    this.getDatabaseDetails()
  });
  
  this.dbQuestionnaireForm.valueChanges.subscribe(newVal => console.log(newVal));
  
}

createFormControls(){

  for(let i of this.dbCommonDetailConrols){
    this.dbQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
  }

  for(let i of this.dbOwnerDetailConrols){
    this.dbQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
  }
  
  for(let i of this.dbHardwareDetailConrols){
    this.dbQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
  }
  
  for(let i of this.dbEnvDetailConrols){
    this.dbQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
  }
  
  for(let i of this.dboracleLicenseDetailConrols){
    this.dbQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
  }

  for(let i of this.fnAppRelatedDailConrols){
    this.dbQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
  }

  for(let i of this.fnOracleTechDetailConrols){
    this.dbQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
  }
  
  for(let i of this.fnOracleSecurityDetailConrols){
    this.dbQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
  }
  
  for(let i of this.fnHrDrMigDetailConrols){
    this.dbQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
  }
}

getValidatorsForControls(control){ return this.questionaireService.getValidatorsForControls(control);}

patchControls(dbDetailsData, controls){
  for(let i of controls){
    if(i.type == 'select' && (dbDetailsData[i.key] == null || dbDetailsData[i.key].length <= 0)){
      this.dbQuestionnaireForm.get(i.key).patchValue(i.ui_control.options[0]);
    }else{
      this.dbQuestionnaireForm.get(i.key).patchValue(dbDetailsData[i.key]);
    }
  }
}

getDatabaseDetails(){
  this.spinner.show();
  this.databaseListService.getDbDetails({'db_name': this.dbDetails['dbName']}).subscribe(response => {
    this.analyticsStatus = response.analytics_status;
    this.formStatus = response.form_status;
    
    let dbDetailsData = response.data;
    dbDetailsData['db_name'] = this.dbDetails['dbName'] //temp fix until this value comes from backend

    // Object.keys(this.dbQuestionnaireForm.controls).forEach(key => {
    //   this.dbQuestionnaireForm.get(key).patchValue(dbDetailData[key]);
    // });
    
    this.patchControls(dbDetailsData, this.dbCommonDetailConrols);
    this.patchControls(dbDetailsData, this.dbOwnerDetailConrols);
    this.patchControls(dbDetailsData, this.dbHardwareDetailConrols);
    this.patchControls(dbDetailsData, this.dbEnvDetailConrols);
    this.patchControls(dbDetailsData, this.dboracleLicenseDetailConrols);
    
    this.patchControls(dbDetailsData, this.fnAppRelatedDailConrols);
    this.patchControls(dbDetailsData, this.fnOracleTechDetailConrols);
    this.patchControls(dbDetailsData, this.fnOracleSecurityDetailConrols);
    this.patchControls(dbDetailsData, this.fnHrDrMigDetailConrols);
    
    /*Open the first tab on the screen */
    setTimeout(() => { 
      $('a#nav-dbOwner_detail-tab').click();
      $('a#nav-dbOwner_detail-tab').tab('show');
    }, 50);

    /**Disable the fields if analytics_status = false */
    if (!response.analytics_status){
      this.disableControls();
    }
    this.spinner.hide();
  });
} 

disableControls(){
  Object.keys(this.dbQuestionnaireForm.controls).forEach(key => {
    this.dbQuestionnaireForm.get(key).disable();
  });
}

clearValues(controls){
  for(let i of controls){
    if(!i.ui_control.readOnly){
      this.dbQuestionnaireForm.get(i.key).reset();
    }
  }
}

clear(){
  const modalRef = this.modalService.open(NgbdConfirmationModal);
  modalRef.componentInstance.data = {msg : 'Are you sure you want to clear the entered details?', title : 'Confirmation',okButtonLabel : 'Ok',cancelButtonLabel:'Cancel'};
  modalRef.result.then((result) => {
    if ( result === 'ok') {
      this.clearValues(this.dbCommonDetailConrols);
      this.clearValues(this.dbOwnerDetailConrols);
      this.clearValues(this.dbHardwareDetailConrols);
      this.clearValues(this.dbEnvDetailConrols);
      this.clearValues(this.dboracleLicenseDetailConrols);

      this.clearValues(this.fnAppRelatedDailConrols);
      this.clearValues(this.fnOracleTechDetailConrols);
      this.clearValues(this.fnOracleSecurityDetailConrols);
      this.clearValues(this.fnHrDrMigDetailConrols);

      this.getDatabaseDetails();
    }
  });
}

submit(action){
  this.spinner.show();

  let req_obj:any = {};
  let isFormValid = true;

  if(action == 'submit'){
    isFormValid = this.validateForm();
  }else if(action == 'save'){
    isFormValid = true;
  }
  
  if(isFormValid){    
    req_obj = this.dbQuestionnaireForm.value;
    req_obj['action'] = action;
    console.log(req_obj)
    
    this.databaseListService.uploadDbDetails(req_obj).subscribe(response=>{
      this.formStatus = response.questionnaire_status;
      this.spinner.hide();
      if(response.status == 'success'){
        this.errorInValidForm = false;
        if(action == 'save'){
          this.openAlert("Database details saved successfully.");
        }else{
          this.openAlert("Database details submitted successfully.");
        }
          
      }else{
        this.openAlert(response.message);
      }

    });
  }else{
    this.spinner.hide();
  }
}

validateFormControls(controls){
  let isValid = true;
  for(let i of controls){
    if(this.dbQuestionnaireForm.get(i.key).invalid){   
      this.dbQuestionnaireForm.get(i.key).markAsTouched();
      this.dbQuestionnaireForm.get(i.key).markAsDirty();
      isValid = false
    }
  }
  return isValid;
}

validateForm(){
  let isDbCommonDetailValid = true;
  let isDbOwnerDetailValid = true;
  let isDbHardwareDetailValid = true;
  let isDbEnvDetailValid = true;
  let isDboracleLicenseDetailValid = true; 
  
  let isFnAppRelatedDailValid = true;
  let isFnOracleTechDetailValid = true;
  let isFnOracleSecurityDetailValid = true;
  let isFnHrDrMigDetailValid = true;

  isDbCommonDetailValid = this.validateFormControls(this.dbCommonDetailConrols);
  isDbOwnerDetailValid = this.validateFormControls(this.dbOwnerDetailConrols);
  isDbHardwareDetailValid = this.validateFormControls(this.dbHardwareDetailConrols);
  isDbEnvDetailValid = this.validateFormControls(this.dbEnvDetailConrols);
  isDboracleLicenseDetailValid = this.validateFormControls(this.dboracleLicenseDetailConrols);
  
  isFnAppRelatedDailValid = this.validateFormControls(this.fnAppRelatedDailConrols);
  isFnOracleTechDetailValid = this.validateFormControls(this.fnOracleTechDetailConrols);
  isFnOracleSecurityDetailValid = this.validateFormControls(this.fnOracleSecurityDetailConrols);
  isFnHrDrMigDetailValid = this.validateFormControls(this.fnHrDrMigDetailConrols);

  console.log("isDbCommonDetailValid=" + isDbCommonDetailValid)
  console.log("isDbOwnerDetailValid=" + isDbOwnerDetailValid)
  console.log("isDbHardwareDetailValid=" + isDbHardwareDetailValid)
  console.log("isDbEnvDetailValid=" + isDbEnvDetailValid)
  console.log("isDboracleLicenseDetailValid=" + isDboracleLicenseDetailValid)
  if(!isDbCommonDetailValid || !isDbOwnerDetailValid || !isDbHardwareDetailValid || !isDbEnvDetailValid || !isDboracleLicenseDetailValid 
     || !isFnAppRelatedDailValid || !isFnOracleTechDetailValid || !isFnOracleSecurityDetailValid || !isFnHrDrMigDetailValid) {
    this.errorInValidForm = true;
    return false
  }
  else{
    this.errorInValidForm = false;
    return true;
  }
  
}

openAlert(msg){
  const modalRef = this.modalService.open(DmapAlertDialogModal);
  modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
  modalRef.result.then((result) => {
    // if ( result === 'ok') {
    // }
  });
}

openDatabaseUploadModal(){
  let fileType = '';
  let sampleFile = '';
  let msg = '';
  fileType = 'dbMigrationQuestionnaire'
  sampleFile = '/assets/sampleTemplates/Database_Migration_Questionnaire.xlsx'
  msg = 'Please click the icon to browse or drag & drop excel file to upload database questionnaire.'

  const modalRef = this.modalService.open(FileUploadModalComponent, {size: 'lg', scrollable: true});

  modalRef.componentInstance.data = {'fileType':fileType, 'sampleFile': sampleFile, 'isSampleFileShow':true,"message": msg,'dbName':this.dbDetails['dbName']}; 

  modalRef.result.then((result) => {
    
      if ( result == 'ok') {
        this.openAlert('File uploaded successfully.');
        this.getDatabaseDetails();
    } else {
      if(result != 'cancel') this.openAlert('Something went wrong. Please try again.');
    }
  });
}

toggleSideBar(sideItem){
  if(sideItem == 'dbDetail'){
    this.isDbDetailClicked = true;
  }else{
    this.isDbDetailClicked = false;
  }

}
}
