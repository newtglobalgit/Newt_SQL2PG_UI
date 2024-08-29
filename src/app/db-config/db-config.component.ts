import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdConfirmationModal } from '../common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';

import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModalComponent } from '../common/Modal/file-upload-modal/file-upload-modal.component';
import { CommonServices } from '../common/Services/common-services.service';
import { DatabaseListService } from '../common/Services/database-list.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
// import FileSaver from 'file-saver';SAIMA_TBD

declare var $: any;

import * as _ from 'underscore';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../common/Services/login-service.service';
import { DmapMasterEmailSettingsModalComponent } from '../common/Modal/dmap-master-email-settings-modal/dmap-master-email-settings-modal.component';

@Component({
  selector: 'app-db-config',
  templateUrl: './db-config.component.html',
  styleUrls: ['./db-config.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DbConfigComponent implements OnInit {
  @ViewChild('f', { static: false }) dbCredentialsForm: NgForm;
  isChecked: boolean = false;
  migrationDate: any;

  targetsEnv: any[];
  targetEnvValue: any = 'Azure';
  toolTobeUsedValue: any;
  sourceDBSchemaValue: string | null;
  sourceDBTypeValue: any = 'Oracle';
  targetDBTypeValue: any = 'PostgreSQL';
  schemaConfigData: any = [];
  tools: any = [];
  sourceDbs: any = ['Oracle'];
  targetDbs: any = ['PostgreSQL'];

  targetDBHostValue = '';
  targetDBNameValue = '';
  targetDBPortValue = '';
  targetDBSidValue = '';
  targetDBUserNameValue = '';
  targetDBPasswordValue = '';

  sourceDbHostValue = '';
  sourceDBPortValue = '';
  sourceDBSidValue = '';
  sourceDBUserNameValue = '';
  sourceDBPasswordValue = '';
  sourceDBServiceNameValue = '';
  sourceDBNameValue = '';

  makeSourcereadOnly: boolean = true;
  makeTargetreadOnly: boolean = true;

  uploadStatus: any = false;
  numberOnlyPattern = '^((?!(0))[0-9]{4,5})$';
  sourcePasswordType: string = 'password';
  targetPasswordType: string = 'password';

  targetOptionSelected: string = 'existing';
  oracleConnect: string = 'sid';
  newTargetDBRequest: any;
  disableSource: boolean = false;
  disableTarget: boolean = false;

  businessUnitValue: any = '';
  applicationNameValue: any = '';
  appplicationIdValue: any = '';
  applicationSPOCNameValue: any = '';
  applicationSPOCEmailValue: any = '';
  databaseSPOCNameValue: any = '';
  databaseSPOCEmailValue: any = '';
  miscellaneous1Value: any = '';
  miscellaneous2Value: any = '';
  locationValue: any = '';
  showOptionalFields: boolean = false;
  dmapProValidation: boolean = false;
  dmpEnterpriseValidation: boolean = false;
  disableSubmit: boolean = false;

  constructor(
    public dialog: MatDialog,
    private modalService: NgbModal,
    private databaseListService: DatabaseListService,
    private commonservice: CommonServices,
    private loginservice: LoginService,
    private calendar: NgbCalendar,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sourceDBTypeValue = 'Oracle';
    this.targetDBTypeValue = 'PostgreSQL';
    this.getTodaysDate();

    // this.loginservice.getLicenseDetails().subscribe((data: any) => {
    //   let _data = data['current'];
    //   for (let i in _data) {
    //     if (_data[i].hasOwnProperty('licenseType')) {
    //       this.commonservice.setLicenseType(_data[i]['licenseType']);
    //     }
    //   }
    // });

    this.commonservice.$isLicenseTypeObj.subscribe((data) => {
      this.getLicenseType();
    });

    this.commonservice.onuploadChanges.subscribe((status) => {
      this.uploadStatus = status;
    });

    // this.databaseListService.getTargetEnv().subscribe(data => {
    //   this.schemaConfigData = data;

    //   this.targetEnvValue = this.schemaConfigData[1].targetEnv;

    //   this.targetsEnv = _.uniq(this.schemaConfigData, function(item){
    //     return item.targetEnv;
    //   });

    //   this.tools = this.schemaConfigData[1].tools;
    //   this.toolTobeUsedValue = this.schemaConfigData[1].tools[0].name;

    //   this.sourceDbs = this.schemaConfigData[1].tools[0].sourceDbs;
    //   this.sourceDBTypeValue = this.sourceDbs[0].sourceVal;

    //   this.targetDbChange(this.sourceDBTypeValue);

    // });
    // this. getTargetEnvironment();
    this.getLicenseType();
    if (
      this.getLicenseType() != 'trial' &&
      this.getLicenseType() != undefined
    ) {
      this.targetOptionSelected = 'existing';
    } else {
      this.targetOptionSelected = 'new';
    }
    this.commonservice.callMenuControlApi(true);
  }

  getTargetEnvironment() {
    let targetEnvironments = [];
    for (let i in this.targetsEnv) {
      targetEnvironments.push(this.targetsEnv[i]['targetEnv']);
    }
    if (targetEnvironments.indexOf('Azure') > -1) {
      return 'Azure';
    } else {
      return 'AWS';
    }
  }

  getTodaysDate() {
    this.migrationDate = this.calendar.getToday();
  }

  openAlert(msg: any, method = false) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      if (result === 'ok') {
        if (method && this.getLicenseType() == 'dmap enterprise') {
          const modalRef = this.modalService.open(NgbdConfirmationModal);
          modalRef.componentInstance.data = {
            msg: 'Do you want to send automated email reminders?',
            title: 'Confirmation',
            okButtonLabel: 'Yes',
            cancelButtonLabel: 'No',
          };
          modalRef.result.then((result) => {
            if (result === 'ok') {
              this.openEmailReminderSettings();
            } else if (result === 'cancel') {
              this.sendEmailReminder('no');
            }
          });
        }
      }
    });
  }
  sendEmailReminder(status: any) {
    let reqObj = { send_email_remainder: status };
    this.databaseListService.sendEmailReminder(reqObj).subscribe((data) => {
      if (data.status == 'success') {
        console.log('');
      } else {
        this.spinner.hide();
        this.openAlert(data.message);
      }
    });
  }
  openEmailReminderSettings() {
    const modalRef = this.modalService.open(
      { size: 'lg', scrollable: true }
    );
    modalRef.componentInstance.data = {
      title: 'Email Reminder Settings',
      emailType: 'reminder',
    };
    modalRef.result.then((result) => {
      // if (result == 'ok') {
      // }
    });
  }

  onEmailCheckbocClicked(isChecked: any) {
    if (isChecked) {
      $('.emailaddressInput').removeClass('invisible');
      $('#email').attr('required');
    } else {
      $('.emailaddressInput').addClass('invisible');
      $('#email').removeAttr('required');
    }
  }

  opneUploadModal() {
    const modalRef = this.modalService.open(FileUploadModalComponent, {
      size: 'lg',
      scrollable: true,
    });

    modalRef.componentInstance.data = {
      fileType: 'databaseConfig',
      sampleFile: '/assets/sampleTemplates/DBSchemaDetailsForAssessment.xlsx',
      isSampleFileShow: true,
      message:
        'Please click the icon to browse or drag & drop excel file to upload multiple schemas at once.',
    };

    modalRef.result.then((result) => {
      if (result == 'ok') {
        this.openAlert('File uploaded successfully.', true);
      } else {
        if (result != 'cancel')
          this.openAlert('Something went wrong. Please try again.');
      }
    });
  }

  targetEnvChange(e: any) {
    this.schemaConfigData.filter((element: any) => {
      if (element.targetEnv == e.target.value) {
        this.tools = element.tools;
        this.toolChange(this.tools[0].name);
      }
    });
    this.toolTobeUsedValue = this.tools[0].name;
  }

  toolChange(evt: any) {
    this.tools.filter((element: any) => {
      if (element.name == evt) {
        this.sourceDbs = element.sourceDbs;
        this.targetDbChange(this.sourceDbs[0].sourceVal);
      }
    });
    this.sourceDBTypeValue = this.sourceDbs[0].sourceVal;
  }

  targetDbChange(sourceSelected: any) {
    this.targetDbs = this.sourceDbs.filter(function (item: any) {
      return item.sourceVal == sourceSelected;
    })[0].targetVal;
    if (this.targetEnvValue == 'Azure') {
      let removalElement;
      for (let i in this.targetDbs) {
        if (this.targetDbs[i].includes('Community')) {
          removalElement = this.targetDbs[i];
        }
      }
      var index = this.targetDbs.indexOf(removalElement);
      if (index > -1) {
        this.targetDbs.splice(index, 1);
      }
    } else if (this.targetEnvValue == 'On-Prem') {
      let removalElement;
      for (let i in this.targetDbs) {
        if (this.targetDbs[i].includes('Azure')) {
          removalElement = this.targetDbs[i];
        }
      }
      var indexPrem = this.targetDbs.indexOf(removalElement);
      if (indexPrem > -1) {
        this.targetDbs.splice(indexPrem, 1);
      }
    }
    this.targetDBTypeValue = this.targetDbs[0];
  }

  toggleSourcePassword(type: any) {
    this.sourcePasswordType = type;
  }

  toggleTargetPassword(type: any) {
    this.targetPasswordType = type;
  }

  onRadioSelected(event: any) {
    this.targetOptionSelected = event.target.value;
  }

  onRadioButtonSelected(event: any) {
    this.oracleConnect = event.target.value;
  }
  onClear(isClearBtnClicked: any) {
    this.dbCredentialsForm.resetForm();
    this.makeSourcereadOnly = true;
    this.makeTargetreadOnly = true;

    if (isClearBtnClicked) {
      this.targetOptionSelected = 'existing';
      this.oracleConnect = 'sid';
    }

    setTimeout(() => {
      this.targetDBHostValue = '';
      this.targetDBNameValue = '';
      this.targetDBPortValue = '';
      this.targetDBSidValue = '';
      this.targetDBUserNameValue = '';
      this.targetDBPasswordValue = '';
      this.ngOnInit();
    }, 50);
  }

  testSourceDbConnection(isTestSrcConBtnClicked: any) {
    this.disableSource = true;
    this.spinner.show();

    let reqObj = {
      sourceDBType: this.sourceDBTypeValue,
      schemaName: this.sourceDBSchemaValue || '',
      databaseName: this.sourceDBNameValue,
      sourceDBHost: this.sourceDbHostValue,
      sourceDBPort: this.sourceDBPortValue,
      sourceDBSid:
        this.oracleConnect == 'sid'
          ? this.sourceDBSidValue
          : this.sourceDBServiceNameValue,
      sourceDBUserName: this.sourceDBUserNameValue,
      sourceDBPassword: this.sourceDBPasswordValue,
      sourceDBiSSid: this.oracleConnect === 'sid',
    };

    this.databaseListService.testSourceDbConnection(reqObj).subscribe((res) => {
      this.spinner.hide();
      this.disableSource = false;
      if (res[0].status === 'SUCCESS') {
        this.makeSourcereadOnly = false;
        if (isTestSrcConBtnClicked) {
          this.openAlert('Connection Successful.');
        }
      } else {
        this.makeSourcereadOnly = true;
        this.openAlert(res[0].message);
      }
    });
  }

  testTargetDbConnection() {
    let reqObj = {
      targetDBType: this.targetDBTypeValue,
      targetDBHost: this.targetDBHostValue,
      targetDBName: this.targetDBNameValue,
      targetDBPort: this.targetDBPortValue,
      targetDBUserName: this.targetDBUserNameValue,
      targetDBPassword: this.targetDBPasswordValue,
    };
    this.disableTarget = true;
    this.spinner.show();
    this.databaseListService
      .testTargetDbConnection(reqObj)
      .subscribe((data) => {
        this.spinner.hide();
        if (data[0].status === 'SUCCESS') {
          this.disableTarget = false;
          this.makeTargetreadOnly = false;
          this.openAlert('Connection Successful.');
        } else {
          this.disableTarget = false;
          this.makeTargetreadOnly = true;
          this.openAlert(data[0].message);
        }
      });
  }

  testAzureAndSourceConnections() {
    this.spinner.show();
    let reqObj = this.updateTheFormDataForNewDBCreation();

    this.databaseListService
      .testAzureAndSourceDbConnection(reqObj)
      .subscribe((res) => {
        if (res[0].status === 'SUCCESS') {
          this.submitForm(reqObj);
        } else {
          this.spinner.hide();
          this.openAlert(res[0].message+ 'Birds arent real');
        }
      });
  }

  openConfirmationModal(dbcredentialsdata: any) {
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {
      msg: 'Incomplete target database credentials. Do you want to proceed anyway?',
      title: 'Confirmation',
      okButtonLabel: 'Ok',
      cancelButtonLabel: 'Cancel',
    };
    modalRef.result.then((result) => {
      if (result === 'ok') {
        this.submitForm(dbcredentialsdata);
      }
    });
  }

  isAllRequiredFieldsForCreateNewDB() {
    let steps = this.newTargetDBRequest.steps;

    for (let i in steps) {
      for (let y in steps[i].fields) {
        if (steps[i].fields[y].isRequired) {
          if (steps[i].fields[y].type == 'number') {
            if (
              this.newTargetDBRequest.targetDBForm.value[
                steps[i].fields[y].name
              ] == null
            ) {
              return false;
            }
          } else {
            if (
              this.newTargetDBRequest.targetDBForm.value[
                steps[i].fields[y].name
              ].trim().length == 0
            ) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  onSubmit() {
    this.disableSubmit = true;
    const dbcredentialsdata: any = this.dbCredentialsForm.value;
    dbcredentialsdata.user_id = sessionStorage['user_id'];
    dbcredentialsdata.toolTobeUsed = 'ORA2PG';
    dbcredentialsdata.targetEnv = 'Azure';
    dbcredentialsdata.sourceDBSid =
      this.oracleConnect == 'sid'
        ? this.sourceDBSidValue
        : this.sourceDBServiceNameValue;
    dbcredentialsdata.sourceDBiSSid =
      this.oracleConnect === 'sid';
    if (this.targetOptionSelected == 'existing') {
      this.submitWithExistingTarget(dbcredentialsdata);
      this.disableSubmit = false;
    } else {
      this.submitWithNewTarget();
      this.disableSubmit = false;
    }
  }

  submitWithExistingTarget(dbcredentialsdata: any) {
    let temArray = [];
    let notNullTarget = false;
    temArray.push(dbcredentialsdata.targetDBHost);
    temArray.push(dbcredentialsdata.targetDBName);
    temArray.push(dbcredentialsdata.targetDBPort);
    temArray.push(dbcredentialsdata.targetDBUserName);
    temArray.push(dbcredentialsdata.targetDBPassword);

    for (let i in temArray) {
      if (!temArray[i]) {
        notNullTarget = true;
        break;
      }
    }
    if (
      dbcredentialsdata.targetDBHost.length <= 0 &&
      dbcredentialsdata.targetDBName.length <= 0 &&
      dbcredentialsdata.targetDBPort.length <= 0 &&
      dbcredentialsdata.targetDBUserName.length <= 0 &&
      dbcredentialsdata.targetDBPassword.length <= 0
    ) {
      this.openConfirmationModal(dbcredentialsdata);
    } else {
      if (notNullTarget) {
        this.openAlert('Please enter all the target db details.');
      } else {
        this.submitForm(dbcredentialsdata);
      }
      //this.submitForm(dbcredentialsdata);
    }
  }

  submitWithNewTarget() {
    if (
      !this.newTargetDBRequest.targetDBForm.valid ||
      !this.isAllRequiredFieldsForCreateNewDB()
    ) {
      alert(this.isAllRequiredFieldsForCreateNewDB());
      this.openAlert(
        `Please enter all the mandatory fields to create new single PostgreSQL server instance on azure for ${this.newTargetDBRequest.targetDBForm.value.targetEnv} database.`
      );
      return;
    }

    this.testAzureAndSourceConnections();
  }

  submitForm(dbcredentialsdata: any) {
    /* Hiding spinner and reseting the form before going into success block since the process takes more than 15 mins */
    if (this.targetOptionSelected == 'new') {
      setTimeout(() => {
        this.spinner.hide();
        this.openAlert('Submitted successfully.');
        this.router.navigate(['/dbAssessment']);
        this.commonservice.setIsDBListChanged(true);
        this.onClear(false);
      }, 2000);
    }

    /* Added the timer in order to give some buffer for the  listenerCreateNewDBFinish() method to capture all the value*/
    setTimeout(() => {
      this.disableSubmit = true;
      this.databaseListService
        .senddbconfigDetails(dbcredentialsdata, this.targetOptionSelected)
        .subscribe((data) => {
          // this.disableSubmit = false;
          if (this.targetOptionSelected == 'existing') {
            this.spinner.hide();
            if (data.status === 'success') {
              this.openAlert('Submitted successfully.');
              this.router.navigate(['/dbAssessment']);
              this.commonservice.setIsDBListChanged(true);
              this.commonservice.viewDataseDetail(true);

              this.databaseListService.getDBlist().subscribe(
                (data) => {
                  this.databaseListService.removeAllCheckedDBRecords();
                  this.databaseListService.addCheckedRecord(data[0]);
                  this.databaseListService.setSavedTableDataStatus(data[0]);
                  this.databaseListService.setIsAccordianExpanded(
                    data[0],
                    false
                  );
                },
                (error) => {}
              );
              this.onClear(true);
            } else {
              this.openAlert(data.message);
              this.disableSubmit = false;
            }
          } else {
            this.onClear(true);
          }
        });
    }, 100);
  }

  /* This method listen and capture values as soon as the child component's form value changes */
  listenerCreateNewDBFinish(data: any) {
    this.newTargetDBRequest = data;
  }

  updateTheFormDataForNewDBCreation() {
    const targeNewtDBCredentials: any =
      this.newTargetDBRequest.targetDBForm.value;
    return {
      ...targeNewtDBCredentials,
      sourceDBType: this.dbCredentialsForm.value['sourceDBType'],
      sourceDBHost: this.dbCredentialsForm.value['sourceDBHost'],
      sourceDBName: this.dbCredentialsForm.value['sourceDBName'],
      sourceDBSchema: this.dbCredentialsForm.value['sourceDBSchema'],
      sourceDBPort: this.dbCredentialsForm.value['sourceDBPort'],
      sourceDBSid:
        this.oracleConnect == 'sid'
          ? this.sourceDBSidValue
          : this.sourceDBServiceNameValue,
      sourceDBUserName: this.dbCredentialsForm.value['sourceDBUserName'],
      sourceDBPassword: this.dbCredentialsForm.value['sourceDBPassword'],
      sourceBackupDirectoryName:
        this.dbCredentialsForm.value['sourceBackupDirectoryName'],
      sourceServiceName: this.dbCredentialsForm.value['sourceServiceName'],
      sourceDBiSSid: this.oracleConnect === 'sid',
    };
  }

  getLicenseType() {
    if (this.commonservice.getLicenseType() == 'dmap pro') {
      this.dmapProValidation = true;
    } else if (this.commonservice.getLicenseType() == 'dmap enterprise') {
      this.dmpEnterpriseValidation = true;
    } else {
      this.dmapProValidation = false;
      this.dmpEnterpriseValidation = false;
    }
    return this.commonservice.getLicenseType();
  }
  toggle() {
    this.showOptionalFields = !this.showOptionalFields;
  }
}
