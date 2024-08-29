import { Injectable, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DatabaseListService } from './database-list.service';
import { EventEmitterService } from './event-emitter.service';
import { PdfChartService } from './pdf-chart.service';
import { DatabaseSchemaMigrationService } from './database-schemMigration.service';
import { PdfContentService } from './pdf-content.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseSchemaAssesmentService } from './database-schemaAssesment.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import * as _ from 'lodash';
import { NgbdConfirmationModal } from '../Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseDataMigrationService } from './database-data-migration.service';
import { DmapAlertDialogModal } from '../Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { DataMigrationSettingsModalComponent } from '../Modal/data-migration-settings-modal/data-migration-settings-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from './login-service.service';
declare var $: any;


@Injectable({
  providedIn: 'root',
})
export class CommonServices {
  licenseType: string = '';
  isDBListChanged: boolean = false;
  showTab: boolean = false;
  isExportClickedData: any = '';
  batchTabClickedData: boolean = false;
  accordianExpandedData: any[] = [];
  $isDBListChanged = new BehaviorSubject<boolean>(this.isDBListChanged);
  $isDBListChangedObj = this.$isDBListChanged.asObservable();
  actionButtonLabel: string; //option: ViewDetail|Export
  migrationMode: any = null;
  isDumpDataFile: boolean = false;
  nodeType: any;
  setShowLicensePagee: any = null;
  changedStages: any[] = [];
  masterNodeIPVal:string = "";

  $isLicenseType = new BehaviorSubject<string>(this.licenseType);
  $isLicenseTypeObj = this.$isLicenseType.asObservable();

  /* This observables help you show hide the second accordian on the click of Existing Migration and Getting Started Tab */
  $isShowSecondAccordian = new BehaviorSubject<boolean>(this.showTab);
  $isShowSecondAccordianObj = this.$isShowSecondAccordian.asObservable();

  $exportClicked = new BehaviorSubject<any>(this.isExportClickedData);
  $exportClickedObj = this.$exportClicked.asObservable();

  $batchTabClicked = new BehaviorSubject<any>(this.batchTabClickedData);
  $batchTabClickedObj = this.$batchTabClicked.asObservable();

  $isSetAccordianView = new BehaviorSubject<any[]>(this.accordianExpandedData);
  $isSetAccordianViewdObj = this.$isSetAccordianView.asObservable();

  $isStagesChanged = new BehaviorSubject<any[]>(this.changedStages);
  $isStagesChangedObj = this.$isStagesChanged.asObservable();

  activeRunId: any = null;

  private showMinWindowSource = new BehaviorSubject<boolean>(false);
  showMinWindow$ = this.showMinWindowSource.asObservable();

  private showValidationReportSource = new BehaviorSubject<boolean>(false);
  showValidationReport$ = this.showValidationReportSource.asObservable();

  private showMinWindowError = new BehaviorSubject<boolean>(false);
  showMinError$ = this.showMinWindowError.asObservable();

  private disableWorkerNode = new BehaviorSubject<boolean>(false);
  disableFlag$ = this.disableWorkerNode.asObservable();
  private enableFileUploadButton = new BehaviorSubject<string>(this.masterNodeIPVal);
  enableFileUpload$ = this.enableFileUploadButton.asObservable();

  private callMenuControlAPI = new BehaviorSubject<boolean>(false);
  callMenuControl$ = this.callMenuControlAPI.asObservable();

  private submitDisabledSubject = new BehaviorSubject<boolean>(false);
  submitDisabled$ = this.submitDisabledSubject.asObservable();

  constructor(
    private databaseListService: DatabaseListService,
    private eventEmitterService: EventEmitterService,
    private pdfChartService: PdfChartService,
    private pdfContentService: PdfContentService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private modalService: NgbModal,
    private databaseSchemaMigrationService: DatabaseSchemaMigrationService,
    public dialog: MatDialog,
    private config: AppConfigService,
    private loginService: LoginService
  ) {}

  currentViewChanged = new EventEmitter<string>();
  onuploadChanges = new EventEmitter<any>();

  toggleMinWindow() {
    this.showMinWindowSource.next(!this.showMinWindowSource.value);
  }

  closeMinimizedWindow() {
    this.showMinWindowSource.next(false);
  }
  
  showMinErrorWindow() {
    this.showMinWindowError.next(!this.showMinWindowError.value);
  }

  toggleWorkerNodebutton(value:boolean) {
    this.disableWorkerNode.next(value);
  
  }
  showValidationReportFunc(data) {
    this.showValidationReportSource.next(data);
  }
  
  getLicenseType() {
    //return this.licenseType;
    return sessionStorage['licenseType'];
  }

  setLicenseType(licenseType: any) {
    if (licenseType == null) {
      delete sessionStorage['nodeType'];
    } else {
      sessionStorage['licenseType'] = licenseType;
    }
    this.licenseType = licenseType;
    this.$isLicenseType.next(this.licenseType);
  }

  getMigrationMode() {
    return this.migrationMode;
  }

  setMigrationMode(migrationMode: any) {
    this.migrationMode = migrationMode;
  }

  setActionButtonClicked(buttonLabel: any) {
    this.actionButtonLabel = buttonLabel;
  }

  getActionButtonClicked() {
    return this.actionButtonLabel;
  }

  setIsDBListChanged(isDBListChanged: boolean) {
    this.$isDBListChanged.next(isDBListChanged);
  }

  setExportByRunIdClicked(isExportClickedData: any) {
    this.$exportClicked.next(isExportClickedData);
  }

  refreshAccordianView(accordianExpandedData: []) {
    this.$isSetAccordianView.next(accordianExpandedData);
  }

  refreshStageFilters(changedStages) {
    this.$isStagesChanged.next(changedStages);
  }

  removeFromViewDetail(runId: any) {
    this.databaseListService.removeAllCheckedDBRecords();
    this.pdfChartService.removeChart(runId);
  }

  export(isScroll: any, reportType: any) {
    this.spinner.show();
    this.viewDataseDetail(isScroll);

    setTimeout(() => {
      let chartData = this.databaseListService.getSavedCheckedDBRecords();

      for (let i in chartData) {
        if (reportType == undefined) {
          reportType = chartData[i].step;
        }

        if (reportType == 'Discovery') {
          this.pdfContentService.downloadDiscoveryReport(
            chartData[i].runId + '',
            reportType
          );
        }

        if (reportType == 'Assessment') {
          this.pdfChartService.downloadNewAssessmentReport(
            chartData[i].runId + '',
            reportType
          );
        }

        if (reportType == 'Schema Conversion') {
          this.pdfContentService.downloadNewSchemaConversionReport(
            chartData[i].runId + '',
            reportType
          );
        }
      }
      this.setActionButtonClicked('ViewDetail');
    }, 10000);
  }

  viewDataseDetail(isScoll: boolean, showAlert = false,stage='') {
    let savedCheckedTableData =
      this.databaseListService.getSavedCheckedDBRecords();
    let schemasNotFound = this.databaseListService.getschemasNotFound();

    if (savedCheckedTableData.length == 0 && showAlert) {
      this.openAlert('Please select a schema to view detail.');
    } else {
      if(!schemasNotFound){
        let accordianId = 'dbSecondAcc';
        let refId = 'nav-migrationStatus';

        this.$isShowSecondAccordian.next(true);

        // if (isScoll) {
        //   $('html, body').animate(
        //     {
        //       scrollTop: $('#dbSecondAccMainDiv').offset().top,
        //     },
        //     'slow',
        //     'linear'
        //   );
        // }

        if (savedCheckedTableData.length > 0) {
          // $('#'+accordianId).trigger( "click" );
          $('#' + accordianId).addClass('show');

          $('a#' + refId).tab('show');
          $('#' + accordianId + 'MainDiv').addClass(
            'shadow mb-5 bg-white rounded'
          );

          $('#href_0').addClass('show');

          if(stage != ''){
            for (let j in savedCheckedTableData){
              savedCheckedTableData[j].currentReportView = stage;
            }
          }

          for (let i in savedCheckedTableData)
            this.eventEmitterService.onViewDetailButtonClick(
              savedCheckedTableData[i]
            );
        }
        this.spinner.hide();
      }

    }
  }

  setChartContainerHeightDynamically(chart: any) {
    // Set cell size in pixels
    let cellSize = 50;
    chart.events.on('datavalidated', function (ev: any) {
      // Get objects of interest
      let chart = ev.target;
      let categoryAxis = chart.yAxes.getIndex(0);

      // Calculate how we need to adjust chart height
      let adjustHeight =
        chart.data.length * cellSize - categoryAxis.pixelHeight;

      // get current chart height
      let targetHeight = chart.pixelHeight + adjustHeight;

      // Set it on chart's container
      chart.svgContainer.htmlElement.style.height = targetHeight + 'px';
    });
  }

  downloadExcelReport(runId: any) {
    return this.http.get(this.config.host + '/downloadExcel?RUN_ID=' + runId, {
      responseType: 'blob',
    });
  }

  downloadValidationExcel(){
    return this.http.get(this.config.host + '/downloadValidationExcel', {
      responseType: 'blob',
    });
  }

  openAlert(msg: any) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      // if (result == 'ok') {
      // } else {
      // }
    });
  }

  startDataMigration(runId: any) {
    this.migrationMode = this.getMigrationMode();
    if (this.migrationMode) {
      const modalRef = this.modalService.open(NgbdConfirmationModal);
      modalRef.componentInstance.data = {
        msg: 'Data in target PostgreSQL DB may be overwritten by data from Source Oracle DB. Are you sure you want to proceed?',
        title: 'Confirmation',
        okButtonLabel: 'Ok',
        cancelButtonLabel: 'Cancel',
        label: 'moveToCompletion',
      };
      modalRef.result.then((result) => {
        if (result == 'ok') {
          this.spinner.show();
          let reqObj = {
            RUN_ID: runId,
          };
          this.databaseSchemaMigrationService
            .startDataMigration(reqObj)
            .subscribe((data: any) => {
              if (data.status == 'failed') {
                this.openAlert(data.message);
              }
            });
          this.spinner.hide();
        }
      });
    } else {
      const modalRef = this.modalService.open(DmapAlertDialogModal);
      modalRef.componentInstance.data = {
        msg: 'Update Data Migration Settings before proceeding with Data Migration',
        title: 'Alert',
      };
      modalRef.result.then((result) => {
        if (result == 'ok') {
          const dialogRef = this.dialog.open(
            DataMigrationSettingsModalComponent,
            {
              disableClose: true,
              width: '900px',
              data: { runId: runId, showError: false },
            }
          );
          dialogRef.afterClosed().subscribe((result) => {
            console.log('result', result);
            if (result && result.action == 'success') {
              this.isDumpDataFile =
                result.settingsData.generate_dump_only != 0;
              this.startDataMigration(runId);
            }
          });
        }
        // else {
        // }
      });
      //this.openAlert("Update Data Migration Settings before proceeding with Data Migration");
    }
  }

  setNodeType(nodeType: any) {
    if (nodeType == null) {
      delete sessionStorage['nodeType'];
    } else {
      sessionStorage['nodeType'] = nodeType;
    }
    this.nodeType = nodeType;
  }
  getNodeType() {
    //return this.nodeType;
    return sessionStorage['nodeType'];
  }
  setShowLicensePage(data: any) {
    this.setShowLicensePagee = data;
    sessionStorage['show_license_details'] = data;
  }

  getShowLicensePage() {
    return this.setShowLicensePagee;
  }

  enableRestoreDMAPFunc(data) {
    this.enableFileUploadButton.next(data);
  }

  callMenuControlApi(value:boolean) {
    this.callMenuControlAPI.next(value);
  }

   setSubmitDisabled(value: boolean): void {
    this.submitDisabledSubject.next(value);
  }

}
