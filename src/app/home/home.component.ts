import { Component, OnInit, ViewEncapsulation, AfterViewInit, AfterContentInit } from '@angular/core';
import { DatabaseListService } from '../common/Services/database-list.service';
import { EventEmitterService } from '../common/Services/event-emitter.service';

import { NgxSpinnerService } from "ngx-spinner";
import { LoginService } from '../common/Services/login-service.service';
import { Router } from '@angular/router';
import { CommonServices } from '../common/Services/common-services.service';
import { DmapMasterSettingsModalComponent } from '../common/Modal/dmap-master-settings-modal/dmap-master-settings-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DmapMasterEmailSettingsModalComponent } from '../common/Modal/dmap-master-email-settings-modal/dmap-master-email-settings-modal.component';
import { HttpClient } from '@angular/common/http';
import { NgbdConfirmationModal } from '../common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import FileSaver from 'file-saver';
import { AssessmentLogsComponent } from '../common/Modal/assessment-logs/assessment-logs.component';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit , AfterViewInit,AfterContentInit
{
  checkedDBRecords: any[];
  userLogin:string;
  showtab: boolean;
  showBatchTab: boolean;
  schemaList:any[]=[];

  nodeType:any;

  masterAnalyticsDetails:any;
  masterAnalyticsAssessmentDetails:any;
  masterAnalyticsDiscoveryDetails:any;
  disableAnalytics:boolean = true;

  schemaData:any;
  worker_nodes:any;
  disableAssignWorkerNode:any;
  workerNodeValue:any;
  showButtons:any;
  analyticsStatusCalls:any;
  appDbDetailsData:any;
  showDbDetailsDashboardData:boolean = true;
  tcoLabel:any;
  tcoStatus:any;
  licenseType: any;
  settings_label:any;
  refId:any;

  constructor(private databaseListService: DatabaseListService,
              private commonServices:CommonServices,
              private eventEmitterService: EventEmitterService,
              private loginService: LoginService,
              private spinner: NgxSpinnerService,
              private modalService: NgbModal,
              private http:HttpClient,
              private router: Router) { }

  ngOnInit() {

    const dmapDBConfigLink = document.querySelectorAll('.dmapDBConfigLink');
    const dmapDBMigrationLinkk = document.querySelectorAll('.dmapDBMigrationLinkk');
    // const dmapBatchProcessLink = document.querySelectorAll('.dmapBatchProcessLink');

    this.styleFirstAccordian(dmapDBConfigLink)
    this.styleSecondAccordian(dmapDBMigrationLinkk);
    // this.styleBatchSecondAccordian(dmapBatchProcessLink);

    // this.styleBatchSecondAccordian(dmapBatchProcessLink);
    this.commonServices.$isShowSecondAccordianObj.subscribe(
      response => {
        this.showtab = response;
      }
    );

    // /* This provoke the Batch tab  */
    // this.commonServices.$batchTabClickedObj
    //   .subscribe((data:any) => {
    //     if(data){
    //       this.onBatchProcessTabClicked();
    //     }
    // });

    this.nodeType = this.commonServices.getNodeType();
    this.licenseType = this.commonServices.getLicenseType();
    this.loginService.getNodeType().subscribe(data => {
      this.nodeType = data.node_type;
      this.licenseType = data.license_type;
      this.commonServices.setNodeType(this.nodeType);
      this.commonServices.setLicenseType(this.licenseType);
      this.initializeTabs();
    });

    this.analyticsStatusCalls = setInterval(()=>{
      this.getAnalyticsStatus();
     }, 5000);
    if (this.licenseType == 'dmap pro' || this.licenseType == 'dmap enterprise'){
      this.settings_label = 'Node'
    }
    else{
      this.settings_label = 'Time Zone'
    }
  }
  ngOnDestroy(): void {
    clearInterval(this.analyticsStatusCalls);
  }

  initializeTabs(){
    let refId;

    refId = sessionStorage.getItem('refId');
    if (refId != undefined){
      this.openTabNAccordian(refId,"dbFirstAcc")
    }
    else{
      if (this.nodeType=='analytics_worker'){
          //this.showtab = true;
          $('#dbFirstAcc').addClass("show");
          $('#dbFirstAccMainDiv').addClass('shadow mb-5 bg-white rounded');

          $('a#nav-dbList-tab').click();
          $('a#nav-dbList-tab').tab('show');
        }
      else{
          $('#dbFirstAcc').addClass("show");
          $('#dbFirstAccMainDiv').addClass('shadow mb-5 bg-white rounded');

          $('a#nav-dbConfig-tab').click();
          $('a#nav-dbConfig-tab').tab('show');
      }
    }

  }

  getSavedTableDataCount(){
    return this.databaseListService.getSavedTableDataCount() > 0;
  }

  getSavedBatchDataCount(){
    return this.databaseListService.getSavedTableDataCount() > 0;
  }

  ngAfterViewInit(){
    let refId;
    refId = sessionStorage.getItem('refId');

    if (refId != undefined && refId != 'undefined'){
      this.openTabNAccordian(refId,"dbFirstAcc");
    }
    else{
      if (this.nodeType=='analytics_worker'){
       this.openTabNAccordian("nav-dbList-tab","dbFirstAcc");
      }
      else{
        this.openTabNAccordian("nav-dbConfig-tab","dbFirstAcc");
      }
    }

  }

  ngAfterContentInit(){
  }

  styleFirstAccordian(dmapDBConfigLink){

    dmapDBConfigLink[0].classList.remove('active');
    $('#dbFirstAcc').on('hidden.bs.collapse', function () {
      $('#dbFirstAccMainDiv').removeClass('shadow p-3 mb-5 bg-white rounded');

      dmapDBConfigLink.forEach((element) => {
          element.classList.remove('active');
      });
    });

    $('#dbFirstAcc').on('shown.bs.collapse', function () {
      $('a#nav-dbConfig-tab').tab('show');
      $('#dbFirstAccMainDiv').addClass('shadow mb-5 bg-white rounded');
      dmapDBConfigLink[0].classList.add('active');
    });
  }

  styleSecondAccordian(dmapDBMigrationLink){
    dmapDBMigrationLink[0].classList.remove('active');

    $('#dbSecondAcc').on('hidden.bs.collapse', function () {
      // $('#dbSecondAccMainDiv').removeClass('shadow p-3 mb-5 bg-white rounded');

      dmapDBMigrationLink.forEach((element) => {
          element.classList.remove('active');
      });
    });

    $('#dbSecondAcc').on('shown.bs.collapse', function () {
      $('a#nav-migrationStatus-tab').tab('show');
      $('#dbSecondAccMainDiv').addClass('shadow mb-5 bg-white rounded');
      dmapDBMigrationLink[0].classList.add('active');
    });
  }

  styleBatchSecondAccordian(dmapBatchProcessLinkk){
    dmapBatchProcessLinkk[0].classList.remove('active');

    $('#dbBatchSecondAcc').on('hidden.bs.collapse', function () {
      // $('#dbSecondAccMainDiv').removeClass('shadow p-3 mb-5 bg-white rounded');

      dmapBatchProcessLinkk.forEach((element) => {
          element.classList.remove('active');
      });
    });

    $('#dbBatchSecondAcc').on('shown.bs.collapse', function () {
      $('a#nav-batchProcessess-tab').tab('show');
      $('#dbBatchSecondAccMainDiv').addClass('shadow mb-5 bg-white rounded');
      dmapBatchProcessLinkk[0].classList.add('active');
    });
  }



  load_schema_data(){
    this.spinner.show();
    this.databaseListService.getMasterSchemaDetails().subscribe(data => {
      this.schemaData = data.schemas;

      this.worker_nodes = data.active_worker_nodes;
      if(this.schemaData.length > 0){
        for (let i in this.schemaData){
          if(this.schemaData[i]['workerNode'] == null){
              this.disableAssignWorkerNode = false;
          }
          else{
            this.disableAssignWorkerNode = true;
          }
        }
        this.showButtons = true;
        if(this.worker_nodes.length > 0){
         this.workerNodeValue = this.worker_nodes[0];
       }
      }
      this.spinner.hide();
     });

  }
  load_app_details_data(){
    this.spinner.show();
    this.databaseListService.getAppDBDetails().subscribe(data => {

      if (data.status == 'success'){
        this.appDbDetailsData = data.data
        this.tcoStatus = this.appDbDetailsData["tcoStatus"];
        if (this.appDbDetailsData["tcoStatus"] == 'Not Started'){
            this.tcoLabel = 'Enter TCO Questionnaire';
        }
        else{
          this.tcoLabel = 'Update TCO Questionnaire';
        }
        if (Object.keys(this.appDbDetailsData).length == 0){
          this.showDbDetailsDashboardData = false;
        }
        else{
          this.showDbDetailsDashboardData = true;
        }
      }
      else{
        this.appDbDetailsData = {}
      }

      this.spinner.hide();
     });


  }
  getAnalyticsStatus(){
    this.databaseListService.getAnalyticsStatus().subscribe(data => {
     if(data.allowed){
      this.disableAnalytics = false;
     }
     else{
      this.disableAnalytics = true;
     }
     });
  }


  openTabNAccordian(ref, accordianId){
    if (typeof ref === 'string' || ref instanceof String){
      sessionStorage['refId'] =ref;
    }
    else{
      sessionStorage['refId'] =ref.id;
    }
    if(ref.id == undefined){
      $('#' + accordianId).addClass('show');
      $('a#'+ ref).tab('show');
      $('#' + accordianId + 'MainDiv').addClass('shadow mb-5 bg-white rounded');
    }
    else{
      $('#' + accordianId).addClass('show');
    $('a#'+ ref.id).tab('show');
    $('#' + accordianId + 'MainDiv').addClass('shadow mb-5 bg-white rounded');

    }

    /* if (ref.id === 'nav-dbConfig-tab' && accordianId === 'dbFirstAcc') {
      this.showtab = false;
    }else{
      this.showtab = true;
    } */

    if (ref.id == 'nav-dbList-tab') {
      this.commonServices.$isShowSecondAccordianObj.subscribe(
        response => {
          this.showtab = response;
        }
      );
      //this.showtab = true;
    }
    else if (ref.id == 'nav-uploadSchema-tab' && accordianId === 'dbFirstAcc') {
      this.showtab = false;
      this.load_schema_data();
     }
     else if(ref.id == 'nav-appDbDetails-tab' && accordianId === 'dbFirstAcc'){
      this.showtab = false;
       this.load_app_details_data();
     }
     else if(ref.id == 'nav-workerNode-tab' || accordianId === 'dbFirstAcc'){
      this.showtab = false;
     }
     else{
      this.showtab = false;
    }

    // if (ref.id != 'nav-batchList-tab' && accordianId === 'dbFirstAcc') {
    //   this.showBatchTab = false;
    // }else{
    //   this.showBatchTab = true;
    // }

    if(accordianId === 'dbSecondAcc'){
      this.checkedDBRecords = [];
      this.checkedDBRecords = this.databaseListService.getSavedCheckedDBRecords();
    }

    if(ref.id == 'nav-batchList-tab'){
      this.onBatchProcessTabClicked();
    }
  }

  onBatchProcessTabClicked(){
    this.databaseListService.getDBlist().subscribe(data => {
      this.schemaList = data;
    });
  }

  showBatchDetails(){
    return this.databaseListService.getShowBatchDetails();
  }
  settings(settings_label){
    let node_type;
    if(this.nodeType == 'analytics_master'){
      node_type = 'analytics_master';
    }
    else{
      node_type = 'dmap_node';
    }

    const modalRef = this.modalService.open(DmapMasterSettingsModalComponent, {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = {'title':settings_label + ' Settings','node_type':node_type};
    modalRef.result.then((result) => {
    // if ( result == 'ok') {
    // }
  });
  }
  mailSettings(title,type){
    const modalRef = this.modalService.open(DmapMasterEmailSettingsModalComponent, {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = {'title':title,'emailType':type};
    modalRef.result.then((result) => {
    // if ( result == 'ok') {
    // }
  });

  }
  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    })
  }
  generateAnalyticsReport(){
    $('#nav-analyticsDashboard-tab').trigger('click');
    this.spinner.show();
    this.databaseListService.getOfflineVmDetails().subscribe(response => {
      if(response.offline_vms > 0){
        this.spinner.hide();
        const modalRef = this.modalService.open(NgbdConfirmationModal);
        let message = '';
        if(response.offline_vms == 1){
          message = 'node is';
        }
        else{
          message = 'nodes are';
        }
        modalRef.componentInstance.data = {msg : response.offline_vms+' worker '+message+' offline. '+response.total_analytics_assessment_completed_schemas+' of '+response.total_schemas+' assessments are completed. Do you wish to generate Analytics reports?', title : 'Confirmation',okButtonLabel : 'Yes',cancelButtonLabel:'No',label:'moveToCompletion'};
        modalRef.result.then((result) => {
        if ( result == 'ok') {
          this.disableAnalytics = true;
          //$('#nav-analyticsDashboard-tab').trigger('click');
          }
        });
      }
      else{
        this.spinner.hide();
        this.disableAnalytics = true;
        this.databaseListService.generateAnalyticsReport().subscribe(data => {
          if(data.status != "success"){
            this.openAlert(data.message);
          }
          else{
            // const modalRef = this.modalService.open(DmapAlertDialogModal);
            // modalRef.componentInstance.data = {msg: "Analytics is in progress to generate the requested reports.", title : 'Alert'};
            // modalRef.result.then((result) => {
            //   if ( result === 'ok') {
            //     $('#nav-analyticsDashboard-tab').trigger('click');
            //   }
            // });
          }
         });
        }
      });

  }
  viewLogs(){
    const modalRef = this.modalService.open(AssessmentLogsComponent, {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = {'title':'View/Download Worker Node Logs'};
    modalRef.result.then((result) => {
    // if ( result == 'ok') {
    // }
  });
  }

  masterBackup(){
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {msg : 'On completion of backup, please save the downloaded .tar.gz file in a secure location. If you reinstall the DMAP image and create a new container for DMAP, then the downloaded backup file will be required to restore the data of DB schema assessments and migrations done using DMAP.  Data will be restored to the point you previously backed up data.',
                                       title : 'Confirmation',
                                       okButtonLabel : 'Continue',
                                       cancelButtonLabel:'Cancel',
                                       label:'restoreDmap'};
    modalRef.result.then((result) => {
    if ( result == 'ok') {
      const appBackupRequired = modalRef.componentInstance.data.showRadioButtons 
      ? modalRef.componentInstance.userChoice === 'yes' 
      : false;
      this.databaseListService.backupDMAP(appBackupRequired).subscribe((res) => {

        let blob = new Blob([res],{});
        let filename = 'dmap_complete.tar.gz';
        FileSaver.saveAs(blob,filename);
      });
    }});
  }
}
