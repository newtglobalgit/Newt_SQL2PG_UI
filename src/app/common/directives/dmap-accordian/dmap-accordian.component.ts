import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { DatabaseSchemaAssesmentService } from '../../Services/database-schemaAssesment.service';
declare var $: any;
import * as _ from 'underscore';
import { DatabaseListService } from '../../Services/database-list.service';
import { EventEmitterService } from '../../Services/event-emitter.service';
import { CommonServices } from '../../Services/common-services.service';
import { DmapAlertDialogModal } from '../../Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbdConfirmationModal } from '../../Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DblinkViewComponent } from '../../Modal/dblink-view/dblink-view.component';
import { DmapTargetCredtialsModal } from '../../Modal/dmap-target-credtials-modal/dmap-target-credtials-modal.component';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-dmap-accordian',
  templateUrl: './dmap-accordian.component.html',
  styleUrls: ['./dmap-accordian.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DmapAccordianComponent implements OnInit, OnChanges {

  @Input () accordianSettings:any;
  @Input () accordianData:any[];
  @Input () nodeType:any;

  @Output() onStartAssessment = new EventEmitter<any>();
  @Output() onStartSchemaConversion = new EventEmitter<any>();

  accordians: any[];
  accordianHeaders: any;
  tableBar:any[];
  databaseObjects:any[];
  storageObjects:any;
  storageObjectsSettings:any;
  codeObjects:any[];
  codeObjectsSettings:any;
  effortBreakdowns:any[];
  effortBreakdownsSettings:any;
  migrationPlan:any;
  migrationPlanSettings:any;
  currentView:string;
  startDisabled:boolean = false;

  discoveryButtonShown = true;
  assessmentButtonShown:boolean = true;
  schemaMigrationButtonShown:boolean = true;
  dataMigrationButtonShown:boolean = true;
  licenseType:any;
  colSpan:any;
  lastRow:any;

  constructor( private commonservice: CommonServices,
               private databaseListService: DatabaseListService,
               private eventEmitterService: EventEmitterService,
               private spinner: NgxSpinnerService,
               private modalService: NgbModal,) { }

  ngOnInit() {
    this.licenseType = this.commonservice.getLicenseType();
    if (this.nodeType == 'analytics_master'){
      this.colSpan = 10;
      this.lastRow = 9;
    }else{
      this.colSpan = 9;
      this.lastRow = 8;
    }
    this.initialize();
  }

  ngOnChanges(changes:SimpleChanges){
    this.initialize()
  }

  initialize(){
    this.accordians = this.accordianData.slice();
    this.accordianHeaders = this.accordianSettings.tableHeaders;

      if(this.eventEmitterService.subsVar == undefined){
        this.eventEmitterService.subsVar = this.eventEmitterService.invokeDMAPAccordiansComponentsFunctions.subscribe((data:any) => {
          this.getDataMigrationReport(data, 0);
        });
      }
  }

  styleAccordiansHeader(index, event, isAccordianExpanded){
    if(!isAccordianExpanded){
      if(event == 'mouseEnter'){
        $(".accordianTr_"+index).addClass("dmapTableAccordianMainHover ");

      }else if(event == 'mouseLeave'){
        $(".accordianTr_"+index).removeClass("dmapTableAccordianMainHover");
      }
    }else{
      $(".accordianTr_"+index).addClass("dmapTableAccordianMainHover ");
    }
  }

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

  getHref(i){
    return '#href_'+i;
  }

  startDisacoveryt(data){
    this.startDisabled = true;

    let reqObj = {"RUN_ID": data.runId.toString()}

    this.databaseListService.startDiscovery(reqObj).subscribe(res=>{
      this.commonservice.setIsDBListChanged(true);
      this.startDisabled = false;
    });
  }

  expandAccordian(data, i){
    this.commonservice.setActionButtonClicked('ViewDetail')
    if(this.accordians[0].stepStatus !="Not Started" && this.accordians[0].stepStatus !="In Queue" ){
      if(data.isAccordianExpanded){
        this.databaseListService.setIsAccordianExpanded(data.runId, false);
      }else{
        this.databaseListService.setIsAccordianExpanded(data.runId, true);
        this.styleAccordiansHeader(i, 'rowSelected', true);
      }
    }
  }

  getDataMigrationReport(data, i){
    this.databaseListService.setIsAccordianExpanded(data.runId, true);
    this.styleAccordiansHeader(i, 'rowSelected', true);
  }

  // startSchemaCoversion(reqObj){
  //   this.spinner.show();
  //   //let reqObj = {"RUN_ID": data.RUN_ID.toString(),""}

  //   this.databaseListService.startSchemaConversion(reqObj).subscribe(data=>{
  //     if(data.status == 'failed'){
  //         this.spinner.hide();
  //         this.openAlert(data.message)
  //     }
  //     else{
  //       this.commonservice.setIsDBListChanged(true);
  //       setTimeout(() => {
  //         this.spinner.hide();
  //       }, 1000);
  //     }
  //   }, error =>{
  //     this.commonservice.setIsDBListChanged(true);
  //     setTimeout(() => {
  //       this.spinner.hide();
  //     }, 1000);
  //   });
  // }

  clearErrorStatus(data){
    let reqObj = {"RUN_ID": data.runId.toString(),"Stage": data.step}
    this.databaseListService.clearErrorStatus(reqObj).subscribe(res=>{
      this.startDisabled = false;
    });
  }

  viewDetail(data){
      this.openAlert(data);
  }

  startManually(data){

    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {msg : 'Are you sure that selected RUN ID’s which is “In Queue" needs to start manually? On continuing to submit this RUN ID will be removed from batch process.', title : 'Confirmation',okButtonLabel : 'Yes',cancelButtonLabel:'No',label:'moveToCompletion'};
    modalRef.result.then((result) => {
    if ( result == 'ok') {
      this.spinner.show();
      let reqObj = {"RUN_ID": data.runId.toString(),"Stage": data.step}
       this.databaseListService.startManually(reqObj).subscribe(res=>{

      });
      this.spinner.hide();

    }
    });

  }
  startAssessment(data){
    //this.spinner.show();
    this.startDisabled = true;
    let reqObj = {"RUN_ID": data.runId.toString(),"node":data.workerNode}

    this.databaseListService.startAssessment(reqObj).subscribe(res=>{
      if(res.status == 'failed'){
          this.openAlert(res.message);
      }
      else{
        this.commonservice.setIsDBListChanged(true);
        //this.startDisabled = false;
      }

     // this.spinner.hide();
    });
  }
  openTargetDatabaseConfigModal(data){
    const modalRef = this.modalService.open(DmapTargetCredtialsModal, {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = {'title':'Target Database Configuration', 'runId': data.runId,'target_db_type':data.target_db_type,'target_env':data.target_env,'toolsUsed':data.toolsUsed,'sourceDBSchema':data.sourceDBSchema};
    modalRef.result.then((result) => {
      if ( result.status == 'success') {
        data.targetDBName = result.targetDBName
      }else if(result == 'cancel'){
        this.startDisabled = false;
      }
      // else{

      // }
    });
  }
  startSchemaConversion(data){

    if(data.targetDBName == null && data.target_env == 'Azure' && data.toolsUsed == 'SCT' && data.interim_status == 0){
      console.log('');
    }
    else if(data.targetDBName == null ){
      this.openTargetDatabaseConfigModal(data);
    }
    else if(data.target_env == 'Azure' && data.toolsUsed == 'SCT' && data.interim_status == 0){
      console.log('');
    }
    else{

      if(data.toolsUsed == 'SCT'){
        let reqObj = {}
        reqObj = {"RUN_ID":data.runId,"RERUN":true}
        this.startSchemaCoversion_(reqObj);
      }
      else{
        let reqObj = {}
        const modalRef = this.modalService.open(NgbdConfirmationModal);
        modalRef.componentInstance.data = {msg : 'Is there any change in database Schema?', title : 'Confirmation',okButtonLabel : 'Yes',cancelButtonLabel:'No'};
        modalRef.result.then((result) => {

          if ( result === 'ok') {
            this.startDisabled = true;
            reqObj = {"RUN_ID":data.runId,"RERUN":true}
            this.spinner.show();
            this.databaseListService.getDbLinkDetails({"run_id":data.runId}).subscribe(resp=>{
              this.handleDbLinkDetailsResponse(resp, reqObj, data.runId);
            // this.spinner.hide();
            // if(resp.status == 'success' && resp.exists){
            //   const modalRef = this.modalService.open(DblinkViewComponent, {size: 'lg', scrollable: true});
            //   modalRef.componentInstance.data = {'title':'DBLINK Details', 'data': resp.data, 'runId': data.runId};
            //   modalRef.result.then((result) => {
            //   if ( result == 'ok') {
            //     this.startSchemaCoversion_(reqObj);
            //   }
            //   else{
            //     this.startDisabled = false;
            //   }
            //   });
            // }else{
            //   this.startSchemaCoversion_(reqObj);
            // }
          });

          }
          else if ( result === 'cancel') {
            this.startDisabled = true;
            reqObj = {"RUN_ID":data.runId,"RERUN":false}
            this.spinner.show();
            this.databaseListService.getDbLinkDetails({"run_id":data.runId}).subscribe(resp=>{
              this.handleDbLinkDetailsResponse(resp, reqObj, data.runId);
              // this.spinner.hide();
              // if(resp.status == 'success' && resp.exists){
              //   const modalRef = this.modalService.open(DblinkViewComponent, {size: 'lg', scrollable: true});
              //   modalRef.componentInstance.data = {'title':'DBLINK Details', 'data': resp.data, 'runId': data.runId};
              //   modalRef.result.then((result) => {
              //   if ( result == 'ok') {
              //     this.startSchemaCoversion_(reqObj);
              //   }
              //   else{
              //     this.startDisabled = false;
              //   }
              // });
              // }else{
              //   this.startSchemaCoversion_(reqObj);
              // }
            });

          }
          else{
            this.startDisabled = false;
          }
        });


      }

     // this.startSchemaCoversion_(this.data.runId);
    }

  }
  handleDbLinkDetailsResponse(resp: any, reqObj: any, runId: any) {    this.spinner.hide();
    if (resp.status === 'success' && resp.exists) {
        const modalRef = this.modalService.open(DblinkViewComponent, { size: 'lg', scrollable: true });
        modalRef.componentInstance.data = { 'title': 'DBLINK Details', 'data': resp.data, 'runId':runId };
        modalRef.result.then((result) => {
            if (result === 'ok') {
                this.startSchemaCoversion_(reqObj);
            } else {
                this.startDisabled = false;
            }
        });
    } else {
        this.startSchemaCoversion_(reqObj);
    }
}

  startSchemaCoversion_(reqObj){
    this.spinner.show();
    //let reqObj = {"RUN_ID": data.RUN_ID.toString(),""}

    this.databaseListService.startSchemaConversion(reqObj).subscribe(data=>{
      if(data.status == 'web_request_failed'){
          this.spinner.hide();
          this.startDisabled = false;
          this.openAlert(data.message);
      }
      else if(data.status == "failed"){
        this.spinner.hide();
      }
      else{
        this.commonservice.setIsDBListChanged(true);
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
    }, error =>{
      this.commonservice.setIsDBListChanged(true);
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    });
  }
}
