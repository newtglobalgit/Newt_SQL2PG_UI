import { Component, OnInit, Output, Input, ComponentFactoryResolver } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseListService } from '../../Services/database-list.service'
import { ViewChild } from '@angular/core'
import { CommonServices } from '../../Services/common-services.service';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { EventEmitter } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { DmapAlertDialogModal } from '../../Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;


@Component({
  selector: 'app-dmap-upload-file',
  templateUrl: './dmap-upload-file.component.html',
  styleUrls: ['./dmap-upload-file.component.css']
})
export class DmapUploadFileComponent implements OnInit {
  @Input() data;
  submitDisabled: boolean = false;
  @Output() onFileUploadClicked = new EventEmitter<any>();

  files: File[] = [];
  filesData:any = [];
  uploadedFilePath: string = null;
  masterNodeIPExist: boolean = false;

  constructor(private commonservice: CommonServices,
              private http: HttpClient,
              private dabaseListService: DatabaseListService,
              private spinner: NgxSpinnerService,
              private modalService: NgbModal,
              private activeModal: NgbActiveModal){}

  ngOnInit() {
    this.commonservice.enableFileUpload$.subscribe((val) => {
      this.masterNodeIPExist = val && val !== "";
    });

    this.commonservice.submitDisabled$.subscribe(value => {
      this.submitDisabled = value;
    });
  }

  filesDropped(files) {
    for (let index = 0; index < files.length; index++) {
      const element = <File>files[index];

      this.files = [element];
      /* this.filesData.push(element.name) */
    }
  }

  attachFile(event) {
    this.filesDropped(event.target.files)
  }

  deleteAttachment(index) {
    /* this.filesData.splice(index, 1); */
    this.files.splice(index, 1);
  }

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

  uploadFile(){

    if(this.data.fileType ==  'awrReport' || this.data.fileType == 'dbScriptReport'){
      sessionStorage['dbName'] = this.data.dbName;
    }
    let obj = {}
    if(this.files.length == 0){
      return;
    }
    if(this.files.length > 1){
      this.openAlert("Only one file is allowed to upload.")
      return;
    }
    let excel_types = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    this.spinner.show();
    const fd = new FormData();
    if(this.data.fileType == 'applicationQuestionnaire' || this.data.fileType == 'dbMigrationQuestionnaire' || this.data.fileType == 'tcoQuestionnaire'){
      let invalid_type = false;
      for(let i in this.files){
      if(excel_types.includes(this.files[i].type)){
        fd.append("file", this.files[i]);
      }else{
        invalid_type = true;
        }
      }
      if(invalid_type){
        this.spinner.hide();
        this.openAlert("Please upload a valid file in excel format.");
      }else{
      this.file_upload(fd);
      }
    }else{
      for(let i in this.files){
        if(this.data.fileType == 'dbScriptReport'){
          if(this.files[i].type == 'text/plain'){
          fd.append("file", this.files[i]);
          this.file_upload(fd);
          }else{
            this.spinner.hide();
            this.openAlert("Only text files are allowed to upload.");
          }
        }
        else if(this.data.fileType == 'restoreDMAP'){
          if(this.files[i].type == 'application/x-gzip'){
            fd.append("file", this.files[i]);
            this.file_upload(fd);
            }else{
              this.spinner.hide();
              this.openAlert("Only tar.gz files are allowed to upload.");
            }
        }
        else if(this.data.fileType =='dbScripts'){
          if (this.data.scriptName == 'oracle_assessment' || this.data.scriptName == 'redo_metrics'|| this.data.scriptName == 'sga_mem_components' || this.data.scriptName == 'data_analysis' || this.data.scriptName == 'lob_size' || this.data.scriptName == 'partition_detail' || this.data.scriptName == 'database_stats' || this.data.scriptName == 'awr_trend' || this.data.scriptName == 'top_sql_query' || this.data.scriptName == 'db_performance_queries' ){
            if(this.files[i].type == 'text/plain'){
              fd.append("file", this.files[i]);
              this.file_upload(fd);
            }else{
                this.spinner.hide();
                this.openAlert("Only text files are allowed to upload.");
            }
          }

        }
        else if(this.data.fileType == 'uploadCopilot'){
          console.log(this.files[i].type,"this.files[i].type")
          fd.append("file", this.files[i]);
          this.file_upload(fd);
          // if(this.files[i].type == 'sql' || this.files[i].type == 'text/plain'){
          // fd.append("file", this.files[i]);
          // this.file_upload(fd);
          // }else{
          //   this.spinner.hide();
          //   this.openAlert("Only text/SQL files are allowed to upload.");
          // }
        }
        else{
          if(excel_types.includes(this.files[i].type)){
            fd.append("file", this.files[i]);
            this.file_upload(fd);
          }else{
            this.spinner.hide();
            this.openAlert("Please upload a valid file in excel format.");
          }
        }
      }
    }

  }

  file_upload(fd){
    let obj = {}
    obj['run_id'] = this.data.run_id;
    obj['userId'] = sessionStorage['user_id'];
    obj['object_type'] = this.data.label;
    obj['fileType'] = this.data.fileType;
    obj['file'] = fd;
    if (this.data.fileType == 'dbScripts'){
      obj['dbName'] = this.data.dbName;
      obj['scriptName'] = this.data.scriptName;
    }

    if (this.data.fileType == 'applicationQuestionnaire'){
      obj['appId'] = this.data.applicationId;
    }
    if (this.data.fileType == 'dbMigrationQuestionnaire'){
      obj['dbName'] = this.data.dbName;
    }
    if (this.data.fileType == 'restoreDMAP'){
      obj['dbNodeIP'] = this.data.dbNodeIP;
      obj['appNodeIP'] = this.data.appNodeIP;
      obj['appNodePort'] = this.data.appNodePort;
      obj['restoreApp'] = this.data.restoreApp;
    }
    if (this.data.fileType == 'appIntakeExcel'){
      obj['appId'] = this.data.appId;
      obj['appName'] = this.data.appName;
    }

    this.dabaseListService.uploadfile(obj).subscribe((res:any) => {
      //this.spinner.show();
      // if(res.status){

      /** This if statement is added because for fileType restoreDMAP the response comes as an array */
      if(this.data.fileType == 'restoreDMAP'){
        if(res[0].status){
          this.spinner.hide();
          this.onFileUploadClicked.emit(res[0].status);
          this.activeModal.close('ok');
        }
        else if(res[0].hasOwnProperty('message')){
          this.spinner.hide();
          this.openAlert(res[0].message);
        }
        else{
          this.spinner.hide();
          this.openAlert('Something went wrong. Please try again.');
        }
      }
      else if(this.data.fileType == 'dbScripts'){
        if(res.status == 'success'){
          this.spinner.hide();
          this.onFileUploadClicked.emit(res.status);
          this.activeModal.close('ok');
        }
        else{
          this.spinner.hide();
          this.openAlert(res.message);
        }
      }
      else if(this.data.fileType != 'restoreDMAP'){
        if(res.status){
          this.spinner.hide();
          this.onFileUploadClicked.emit(res.status);
          this.activeModal.close('ok');
        }
        else if(res.hasOwnProperty('message')){
          this.spinner.hide();
          this.openAlert(res.message);
        }
        else{
          this.spinner.hide();
          this.openAlert('Something went wrong. Please try again.')
        }
      }

      else{
        this.spinner.hide();
        this.openAlert('Something went wrong. Please try again.')
      }
    }, error =>{
      this.spinner.hide();
      this.openAlert('Something went wrong. Please try again.');
    })
  }
}
