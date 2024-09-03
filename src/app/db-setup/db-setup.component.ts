import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { Sql2PgService } from '../common/Services/sql2pg.service';

@Component({
  selector: 'app-db-setup',
  templateUrl: './db-setup.component.html',
  styleUrls: ['./db-setup.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DbSetupComponent implements OnInit {
  @ViewChild('f', { static: false }) dbCredentialsForm: NgForm;

  sourceDBTypeValue: any = 'MsSql';
  targetDBTypeValue: any = 'Postgres';
  oracleConnect: string = 'sid';

  sourceDbs: any = ['MsSql'];
  targetDbs: any = ['Postgres'];

  disableSubmit: boolean = false;
  disableSource: boolean = false;
  disableTarget: boolean = false;

  sourceDBSchemaValue: string | null;
  sourceDriverNameValue = '';
  sourceDBNameValue = '';
  sourceDbHostValue = '';
  sourceDBPortValue = '';
  sourceDBSidValue = '';
  sourceDBServiceNameValue = '';
  sourceDBUserNameValue = '';
  sourceDBPasswordValue = '';

  targetDBPasswordValue = '';
  targetDBUserNameValue = '';
  targetDBHostValue = '';
  targetDBNameValue = '';
  targetDBPortValue = '';

  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private sql2PgService: Sql2PgService
  ) {}

  ngOnInit(): void {}

  onRadioButtonSelected(event: any) {
    this.oracleConnect = event.target.value;
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
      sourceDBDriver: this.sourceDriverNameValue,
      sourceDBSid:
        this.oracleConnect == 'sid'
          ? this.sourceDBSidValue
          : this.sourceDBServiceNameValue,
      sourceDBUserName: this.sourceDBUserNameValue,
      sourceDBPassword: this.sourceDBPasswordValue,
      sourceDBiSSid: this.oracleConnect === 'sid',
    };

    this.sql2PgService.testSourceDbConnection(reqObj).subscribe((res) => {
      this.spinner.hide();
      this.disableSource = false;
      if (res[0].status === 'SUCCESS') {
        if (isTestSrcConBtnClicked) {
          this.openAlert('Connection Successful.');
        }
      } else {
        this.openAlert(res[0].message);
      }
    });
  }

  testTargetDbConnection(isTestTargetConBtnClicked) {
    this.disableTarget = true;
    this.spinner.show();

    let reqObj = {
      targetDBType: this.targetDBTypeValue,
      databaseName: this.targetDBNameValue,
      targetDBHost: this.targetDBHostValue,
      targetDBPort: this.targetDBPortValue,
      targetDBUserName: this.targetDBUserNameValue,
      targetDBPassword: this.targetDBPasswordValue,
    };

    this.sql2PgService.testTargetDbConnection(reqObj).subscribe((res) => {
      this.spinner.hide();
      this.disableSource = false;
      if (res[0].status === 'SUCCESS') {
        if (isTestTargetConBtnClicked) {
          this.openAlert('Connection Successful.');
        }
      } else {
        this.openAlert(res[0].message);
      }
    });
  }

  onSubmit() {
    this.disableSubmit = true;
    const dbcredentialsdata: any = this.dbCredentialsForm.value;
    console.log('db setup submit data - ', dbcredentialsdata);
  }

  openAlert(msg: any, method = false) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      if (result === 'ok') {
      }
    });
  }
}
