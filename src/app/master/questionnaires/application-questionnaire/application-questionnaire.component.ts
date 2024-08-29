import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
// import { isNumeric } from 'rxjs/internal/util/isNumeric';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbdConfirmationModal } from 'src/app/common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { FileUploadModalComponent } from 'src/app/common/Modal/file-upload-modal/file-upload-modal.component';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
import { QuestionaireService } from 'src/app/common/Services/questionaire.service';
import { MinNumberValidator } from 'src/app/common/Validators/min-number-validator';
declare var $: any;
import 'jqueryui';
import { PopupDraggableService } from 'src/app/common/Services/popup-draggable.service';

@Component({
  selector: 'app-application-questionnaire',
  templateUrl: './application-questionnaire.component.html',
  styleUrls: ['./application-questionnaire.component.css']
})
export class ApplicationQuestionnaireComponent implements OnInit {
  appQuestionnaireForm: FormGroup;
  appStatus:any;
  analyticsStatus: any;
  formStatus: any = '';
  currencySymbol:string;
  allowFormToEdit: boolean;
  errorInValidForm:boolean= false;

  appDetails:any;
  appDetailData:any;
  appCommonConrols:any[] = [];
  appOwnerDetail: any[];
  appTechDetails: any[];
  appFunctionalDetails: any[];
  application_architecture_diagram_file: any;
  application_deployment_diagram_file: any;


  constructor(private activatedroute:ActivatedRoute,
              private spinner: NgxSpinnerService,
              private modalService: NgbModal,
              private databaseListService: DatabaseListService,
              private formBuilder: FormBuilder,
              private _PopupDraggableService: PopupDraggableService,
              private questionaireService:QuestionaireService ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.appQuestionnaireForm = this.formBuilder.group({});

      this.appDetailData = this.questionaireService.getAppDetails();

      this.appCommonConrols = this.appDetailData.appDetails[0].controls;
      this.appOwnerDetail = this.appDetailData.appDetails[1].controls;
      this.appTechDetails = this.appDetailData.appDetails[2].controls;
      this.appFunctionalDetails = this.appDetailData.appDetails[3].controls;

      this.createFormControls();
      
    this.activatedroute.queryParams.subscribe(queryParams => {
      this.appDetails=queryParams;
      this.appQuestionnaireForm.get('application_id').patchValue(this.appDetails['appId']);
    });

      this.getAppDetails();
      //console.log(this.appQuestionnaireForm);
  }
  

  createFormControls(){
    for(let i of this.appCommonConrols){
      this.appQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
    }
    for(let i of this.appOwnerDetail){
      this.appQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
    }
    for(let i of this.appTechDetails){
      this.appQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
    }
    for(let i of this.appFunctionalDetails){
      this.appQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
    }
  }
  

  getAppDetails(){
    this.spinner.show();    
    let reqObj = {'appId':this.appDetails['appId']}

    this.databaseListService.getAPPQuestionnaireDetails(reqObj).subscribe(response => {
      console.log(response)
      this.analyticsStatus = response[0].run_analytics_allowed;
      this.allowFormToEdit = response[0].run_analytics_allowed;
      this.formStatus = response[0].questionnaire_status;
      let appData = response[0];
      appData.application_id = this.appDetails['appId'];
    
      this.patchControls(appData, this.appCommonConrols);
      this.patchControls(appData, this.appOwnerDetail);
      this.patchControls(appData, this.appTechDetails);
      this.patchControls(appData, this.appFunctionalDetails);

      
      /*Open the first tab on the screen */
      setTimeout(() => { 
        $('a#nav-appOwner_detail-tab').click();
        $('a#nav-appOwner_detail-tab').tab('show');
      }, 50);
      this.spinner.hide();
    });
  }
  
  getValidatorsForControls(control){ return this.questionaireService.getValidatorsForControls(control);}

  patchControls(appDataControls, controls){
    for(let i of controls){
      if(i.type == 'select' && (appDataControls[i.key] == null || appDataControls[i.key].length <= 0)){
        this.appQuestionnaireForm.get(i.key).patchValue(i.ui_control.options[0]);
      }else{
        this.appQuestionnaireForm.get(i.key).patchValue(appDataControls[i.key]);
      }
    }
  }

  clearValues(controls){
    for(let i of controls){
      if(!i.ui_control.readOnly){
        this.appQuestionnaireForm.get(i.key).reset();
      }
    }
  }

  clear(){
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {msg : 'Are you sure you want to clear the entered details?', title : 'Confirmation',okButtonLabel : 'Ok',cancelButtonLabel:'Cancel'};
    modalRef.result.then((result) => {
      if ( result === 'ok') {
        this.clearValues(this.appCommonConrols);
        this.clearValues(this.appOwnerDetail);
        this.clearValues(this.appTechDetails);
        this.clearValues(this.appFunctionalDetails);
  
        this.getAppDetails();
      }
    });
  }

  disableControls(){
    Object.keys(this.appQuestionnaireForm.controls).forEach(key => {
      this.appQuestionnaireForm.get(key).disable();
    });
  }

  validateFormControls(controls){
    let isValid = true;
    for(let i of controls){
      if(this.appQuestionnaireForm.get(i.key).invalid){   
        this.appQuestionnaireForm.get(i.key).markAsTouched();
        this.appQuestionnaireForm.get(i.key).markAsDirty();
        isValid = false
      }
    }
    return isValid;
  }

  validateForm(){
    let isAppCommonValid = true;
    let isAppoOwnerDetailValid = true;
    let isAppTechDetailslValid = true;
    let isAFuncDetailsValid = true;
  
    isAppCommonValid = this.validateFormControls(this.appCommonConrols);
    isAppoOwnerDetailValid = this.validateFormControls(this.appOwnerDetail);
    isAppTechDetailslValid = this.validateFormControls(this.appTechDetails);
    isAFuncDetailsValid = this.validateFormControls(this.appFunctionalDetails);
  
    console.log("isAppCommonValid=" + isAppCommonValid)
    console.log("isAppoOwnerDetailValid=" + isAppoOwnerDetailValid)
    console.log("isAppTechDetailslValid=" + isAppTechDetailslValid)
    console.log("isAFuncDetailsValid=" + isAFuncDetailsValid)
    
    if(!isAppCommonValid || !isAppoOwnerDetailValid || !isAppTechDetailslValid || !isAFuncDetailsValid ) {
      this.errorInValidForm = true;
      return false
    }
    else{
      this.errorInValidForm = false;
      return true;
    }    
  }

  setControlValue(data){
    console.log('data')
    console.log(data)
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
      req_obj = this.appQuestionnaireForm.value;
      req_obj['appDetailsAction'] = action;
      console.log(req_obj)

      if(this.application_architecture_diagram_file == null){
        req_obj.application_architecture_diagram = ''
      }
      if(this.application_deployment_diagram_file == null){
        req_obj.application_deployment_diagram = ''
      }
      
      if (this.application_architecture_diagram_file != null || this.application_deployment_diagram_file != null){
        this.databaseListService.postFile(this.appDetails['appId'],this.application_architecture_diagram_file,this.application_deployment_diagram_file).subscribe(response => {
         
          if(response){ //if response is success
            this.submitForm(req_obj, action);
          }else{            
            this.spinner.hide();
            this.openAlert("Failed to upload the file");
            
          }
        }, error => {
        });
      }
      this.submitForm(req_obj, action)
      
      
    }else{
      this.spinner.hide();
    }
  }

  submitForm(req_obj, action){
    
    this.databaseListService.setAPPQuestionnaireDetails(req_obj).subscribe(response=>{
      this.formStatus = response.questionnaire_status;
      this.spinner.hide();
      if(response.status){
        this.errorInValidForm = false;
        if(action == 'save'){
          this.openAlert("Application details saved successfully.");
        }else{
          this.openAlert("Application details submitted successfully.");
        }
          
      }else{
        this.openAlert(response.message);
      }  
    });
  }
  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

  opneUploadModal(type){
    let message;
    if (type == 'architecture'){
      message = "Please click the icon to browse or drag & drop Architecture/dependency diagram for the application.";
    }else{
      message = "Please click the icon to browse or drag & drop Application Deployment and Network Topology diagram for the application.";
    }
    
    const modalRef = this.modalService.open(FileUploadModalComponent, {size: 'lg', scrollable: true});

    modalRef.componentInstance.data = {'fileType':'masterSchemaUpload', 'sampleFile':'/assets/sampleTemplates/sourceSchemaDetails.xlsx', 'isSampleFileShow':false,"message":message}; 

    modalRef.result.then((result) => {
     
        if ( result == 'ok') {
          this.openAlert('File uploaded successfully.');
      } else {
        if(result != 'cancel') this.openAlert('Something went wrong. Please try again.');
      }
    });
  }
  openApplicationUploadModal(){
    let fileType = '';
    let sampleFile = '';
    let msg = '';
    fileType = 'applicationQuestionnaire'
    sampleFile = '/assets/sampleTemplates/Application_Questionnaire.xlsx'
    msg = 'Please click the icon to browse or drag & drop excel file to upload application questionnaire.'
  
    const modalRef = this.modalService.open(FileUploadModalComponent, {size: 'lg', scrollable: true});

    modalRef.componentInstance.data = {'fileType':fileType, 'sampleFile': sampleFile, 'isSampleFileShow':true,"message": msg,'applicationId':this.appDetails['appId']}; 

    modalRef.result.then((result) => {
     
        if ( result == 'ok') {
          this.openAlert('File uploaded successfully.');
          this.getAppDetails();
      } else {
        if(result != 'cancel') this.openAlert('Something went wrong. Please try again.');
      }
    });
  }
  changeDropDownValues(event){    
    this.appQuestionnaireForm.get(event.control).patchValue(event.files.item(0).name);

    if(event.control == "application_architecture_diagram"){
      this.application_architecture_diagram_file = event.files.item(0)
    }else if(event.control == "application_deployment_diagram"){
      this.application_deployment_diagram_file = event.files.item(0);
    }
    
  }
}
