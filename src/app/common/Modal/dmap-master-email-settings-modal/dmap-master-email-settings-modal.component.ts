import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonServices } from '../../Services/common-services.service';
import { DatabaseListService } from '../../Services/database-list.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';

@Component({
  selector: 'app-dmap-master-email-settings-modal',
  templateUrl: './dmap-master-email-settings-modal.component.html'
})
export class DmapMasterEmailSettingsModalComponent implements OnInit {
  @ViewChild('f',  { static: false }) masterEmailSettingsForm: NgForm;

  emailAddressValue:any;
  emailPasswordValue:any;
  passwordType:string = 'password';
  smtpHostValue:any;
  smtpPortValue:any;
  emailsValue:any;
  disableTestConnection = false;
  sendEmailReminder:string;
  selectedTimeZone:any;
  sendSchemaStatusEmail:string='true';
  tcoEmailsValue:any = '';
  licenseType:any;
  data:any  = {"emailType":"settings"}
  reminderFrequencyValue:any;
  schedulerRunsValue:any;

  constructor(private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private commonservice: CommonServices,
    private databaseListService:DatabaseListService) {}


  ngOnInit() {
    this.licenseType = this.commonservice.getLicenseType();

    if (this.data.emailType == 'settings'){
      this.getAnalyticsSettings();
      this.getEmailReminderSettings();
    }
    // else if(this.data.emailType == 'reminder'){
    //   this.getEmailReminderSettings();
    // }

  }
  counter(i: number) {
      return new Array(i);
  }
  cancel() {
    this.activeModal.close('cancel');
  }

  clear(){
    this.sendSchemaStatusEmail = 'true';
    this.masterEmailSettingsForm.resetForm();
    this.sendEmailReminder = null;
  }
  clearReminderSettings(){
    this.sendEmailReminder = 'true';
    this.reminderFrequencyValue = 7;
    this.schedulerRunsValue = 8;
  }
  ok() {
    this.activeModal.close('ok');
  }
  getAnalyticsSettings(){
    let settings;
    this.spinner.show();
    this.databaseListService.getAnalyticsSettingDetails().subscribe(data => {
      this.spinner.hide();
      settings = data.settings;
      this.smtpHostValue = settings.smtp_server;
      this.smtpPortValue = settings.smtp_port;
      this.emailsValue = settings.emails;
      this.emailAddressValue = settings.emailAddress;
      this.emailPasswordValue = settings.emailPassword;
      this.sendSchemaStatusEmail = settings.sendSchemaStatusEmail?'true':'false';
      this.tcoEmailsValue = settings.tcoEmailsValue;

    });
  }

  getEmailReminderSettings(){
    this.spinner.show();
    this.databaseListService.getEmailReminderSettings().subscribe(data => {
      if(data['status'] == 'success'){
        this.sendEmailReminder = data['send_email_remainder']?'true':'false'
        this.reminderFrequencyValue = data['remainder_frequency'];
        this.schedulerRunsValue = data['hr_at_remainder_email_sent'];
        this.selectedTimeZone = data['selected_timezone'];
      }
      else{
        this.selectedTimeZone = '';
      }
      this.spinner.hide();
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
  private emailReminderDetails(reqObj: any): void {
    this.databaseListService.submitEmailRemindergDetails(reqObj).subscribe(data => {
      if (data.status == 'success') {
        this.spinner.hide();
        // this.openAlert("Email reminder settings updated successfully.");
        this.ok();
      } else {
        this.spinner.hide();
        this.openAlert(data.message);
      }
    });
  }
  submit(){
    if (this.data.emailType == 'settings'){
      let  reqObj:any = {};
      reqObj['smtp_server'] = this.smtpHostValue;
      reqObj['smtp_port'] = this.smtpPortValue;
      reqObj['emails'] = this.emailsValue;
      reqObj['emailAddress'] = this.emailAddressValue;
      reqObj['emailPassword'] = this.emailPasswordValue;
      reqObj['sendSchemaStatusEmail'] = this.sendSchemaStatusEmail === 'true';
      reqObj['tcoEmailsValue'] = this.tcoEmailsValue;
      reqObj['send_email_remainder'] = this.sendEmailReminder == 'true'?'yes':'no';
      reqObj['remainder_frequency'] = this.reminderFrequencyValue;
      reqObj['hr_at_remainder_email_sent'] = this.schedulerRunsValue;

      this.spinner.show();
      this.databaseListService.submitEmailsettingDetails(reqObj).subscribe(data => {
        if(data.status == 'success'){
          this.spinner.hide();
          this.openAlert("Email settings updated successfully.");
          this.ok();
        }

        else{
          this.spinner.hide();
          this.openAlert(data.message);
        }
      });
      this.emailReminderDetails(reqObj);
    }
    else if(this.data.emailType == 'reminder'){
      let  reqObj:any = {};
      reqObj['send_email_remainder'] = this.sendEmailReminder == 'true'?'yes':'no';
      reqObj['remainder_frequency'] = this.reminderFrequencyValue;
      reqObj['hr_at_remainder_email_sent'] = this.schedulerRunsValue;

      this.spinner.show();
      this.emailReminderDetails(reqObj);
     
    }

  }
  togglePassword(type){
    this.passwordType = type;
  }

  testemailConnection(){

    this.disableTestConnection = true;
    let  reqObj:any = {};
    reqObj['smtp_server'] = this.smtpHostValue;
    reqObj['smtp_port'] = this.smtpPortValue;
    reqObj['emailAddress'] = this.emailAddressValue;
    reqObj['emailPassword'] = this.emailPasswordValue;

    this.spinner.show();
    this.databaseListService.testEmailsettingDetails(reqObj).subscribe(data => {
     if(data.status == 'success'){
      this.spinner.hide();
      this.disableTestConnection = false;
       this.openAlert('SMTP Server connection successful.');
     }
     else{
      this.spinner.hide();
      this.disableTestConnection = false;
      this.openAlert(data.message);
     }

    });

  }

}