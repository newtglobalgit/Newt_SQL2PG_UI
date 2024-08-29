import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbdConfirmationModal } from 'src/app/common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { FileUploadModalComponent } from 'src/app/common/Modal/file-upload-modal/file-upload-modal.component';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
import { QuestionaireService } from 'src/app/common/Services/questionaire.service';

declare var $: any;

@Component({
  selector: 'app-tco-questionnaire',
  templateUrl: './tco-questionnaire.component.html',
  styleUrls: ['./tco-questionnaire.component.css']
})
export class TcoQuestionnaireComponent implements OnInit {

  tcoQuestionnaireForm: FormGroup;
  tcoStatus:any;
  analyticsStatus: any;
  formStatus: any = '';
  currencySymbol:string;
  allowFormToEdit: boolean;
  errorInValidForm:boolean= false;

  tcoDetail:any;
  tcoCommonConrols:any[] = [];
  tcoOracleDetail: any[];
  tcoDataCenterHardwareCost: any[];
  tcoDataCenterRealEstates: any[];

  constructor(private activatedroute:ActivatedRoute,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private databaseListService: DatabaseListService,
              private modalService: NgbModal,
              private questionaireService:QuestionaireService ) { }

  ngOnInit() {
    this.tcoQuestionnaireForm = this.formBuilder.group({});

      this.tcoDetail = this.questionaireService.getTCOFields();

      this.tcoCommonConrols = this.tcoDetail.tcoCommonDetail
      this.tcoOracleDetail = this.tcoDetail.tcoDetails[0].controls;
      this.tcoDataCenterHardwareCost = this.tcoDetail.tcoDetails[1].controls;
      this.tcoDataCenterRealEstates = this.tcoDetail.tcoDetails[2].controls;

      this.createFormControls();

      this.getTcoDetails();
  }

  createFormControls(){
    for(let i of this.tcoCommonConrols){
      this.tcoQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
    }
    for(let i of this.tcoOracleDetail){
      this.tcoQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
    }
    for(let i of this.tcoDataCenterHardwareCost){
      this.tcoQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
    }
    for(let i of this.tcoDataCenterRealEstates){
      this.tcoQuestionnaireForm.addControl(i.key, new FormControl([], this.getValidatorsForControls(i)));
    }
  }

  clearValues(controls){
    for(let i of controls){
      if(!i.ui_control.readOnly){
        this.tcoQuestionnaireForm.get(i.key).reset();
      }
    }
  }

  clear(){
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {msg : 'Are you sure you want to clear the entered details?', title : 'Confirmation',okButtonLabel : 'Ok',cancelButtonLabel:'Cancel'};
    modalRef.result.then((result) => {
      if ( result === 'ok') {
        this.clearValues(this.tcoCommonConrols);
        this.clearValues(this.tcoOracleDetail);
        this.clearValues(this.tcoDataCenterHardwareCost);
        this.clearValues(this.tcoDataCenterRealEstates);

        //this.getTcoDetails();
      }
    });
  }

  getTcoDetails(){
    this.spinner.show();
    this.databaseListService.getTcoDetails().subscribe(response => {
      this.analyticsStatus = response.analytics_status;
      this.allowFormToEdit = response.analytics_status;
      this.formStatus = response.form_status;
      this.currencySymbol=response.currency_symbol;
      let tcoData = response.data;

      this.patchControls(tcoData, this.tcoCommonConrols);
      this.patchControls(tcoData, this.tcoOracleDetail);
      this.patchControls(tcoData, this.tcoDataCenterHardwareCost);
      this.patchControls(tcoData, this.tcoDataCenterRealEstates);


      /*Open the first tab on the screen */
      setTimeout(() => {
        $('a#nav-tcoOracle_detail-tab').click();
        $('a#nav-tcoOracle_detail-tab').tab('show');
      }, 50);
      this.spinner.hide();
    });
  }

  getValidatorsForControls(control){ return this.questionaireService.getValidatorsForControls(control);}

  patchControls(dbDetailsData, controls){
    for(let i of controls){
      if(i.type == 'select' && (dbDetailsData[i.key] == null || dbDetailsData[i.key].length <= 0)){
        this.tcoQuestionnaireForm.get(i.key).patchValue(i.ui_control.options[0]);
      }else{
        this.tcoQuestionnaireForm.get(i.key).patchValue(dbDetailsData[i.key]);
      }
    }
  }

  disableControls(){
    Object.keys(this.tcoQuestionnaireForm.controls).forEach(key => {
      this.tcoQuestionnaireForm.get(key).disable();
    });
  }

  validateFormControls(controls){
    let isValid = true;
    for(let i of controls){
      if(this.tcoQuestionnaireForm.get(i.key).invalid){
        this.tcoQuestionnaireForm.get(i.key).markAsTouched();
        this.tcoQuestionnaireForm.get(i.key).markAsDirty();
        isValid = false
      }
    }
    return isValid;
  }

  validateForm(){
    let istcoCommonValid = true;
    let istcoOracleDetailValid = true;
    let istcoDataCenterHardwareCoslValid = true;
    let istcoDataCenterRealEstatesValid = true;

    istcoCommonValid = this.validateFormControls(this.tcoCommonConrols);
    istcoOracleDetailValid = this.validateFormControls(this.tcoOracleDetail);
    istcoDataCenterHardwareCoslValid = this.validateFormControls(this.tcoDataCenterHardwareCost);
    istcoDataCenterRealEstatesValid = this.validateFormControls(this.tcoDataCenterRealEstates);

    console.log("istcoCommonValid=" + istcoCommonValid)
    console.log("istcoOracleDetailValid=" + istcoOracleDetailValid)
    console.log("istcoDataCenterHardwareCoslValid=" + istcoDataCenterHardwareCoslValid)
    console.log("istcoDataCenterRealEstatesValid=" + istcoDataCenterRealEstatesValid)

    if(!istcoCommonValid || !istcoOracleDetailValid || !istcoDataCenterHardwareCoslValid || !istcoDataCenterRealEstatesValid ) {
      this.errorInValidForm = true;
      return false
    }
    else{
      this.errorInValidForm = false;
      return true;
    }
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
      req_obj = this.tcoQuestionnaireForm.value;
      req_obj['action'] = action;

      this.databaseListService.uploadTcoDetails(req_obj).subscribe(response=>{
        this.formStatus = response.questionnaire_status;
        this.spinner.hide();
        if(response.status == 'success'){
          this.errorInValidForm = false;
          if(action == 'save'){
            this.openAlert("TCO details saved successfully.");
          }else{
            this.openAlert("TCO details submitted successfully.");
          }

        }else{
          this.openAlert(response.message);
        }
      });
    }else{
      this.spinner.hide();
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

  openTCOUploadModal(){
    let fileType = '';
    let sampleFile = '';
    let msg = '';
    fileType = 'tcoQuestionnaire'
    sampleFile = '/assets/sampleTemplates/TCOQuestionnaire.xlsx'
    msg = 'Please click the icon to browse or drag & drop excel file to upload tco questionnaire.'

    const modalRef = this.modalService.open(FileUploadModalComponent, {size: 'lg', scrollable: true});

    modalRef.componentInstance.data = {'fileType':fileType, 'sampleFile': sampleFile, 'isSampleFileShow':true,"message": msg};

    modalRef.result.then((result) => {

        if ( result == 'ok') {
          this.openAlert('File uploaded successfully.');
          this.getTcoDetails();
      } else {
        if(result != 'cancel') this.openAlert('Something went wrong. Please try again.');
      }
    });
  }

}
