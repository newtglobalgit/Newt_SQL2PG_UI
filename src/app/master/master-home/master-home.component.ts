import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssessmentLogsComponent } from 'src/app/common/Modal/assessment-logs/assessment-logs.component';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbdConfirmationModal } from 'src/app/common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DmapMasterEmailSettingsModalComponent } from 'src/app/common/Modal/dmap-master-email-settings-modal/dmap-master-email-settings-modal.component';
import { DmapMasterSettingsModalComponent } from 'src/app/common/Modal/dmap-master-settings-modal/dmap-master-settings-modal.component';
import { FileUploadModalComponent } from 'src/app/common/Modal/file-upload-modal/file-upload-modal.component';
import { CommonServices } from 'src/app/common/Services/common-services.service';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';

declare var $: any;
@Component({
  selector: 'app-master-home',
  templateUrl: './master-home.component.html',
  styleUrls: ['./master-home.component.css']
})
export class MasterHomeComponent implements OnInit {

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

  constructor(private databaseListService: DatabaseListService,
              private commonServices:CommonServices,
              private modalService: NgbModal,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {

    const dmapMasterNodeLink = document.querySelectorAll('.dmapMasterNodeLink');

    this.styleFirstAccordian(dmapMasterNodeLink);
    this.initializeTabs();
    this.analyticsStatusCalls = setInterval(()=>{
     this.getAnalyticsStatus();
    }, 5000);
  }
  ngOnDestroy(): void {
    clearInterval(this.analyticsStatusCalls);
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

  initializeTabs(){
      $('#dbMasterFirstAcc').addClass("show");
    $('#dbMasterFirstAccMainDiv').addClass('shadow mb-5 bg-white rounded');

      $('a#nav-analyticsDashboard-tab').click();
      $('a#nav-analyticsDashboard-tab').tab('show');
  }
  ngAfterViewInit(){
    this.openTabNAccordian("nav-analyticsDashboard-tab","dbMasterFirstAcc")

  }

  styleFirstAccordian(dmapMasterNodeLink){

    dmapMasterNodeLink[0].classList.remove('active');
    $('#dbMasterFirstAcc').on('hidden.bs.collapse', function () {
      $('#dbMasterFirstAccMainDiv').removeClass('shadow p-3 mb-5 bg-white rounded');

      dmapMasterNodeLink.forEach((element) => {
          element.classList.remove('active');
      });
    });

    $('#dbMasterFirstAcc').on('shown.bs.collapse', function () {
      $('a#nav-dbConfig-tab').tab('show');
      $('#dbMasterFirstAccMainDiv').addClass('shadow mb-5 bg-white rounded');
      dmapMasterNodeLink[0].classList.add('active');
    });
  }


  openTabNAccordian(ref, accordianId){

    $('#' + accordianId).addClass('show');
    $('a#'+ ref.id).tab('show');
    $('#' + accordianId + 'MainDiv').addClass('shadow mb-5 bg-white rounded');

    if (ref.id == 'nav-uploadSchema-tab' && accordianId === 'dbMasterFirstAcc') {
     this.load_data();
    }
    else if(ref.id == 'nav-appDbDetails-tab' && accordianId === 'dbMasterFirstAcc'){
      this.load_app_details_data();
    }
    else if(ref.id == 'nav-workerNode-tab' || accordianId === 'dbMasterFirstAcc'){
      console.log();
    }
  }
  load_data(){
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

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

  generateAnalyticsReport(){
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
          this.databaseListService.generateAnalyticsReport().subscribe(data => {
            if(data.status != "success"){
              //this.openAlert(data.message);
            }
            });
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
         });
      }

    });

  }


  settings(){
    const modalRef = this.modalService.open(DmapMasterSettingsModalComponent, {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = {'title':'Settings','node_type':'analytics_master'};
    modalRef.result.then((result) => {
    // if ( result == 'ok') {
    // }
  });
  }
  viewLogs(){
    const modalRef = this.modalService.open(AssessmentLogsComponent, {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = {'title':'Download Assessment Logs'};
    modalRef.result.then((result) => {
    if ( result == 'ok') {
      console.log("okkkk");
    }
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

  openUploadModal(file_type){
    console.log(file_type)
    let fileType = '';
    let sampleFile = '';
    let msg = '';
    if (file_type == 'application'){
      fileType = 'applicationQuestionnaire'
      sampleFile = '/assets/sampleTemplates/Application_Questionnaire.xlsx'
      msg = 'Please click the icon to browse or drag & drop excel file to upload application questionnaire.'
    }

    else if (file_type == 'db_migration'){
      fileType = 'dbMigrationQuestionnaire'
      sampleFile = '/assets/sampleTemplates/Database_Migration_Questionnaire.xlsx'
      msg = 'Please click the icon to browse or drag & drop excel file to upload data migration questionnaire.'
    }

    else if (file_type == 'tco'){
      fileType = 'tcoQuestionnaire'
      sampleFile = '/assets/sampleTemplates/TCOQuestionnaire.xlsx'
      msg = 'Please click the icon to browse or drag & drop excel file to upload TCO questionnaire.'
    }

    else if (file_type == 'awr'){
      fileType = 'awrReport'
      sampleFile = '/assets/sampleTemplates/3_awr_trend.sql'
      msg = 'Please click the icon to browse or drag & drop excel file to upload AWR report.'
    }

    else if (file_type == 'dbScript'){
      fileType = 'dbScriptReport'
      sampleFile = '/assets/sampleTemplates/4_oracle_assessment.sql'
      msg = 'Please click the icon to browse or drag & drop text file to upload DB Script Output.'
    }

    const modalRef = this.modalService.open(FileUploadModalComponent, {size: 'lg', scrollable: true});

    modalRef.componentInstance.data = {'fileType':fileType, 'sampleFile': sampleFile, 'isSampleFileShow':true,"message": msg};

    modalRef.result.then((result) => {

        if ( result == 'ok') {
          this.openAlert('File uploaded successfully.');
          this.load_data();
      } else {
        if(result != 'cancel') this.openAlert('Something went wrong. Please try again.');
      }
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
        console.log(res);

        let blob = new Blob([res],{});
        let filename = 'dmap_complete.tar.gz';
        saveAs.saveAs(blob,filename);
      });
    }});
  }
}
