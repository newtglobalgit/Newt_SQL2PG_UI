import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;
import * as _ from 'underscore';
import { DatabaseListService } from '../../Services/database-list.service';
import { EventEmitterService } from '../../Services/event-emitter.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonServices } from '../../Services/common-services.service';
import { PdfChartService } from '../../Services/pdf-chart.service';
import { NgbdConfirmationModal } from '../../Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { MergePrioritySelectionModalComponent } from '../../Modal/merge-priority-selection-modal/merge-priority-selection-modal.component';
import { PdfContentService } from 'src/app/common/Services/pdf-content.service';
import { DatabaseSchemaMigrationService } from 'src/app/common/Services/database-schemMigration.service';
import { DmapUpdatePasswordComponent } from '../../Modal/dmap-update-password/dmap-update-password.component';
import { toastAnimationLeft } from '../../Animation/toastAnimationLeft';
import { saveAs } from 'file-saver';
import { FileUploadModalComponent } from '../../Modal/file-upload-modal/file-upload-modal.component';
import { DmapAlertDialogModal } from '../../Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { SchemaMigrationConfirmationModalComponent } from '../../Modal/schema-migration-confirmation-modal/schema-migration-confirmation-modal.component';
import { DmapMultipleSchemaDeleteComponent } from '../../Modal/dmap-multiple-schema-delete/dmap-multiple-schema-delete.component';
import { Router } from '@angular/router';
import { DataMigrationSettingsModalComponent } from '../../Modal/data-migration-settings-modal/data-migration-settings-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DatabaseDataMigrationService } from '../../Services/database-data-migration.service';
import { DataMigrationDumpDataModalComponent } from '../../Modal/data-migration-dump-data-modal/data-migration-dump-data-modal.component';
import { MultiFieldFilterPipe } from '../../Pipes/multi-field-filter.pipe';

@Component({
  selector: 'app-dmap-table',
  templateUrl: './dmap-table.component.html',
  styleUrls: ['./dmap-table.component.css'],
  animations: [toastAnimationLeft],
  encapsulation: ViewEncapsulation.None,
  providers: [MultiFieldFilterPipe]
})
export class DmapTableComponent implements OnInit, OnChanges {
  @Input() tableCaption: string;
  @Input() tableSettings: any;
  @Input() tableContent: any[];
  @Input() nodeType: any;
  @Input() licenseType: any;
  @Input() disableSchemaConversion: any;
  // toastState = 'hide'

  radioCheckedValue: any;
  checkedSchemas: any[] = [];

  searchDmapTable: string;
  tableHeaders: any[];
  tableData: any[];
  savedCheckedTableData: any[];
  disableAssignWorkerNode: boolean;
  sourceSchemas: any[];
  sourceDbs: any[];
  targetDbs: any[];
  creators: any[];
  requests: any[];
  steps: any[];
  stepStatuses: any[];
  lastUpdates: any[];
  bUnits: any[];
  appNames: any[];
  assignedVms: any[];
  selectedStage: any = 'Assessment';
  currentUrl: any;
  schemaStage: any;
  schemaStatus: any;
  enableDiscoveryReport: boolean = false;
  enableAssessmentReport: boolean = false;
  enableSchemaConversionReport: boolean = false;
  enableDataMigrationReport: boolean = false;
  isDataMigrationChecked: boolean = false;
  isDumpDataFile: boolean = false;
  userLogin: string;

  p: number = 1;
  checkedDBRecords: any[];
  showButtons: any = false;
  noschemasFound: any = false;
  selected_schemas: any[] = [];
  disableDeleteButton: boolean = false;

  backupdata: any[];
  backupdataSetings: any;
  restoredata: any[];
  restoredataSetings: any;

  isSchemasExists = false;
  pageHeader: any;
  schemasNotFound: any = false;
  currentReportView: any;
  runId: any;
  selectedRow: any;
  testButtonShown: boolean = false;
  reValidateTag: any = 'dmapAccordian';

  validationData: any[];
  errordatalen: any;
  errorDetailsData: any[];
  totalCount:any = "";
  disableDiscoverAll:boolean = true;
  getEnableDiscoverAllCalls:any;
  hasValidationErrors: boolean = false;

  constructor(
    private modalService: NgbModal,
    private commonservice: CommonServices,
    private router: Router,
    private location: Location,
    public dialog: MatDialog,
    private databaseSchemaMigrationService: DatabaseSchemaMigrationService,
    private databaseDataMigrationService: DatabaseDataMigrationService,
    private databaseListService: DatabaseListService,
    private spinner: NgxSpinnerService,
    private multiFieldFilter: MultiFieldFilterPipe
  ) {
    router.events.subscribe((val) => {
      if (this.currentUrl.indexOf('dbAssessment')) {
        this.selectedStage = 'Assessment';
      } else if (this.currentUrl.indexOf('schemaConversion')) {
        this.selectedStage = 'Schema Conversion';
      } else if (this.currentUrl.indexOf('dataMigration')) {
        this.selectedStage = 'Data Migration';
      }
    });
  }

  ngOnInit() {
    this.commonservice.disableFlag$.subscribe((val) => {
      this.disableAssignWorkerNode = val;
    })
    
    sessionStorage['DMSelectedDatabase'] = undefined;
    sessionStorage['SCSelectedDatabase'] = undefined;
    this.schemaStage = '';
    sessionStorage['assessmentSelectedDatabase'] = undefined;
    this.getPageHeading();
    this.getEnableDiscoverAll();
    //this.tableData = this.tableContent ? this.tableContent.slice() : [];
    this.filterDataByStage();

    this.licenseType = this.commonservice.getLicenseType();

    this.databaseListService.$savedTableDataChangedObj.subscribe(
      (savedDBList: any[]) => {
        this.checkedDBRecords = savedDBList;
        if (this.checkedDBRecords.length > 0) {
          // this.radioCheckedValue = this.checkedDBRecords[0]['runId']; commenting for NDMAP-4282 ticket
        }
      }
    );

    this.commonservice.$isSetAccordianViewdObj.subscribe((data: any[]) => {
      if (data != undefined && data.length > 0) {
        this.databaseListService.setIsAccordianExpanded(data[0].runId, false);
        setTimeout(() => {
          this.commonservice.viewDataseDetail(false);
        }, 1000);
      }
    });

    this.commonservice.$isStagesChangedObj.subscribe((data: any[]) => {
      //this.tableContent = data;
      //this.filterDataByStage();
    });

    /* This provoke the Export button above the dmap table */
    this.commonservice.$exportClickedObj.subscribe((data: any) => {
      if (data != undefined)
        if (data.status) {
          this.export(false, data.reportType);
        }
    });

    // this.loadDefaultSchema(); commenting for NDMAP-4282 ticket

    this.getEnableDiscoverAllCalls = setInterval(() => {
      this.getEnableDiscoverAll();
      }, 5000);

  }

  ngOnDestroy(): void {
    clearInterval(this.getEnableDiscoverAllCalls);
    this.databaseListService.removeAllCheckedDBRecords();
  }


  getEnableDiscoverAll(){
    this.databaseListService.getEnableDiscoverAll().subscribe((res)=>{
      if(res['status'] == 'success'){
        if(res['enable']){
          this.disableDiscoverAll = false;
        } else {
          this.disableDiscoverAll = true;
        }
      }
    })
  }

  runDiscoverAll(){
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {
      msg: 'Once the process is initiated, please check the reports screen for any updates.',
      title: 'Discover all',
      okButtonLabel: 'Ok',
      cancelButtonLabel: 'Cancel',
    };
    modalRef.result.then((result) => {
      if (result === 'ok') {
        this.databaseListService.discoverAll().subscribe((res)=>{
           this.spinner.hide();
          // if(res['status']=='success'){
          //   this.spinner.hide();
          // } else {
          //   this.spinner.hide();
          // }
        })
      }
    });
  }

  loadDefaultSchema() {
    if (this.tableData.length > 0) {
      let selecteDatabase_;
      let allStageRunIds = this.tableData.map((i) => i.runId);
      //let selecteDatabase_ = sessionStorage.getItem('selecteDatabase');
      if (this.selectedStage == 'Assessment') {
        selecteDatabase_ = sessionStorage.getItem('assessmentSelectedDatabase');
      } else if (this.selectedStage == 'Schema Conversion') {
        selecteDatabase_ = sessionStorage.getItem('SCSelectedDatabase');
      } else if (this.selectedStage == 'Data Migration') {
        selecteDatabase_ = sessionStorage.getItem('DMSelectedDatabase');
      }

      let selecteDatabase = JSON.parse(selecteDatabase_);

      if (selecteDatabase && selecteDatabase != undefined) {
        let selectedrunId = selecteDatabase['runId'];
        if (allStageRunIds.includes(selectedrunId)) {
          this.onRadioClicked(selecteDatabase);
        } else {
          this.onRadioClicked(this.tableData[0]);
        }
      } else {
        this.onRadioClicked(this.tableData[0]);
      }
    }
  }

  filterDataByStage() {
    this.tableData = this.tableContent ? this.tableContent : [];
  
    const isAssessmentStage = this.selectedStage === 'Assessment';
    const isSchemaConversionStage = this.selectedStage === 'Schema Conversion';
    const isDataMigrationStage = this.selectedStage === 'Data Migration';
  
    if (isAssessmentStage) {
      this.tableData = this.tableData.filter(
        item => ['Discovery', 'Assessment', 'Validation'].includes(item.step)
      );
    } else if (isSchemaConversionStage || isDataMigrationStage) {
      const tupleList = isSchemaConversionStage
        ? [['Assessment', 'Completed']]
        : [
            ['Schema Conversion', 'Processing Done'],
            ['Schema Conversion', 'Completed']
          ];
  
      this.tableData = this.tableData.filter(
        item =>
          tupleList.some(
            tuple => tuple[0] === item.step && tuple[1] === item.stepStatus
          ) || item.step === this.selectedStage
      );
    }
  
    // Show/hide buttons and spinner based on filtered data
    this.showButtons = this.tableData.length > 0;
    this.schemasNotFound = !this.showButtons;
    this.databaseListService.setschemasNotFound(this.schemasNotFound);
  
    if (this.showButtons) {
      //this.spinner.show();
      setTimeout(() => {
        //his.spinner.hide();
        this.pChange();
      }, 10);
    } else {
      this.tableData = [];
    }
  }

  getPageHeading() {
    this.currentUrl = window.location.href;
    if (this.currentUrl.includes('dbAssessment')) {
      this.selectedStage = 'Assessment';
      this.pageHeader = 'Database Assessment';
    } else if (this.currentUrl.includes('schemaConversion')) {
      this.selectedStage = 'Schema Conversion';
      this.pageHeader = 'Schema Conversion';
    } else if (this.currentUrl.includes('dataMigration')) {
      this.selectedStage = 'Data Migration';
      this.pageHeader = 'Data Migration';
    }
    if (sessionStorage.getItem('selectedStage') != this.selectedStage) {
      this.databaseListService.setShowSecondDiv(false);
    } else {
      this.databaseListService.setShowSecondDiv(true);
    }
    sessionStorage['selectedStage'] = this.selectedStage;
  }

  ngOnChanges(changes: SimpleChanges) {
    let savedTableData = this.databaseListService.getSavedCheckedDBRecords();

    if (savedTableData.length > 0) {
      if (this.schemaStage != savedTableData[0].step) {
        this.schemaStage = savedTableData[0].step;
        if (savedTableData[0].step == 'Discovery') {
          this.viewDiscoveryReport();
        } else if (savedTableData[0].step == 'Assessment') {
          this.viewAssessmentReport();
        } else if (savedTableData[0].step == 'Schema Conversion') {
          this.viewSchemaConversionReport();
        } else {
          this.viewDataMigrationReport();
        }
      }
      if (this.schemaStatus != savedTableData[0].stepStatus) {
        this.schemaStatus = savedTableData[0].stepStatus;
      }
    }

    if (sessionStorage.getItem('selectedStage') != this.selectedStage) {
      this.databaseListService.setShowSecondDiv(false);
    } else {
      this.databaseListService.setShowSecondDiv(true);
    }
    this.initialize();

    this.hasValidationErrors = this.validateErrorStatusBtn(this.tableContent);
    //this.setFilters();
  }
  clearSearch(searchInput: HTMLInputElement) {
    searchInput.value = '';
    this.searchDmapTable = '';
  }

  search(searchValue: string) {
    this.searchDmapTable = searchValue;
  }

  updateWorkerNodes(data) {
    let schema;
    let existing_entry = false;
    schema = data.schemaDtls;
    schema.selectedWorkerNode = data.event.target.value;
    for (let i in this.selected_schemas) {
      if (
        this.selected_schemas[i].sourceDbHost == schema.sourceDbHost &&
        this.selected_schemas[i].sourceDBName == schema.sourceDBName &&
        this.selected_schemas[i].sourceDBSchema == schema.sourceDBSchema
      ) {
        this.selected_schemas[i].selectedWorkerNode = data.event.target.value;
        existing_entry = true;
      }
    }
    if (existing_entry === false) {
      this.selected_schemas.push(schema);
    }
    for (let j in this.tableData) {
      if (
        this.tableData[j].sourceDbHost == schema.sourceDbHost &&
        this.tableData[j].sourceDBName == schema.sourceDBName &&
        this.tableData[j].sourceDBSchema == schema.sourceDBSchema
      ) {
        this.tableData[j].active_worker_nodes.unshift(data.event.target.value);
        let temp = new Set(this.tableData[j].active_worker_nodes);
        this.tableData[j].active_worker_nodes = Array.from(temp);
      }
    }
    this.databaseListService.addWorkerNodeSelection(schema);
  }

  initialize() {
    this.tableData = this.tableContent ? this.tableContent : [];
    this.filterDataByStage();
    this.tableHeaders = this.tableSettings.tableHeaders;
  
    // Define reusable function for updating properties
    const updateProperties = (array, propertyKey, property) => {  
      if (array !== undefined) {
        let newArray = _.uniq(this.tableData.slice(), item => item[propertyKey]);
        _.each(newArray, item => {
          item[property] = _.findIndex(array, { [propertyKey]: item[propertyKey] }) >= 0
            ? array[_.findIndex(array, { [propertyKey]: item[propertyKey] })][property]
            : false;
        });
        return newArray;
      } else {
        return _.uniq(this.tableData.slice(), item => item[propertyKey]).map(item => {
          item[property] = false;
          return item;
        });
      }
    };
  
    // Update properties for various arrays
    this.creators = updateProperties(this.creators, 'createdBy', 'isCreatorChecked');
    this.sourceSchemas = updateProperties(this.sourceSchemas, 'sourceDBSchema', 'isSourceSchemaChecked');
    this.sourceDbs = updateProperties(this.sourceDbs, 'sourceDBName', 'isSourceDbChecked');
    this.targetDbs = updateProperties(this.targetDbs, 'targetDBName', 'isTargetDbChecked');
    this.bUnits = updateProperties(this.bUnits, 'businessUnit', 'isbUnitChecked');
    this.appNames = updateProperties(this.appNames, 'applicationName', 'isappNameChecked');
    this.assignedVms = updateProperties(this.assignedVms, 'workerNode', 'isassignedVmChecked');
    this.requests = updateProperties(this.requests, 'runId', 'isRequestorChecked');
    this.steps = updateProperties(this.steps, 'step', 'isStepChecked');
    this.stepStatuses = updateProperties(this.stepStatuses, 'stepStatus', 'isStatusChecked');
    this.lastUpdates = updateProperties(this.lastUpdates, 'lastUpdated', 'isDateChecked');
  
    this.onFilterSelected();
  }

  downloadExcel() {
    let checkedRecords = this.databaseListService.getSavedCheckedDBRecords();
    for (let i in checkedRecords) {
      this.commonservice
        .downloadExcelReport(checkedRecords[i].runId)
        .subscribe((data) => {
          let blob = new Blob([data], {});
          let filename =
            checkedRecords[i].sourceDBName +
            '_' +
            checkedRecords[i].sourceDBSchema +
            '_' +
            checkedRecords[i].runId +
            '_Report.xlsx';
          saveAs.saveAs(blob, filename);
        });
    }
  }

  /* DONOT REMOVE */
  export(isScroll, reportType) {
    this.spinner.show();

    if (reportType == undefined) {
      this.commonservice.viewDataseDetail(isScroll);

      setTimeout(() => {
        let checkedRecords =
          this.databaseListService.getSavedCheckedDBRecords();
        let _checkedRecords = checkedRecords.filter(function (item) {
          return item.isAccordianExpanded;
        })[0];

        /* If current view is Assessment and Export is clicked to download the Schema Migration Report. This method first set the current view to Schema */
        this.databaseListService.setCurrentViewInSavedCheckedDBRecords(
          _checkedRecords,
          _checkedRecords.step
        );
        reportType = _checkedRecords.step;
      }, 500);
    }
    this.commonservice.setActionButtonClicked('Export');
    this.commonservice.export(isScroll, reportType);
  }

  enableReports() {
    if (this.schemaStage == 'Discovery') {
      if (this.schemaStatus == 'Completed') {
        this.enableDiscoveryReport = true;
        this.enableAssessmentReport = false;
        this.enableDataMigrationReport = false;
        this.enableSchemaConversionReport = false;
      } else {
        this.enableDiscoveryReport = false;
        this.enableAssessmentReport = false;
        this.enableDataMigrationReport = false;
        this.enableSchemaConversionReport = false;
      }
    } else if (this.schemaStage == 'Assessment') {
      if (this.schemaStatus == 'Completed') {
        this.enableDiscoveryReport = true;
        this.enableAssessmentReport = true;
        this.enableDataMigrationReport = false;
        this.enableSchemaConversionReport = false;
      } else if (
        this.schemaStatus == 'In Progress' ||
        this.schemaStatus == 'Error'
      ) {
        this.enableDiscoveryReport = true;
        this.enableAssessmentReport = false;
        this.enableDataMigrationReport = false;
        this.enableSchemaConversionReport = false;
      } else {
        this.enableDiscoveryReport = false;
        this.enableAssessmentReport = false;
        this.enableDataMigrationReport = false;
        this.enableSchemaConversionReport = false;
      }
    } else if (this.schemaStage == 'Schema Conversion') {
      if (
        this.schemaStatus == 'Completed' ||
        this.schemaStatus == 'Processing Done'
      ) {
        this.enableDiscoveryReport = true;
        this.enableAssessmentReport = true;
        this.enableSchemaConversionReport = true;
        this.enableDataMigrationReport = false;
      } else if (
        this.schemaStatus == 'In Progress' ||
        this.schemaStatus == 'Error'
      ) {
        this.enableDiscoveryReport = true;
        this.enableAssessmentReport = true;
        this.enableSchemaConversionReport = false;
        this.enableDataMigrationReport = false;
      } else {
        this.enableDiscoveryReport = false;
        this.enableAssessmentReport = false;
        this.enableSchemaConversionReport = false;
        this.enableDataMigrationReport = false;
      }
    } else if (this.schemaStage == 'Data Migration') {
      if (
        this.schemaStatus == 'Completed' ||
        this.schemaStatus == 'Processing Done'
      ) {
        this.enableDiscoveryReport = true;
        this.enableAssessmentReport = true;
        this.enableSchemaConversionReport = true;
        this.enableDataMigrationReport = true;
      } else if (
        this.schemaStatus == 'In Progress' ||
        this.schemaStatus == 'Error'
      ) {
        this.enableDiscoveryReport = true;
        this.enableAssessmentReport = true;
        this.enableSchemaConversionReport = true;
        this.enableDataMigrationReport = false;
      } else {
        this.enableDiscoveryReport = false;
        this.enableAssessmentReport = false;
        this.enableSchemaConversionReport = false;
        this.enableDataMigrationReport = false;
      }
    } else {
      this.enableAssessmentReport = false;
      this.enableDiscoveryReport = false;
      this.enableSchemaConversionReport = false;
      this.enableDataMigrationReport = false;
    }
  }

  setDataMigrationChecked() {
    if (
      this.schemaStage == 'Data Migration' &&
      this.schemaStatus == 'Completed'
    ) {
      this.isDataMigrationChecked = true;
    } else {
      this.isDataMigrationChecked = false;
    }
  }
  onRadioClicked(data, userSelected = false) {
    if (userSelected) {
      if (this.selectedStage == 'Assessment') {
        sessionStorage['assessmentSelectedDatabase'] = JSON.stringify(data);
      } else if (this.selectedStage == 'Schema Conversion') {
        sessionStorage['SCSelectedDatabase'] = JSON.stringify(data);
      } else if (this.selectedStage == 'Data Migration') {
        sessionStorage['DMSelectedDatabase'] = JSON.stringify(data);
      }
    }

    this.selectedRow = data;
    this.selectedRow.currentReportView = 'Schema Conversion';
    this.databaseListService.setShowSecondDiv(true);
    this.schemaStage = data.step;
    this.schemaStatus = data.stepStatus;

    this.setDataMigrationChecked();
    this.enableReports();

    this.radioCheckedValue = data.runId;
    this.viewDataseDetail(data, true);
    /* First empty the list */
    this.databaseListService.removeAllCheckedDBRecords();
    this.databaseListService.addCheckedRecord(data);
    this.disableDelete(data);
  }

  disableDelete(data) {
    if (
      data.step == 'Schema Conversion' ||
      data.step == 'Data Migration' ||
      (data.step == 'Assessment' && data.stepStatus == 'Completed')
    ) {
      this.disableDeleteButton = true;
    } else {
      this.disableDeleteButton = false;
    }
  }

  onFilterSelected() {
    let _creators: any[] = this.creators.filter(function (d) {
      return d.isCreatorChecked === true;
    });
    let _creatorsTableContent: any[] = this.tableContent.filter(function (d) {
      return _.findIndex(_creators, { createdBy: d.createdBy }) !== -1;
    });

    let _sourceSchemas: any[] = this.sourceSchemas.filter(function (d) {
      return d.isSourceSchemaChecked === true;
    });
    let _sourceSchemasTableContent = this.tableContent.filter(function (d) {
      return (
        _.findIndex(_sourceSchemas, { sourceDBSchema: d.sourceDBSchema }) !== -1
      );
    });

    let _sourceDbs: any[] = this.sourceDbs.filter(function (d) {
      return d.isSourceDbChecked === true;
    });
    let _sourceDbTableContent = this.tableContent.filter(function (d) {
      return _.findIndex(_sourceDbs, { sourceDBName: d.sourceDBName }) !== -1;
    });

    let _targetDbs: any[] = this.targetDbs.filter(function (d) {
      return d.isTargetDbChecked === true;
    });

    let _targetDbsTableContent = this.tableContent.filter(function (d) {
      return _.findIndex(_targetDbs, { targetDBName: d.targetDBName }) !== -1;
    });

    let _bUnits: any[] = this.bUnits.filter(function (d) {
      return d.isbUnitChecked === true;
    });

    let _bUnitsTableContent = this.tableContent.filter(function (d) {
      return _.findIndex(_bUnits, { businessUnit: d.businessUnit }) !== -1;
    });

    let _appNames: any[] = this.appNames.filter(function (d) {
      return d.isappNameChecked === true;
    });

    let _appNamesTableContent = this.tableContent.filter(function (d) {
      return (
        _.findIndex(_appNames, { applicationName: d.applicationName }) !== -1
      );
    });

    let _assignedVms: any[] = this.assignedVms.filter(function (d) {
      return d.isassignedVmChecked === true;
    });

    let _assignedVmsTableContent = this.tableContent.filter(function (d) {
      return _.findIndex(_assignedVms, { workerNode: d.workerNode }) !== -1;
    });

    let _requests: any[] = this.requests.filter(function (d) {
      return d.isRequestorChecked === true;
    });
    let _requestsTableContent = this.tableContent.filter(function (d) {
      return _.findIndex(_requests, { runId: d.runId }) !== -1;
    });

    let _steps: any[] = this.steps.filter(function (d) {
      return d.isStepChecked === true;
    });

    let _stepsTableContent = this.tableContent.filter(function (d) {
      return _.findIndex(_steps, { step: d.step }) !== -1;
    });

    let _stepStatuses: any[] = this.stepStatuses.filter(function (d) {
      return d.isStatusChecked === true;
    });

    let _stepStatusesTableContent = this.tableContent.filter(function (d) {
      return _.findIndex(_stepStatuses, { stepStatus: d.stepStatus }) !== -1;
    });

    let _lastUpdates: any[] = this.lastUpdates.filter(function (d) {
      return d.isDateChecked === true;
    });
    let _lastUpdatesTableContent = this.tableContent.filter(function (d) {
      return _.findIndex(_lastUpdates, { lastUpdated: d.lastUpdated }) !== -1;
    });

    if (
      _creators.length <= 0 &&
      _sourceSchemas.length <= 0 &&
      _sourceDbs.length <= 0 &&
      _targetDbs.length <= 0 &&
      _requests.length <= 0 &&
      _steps.length <= 0 &&
      _stepStatuses.length <= 0 &&
      _lastUpdates.length <= 0 &&
      _bUnits.length <= 0 &&
      _appNames.length <= 0 &&
      _assignedVms.length <= 0
    ) {
      //this.tableData = this.tableContent.slice();
      this.filterDataByStage();
    } else {
      if (_creators.length <= 0 || _creatorsTableContent.length <= 0) {
        _creators = this.tableContent.slice();
        _creatorsTableContent = this.tableContent.slice();
      }

      if (
        _sourceSchemas.length <= 0 ||
        _sourceSchemasTableContent.length <= 0
      ) {
        _sourceSchemas = this.tableContent.slice();
        _sourceSchemasTableContent = this.tableContent.slice();
      }

      if (_sourceDbs.length <= 0 || _sourceDbTableContent.length <= 0) {
        _sourceDbs = this.tableContent.slice();
        _sourceDbTableContent = this.tableContent.slice();
      }

      if (_targetDbs.length <= 0 || _targetDbsTableContent.length <= 0) {
        _targetDbs = this.tableContent.slice();
        _targetDbsTableContent = this.tableContent.slice();
      }

      if (_bUnits.length <= 0 || _bUnitsTableContent.length <= 0) {
        _bUnits = this.tableContent.slice();
        _bUnitsTableContent = this.tableContent.slice();
      }

      if (_appNames.length <= 0 || _appNamesTableContent.length <= 0) {
        _appNames = this.tableContent.slice();
        _appNamesTableContent = this.tableContent.slice();
      }

      if (_assignedVms.length <= 0 || _assignedVmsTableContent.length <= 0) {
        _assignedVms = this.tableContent.slice();
        _assignedVmsTableContent = this.tableContent.slice();
      }

      if (_requests.length <= 0 || _requestsTableContent.length <= 0) {
        _requests = this.tableContent.slice();
        _requestsTableContent = this.tableContent.slice();
      }

      if (_steps.length <= 0 || _stepsTableContent.length <= 0) {
        _steps = this.tableContent.slice();
        _stepsTableContent = this.tableContent.slice();
      }

      if (_stepStatuses.length <= 0 || _stepStatusesTableContent.length <= 0) {
        _stepStatuses = this.tableContent.slice();
        _stepStatusesTableContent = this.tableContent.slice();
      }

      if (_lastUpdates.length <= 0 || _lastUpdatesTableContent.length <= 0) {
        _lastUpdates = this.tableContent.slice();
        _lastUpdatesTableContent = this.tableContent.slice();
      }

      this.tableData = _.intersection(
        _creatorsTableContent,
        _sourceSchemasTableContent,
        _sourceDbTableContent,
        _targetDbsTableContent,
        _requestsTableContent,
        _stepsTableContent,
        _stepStatusesTableContent,
        _lastUpdatesTableContent,
        _bUnitsTableContent,
        _appNamesTableContent,
        _assignedVmsTableContent,
        this.tableContent.slice()
      );
    }

    let savedTableData = this.databaseListService.getSavedCheckedDBRecords();

    if (savedTableData.length > 0) {
      this.schemaStage = savedTableData[0].step;
      this.schemaStatus = savedTableData[0].stepStatus;
      let stageRunIds = this.tableData.map((i) => i.runId);
      if (stageRunIds.includes(savedTableData[0].runId)) {
        this.databaseListService.setShowSecondDiv(true);
      } else {
        this.databaseListService.setShowSecondDiv(false);
      }
    }
  }

  viewDiscoveryReport() {
    this.viewReport('Discovery');
    // this.commonservice.setActionButtonClicked('ViewDetail');
    // this.spinner.show();
    // setTimeout(() => {
    //   this.commonservice.viewDataseDetail(true, true, 'Discovery');
    //   this.spinner.hide();
    // }, 500);
  }

  viewAssessmentReport() {
    this.viewReport('Assessment');
    // this.commonservice.setActionButtonClicked('ViewDetail');
    // this.spinner.show();
    // setTimeout(() => {
    //   this.commonservice.viewDataseDetail(true, true, 'Assessment');
    //   this.spinner.hide();
    // }, 500);
  }
  viewSchemaConversionReport() {
    this.viewCurrentReport('Schema Conversion', 'Schema Conversion');
    // this.currentReportView = 'Schema Conversion';
    // this.commonservice.setActionButtonClicked('ViewDetail');
    // this.spinner.show();
    // setTimeout(() => {
    //   this.commonservice.viewDataseDetail(true, true, 'Schema Conversion');
    //   this.spinner.hide();
    // }, 500);
  }
  viewDataMigrationReport() {
    this.viewCurrentReport('Test Migration', 'Test Migration');
    // this.currentReportView = 'Test Migration';
    // this.commonservice.setActionButtonClicked('ViewDetail');
    // this.spinner.show();
    // setTimeout(() => {
    //   this.commonservice.viewDataseDetail(true, true, 'Test Migration');
    //   this.spinner.hide();
    // }, 500);
  }
  viewCurrentReport(reportType: string, currentReportView: string) {
    this.currentReportView = currentReportView;
    this.commonservice.setActionButtonClicked('ViewDetail');
    this.spinner.show();
    setTimeout(() => {
        this.commonservice.viewDataseDetail(true, true, reportType);
        this.spinner.hide();
    }, 500);
}

  viewDataseDetail(data, isScoll: boolean) {
    this.radioCheckedValue = data.runId;
    /* First empty the list */
    this.databaseListService.removeAllCheckedDBRecords();
    this.databaseListService.addCheckedRecord(data);
    //this.disableDelete(data);
    this.commonservice.setActionButtonClicked('ViewDetail');
    this.spinner.show();
    setTimeout(() => {
      this.commonservice.viewDataseDetail(isScoll, true);
      this.spinner.hide();
    }, 500);
  }

  onDelete() {
    if (this.databaseListService.getSavedCheckedDBRecords().length <= 0) {
      this.openAlert('Alert', 'Please select a schema to delete.');
      return;
    }
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {
      msg: 'Are you sure you want to remove checked item(s) from the list?',
      title: 'Confirmation',
      okButtonLabel: 'Ok',
      cancelButtonLabel: 'Cancel',
    };
    modalRef.result.then((result) => {
      if (result === 'ok') {
        this.delete();
      }
    });
  }
  delete() {
    this.savedCheckedTableData =
      this.databaseListService.getSavedCheckedDBRecords();

    for (let i in this.savedCheckedTableData) {
      this.spinner.show();

      let runId = this.savedCheckedTableData[i].runId;
      this.databaseListService
        .deleteDBItem({ RUN_ID: runId + '' })
        .subscribe((res) => {
          if (res.status == 'success') {
            this.openAlert('Alert', 'Schema deleted successfully.');
            this.commonservice.removeFromViewDetail(runId);
            this.refreshTable();
            this.filterDataByStage();
          } else {
            this.spinner.hide();
            this.openAlert('Alert', res.message);
          }

          this.spinner.hide();
        });
      // if (this.commonservice.getLicenseType() == 'trial' || this.commonservice.getLicenseType() == 'dmap'){
      //   this.databaseListService.deleteDBItem({RUN_ID:runId+''}).subscribe((res) => {
      //     if(res.status == 'success'){
      //       this.openAlert('Alert','Schema deleted successfully.');
      //       this.commonservice.removeFromViewDetail(runId);
      //       this.refreshTable();
      //     }
      //     else{
      //       this.spinner.hide();
      //       this.openAlert('Alert',res.message)
      //     }

      //   this.spinner.hide();
      //   });
      // }
      // else if (this.commonservice.getLicenseType() == 'dmap pro' || this.commonservice.getLicenseType() == 'dmap enterprise'){
      //   let item = {'runId':this.savedCheckedTableData[i].runId,'sourceDbHost':this.savedCheckedTableData[i].sourceDbHost,'sourceSchema':this.savedCheckedTableData[i].sourceDBSchema,'sourceDbName':this.savedCheckedTableData[i].sourceDBName}
      //   this.databaseListService.deleteSchema(item).subscribe(data => {
      //     if(data.status == 'success'){
      //       this.spinner.hide();
      //       this.openAlert('Alert','Schema deleted successfully.');
      //     }
      //     else{
      //       this.spinner.hide();
      //       this.openAlert('Alert',data.message)
      //     }
      //   });
      // }
    }
  }

  setMergeOptions(data) {
    let selectedItem: any[] = [];
    selectedItem.push(data);

    const modalRef = this.modalService.open(
      MergePrioritySelectionModalComponent,
      { size: 'lg', scrollable: true }
    );
    modalRef.componentInstance.data = {
      title: 'Merge Priority Selection',
      itemsSelected: selectedItem,
    };
    modalRef.result.then((result) => {
      // if (result.status === 'ok') {
      // } else {
      // }
    });
  }

  refreshTable() {
    this.commonservice.setIsDBListChanged(true);
  }

  resetFilters() {
    const resetProperty = (array, property) => {
      if (array) {
        array.forEach(item => item[property] = false);
      }
    };
  
    resetProperty(this.creators, 'isCreatorChecked');
    resetProperty(this.sourceSchemas, 'isSourceSchemaChecked');
    resetProperty(this.sourceDbs, 'isSourceDbChecked');
    resetProperty(this.targetDbs, 'isTargetDbChecked');
    resetProperty(this.bUnits, 'isbUnitChecked');
    resetProperty(this.appNames, 'isappNameChecked');
    resetProperty(this.assignedVms, 'isassignedVmChecked');
    resetProperty(this.requests, 'isRequestorChecked');
    resetProperty(this.steps, 'isStepChecked');
    resetProperty(this.stepStatuses, 'isStatusChecked');
    resetProperty(this.lastUpdates, 'isDateChecked');
  
    this.searchDmapTable = undefined;
    this.onFilterSelected();
  }

  updatePassword(data) {
    const modalRef = this.modalService.open(DmapUpdatePasswordComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.data = {
      title: 'Update Password',
      runId: data.runId,
      stage: data.stepStatus,
      step: data.step,
    };
    modalRef.result.then((result) => {
      // if ( result.status == 'success') {
      // }else if(result == 'cancel'){
      // }else{
      // }
    });
  }

  backupDMAP() {
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {
      msg: 'On completion of backup, please save the downloaded .tar.gz file in a secure location. If you reinstall the DMAP image and create a new container for DMAP, then the downloaded backup file will be required to restore the data of DB schema assessments and migrations done using DMAP.  Data will be restored to the point you previously backed up data.',
      title: 'Confirmation',
      okButtonLabel: 'Continue',
      cancelButtonLabel: 'Cancel',
      label: 'restoreDmap',
    };
    modalRef.result.then((result) => {
      if (result == 'ok') {
        const appBackupRequired = modalRef.componentInstance.data.showRadioButtons 
        ? modalRef.componentInstance.userChoice === 'yes' 
        : false;
        this.databaseListService.backupDMAP(appBackupRequired).subscribe((res) => {
          console.log(res);

          let blob = new Blob([res], {});
          let filename = 'dmap_complete.tar.gz';
          saveAs.saveAs(blob, filename);
        });
      }
    });
  }

  // restoreDMAP(){
  //   const modalReff = this.modalService.open(NgbdConfirmationModal);
  //   modalReff.componentInstance.data = {msg : 'Restoring the backup will overwrite data for DB schema assessments and migrations you may have done using DMAP with the backup you are restoring. Are you sure you want to continue?',
  //                                      title : 'Confirmation',
  //                                      okButtonLabel : 'Continue',
  //                                      cancelButtonLabel:'Cancel',
  //                                      label:'restoreDmap'};
  //   modalReff.result.then((result) => {
  //   if ( result == 'ok') {

  //     const modalRef = this.modalService.open(FileUploadModalComponent, {size: 'lg', scrollable: true});
  //     modalRef.componentInstance.data = {'fileType':'restoreDMAP','sampleFile':'', 'isSampleFileShow':false};
  //     modalRef.result.then((result) => {
  //       console.log(result)
  //       if ( result == 'ok') {
  //         this.openAlert('Alert', 'DMAP has been restored successfully.');
  //       }else{

  //       }
  //     });
  //   }});

  // }

  openAlert(title, msg) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: title };
    modalRef.result.then((result) => {});
  }

  nextPageClick() {
    $('html, body').animate(
      {
        scrollTop: $('#dbSecondAccMainDiv').offset().top,
      },
      'slow',
      'linear'
    );
  }

  assignWorkerNode() {
    let message;
    let assigned_schemas_count = 0;
    for (let k in this.tableData) {
      if (this.tableData[k].workerNode != null) {
        assigned_schemas_count = assigned_schemas_count + 1;
      }
    }
    if (
      this.selected_schemas.length + assigned_schemas_count ==
      this.tableData.length
    ) {
      message =
        'Do you want DMAP to allocate selected schemas to worker nodes for assessment?';
    } else {
      message =
        'Do you want DMAP to allocate unassigned schemas to worker nodes for assessment?';
    }
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {
      msg: message,
      title: 'Confirmation',
      okButtonLabel: 'Ok',
      cancelButtonLabel: 'Cancel',
      label: 'assignWorkerNode',
    };
    modalRef.result.then((result) => {
      if (result == 'ok') {
        this.databaseListService
          .assignWorkerNode(this.selected_schemas)
          .subscribe((data) => {
            let msg;
            if (data.status == 'success') {
              if ('message' in data) {
                this.openAlert('Alert', data.message);
              } else {
                this.openAlert('Alert', 'Worker node assigned successfully.');
              }
            } else {
              if (data.inActiveNodes && data.inActiveNodes.length > 0) {
                msg =
                  'To automatically assign schemas to worker nodes to perform assessment, any of the configured worker nodes shall have "Live" status. Please resolve connection error for below VMs and Resync them before continuing.<br>' +
                  data.inActiveNodes.join('<br>');
                //msg = "Fix worker node " + data.inActiveNodes.join('\n') + " or delete it to continue Assigning schema to worker node.";
              } else {
                msg = data.message;
              }
              this.openAlert('Alert', msg);
            }
          });
      }
    });
  }
  runSchemaMigration() {
    // let checkedScemaEntry = this.databaseListService.getSavedCheckedDBRecords();
    let checkedScemaEntry = [];
    let selectedSchema = {};
    if (checkedScemaEntry.length == 0) {
      selectedSchema['runId'] = '';
      selectedSchema['sourceDBSchema'] = '';
    } else {
      selectedSchema = checkedScemaEntry[0];
    }

    let schemaMigrationList;
    this.databaseListService.getSchemaMigrationData().subscribe(
      (data) => {
        this.spinner.hide();
        schemaMigrationList = data;
        for (let i in schemaMigrationList) {
          if (schemaMigrationList[i].runId == selectedSchema['runId']) {
            schemaMigrationList[i]['defaultSelection'] = true;
          } else {
            schemaMigrationList[i]['defaultSelection'] = false;
          }
        }
        const modalRef = this.modalService.open(
          SchemaMigrationConfirmationModalComponent,
          { size: 'lg', scrollable: true }
        );
        modalRef.componentInstance.data = {
          title: 'Run Schema Conversion',
          data: schemaMigrationList,
          selectedSchema: selectedSchema,
        };
        modalRef.result.then((result) => {
          // if (result == 'ok') {
          // }
        });
      },
      (error) => {}
    );
  }

  multipleDelete() {
    this.spinner.show();
    // let checkedScemaEntry = this.databaseListService.getSavedCheckedDBRecords();
    let checkedScemaEntry = [];
    let selectedSchema = {};
    if (checkedScemaEntry.length == 0) {
      selectedSchema['runId'] = '';
      selectedSchema['sourceDBSchema'] = '';
    } else {
      selectedSchema = checkedScemaEntry[0];
    }

    let schemasToDelete;
    this.databaseListService.getMultipleSchemasDelete().subscribe(
      (data) => {
        schemasToDelete = data;
        for (let i in schemasToDelete) {
          if (schemasToDelete[i].runId == selectedSchema['runId']) {
            schemasToDelete[i]['defaultSelection'] = true;
          } else {
            schemasToDelete[i]['defaultSelection'] = false;
          }
        }

        const modalRef = this.modalService.open(
          DmapMultipleSchemaDeleteComponent,
          { size: 'lg', scrollable: true }
        );
        modalRef.componentInstance.data = {
          title: 'Delete Multiple Schemas',
          data: schemasToDelete,
          selectedSchema: selectedSchema,
        };
        modalRef.result.then((result) => {
          // if (result == 'ok') {
          // }
        });
      },
      (error) => {}
    );
  }

  reports() {
    let savedTableData = this.databaseListService.getSavedCheckedDBRecords();
    if (savedTableData.length > 0) {
      this.schemaStage = savedTableData[0].step;
      this.schemaStatus = savedTableData[0].stepStatus;
    }
    this.enableReports();

    if (
      !this.enableAssessmentReport &&
      !this.enableDiscoveryReport &&
      !this.enableSchemaConversionReport &&
      !this.enableDataMigrationReport
    ) {
      this.openAlert('Alert', 'Please select a schema to view the report');
    }
  }
  dataMigration(runId) {
    this.databaseDataMigrationService
      .getDataMigrationSettings({ run_id: runId })
      .subscribe((response) => {
        console.log('getDataMigrationSettings=>', response);
        this.isDumpDataFile =
          response[0].generate_dump_only != 0;
        this.commonservice.setMigrationMode(response[0].migration_mode);
      });
  }

  dataMigrationConfirmation(runId) {
    let _status;
    this.setDataMigrationChecked();
    if (!this.isDataMigrationChecked) {
      _status = 'Y';
    } else {
      _status = 'N';
    }
    let reqObj = {
      RUN_ID: runId.toString(),
      STATUS: _status,
    };
    this.spinner.show();
    this.databaseSchemaMigrationService
      .sendDataMigrationStatus(reqObj)
      .subscribe((data) => {
        setTimeout(() => {
          this.spinner.hide();
        }, 2500);
      });
  }

  startDataMigration(runId) {
    this.commonservice.startDataMigration(runId);
  }
  dataMigrationsSettings(runId, showError) {
    const dialogRef = this.dialog.open(DataMigrationSettingsModalComponent, {
      disableClose: true,
      width: '750px',
      height: 'auto',
      data: { runId: runId, showError: showError },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action == 'success') {
        this.isDumpDataFile =
          result.settingsData.generate_dump_only != 0;
      }
    });
  }
  downloadLogs(runId) {
    let reqObj = {
      RUN_ID: runId,
    };
    this.databaseSchemaMigrationService
      .downloadLogs(reqObj)
      .subscribe((data) => {
        if (data.type == 'application/json') {
          this.openAlert(
            'Alert',
            'File does not exist. Please run Data Migration before viewing the log.'
          );
        } else {
          var rightNow = new Date();
          var currentDate = rightNow
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, '');
          let blob = new Blob([data], {});
          let filename =
            currentDate + '_' + reqObj.RUN_ID + '_DataMigration_log.txt';
          saveAs.saveAs(blob, filename);
        }
      });
  }
  viewDumpFiles(runId) {
    const dialogRef = this.dialog.open(DataMigrationDumpDataModalComponent, {
      disableClose: true,
      width: '90%',
      data: { runId: runId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action == 'success') {
        console.log('success');
      }
    });
  }
  logicalValidation() {
    this.viewReport('LogicalValidation');
    // this.commonservice.setActionButtonClicked('ViewDetail');
    // this.spinner.show();
    // setTimeout(() => {
    //   this.commonservice.viewDataseDetail(true, true, 'LogicalValidation');
    //   this.spinner.hide();
    // }, 500);
  }

  performaceBench() {
    this.viewReport('PerformanceBench');
    // this.commonservice.setActionButtonClicked('ViewDetail');
    // this.spinner.show();
    // setTimeout(() => {
    //   this.commonservice.viewDataseDetail(true, true, 'PerformanceBench');
    //   this.spinner.hide();
    // }, 500);
  }

  reValidateReports(runId) {
  }

  generateValidationReports(runId){
    let checkedRecords = this.databaseListService.getSavedCheckedDBRecords();
    let filename = 'Schema_Validation_Report.zip'
    for (let i in checkedRecords) {
    filename =
            checkedRecords[i].sourceDBName +
            '_' +
            checkedRecords[i].sourceDBSchema +
            '_' +
            checkedRecords[i].runId +
            '_'+filename;
    }
  }

  // reValidate() {
  //   // this.reValidateTag = 'datamigration';

  //   // let data = this.databaseListService.getSavedCheckedDBRecords();
  //   // this.runId = data[0].runId;
  //   // this.currentReportView = 'Schema Conversion';

  //   this.commonservice.setActionButtonClicked('ViewDetail');
  //   this.spinner.show();
  //   setTimeout(() => {
  //     this.commonservice.viewDataseDetail(true, true, 'Schema Conversion');
  //     this.spinner.hide();
  //   }, 500);

  // }
  reValidateData() {
    this.viewReport('Revalidate Data');
    // this.commonservice.setActionButtonClicked('ViewDetail');
    // this.spinner.show();
    // setTimeout(() => {
    //   this.commonservice.viewDataseDetail(true, true, 'Revalidate Data');
    //   this.spinner.hide();
    // }, 500);
  }
  backupRestore(runId) {
    this.commonservice.viewDataseDetail(true, true, 'Backup Restore');
    this.currentReportView = 'Backup Restore';
  }

  pChange() {
    const itemsPerPage = 20;
    const totalPages = Math.ceil(this.tableData.length / itemsPerPage);

    if (this.p < 1 || this.p > totalPages) {
        return "Invalid current page";
    }

    const startIndex = (this.p - 1) * itemsPerPage + 1;
    const endIndex = Math.min(this.p * itemsPerPage, this.tableData.length);

    this.totalCount = `${startIndex}-${endIndex} of ${this.tableData.length}`;
    console.log("totlaCount", this.totalCount);
}

validateErrorStatusBtn = (tblContent: Array<Object>): boolean => {
  return tblContent.some(value => value['step'] === 'Validation' && value['stepStatus'] === 'Error');
}
viewReport(reportType: string) {
  this.commonservice.setActionButtonClicked('ViewDetail');
  this.spinner.show();
  setTimeout(() => {
      this.commonservice.viewDataseDetail(true, true, reportType);
      this.spinner.hide();
  }, 500);
}

DownloadValidationExcel() {
  this.commonservice.downloadValidationExcel()
  .subscribe((data) => {
    let blob = new Blob([data], {});
        let filename =
          'ValidationError_Report.xlsx';
        saveAs.saveAs(blob, filename);
  })
}

}
