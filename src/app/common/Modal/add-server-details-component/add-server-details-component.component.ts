import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,ValidationErrors } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from '../../Services/database-list.service';
import { MinNumberValidator } from '../../Validators/min-number-validator';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-add-server-details-component',
  templateUrl: './add-server-details-component.component.html',
  styleUrls: ['./add-server-details-component.css']
})
export class AddServerDetailsComponentComponent implements OnInit {

  @Input() data:any;
  
  masterServerData: any;
  addServerQuestionnaireForm: FormGroup;
  dropdown_others_values:any={};
  errorInValidForm:boolean= false;
  formStatus: any = '';
  applicationName: any;
  applicationId: any;
  appServerDetailId:any;
  isDataAvailable:any;
  disableSubmit: boolean=false;
  editAction: any = '';

  regexp_number = /^(0|[1-9]\d*)(\.\d+)?$/
  regexp_email = /\S+@\S+\.\S+/
  regexp_percentage =/^\d+(\.\d+)?$/
  regexp_designation=/^.{1,50}$/


  constructor(private databaseListService: DatabaseListService,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private _PopupDraggableService: PopupDraggableService
            ) { }

  ngOnInit(): void {
    this._PopupDraggableService.enableDraggablePopup();
    this.addServerQuestionnaireForm = this.formBuilder.group({});
    this.getMasterServerDetails();
    this.applicationName = this.data.appName
    this.applicationId = this.data.appId
    this.appServerDetailId = this.data.appServerDetailId
    this.editAction = this.data.action;

    this.getServerDetails();

  }
  getMasterServerDetails(){

    //this.spinner.show();
    this.databaseListService.getAddServerDetails({}).subscribe(response => {

      if (response){
        this.masterServerData = response;
        this.createFormControls();
        
      }

    });
  }
  getAppServerDetailsValues(){
    let reqObj = {'appName':this.applicationName};
    this.databaseListService.getServerRequiredValuesByApplication(reqObj).subscribe(response => {
      if (response.length > 0){
        if(response[0]['servers_core']){
          // this.isAddServerDetailsavailable = true;
        }

    }
      });
  }
  createFormControls(){

    for (let i in this.masterServerData){
      let appData = this.masterServerData[i];
      console.log(appData)
      for(let j in appData){
        this.addServerQuestionnaireForm.addControl(appData[j].form_control_name, new FormControl([], this.getValidatorsForControls(appData[j])));
        if(appData[j].input_type == 'multi_select'){
          let key = appData[j].form_control_name+'_others';
          this.dropdown_others_values[key] = false;
          this.addServerQuestionnaireForm.addControl(key, new FormControl([],[]));
        } 
      }
    }
  }
  getServerDetails(){
    
      let reqObj = {'appServerDetailId':this.appServerDetailId};
      this.spinner.show();
      this.databaseListService.getAppServerDetailsResponse(reqObj).subscribe(response => {
  
        if (response.length > 0){
  
          let appData = response[0];
          Object.keys(appData).forEach(key => {
              this.addServerQuestionnaireForm.get(key).patchValue(appData[key]);
          
          });

        }
        this.isDataAvailable = true;
      });
      this.spinner.hide();
    
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

    }
  
    return validators;
  }
  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    this.getServerDetails();
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

  ok() {
    this.activeModal.close('ok');
  }

  cancel() {
    this.getAppServerDetailsValues();
    this.activeModal.close('cancel');
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

  getFormValidationErrors() {
    let labels={
      server_type:	"Server Type",
      host_name:"Host Name",
      hosted_environment:	"Hosted Environment",
      operating_system:"Operating System",
      os_version:	"OS Version",
      num_core:	"Number of Cores",
      ram_gb:	"Server RAM (GB)",
      storage_gb:	"Storage (GB)",
      location:"Location",
      ha_percentage_prod:	"HA Environment as % of Prod",
      dr_percentage_prod:	"DR Environment as % of Prod",
      dev_test_percentage_prod:	"Dev Environment as % of Prod",
      other_percentage_prod:	"Other Environment as % of Prod"

    }
    let unfilled_fields = []
    
    Object.keys(this.addServerQuestionnaireForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.addServerQuestionnaireForm.get(key).errors;
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
  submitServerDetails(action){
    this.spinner.show();
    let isFormValid = true;
    if(action == 'submit'){
      if(!this.addServerQuestionnaireForm.valid){
        this.getFormValidationErrors();
        this.spinner.hide();
        this.errorInValidForm = true;
        return;
      }
    }else if(action == 'save'){
      isFormValid = true;
    }

    if(isFormValid){   
      this.submit(action);

    }
    this.spinner.hide();
  }
  
  submit(action){
    this.spinner.show();
    let req_obj:any = {};
    
    req_obj = this.addServerQuestionnaireForm.value;
    req_obj['app_name'] = this.applicationName;
    req_obj['appServerDetailId'] = this.appServerDetailId;
    req_obj['app_id'] = this.applicationId;
    if(this.editAction=='edit'){
      req_obj['action'] = this.editAction;
    }
    else{
      req_obj['action'] = 'submit';
    }
    

    
    this.databaseListService.submitAddServerDetails(req_obj).subscribe(response=>{
      
      if(response.status){
        this.formStatus = 'Complete';
        //this.getInterfaceDetails();
        this.spinner.hide();
        this.errorInValidForm = false;
        
          this.openAlert("Application Server details updated successfully.");
          this.disableSubmit = true;
          //this.getMasterServerDetails;
          this.cancel();
        
          
      }else{
        this.openAlert(response.message);
      }

    });
    let reqObj = {'appName':this.applicationName};
    this.databaseListService.getServerRequiredValuesByApplication(reqObj).subscribe(response => {});
    
  }
                        

}
