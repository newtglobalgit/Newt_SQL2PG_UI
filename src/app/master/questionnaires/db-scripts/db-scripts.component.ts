import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import FileSaver from 'file-saver';SAIMA_TBD
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { DmapProdDbDetailsComponent } from 'src/app/common/Modal/dmap-prod-db-details/dmap-prod-db-details.component';
import { FileUploadModalComponent } from 'src/app/common/Modal/file-upload-modal/file-upload-modal.component';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';

@Component({
  selector: 'app-db-scripts',
  templateUrl: './db-scripts.component.html'
})
export class DbScriptsComponent implements OnInit {

  constructor(private activatedroute:ActivatedRoute,
              private spinner: NgxSpinnerService,
              private databaseListService:DatabaseListService,
              private modalService: NgbModal) { }

  dbName:any;
  dbScriptDetails:any;
  allowFormToEdit:boolean = true;
  showDbScriptsData:boolean = true;

  file_mapping = {'DB Details & Settings':'oracle_assessment','AWR Trend':'awr_trend',
  'Redo Metrics':'redo_metrics','SGA & PGA Memory Components':'sga_mem_components',
  'Data Analysis':'data_analysis','LOB Size':'lob_size','Partition Detail':'partition_detail','Database Stats':'database_stats',
  'Top SQL Query':'top_sql_query','DB Performance Queries':'db_performance_queries'  }

  ngOnInit() {
    this.activatedroute.queryParams.subscribe(queryParams => {
      this.dbName=queryParams['dbName'];
      console.log(this.dbName,"this.dbName")
      this.loadData();
    });
  }

  error30Characters(msg){
    return msg.substring(0,30);
    }
    viewFullError(msg){
    this.openAlert(msg);
    }
  
    showError(msg){
    if(msg.length>30){
      return true
    }
    return false;
    }
    
  loadData(){
    let reqObj = {}
    reqObj['db_name'] = this.dbName;
    this.databaseListService.getScriptDetails(reqObj).subscribe(data => {
      if(data.status == 'success'){
        this.spinner.hide();
           let prodData = data.data;
           this.allowFormToEdit = !prodData.analytics_running;
           this.dbScriptDetails = prodData.scripts;
      }
      else{
        this.allowFormToEdit = false;
        this.showDbScriptsData = false;
      }
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

  opneUploadModal(fileType){

    let message,sampleFile;
    if (fileType == 'DB Details & Settings'){
      message = "Please click the icon to browse or drag & drop file to upload db details & settings details."
      sampleFile =  '/assets/sampleTemplates/oracle_assessment.sql'
    }
    else if(fileType == 'AWR Trend'){
      message = "Please click the icon to browse or drag & drop file to upload awr trend details."
      sampleFile =  '/assets/sampleTemplates/awr_trend.sql'
    }
    else if(fileType == 'Database Stats'){
      message = "Please click the icon to browse or drag & drop file to upload database stats."
      sampleFile =  '/assets/sampleTemplates/db_stats.sql'
    }
    else if(fileType == 'Redo Metrics'){
      message = "Please click the icon to browse or drag & drop file to upload redo metrics details."
      sampleFile =  '/assets/sampleTemplates/redo_metrics.sql'
    }
    else if(fileType == 'SGA & PGA Memory Components'){
      message = "Please click the icon to browse or drag & drop file to upload SGA & PGA memory components."
      sampleFile =  '/assets/sampleTemplates/sga_memory_components.sql'
    }
    else if(fileType == 'Data Analysis'){
      message = "Please click the icon to browse or drag & drop file to upload data analysis details."
      sampleFile =  '/assets/sampleTemplates/data_analysis.sql'
    }
    else if(fileType == 'LOB Size'){
      message = "Please click the icon to browse or drag & drop file to upload lob size details."
      sampleFile =  '/assets/sampleTemplates/lob_size.sql'
    }
    else if(fileType == 'Partition Detail'){
      message = "Please click the icon to browse or drag & drop file to upload partition detail."
      sampleFile =  '/assets/sampleTemplates/partition_details.sql'
    }
    else if(fileType == 'Top SQL Query'){
      message = "Please click the icon to browse or drag & drop file to upload top sql detail."
      sampleFile =  '/assets/sampleTemplates/top_sql_query.sql'
    }
    else if(fileType == 'DB Performance Queries'){
      message = "Please click the icon to browse or drag & drop file to upload db performance."
      sampleFile =  '/assets/sampleTemplates/db_performance_queries.sql'
    }
    const modalRef = this.modalService.open(FileUploadModalComponent, {size: 'lg', scrollable: true});

    modalRef.componentInstance.data = {'fileType':'dbScripts', 'sampleFile':sampleFile, 'isSampleFileShow':true,"message":message,"dbName":this.dbName,"scriptName":this.file_mapping[fileType]};

    modalRef.result.then((result) => {

        if ( result == 'ok') {
          this.openAlert('File uploaded successfully.');
          this.loadData();
      } else {
        if(result != 'cancel') this.openAlert('Something went wrong. Please try again.');
      }
    });
  }

  executeDbScript(fileType){
    const modalRef = this.modalService.open(DmapProdDbDetailsComponent, {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = {'title':'Production Database Details','dbName':this.dbName,"scriptName":this.file_mapping[fileType]};
    modalRef.result.then((result) => {
      if ( result == 'ok') {
        this.loadData();
      }
      // else if(result == 'cancel'){
      // }
      // else{
      // }
    });
  }
  downloadScripts(fileType){
    let reqObj = {
      "db_name" :this.dbName,
      "script_name" :this.file_mapping[fileType]
    }
    let extension;
    if (this.file_mapping[fileType] == 'oracle_assessment' || this.file_mapping[fileType] == 'sga_mem_components' || this.file_mapping[fileType] == 'awr_trend' ||
    this.file_mapping[fileType] == 'data_analysis' || this.file_mapping[fileType] == 'lob_size' || this.file_mapping[fileType] == 'partition_detail'
    || this.file_mapping[fileType] == 'database_stats' || this.file_mapping[fileType] == 'top_sql_query' || this.file_mapping[fileType] == 'db_performance_queries'){
      extension = '.txt'
    }
    else if(this.file_mapping[fileType] == 'redo_metrics' ){
      extension = '.xlsx'
    }
    this.databaseListService.downloadDbScript(reqObj).subscribe(data=>{


      if(data.type == "application/json"){
        this.openAlert("File may not exists");
      }
     else{
      let blob = new Blob([data],{});
      let filename = fileType+extension;
      saveAs.saveAs(blob,filename);
     }
    });

  }
}
