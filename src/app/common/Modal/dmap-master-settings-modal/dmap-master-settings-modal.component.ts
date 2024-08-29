import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalyticsService } from '../../Services/analytics.service';
import { DatabaseListService } from '../../Services/database-list.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-master-settings-modal',
  templateUrl: './dmap-master-settings-modal.component.html',
  styleUrls: ['./dmap-master-settings-modal.component.css']
})
export class DmapMasterSettingsModalComponent implements OnInit {
  @Input() data;
  
  @ViewChild('f',  { static: false }) masterSettingsForm: NgForm;
  
  miscellaneous1Value:any;
  miscellaneous2Value:any;
  backupIntervalValue:any;
  timeToSyncWorkerNodesValue:any;
  timeToSyncWorkerNodesStatusValue: any;
  maxTimeToWaitInprogressSchemaValue: any;
  timeToExecuteDiscoveryAssessmentAutomaticallyValue: any;
  timeToTimedOutInprogressSchemasValue: any;
  passwordType:string = 'password';
  currency:any[] = [];
  selectedCurrencyValue:string;
  timeZones:any[] = [];
  selectedtimeZoneValue;
  maxErrorRerunAttempt:any;
  numberOnlyPattern = "^((?!(0))[0-9]*)$"
  
  constructor(private activeModal: NgbActiveModal,
              private spinner: NgxSpinnerService,
              private modalService: NgbModal,
              private databaseListService:DatabaseListService,
              private analyticService: AnalyticsService,
              private _PopupDraggableService: PopupDraggableService) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.getAnalyticsSettings();
    this.loadCurrency();
    this.loadTimezones();
  }
  loadTimezones(){
    this.analyticService.getTimeZoneDetails().subscribe(data => {
      this.timeZones = data;
      this.timeZones.unshift(this.selectedtimeZoneValue);
      let temp = new Set(this.timeZones);
      this.timeZones = Array.from(temp);
    });
  }

  loadCurrency(){
    this.databaseListService.getCurrencyDetails().subscribe(data => {
      this.currency = data.currency;
      this.currency.unshift(this.selectedCurrencyValue);
      /* Removing INR from array */
      this.currency  =['$ United States'];
      let temp = new Set(this.currency);
      this.currency = Array.from(temp);
    });
  }
  getAnalyticsSettings(){
    let settings;
    this.databaseListService.getAnalyticsSettingDetails().subscribe(data => {
      settings = data.settings;
      this.miscellaneous1Value = settings.miscellaneous1;
      this.miscellaneous2Value = settings.miscellaneous2;
      this.backupIntervalValue = settings.backup_interval;
      this.timeToSyncWorkerNodesValue = settings.time_to_sync_worker_nodes;
      this.timeToSyncWorkerNodesStatusValue = settings.time_to_sync_worker_nodes_status;
      this.maxTimeToWaitInprogressSchemaValue = settings.max_time_to_wait_inprogress_schema;
      this.timeToExecuteDiscoveryAssessmentAutomaticallyValue = settings.time_to_execute_discovery_assessment_automatically;
      this.timeToTimedOutInprogressSchemasValue = settings.time_to_timed_out_in_progress_schemas;
      this.selectedCurrencyValue = settings.currency_selected;
      this.selectedtimeZoneValue = settings.timezone_selected;
      this.maxErrorRerunAttempt =  settings.max_error_rerun_attempt;
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

  ok() {
    this.activeModal.close('ok');
  }
  cancel() {
    this.activeModal.close('cancel');
  }
  
  clear(){
    this.masterSettingsForm.resetForm();
  }
  private SettingsUpdateResponse(data: any): void {
    this.spinner.hide();
    if (data.status === 'success') {
      this.openAlert('Settings updated successfully.');
      this.ok();
    } else {
      this.openAlert(data.message);
    }
  }
  submit(){
    if (this.data.node_type == 'analytics_master'){
      let  reqObj:any = {};
      reqObj['miscellaneous1'] = this.miscellaneous1Value;
      reqObj['miscellaneous2'] = this.miscellaneous2Value;
      reqObj['backup_interval'] = this.backupIntervalValue;
      reqObj['time_to_sync_worker_nodes'] = this.timeToSyncWorkerNodesValue;
      reqObj['time_to_sync_worker_nodes_status'] = this.timeToSyncWorkerNodesStatusValue;
      reqObj['max_time_to_wait_inprogress_schema'] = this.maxTimeToWaitInprogressSchemaValue;
      reqObj['time_to_execute_discovery_assessment_automatically'] = this.timeToExecuteDiscoveryAssessmentAutomaticallyValue;
      reqObj['time_to_timed_out_in_progress_schemas'] = this.timeToTimedOutInprogressSchemasValue;
      reqObj['currency_selected'] = this.selectedCurrencyValue;
      reqObj['timezone_selected'] = this.selectedtimeZoneValue;
      reqObj['max_error_rerun_attempt'] = this.maxErrorRerunAttempt;
      
      this.spinner.show();
      this.databaseListService.submitsettingDetails(reqObj).subscribe(data => {
        this.SettingsUpdateResponse(data);
      });

    }
    else{ 
    let  reqObj:any = {};
    reqObj['timezone_selected'] = this.selectedtimeZoneValue;
    reqObj['miscellaneous1'] = this.miscellaneous1Value;
    reqObj['miscellaneous2'] = this.miscellaneous2Value;
    reqObj['backup_interval'] = this.backupIntervalValue;
    reqObj['time_to_sync_worker_nodes'] = this.timeToSyncWorkerNodesValue;
    reqObj['time_to_sync_worker_nodes_status'] = this.timeToSyncWorkerNodesStatusValue;
    reqObj['max_time_to_wait_inprogress_schema'] = this.maxTimeToWaitInprogressSchemaValue;
    reqObj['time_to_execute_discovery_assessment_automatically'] = this.timeToExecuteDiscoveryAssessmentAutomaticallyValue;
    reqObj['time_to_timed_out_in_progress_schemas'] = this.timeToTimedOutInprogressSchemasValue;
    reqObj['currency_selected'] = this.selectedCurrencyValue;
    reqObj['max_error_rerun_attempt'] = this.maxErrorRerunAttempt;
    
    this.spinner.show();
    this.databaseListService.submitDMAPsettingDetails(reqObj).subscribe(data => {
      this.SettingsUpdateResponse(data);
    });
    }
    
  }
  togglePassword(type){
    this.passwordType = type;
  }

}