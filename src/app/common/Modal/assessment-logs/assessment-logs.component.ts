import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from '../../Services/database-list.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import { NgForm } from '@angular/forms';
import { DmapBatchDetailsComponent } from '../dmap-batch-details/dmap-batch-details.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-assessment-logs',
  templateUrl: './assessment-logs.component.html',
  styleUrls: ['./assessment-logs.component.css']
})
export class AssessmentLogsComponent implements OnInit {
  @Input() data:any;
  @ViewChild('f',  { static: false }) masterEmailSettingsForm: NgForm;

  workerNode:string;
  workerNodeName:string;
  fileList:any = [];
  activeNodes:any[]=[]
  selectedLogFiles:any[]=[];
  isNodeSelected:boolean = false;
  isAllRowChecked:number;
  isSelected:boolean=false;
  selectedNode: string;

  constructor(private databaseListService: DatabaseListService,
    private spinner: NgxSpinnerService, private modalService: NgbModal, private activeModal: NgbActiveModal,     private _PopupDraggableService: PopupDraggableService
  ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.spinner.show();
    this.databaseListService.getMasterSchemaDetails().subscribe(data => {
      this.spinner.hide();
      this.activeNodes = data.active_worker_nodes.sort();
      if (this.activeNodes.length > 0) {
        this.selectedNode = this.activeNodes[0];
        this.onNodeSelect(this.selectedNode);
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

  download(){
    let req = {"node_name": this.workerNode, "files": this.selectedLogFiles}
    this.spinner.show();
    this.databaseListService.downloadWorkerNodeLogs(req).subscribe((res) => {
      this.workerNodeName = this.workerNode;
        this.spinner.hide();
        if(res.type == "application/json"){
          this.openAlert("File does not exists");
        }
        else{
          let blob = new Blob([res],{});
          let date = this.dateFormat()
          let filename = this.workerNode+'_'+date+'_log.zip';
           saveAs.saveAs(blob,filename);
        }

      });
  }

  submit(){
    this.isNodeSelected = true;
    let req = {"node_name": this.workerNode}
    this.spinner.show();
    this.databaseListService.getSelectedNodeLogFiles(req).subscribe(data => {
      this.isSelected = true;
      this.selectedLogFiles = [];
      this.workerNodeName = this.workerNode;
      let temp = data.files;
      this.fileList = [];
      for (let i in temp){
        this.fileList[i] =  {"file":temp[i]};
      }
      this.spinner.hide();
      this.setCheckboxes();
    });

  }

  openLog(dtls){
    //if(dtls.event.target.checked){
      let req = {"node_name": this.workerNode, "file_name": dtls.file}
      this.spinner.show();
      this.databaseListService.getLogFileContent(req).subscribe(data => {
        if(data.status == "success"){
          this.spinner.hide();
          if (data.file_content){
            let fileContent = data.file_content;
            //this.openAlert(data.file_content);
            let logData:any = {};
            let dataa = [];
            logData.title = "Logs";
            logData.headers = [{"name":'Logs', "widthStyle":"100%"}];
            logData.showId = "masterAssessmentLogs"


            if(fileContent){
              dataa = fileContent.split("\n")
            }
            else{
              dataa[0] = "No logs Found";
            }
            logData.content = dataa;
            const modalRef = this.modalService.open(DmapBatchDetailsComponent,  {size: 'lg', scrollable: true});
            modalRef.componentInstance.data = logData;
            modalRef.result.then((result) => {
              // if ( result == 'ok') {

              // }else{

              // }
            });
          }
          else{
            this.openAlert("No data found in logfile.");
          }
        }
        else{
          this.spinner.hide();
          this.openAlert("File not found.");
        }
      });
    //}
  }

  dateFormat(){
    let formatted_date;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    formatted_date = yyyy + mm + dd;
    return formatted_date;
  }

  onNodeSelect(node){
    // this.isNodeSelected = false;
    // this.isSelected = false;
    // this.fileList = [];
    this.workerNode = node;
    this.submit();
  }

  onSelectFile(dtls){
    if(dtls.file == -1){
      if(dtls.event.target.checked){
        this.checkAll('add');
      }else{
        this.checkAll('remove');
      }
    }
    else{
      if(dtls.event.target.checked){
        this.selectedLogFiles.push(dtls.file);
        this.setAllCheckBox();
      }
      else{
        this.selectedLogFiles.splice(this.selectedLogFiles.indexOf(dtls.file), 1);
        this.setAllCheckBox();
      }
    }

  }
  setAllCheckBox(){
    /* check the selectAll checkbox if a user select all the checkboxes one by one */
    let _fileList = this.fileList.filter(function(item){
      return item.isRowChecked;
    });
    if(_fileList.length == this.fileList.length && this.fileList.length > 0){ this.isAllRowChecked = -1}
    else{this.isAllRowChecked = undefined}
  }

  checkAll(action){
    for(let i in this.fileList){
      if(action == 'add' && this.selectedLogFiles.indexOf(this.fileList[i].file) == -1){
        this.selectedLogFiles.push(this.fileList[i].file);
      }else if(action == 'remove'){
        this.selectedLogFiles.splice(this.selectedLogFiles.indexOf(this.fileList[i].file), 1);
      }
    }
    this.setCheckboxes();
  }
  setCheckboxes(){
    for(let i in this.fileList){
      if(this.selectedLogFiles.indexOf(this.fileList[i].file) > -1){
        this.fileList[i].isRowChecked = true;
      }else{
        this.fileList[i].isRowChecked = false;
      }
    }
  }

  value:any;

  cancel() {
    this.activeModal.close('cancel');
  }

}
