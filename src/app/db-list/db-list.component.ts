import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  OnDestroy,
  Input,
} from '@angular/core';
import { DatabaseListService } from '../common/Services/database-list.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { CommonServices } from '../common/Services/common-services.service';
import { Subscription, interval } from 'rxjs';
import { ifError } from 'assert';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-db-list',
  templateUrl: './db-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DbListComponent implements OnInit, OnDestroy {
  dbList: any[] = [];
  dbListDataLoaded:any = false;
  dbListSubscribtion: any;
  dbListIntervalCalls: any;
  caption: string = 'DMAP Table';
  showtab: boolean;

  nodeType: any;
  licenseType: any;
  disableSchemaConversion: any;
  currentUrl: any;
  pageHeader:any;

  tableSettings: any = {
    tableHeaders: [
      { name: ' ', isCheckBox: false, isFilter: false },
      { id: '', name: 'DB Source', isCheckBox: false, isFilter: false },
      { id: '', name: 'DB Target', isCheckBox: false, isFilter: false },
      { id: '', name: 'Business Unit', isCheckBox: false, isFilter: false },
      { id: '', name: 'Application Name', isCheckBox: false, isFilter: false },
      { id: '', name: 'Worker Node', isCheckBox: false, isFilter: false },
      {
        id: 'drpdownRequestId',
        name: 'Run Id',
        isCheckBox: false,
        isFilter: true,
      },
      { id: '', name: 'Stage', isCheckBox: false, isFilter: true },
      {
        id: 'drpdownStepStatus',
        name: 'Status',
        isCheckBox: false,
        isFilter: true,
      },
      // {"id": "drpdownCreatedBy", "name":"Created By", "isCheckBox":false, "isFilter":true },
      {
        id: 'drpdownLastUpdated',
        name: 'Last Updated',
        isCheckBox: false,
        isFilter: true,
      },
    ],
  };
  constructor(
    private databaseListService: DatabaseListService,
    private spinner: NgxSpinnerService,
    private commonservice: CommonServices,
    private cdRef: ChangeDetectorRef,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getPageHeading();
    this.licenseType = this.commonservice.getLicenseType();
    this.nodeType = sessionStorage['nodeType'];
    //this.spinner.show();
    this.getDBList(); // Made this change to make db call on page load, then setInterval will do every 5 second
    this.dbListIntervalCalls = setInterval(() => {
      this.getDBList();
    }, 5000);

    this.dbListSubscribtion = this.commonservice.$isDBListChangedObj.subscribe(
      (response) => {
        if (response) {
          $('#nav-dbList-tab').trigger('click');
          this.commonservice.$isShowSecondAccordian.next(true);
          this.getDBList();
        }
      }
    );

    this.commonservice.$isShowSecondAccordianObj.subscribe((response) => {
      this.showtab = response;
    });
    this.commonservice.callMenuControlApi(true);
  }

  getPageHeading() {
    this.currentUrl = window.location.href;
    if (this.currentUrl.includes('dbAssessment')) {
      this.pageHeader = 'Database Assessment';
    } else if (this.currentUrl.includes('schemaConversion')) {
      this.pageHeader = 'Schema Conversion';
    } else if (this.currentUrl.includes('dataMigration')) {
      this.pageHeader = 'Data Migration';
    }
  }


  ngOnDestroy(): void {
    this.dbListSubscribtion.unsubscribe();
    clearInterval(this.dbListIntervalCalls);
  }

  checkChangeInStatus(data, saveTableData) {
    let hasChangedList: any[] = [];

    if (saveTableData.length > 0) {
      for (let i in saveTableData) {
        for (let j in data) {
          if (data[j].runId == saveTableData[i].runId) {
            if (
              data[j].stepStatus != saveTableData[i].stepStatus ||
              data[j].step != saveTableData[i].step ||
              data[j].migrationStep != saveTableData[i].migrationStep ||
              (data[j].errors != saveTableData[i].erros &&
                saveTableData[i].erros != undefined) ||
              data[j].workerNode != saveTableData[i].workerNode ||
              data[j].targetDBName != saveTableData[i].targetDBName
            ) {
              hasChangedList.push(data[j]);
            }
          }
        }
      }
    }
    if (
      this.nodeType == 'analytics_master' &&
      (this.licenseType == 'dmap enterprise' || this.licenseType == 'dmap pro')
    ) {
      this.databaseListService.$savedWorkerNodeSelectionChangedObj.subscribe(
        (savedDBList: any[]) => {
          for (let i in savedDBList) {
            for (let j in data) {
              if (savedDBList[i].runId == data[j].runId) {
                data[j].selectedWorkerNode = savedDBList[i].selectedWorkerNode;
              }
            }
          }
        }
      );
      for (let i in data) {
        if (data[i]['step'] == 'Validation') {
          this.commonservice.toggleWorkerNodebutton(true);
          break;
        }
        else if (data[i]['workerNode'] == null) {
          this.commonservice.toggleWorkerNodebutton(false);
          break;
        } else {
          this.commonservice.toggleWorkerNodebutton(true);
        }
      }
      for (let i in data) {
        if (
          data[i]['step'] == 'Assessment' &&
          data[i]['stepStatus'] == 'Completed'
        ) {
          this.disableSchemaConversion = false;
          break;
        } else {
          this.disableSchemaConversion = true;
        }
      }
    }
    this.dbList = data;
    return hasChangedList;
  }

  refreshTheAccordianContent(hasChangedList) {
    this.commonservice.refreshAccordianView(hasChangedList);
  }

  openAlert(msg) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
    });
  }

  getDBList() {
    /* get db list on the launch of the application for the very first time */
    if (this.dbList.length == 0) {
      this.databaseListService.getDBlist().subscribe(
        (data) => {
          if (data && data.status && data.status.toLowerCase() == "failed" && data.message) {
            this.openAlert(data.message);
            if (data.message == "Please check master node container status" || data.message.includes("master node container status")) {
              clearInterval(this.dbListIntervalCalls);
            }
          } else {
          this.dbList = data;
          this.dbListDataLoaded = true;
          }
          //this.spinner.hide();
        },
        (error) => {
          this.handleError(error);
        }
      );
      //this.spinner.hide();
    } else {

      let hasChangedList: any[] = [];
      let saveTableData = this.databaseListService.getSavedCheckedDBRecords();

      this.databaseListService.getDBlist().subscribe(
        (data) => {
          if (data && data.status && data.status.toLowerCase() == "failed" && data.message) {
            this.openAlert(data.message);
            if (data.message == "Please check master node container status" || data.message.includes("master node container status")) {
              clearInterval(this.dbListIntervalCalls);
            }
          } else {
          let newchangedStages = [];
          let oldchangedStages = this.databaseListService.getUniqueStages();


          data.forEach(function(item) {
              Object.keys(item).forEach(function(key) {
                if (key =='step'){
                  //console.log("key:" + key + " value:" + item[key]);
                  newchangedStages.push(item[key])
                }
                  
              });
          });          
          hasChangedList = this.checkChangeInStatus(data, saveTableData);

          for (let x in hasChangedList) {
            this.databaseListService.setSavedTableDataStatus(hasChangedList[x]);
          }

          if (hasChangedList.length > 0) {
            this.refreshTheAccordianContent(hasChangedList);
          }
          if (oldchangedStages.length == 0){
            this.databaseListService.setUniqueStages(newchangedStages);
          }

          if(JSON.stringify(newchangedStages) != JSON.stringify(oldchangedStages)){
            this.databaseListService.setUniqueStages(newchangedStages);
            this.commonservice.refreshStageFilters(data);
          }
          }
        },
        (error) => {
          this.handleError(error);
        }
      );
    }
  }

  handleError(error: any) {
    if (error && error.status && error.status.toLowerCase() === "failed" && error.message) {
      this.openAlert(error.message);
      if (error.message === "Please check master node container status" || error.message.includes("master node container status")) {
        clearInterval(this.dbListIntervalCalls);
      }
    }
  }
  

  getSavedTableDataCount() {
    return this.databaseListService.getSavedTableDataCount() > 0;
  }

  showSecondDiv() {
    return this.databaseListService.getShowSecondDiv();
  }
  showSecondDiv_() {
    return !this.databaseListService.getschemasNotFound();
  }
}
