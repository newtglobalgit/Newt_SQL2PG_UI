import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
// import licenseData from '../../../assets/questionaire/db_details/db_license_tab.json';
import licenseData from '../../../../../assets/questionaire/db_details/db_license_tab.json';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { QuestionaireService } from 'src/app/common/Services/questionaire.service';

@Component({
  selector: 'app-db-details-template',
  templateUrl: './db-details-template.component.html',
  styleUrls: ['./db-details-template.component.css']
})
export class DbDetailsTemplateComponent implements OnInit {

  host_environment:any = ["On-prem","Azure","AWS","GCP"];
  db_server_configuration:any =['Standalone','RAC','Exadata'];
  boolean_dropdowns:any = ['Yes','No'];
  work_load:any=['OLTP','OLAP','Mixed'];
  LICENSE_DETAILS:any[] = [] ;
  DB_DETAILS:any;
  db_server_type:any = ["VM","Vmware"];
  disableServiceName : boolean = true;
  sourcePasswordType: string = 'password';
  @Input() shortQuestionnaireForm: FormGroup;
  @Input() content: any;
  @Input() azure_locations: any;
  @Output() dbSectionSubmitted = new EventEmitter<Object>();
  @Output() dbSectionCleared = new EventEmitter<Object>();

  constructor(private spinner: NgxSpinnerService,
    private datalistService: DatabaseListService,
    private modalService: NgbModal,
    private questionaireService:QuestionaireService) { }

  ngOnInit(): void {
    this.LICENSE_DETAILS = licenseData.data;
    let db_details_ = {DBDetails:[
      {seq: 1, tabLabel: 'Oracle License', controls: this.LICENSE_DETAILS}
     ],
    }
    this.DB_DETAILS = db_details_.DBDetails[0].controls;
  }
  getAppControls(form){
    return form.controls;
  }


  setRadio(app){
    if(app.value.dbValue.prod_db_is_sid){
      this.getDBControls(app).get('prod_db_sid')?.enable();
      this.getDBControls(app).get('prod_db_service_name')?.disable();
      this.getDBControls(app).get('prod_db_is_sid').setValue(true);
      this.getDBControls(app).get('prod_db_sid').setValidators(this.getValidation(true, ""));
      this.getDBControls(app).get('prod_db_service_name').setValidators(this.getValidation(false, ""));
      this.getDBControls(app).get('prod_db_service_name').updateValueAndValidity();
      this.getDBControls(app).get('prod_db_sid').updateValueAndValidity();
    } else {
      this.getDBControls(app).get('prod_db_service_name')?.enable();
      this.getDBControls(app).get('prod_db_sid')?.disable();
      this.getDBControls(app).get('prod_db_is_sid').setValue(false);
      this.getDBControls(app).get('prod_db_sid').setValidators(this.getValidation(false, ""));
      this.getDBControls(app).get('prod_db_service_name').setValidators(this.getValidation(true, ""));
      this.getDBControls(app).get('prod_db_service_name').updateValueAndValidity();
      this.getDBControls(app).get('prod_db_sid').updateValueAndValidity();
    }

    return true;
  }

  disableSIDFn(app){
    if(app.value.dbValue.prod_db_is_sid){
      return true;
    }
    return false;
  }

  disableSnameFn(app){
    if(app.value.dbValue.prod_db_is_sid){
      return false;
    }
    return true;
  }

  getAppvalue(form){
    return form.controls.appValue.controls;
  }

  getDBName(control){
    return control.get('dbName').value;
  }

  getAppName(control){
    return control.get('appName').value;
  }

  getDBControls(form){
    return form.controls.dbValue;
  }

  isAppLOCValid(form, key){
    return form.get(key).invalid;
  }

  isNotValid(form, key){
    return form.controls.dbValue.get(key).invalid;
  }

  getValidation(isRequired, regex){
    return this.questionaireService.getValidatorsForControls({isRequired:isRequired, regex:regex});
  }

  isSID(s,app){
    if(s){
      this.getDBControls(app).get('prod_db_sid')?.enable();
      this.getDBControls(app).get('prod_db_is_sid').setValue(true);
      this.getDBControls(app).get('prod_db_sid').setValidators(this.getValidation(true, ""));
      this.getDBControls(app).get('prod_db_service_name').setValidators(this.getValidation(false, ""));
    } else{
      this.getDBControls(app).get('prod_db_service_name')?.enable();
      this.getDBControls(app).get('prod_db_is_sid').setValue(false);
      this.getDBControls(app).get('prod_db_sid').setValidators(this.getValidation(false, ""));
      this.getDBControls(app).get('prod_db_service_name').setValidators(this.getValidation(true, ""));
    }
  }
  submitEmitEvent(appName, dbName) {
    this.dbSectionSubmitted.emit({'appName': appName, 'dbName' : dbName});
  }

  clearEmitEvent(appName, dbName) {
    this.dbSectionCleared.emit({'appName': appName, 'dbName' : dbName});
  }

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
    });
  }

  testConnection(db,app){
    var reqObj = {};
    reqObj['db_name']= app;
    reqObj['script_name']= app;
    reqObj['prod_db_is_sid'] = this.getDBControls(db).get('prod_db_is_sid').value;
    reqObj['prod_host_username'] = this.getDBControls(db).get('prod_db_username').value;
    reqObj['prod_host_password'] = this.getDBControls(db).get('prod_db_password').value;
    reqObj['prod_host_ip'] = this.getDBControls(db).get('prod_db_host_name').value;
    reqObj['prod_host_port'] = this.getDBControls(db).get('prod_db_port').value;
    reqObj['prod_host_sid'] = this.getDBControls(db).get('prod_db_sid').value;
    reqObj['prod_host_sname'] = this.getDBControls(db).get('prod_db_service_name').value;

    if(this.validateProdDbDetails(db)){
      this.spinner.show();
      this.datalistService.testProdDbConnection(reqObj).subscribe((res)=>{
        this.spinner.hide();
        if(res['status'] =='success'){
          this.openAlert("Test connection successful.");
        } else {
          this.openAlert(res['message']);
        }
      })
    } else {
      this.openAlert("Please fill all fields to test connection.")
    }
  }

  validateProdDbDetails(app){
    if(!this.getDBControls(app).get('prod_db_host_name').value || this.getDBControls(app).get('prod_db_host_name').value == '' || this.getDBControls(app).get('prod_db_host_name').value == null) return false;
    if(!this.getDBControls(app).get('prod_db_port').value) return false;
    if(!this.getDBControls(app).get('prod_db_username').value) return false;
    if(!this.getDBControls(app).get('prod_db_password').value) return false;
    if(!this.getDBControls(app).get('prod_db_env').value) return false;
    if(this.getDBControls(app).get('prod_db_is_sid').value){
      if(!this.getDBControls(app).get('prod_db_sid').value){
        return false;
      }
    } else {
      if(!this.getDBControls(app).get('prod_db_service_name').value){
        return false;
      }
    }
    return true;
  }

  toggleSourcePassword(type: any) {
    this.sourcePasswordType = type;
  }
}
