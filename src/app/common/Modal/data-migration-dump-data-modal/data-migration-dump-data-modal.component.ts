import { Component, OnInit, ViewChild, ElementRef, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppConfigService } from '../../Services/app-config.service';
import { DatabaseDataMigrationService } from '../../Services/database-data-migration.service';
import { saveAs } from 'file-saver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
declare var $: any;
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-data-migration-dump-data-modal',
  templateUrl: './data-migration-dump-data-modal.component.html',
  styleUrls: ['./data-migration-dump-data-modal.component.css']
})
export class DataMigrationDumpDataModalComponent implements OnInit {
  @ViewChild('iframe', { static: false }) iframe: ElementRef
  dumpPath:string;
  dumpDataDetails:any;
  showdumpData:any;

  constructor(private dialogRef: MatDialogRef<DataMigrationDumpDataModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any, 
  private modalService: NgbModal,    private _PopupDraggableService: PopupDraggableService,
  private config:AppConfigService, private databaseDataMigrationService:DatabaseDataMigrationService) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    let reqObj = {RUN_ID:this.data.runId};
    this.databaseDataMigrationService.getDataMigrationDumpFileDetails(reqObj).subscribe(response => {
      this.showdumpData = response['status'];
      if (response['status'] == 'success'){
        this.dumpDataDetails = response['data'];
      }    
    });
  }

  ngAfterViewInit() {
  }

  cancel(){
    this.dialogRef.close({'action': 'close'})   ; 
  }

  removeElements(){
  }
  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }
  downloadDumpFile(fileName){
    let reqObj = {RUN_ID:this.data.runId,file_name:fileName};
    this.databaseDataMigrationService.downloadDataMigrationDump(reqObj).subscribe(data=>{
      
      
      if(data.type == "application/json"){
        this.openAlert("File does not exists");
      }
     else{
      let blob = new Blob([data],{});
      let filename = fileName+'.txt';
       saveAs.saveAs(blob,filename);
     }
    });

  }

}
