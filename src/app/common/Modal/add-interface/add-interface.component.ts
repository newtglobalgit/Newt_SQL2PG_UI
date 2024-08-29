import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from '../../Services/database-list.service';
import { MinNumberValidator } from '../../Validators/min-number-validator';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-add-interface',
  templateUrl: './add-interface.component.html',
  styleUrls: ['./add-interface.component.css']
})
export class AddInterfaceComponent implements OnInit {

  @Input() data:any;
  
  masterInterfaceData: any;
  appInterfaceQuestionnaireForm: FormGroup;
  migrationOptions_dropdownSettings:IDropdownSettings = {}; 
  dropdown_others_values:any={};
  errorInValidForm:boolean= false;
  formStatus: any = '';
  interfaceDetails:any;
  isDataAvailable:boolean = false;

  regexp_number = /^(0|[1-9]\d*)(\.\d+)?$/
  regexp_email = /\S+@\S+\.\S+/
  regexp_percentage =/^\d+(\.\d+)?$/
  regexp_designation=/^.{1,50}$/


  constructor(private databaseListService: DatabaseListService,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,
              private activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private _PopupDraggableService: PopupDraggableService) { }

  ngOnInit(): void {
    this._PopupDraggableService.enableDraggablePopup();
    this.appInterfaceQuestionnaireForm = this.formBuilder.group({});
    this.getMasterInterfaceDetails();
    if(this.data.interfaceName != ''){
      this.getInterfaceDetails();
    }
  }

  getMasterInterfaceDetails(){
    
    //this.spinner.show();
    this.databaseListService.getMasterInterfacetails({}).subscribe(response => {

      if (response){
        this.masterInterfaceData = response;
        this.createFormControls();
        this.appInterfaceQuestionnaireForm.addControl('application_id', new FormControl('',[Validators.required,]));
        this.appInterfaceQuestionnaireForm.addControl('application_name', new FormControl('',[Validators.required,]));
        this.appInterfaceQuestionnaireForm.get('application_id').patchValue(this.data['appId']);
        this.appInterfaceQuestionnaireForm.get('application_name').patchValue(this.data['appName']);
        //this.isDataAvailable = true;
      }

    });
  }
  createFormControls(){

    for (let i in this.masterInterfaceData){
      let appData = this.masterInterfaceData[i];
      for(let j in appData){
        this.appInterfaceQuestionnaireForm.addControl(appData[j].form_control_name, new FormControl([], this.getValidatorsForControls(appData[j])));
        if(appData[j].input_type == 'multi_select'){
          let key = appData[j].form_control_name+'_others';
          this.dropdown_others_values[key] = false;
          this.appInterfaceQuestionnaireForm.addControl(key, new FormControl([],[]));
        } 
      }
    }
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
  getInterfaceDetails(){
    //this.spinner.show();    
    let reqObj = {'appId':this.data['appId'],'appName':this.data['appName'],'interfaceName':this.data['interfaceName']};
    this.spinner.show();
    this.databaseListService.getInterfaceDetails(reqObj).subscribe(response => {

      if (response.length > 0){

        let appData = response[0];
        this.formStatus = appData['questionnaire_status'];
        Object.keys(appData).forEach(key => {
          if ( key != 'application_id' && key != 'application_name' && key!='questionnaire_status'){
            this.appInterfaceQuestionnaireForm.get(key).patchValue(appData[key]);
          }
          if (key.indexOf('_others')){
            if (appData[key]){
              this.dropdown_others_values[key] = true;
            }
          }
         
        });
      }
      this.isDataAvailable = true;
      this.spinner.hide();
    });
  }


  submitInterface(action){
    this.spinner.show();
    let isFormValid = true;
    if(action == 'submit'){
      console.log(this.appInterfaceQuestionnaireForm.errors)
      console.log(this.appInterfaceQuestionnaireForm.valid)
      if(!this.appInterfaceQuestionnaireForm.valid){
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
    
    req_obj = this.appInterfaceQuestionnaireForm.value;
    req_obj['action'] = action;
    
    this.databaseListService.submitAppInterfaceetails(req_obj).subscribe(response=>{
      
      if(response.status){
        this.formStatus = 'Complete';
        this.getInterfaceDetails();
        this.spinner.hide();
        this.errorInValidForm = false;
        if(action == 'save'){
          this.openAlert("Application Interface details saved successfully.");
        }else{
          this.openAlert("Application Interface details submitted successfully.");
        }
          
      }else{
        this.openAlert(response.message);
      }

    });
   
  }

  clear(){
    
  }

}
