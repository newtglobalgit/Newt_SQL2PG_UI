import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { DmapAlertDialogModal } from '../../Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { DatabaseDataMigrationService } from '../../Services/database-data-migration.service';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-backup-modal',
  templateUrl: './dmap-backup-modal.component.html',
  styleUrls: ['./dmap-backup-modal.component.css'],
})
export class DmapBackupModalComponent implements OnInit {
  @Input() runId:any;
  @Input() data:any;
  
  @ViewChild('f',  { static: false }) backupRestoreform: NgForm;

  selectedVal:string;
  sourceSelected:any;
  targetSelected:any;
  oracleBackupDirName:any;
  oracleServiceName:any;
  pgBacupDirPath:any;
  fileName:any;
  isSource:any;

  constructor(private activeModal: NgbActiveModal,private spinner: NgxSpinnerService,private modalService: NgbModal,private databaseDataMigrationService:DatabaseDataMigrationService,     private _PopupDraggableService: PopupDraggableService  ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }

  radioChangeHandler(event){
    this.selectedVal = event.target.value;

  }

  isSelected(name: string): boolean   
  {  
  
        if (!this.selectedVal) { 
            return false;  
  }  
  
        return (this.selectedVal === name);
    }   

  ok() {
    this.activeModal.close('ok');
  }

  cancel() {
    this.activeModal.close('cancel');
  }

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

  clear(){
    this.backupRestoreform.resetForm();
  }

  submitBackupDetails(){
    let reqObj={};
    if(this.selectedVal == 'source'){
      reqObj = {'RUN_ID':this.data.runId,'backup_database':'source','oracle_backup_dir_name':this.oracleBackupDirName,'oracle_service_name':this.oracleServiceName,'file_name':this.fileName};
    }
    else if (this.selectedVal == 'target'){
     
       reqObj = {'RUN_ID':this.data.runId,'backup_database':'target','pg_backup_dir_path':this.pgBacupDirPath.replace(/\\/g, '\\\\'),'file_name':this.fileName};
    }
    else{
      // let pgbackup = escape(this.pgBacupDirPath);
      reqObj = {'RUN_ID':this.data.runId,'backup_database':'both','oracle_backup_dir_name':this.oracleBackupDirName,'oracle_service_name':this.oracleServiceName,'pg_backup_dir_path':this.pgBacupDirPath.replace(/\\/g, '\\\\'),'file_name':this.fileName};
    }
  
    this.databaseDataMigrationService.getBackup(reqObj).subscribe(data=>{
    //  if(data.success){
    //  }
    //  else{
    //  }

    });
    this.openAlert("Submitted Sucessfully");
    this.activeModal.close('Submit');
    
  }
}
