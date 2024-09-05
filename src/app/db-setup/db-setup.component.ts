import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { Sql2PgService } from '../common/Services/sql2pg.service';
import { Router } from '@angular/router';
import { DataService } from '../common/Services/data.service';

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
numberOnlyPattern: any;
  result: any;
  current_run_id: any;

  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private sql2PgService: Sql2PgService,
    private router: Router,
    private dataService : DataService
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

  onSubmit(isSubmitBtnClicked) {
    isSubmitBtnClicked = true
    this.disableSubmit = true;
    const dbcredentialsdata: any = this.dbCredentialsForm.value;
    console.log('db setup submit data - ', dbcredentialsdata);
  
    this.sql2PgService.senddbconfigDetails(dbcredentialsdata).subscribe((res) => {
      this.result =res;
      console.log(res[0].status)
      console.log(this.result)
      if (res[0].status === 'SUCCESS') {
        if (isSubmitBtnClicked) {
          this.openAlert('Submitted Successfully');
          this.router.navigate(['/dbAssessment']);
          this.current_run_id = res[0].run_id

          // this.sql2PgService.getInsertedData(this.current_run_id).subscribe(
          //   (data) => {
          //     console.log(data)
          //     // Navigate to the dbAssessment page and pass the data
          //     this.router.navigate(['/dbAssessment'], {
          //       state: { tableData: data },
          //     });
          //   },
          //   (error) => {
          //     console.error('Error fetching data:', error);
          //   }
          // );

          this.sql2PgService.getInsertedData(this.current_run_id).subscribe(
            (response) => {
              console.log('Response:', response);
              
              // Check if the response exists and contains data
              if (response && response.length > 0) {
                 
                 const table_data = response

                 console.log(table_data)
                 
                if (table_data.length > 0) {
                  this.dataService.setTableData(table_data); 
                  // Navigate to the dbAssessment page and pass the formatted data
                  this.router.navigate(['/dbAssessment'], {
                    state: { table_data },
                  });
                } else {
                  console.warn('No valid table data available to navigate.');
                }
              } else {
                console.warn('Response is empty or undefined.');
              }
            },
            (error) => {
              console.error('Error fetching data:', error);
            }
          );
          
          
          
        }
      } else {
        this.openAlert('fail');
      }
    });
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
