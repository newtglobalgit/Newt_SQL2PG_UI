import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, AbstractControl, FormBuilder, ValidatorFn } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { DatabaseListService } from '../../Services/database-list.service';
import { DmapAlertDialogModal } from '../../Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { MustMatch } from './must-match-password';
import { NgbdConfirmationModal } from '../dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

const RangeValidator: ValidatorFn = (fg: FormGroup) => {
  const lower = fg.get('performanceLowerThresholdValue').value;
  const upper = fg.get('performanceUpperThresholdValue').value;
  return lower !== null && upper !== null && lower < upper
  ? null
  : { range: true };
};

@Component({
  selector: 'app-dmap-update-password',
  templateUrl: './dmap-update-password.component.html',
  styleUrls: ['./dmap-update-password.component.css']
})

export class DmapUpdatePasswordComponent implements OnInit {
  @Input() data:any;
  selectedDB:string = null;
  selectedMigrationMode:string = 'selected';
  sourceRadioButton:string;
  targetRadioButton:string;
  sourceForm: FormGroup;
  targetForm: FormGroup;
  thresholdForm: FormGroup;
  usernameForm: FormGroup;
  numberOnlyPattern = "^((?!(0))[0-9]{4,5})$";

  lowerLimit:any;
  upperLimit:any;
  showresetStatus:any = false;
  formpassword:any = null;

  targetDBHostValue = "";
  targetDBNameValue = "";
  targetDBPortValue = "";
  targetDBSidValue = "";
  targetDBUserNameValue = "";
  targetDBPasswordValue = "";
  sourceDbHostValue = "";
  sourceDBNameValue = "";
  sourceDBSchemaValue = "";
  sourceDBPortValue = "";
  sourceDBSidValue = "";
  sourceDBUserNameValue = "";
  sourceDBServiceNameValue = "";
  sourceDBType = "";

  portPattern = "^((?!(0))[0-9]{4})$";
  targetcolmd6:boolean = false;
  targetcolmd12:boolean = true;
  changeTargetDetails:boolean = false;
  changeSourceDetails:boolean = false;
  targetDetailsLabel:string ;
  sourceDetailsLabel:string;
  sourcecolmd6:boolean = false;
  sourcecolmd12:boolean = true;

  allowSourceDetails:boolean = true;
  allowTargetDetails:boolean = true;
  oracleConnect:string = 'sid';

  @ViewChild('targetDBSchemaRef') targetDBSchemaRef: ElementRef;

  constructor(private activeModal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private databaseListService: DatabaseListService,
              private spinner: NgxSpinnerService,
              private modalService: NgbModal,
              private _PopupDraggableService: PopupDraggableService
            ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    if(this.data.stage == 'In Progress' ||this.data.stage == 'Error' ){
      this.showresetStatus = true;
    }

    this.selectDB(null);

    this.sourceForm = this.formBuilder.group({
      'sourcePasswordValue': new FormControl(null, [Validators.required]),
      'sourceConfirmPasswordValue': new FormControl(null, [Validators.required]),
      'sourceDbHostValue': new FormControl('',[Validators.required]),
      'sourceDBNameValue': new FormControl('',[Validators.required]),
      'sourceDBSchemaValue': new FormControl('',[Validators.required]),
      'sourceDBPortValue': new FormControl('',[Validators.required]),
      'sourceDBUserNameValue': new FormControl('',[Validators.required]),
      'sourceDBSidValue': new FormControl('',[Validators.required]),
      'sourceDBServiceNameValue': new FormControl('',[Validators.required])
    }, {
      validator: MustMatch('sourcePasswordValue', 'sourceConfirmPasswordValue')
    });

    this.targetForm = this.formBuilder.group({
      'targetDbHostValue': new FormControl('',[Validators.required]),
      'targetDBNameValue': new FormControl('',[Validators.required]),
      'targetDBSchemaValue': new FormControl('',[Validators.required]),
      'targetDBPortValue': new FormControl('',[Validators.required]),
      'targetDBUserNameValue': new FormControl('',[Validators.required]),
      'targetPasswordValue': new FormControl(null, [Validators.required]),
      'targetConfirmPasswordValue': new FormControl(null, [Validators.required])
    }, {
      validator: MustMatch('targetPasswordValue', 'targetConfirmPasswordValue')
    });

    this.thresholdForm = this.formBuilder.group({
      'performanceLowerThresholdValue': new FormControl(null, [Validators.required]),
      'performanceUpperThresholdValue': new FormControl(null, [Validators.required])
    },{
      validator: RangeValidator
    });
    this.usernameForm = this.formBuilder.group({
      'usernameValue': new FormControl(null,[Validators.required])
    });

    if((this.data.step =='Discovery' || this.data.step =='Assessment') &&this.data.stage =='In Progress'){
      this.allowSourceDetails = false;
      //this.allowTargetDetails = false;
    }
    else if ((this.data.step =='Schema Conversion' || this.data.step =='Data Migration') && this.data.stage =='In Progress' ){
      this.allowTargetDetails = false;
      this.allowSourceDetails = false;
    }

    if((this.data.step =='Discovery' || this.data.step =='Assessment')){
      this.changeTargetDetails = true;
      this.targetcolmd6 = true;
      this.targetcolmd12 = false;
      this.targetDetailsLabel = 'Update target database details'
    }
    else{
      this.changeTargetDetails = false;
      this.targetcolmd6 = false;
      this.targetcolmd12 = true;
      this.targetDetailsLabel = 'Update target database password'

      this.targetForm.get('targetDbHostValue').disable();
      this.targetForm.get('targetDBNameValue').disable();
      this.targetForm.get('targetDBSchemaValue').disable();
      this.targetForm.get('targetDBPortValue').disable();
      this.targetForm.get('targetDBUserNameValue').disable();
    }
    if (this.data.step =='Discovery' && this.data.stage =='Not Started'){
      this.sourceDetailsLabel = 'Change source db details';
      this.changeSourceDetails = true;
      this.sourcecolmd6 = true;
      this.sourcecolmd12 = false;
    }
    else{
      this.sourceDetailsLabel = 'Update source database password';
      this.changeSourceDetails = false;
      this.sourcecolmd6 = false;
      this.sourcecolmd12 = true;
    }

    this.getSchemaDetails(this.data.runId);
  }

  getSchemaDetails(runId){
    this.databaseListService.getTargetDetails(runId).subscribe(response => {
    if (response['status'] == 'SUCCESS'){
      let data = response['data']
      this.selectedMigrationMode = data['synonym_migration_mode'];
      this.targetForm.get('targetDbHostValue').patchValue(data['target_db_host']);
      this.targetForm.get('targetDBNameValue').patchValue(data['target_db_databse']);
      this.targetForm.get('targetDBPortValue').patchValue(data['target_db_port']);
      this.targetForm.get('targetDBUserNameValue').patchValue(data['target_db_username']);
      this.targetForm.get('targetDBSchemaValue').patchValue(data['target_db_schema']);

      this.sourceForm.get('sourceDbHostValue').patchValue(data['source_db_host']);
      this.sourceForm.get('sourceDBNameValue').patchValue(data['source_db_databse']);
      this.sourceForm.get('sourceDBPortValue').patchValue(data['source_db_port']);
      this.sourceForm.get('sourceDBSchemaValue').patchValue(data['source_db_schema']);
      this.sourceForm.get('sourceDBUserNameValue').patchValue(data['source_db_username']);
      this.sourceDBType = data['source_db_type'];

      this.oracleConnect =  data['source_is_sid'] === true ?'sid':'servicename'
      if (data['source_is_sid']){
        this.sourceForm.get('sourceDBSidValue').patchValue(data['source_sid']);
        this.sourceForm.get('sourceDBServiceNameValue').disable();
      }
      else{
        this.sourceForm.get('sourceDBServiceNameValue').patchValue(data['source_sid']);
        this.sourceForm.get('sourceDBSidValue').disable();
      }
    }
    else{
      this.targetForm.get('targetDbHostValue').patchValue('');
      this.targetForm.get('targetDBNameValue').patchValue('');
      this.targetForm.get('targetDBPortValue').patchValue('');
      this.targetForm.get('targetDBUserNameValue').patchValue('');
      this.targetForm.get('targetDBSchemaValue').patchValue('');
      this.sourceForm.get('sourceDbHostValue').patchValue('');
      this.sourceForm.get('sourceDBNameValue').patchValue('');
      this.sourceForm.get('sourceDBPortValue').patchValue('');
      this.sourceForm.get('sourceDBSchemaValue').patchValue('');
      this.sourceForm.get('sourceDBUserNameValue').patchValue('');
      this.sourceForm.get('sourceDBServiceNameValue').patchValue('');
      this.sourceForm.get('sourceDBSidValue').patchValue('');
    }
    });

  }
  // convenience getter for easy access to form fields
  get f() { return this.sourceForm.controls; }
  get f_target() { return this.targetForm.controls; }
  get f_threshold() { return this.thresholdForm.controls; }
  get f_username(){return this.usernameForm.controls;}

  cancel() {
    this.activeModal.close('cancel');
  }

  selectDB(dbType){
    this.selectedDB = dbType
    if(dbType == 'threshold'){
      this.spinner.show();
      let reqObj = {"run_id":this.data.runId}
      this.databaseListService.getPerformanceThreshold(reqObj).subscribe(data => {
        this.spinner.hide();
        this.lowerLimit = data['lower'];
        this.upperLimit = data['upper'];
      });
    }

  }
  selectSynoymMigration(migration_mode){
    console.log(migration_mode)
    this.selectSynoymMigration = migration_mode;
  }

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }
  private UpdateSubmitResponse(data: any, successMessage: string): void {
    this.spinner.hide();
    if (data.status === 'SUCCESS') {
        this.openAlert(successMessage);
        this.activeModal.close();
    } else {
        this.openAlert(data.message);
    }
}
  submitSource(){
    let reqObj = {'RUN_ID':this.data.runId,
    'source_db_host':this.f['sourceDbHostValue'].value,
    'source_db_port':this.f['sourceDBPortValue'].value,
    'source_db_username':this.f['sourceDBUserNameValue'].value,
    'source_db_databse':this.f['sourceDBNameValue'].value,
    'source_db_schema_name':this.f['sourceDBSchemaValue'].value,
    'source_db_password':this.f['sourcePasswordValue'].value,
    'source_db_sid':this.oracleConnect == 'sid' ?this.f['sourceDBSidValue'].value:this.f['sourceDBServiceNameValue'].value,
    'sourcedb_is_sid':this.oracleConnect === 'sid',
  };
    this.spinner.show();
    this.databaseListService.saveSourceDbConnection(reqObj).subscribe(data => {
     this.UpdateSubmitResponse(data, 'Source DB details updated successfully.');
    });
  }

  submitTarget(){
    let reqObj = {'RUN_ID':this.data.runId,
                  'target_db_host':this.f_target['targetDbHostValue'].value,
                  'target_db_port':this.f_target['targetDBPortValue'].value,
                  'target_db_username':this.f_target['targetDBUserNameValue'].value,
                  'target_db_databse':this.f_target['targetDBNameValue'].value,
                  'target_db_password':this.f_target['targetPasswordValue'].value};
    this.spinner.show();
    this.databaseListService.saveNewDbConnection(reqObj).subscribe(data => {
      this.UpdateSubmitResponse(data, 'Target DB details updated successfully.');
    });
  }

  submitThreshold(){
    this.spinner.show();
    let reqObj = {'run_id':this.data.runId,'lower':this.f_threshold['performanceLowerThresholdValue'].value,'upper':this.f_threshold['performanceUpperThresholdValue'].value};
    this.databaseListService.updatePerformanceThreshold(reqObj).subscribe(data => {
      this.spinner.hide();
      if (data.status === true || data.status === 'true') {
        this.openAlert('Updated Successfully.');
        this.activeModal.close();
      }
      else{
      this.openAlert(data.message);
      }
    });
  }
  submitSchemaUsername(){
    this.spinner.show();
    let reqObj = {'runId':this.data.runId,'user_name':this.f_username['usernameValue'].value};
    this.databaseListService.updateSchemaUsername(reqObj).subscribe(data => {
      this.spinner.hide();
      if (data.status) {
        this.openAlert('Updated Successfully.');
        this.activeModal.close();
     }
     else{
      this.openAlert(data.message);
     }
    });
  }

  testSourceDbConnection(){
    //let reqObj = {'RUN_ID':this.data.runId,'sourcePassword':this.f['sourcePasswordValue'].value};
    let reqObj = {'RUN_ID':this.data.runId,
    'sourceDBHost':this.f['sourceDbHostValue'].value,
    'sourceDBPort':this.f['sourceDBPortValue'].value,
    'sourceDBUserName':this.f['sourceDBUserNameValue'].value,
    'databaseName':this.f['sourceDBNameValue'].value,
    'schemaName':this.f['sourceDBSchemaValue'].value,
    'sourcePassword':this.f['sourcePasswordValue'].value,
    'sourceDBSid':this.oracleConnect == 'sid' ?this.f['sourceDBSidValue'].value:this.f['sourceDBServiceNameValue'].value,
    'sourceDBiSSid':this.oracleConnect === 'sid',
    'sourceDBType':this.sourceDBType,
    'sourceDBPassword':this.f['sourcePasswordValue'].value
  };
    this.spinner.show();

    this.databaseListService.testSourceDbConnection(reqObj).subscribe(data => {
      this.spinner.hide();
      if (data[0].status === 'SUCCESS' ) {
        this.openAlert('Connection Successful.');
     }
     else{
      this.openAlert(data[0].message);
     }
    });

  }

  testTargetDbConnection(){
    let reqObj = {'RUN_ID':this.data.runId,
                  'target_db_host':this.f_target['targetDbHostValue'].value,
                  'target_db_port':this.f_target['targetDBPortValue'].value,
                  'target_db_username':this.f_target['targetDBUserNameValue'].value,
                  'target_db_databse':this.f_target['targetDBNameValue'].value,
                  'target_db_password':this.f_target['targetPasswordValue'].value};
    this.spinner.show();

    this.databaseListService.testNewDbConnection(reqObj).subscribe(data => {
      this.spinner.hide();
      if (data.status === 'SUCCESS' ) {
        this.openAlert('Connection Successful.');
     }
     else{
      this.openAlert(data.message);
     }
    });
  }

  clearTarget(){
    if(this.selectedDB == 'source'){
      this.sourceForm.reset();
      this.oracleConnect = 'sid' ;
    }else if(this.selectedDB == 'target'){
      const controlsToKeep = {};
      // Check if the field is readonly, don't clear the value
      if (this.targetDBSchemaRef && this.targetDBSchemaRef.nativeElement && this.targetDBSchemaRef.nativeElement.readOnly) {
        controlsToKeep['targetDBSchemaValue'] = this.targetForm.get('targetDBSchemaValue')?.value;
      }
      this.targetForm.reset(controlsToKeep);
    }
    else if(this.selectedDB == 'username'){
      this.usernameForm.reset();
    }
    else{
      this.thresholdForm.reset();
    }

  }

  ok(){
    this.activeModal.close();
  }

  submitResetStatus(){
    const modalRef = this.modalService.open(NgbdConfirmationModal);

    let message:any;
    if (this.data.stage == 'In Progress'){
      message = 'Are you sure that selected RUN ID which is “In progress” was stopped and not running any longer? Because, if it is running and still continuing to submit, it may lead to some inconsistent reports in the end.'
    }
    else if(this.data.stage == 'Error'){
      message = 'Are you sure you want to reset the status?'
    }

    modalRef.componentInstance.data = {msg : message, title : 'Confirmation',okButtonLabel : 'Yes',cancelButtonLabel:'No'};
    modalRef.result.then((result) => {
    if ( result === 'ok') {
      let reqObj = {"RUN_ID":this.data.runId,"stage":this.data.step}
      this.spinner.show();
        this.databaseListService.restartschemaConversion(reqObj).subscribe((res:any) => {
          if (res.status == 'failed'){
            this.spinner.hide();
            this.openAlert(res.message);
          }
          else{
            this.spinner.hide();
            this.ok();
          }
          this.spinner.hide();
        });
      }
    });
  }

  submitSynonymMigrationMode(){
    let reqObj = {'run_id':this.data.runId,'synonym_migration_mode':this.selectedMigrationMode}
    this.databaseListService.submitSynonymMigrationMode(reqObj).subscribe((res:any) => {
      if (res.status == 'failed'){
        this.spinner.hide();
        this.openAlert(res.message);
      }
      else{
        this.spinner.hide();
        this.openAlert("Synonym Migration Mode updated successfully.");
        this.ok();
      }
      this.spinner.hide();
    });

  }
  onRadioButtonSelected(event){
    this.oracleConnect = event.target.value;
    if (this.oracleConnect == 'sid'){
      this.sourceForm.get('sourceDBServiceNameValue').disable();
      this.sourceForm.get('sourceDBSidValue').enable();
    }
    else{
      this.sourceForm.get('sourceDBServiceNameValue').enable();
      this.sourceForm.get('sourceDBSidValue').disable();
    }
  }
}
