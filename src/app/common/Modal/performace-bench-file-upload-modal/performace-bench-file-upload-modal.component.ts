import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { DatabaseDataMigrationService } from '../../Services/database-data-migration.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-performace-bench-file-upload-modal',
  templateUrl: './performace-bench-file-upload-modal.component.html',
  styleUrls: ['./performace-bench-file-upload-modal.component.css']
})
export class PerformaceBenchFileUploadModalComponent implements OnInit {
  @Input() data:any;
  constructor(private activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private _PopupDraggableService: PopupDraggableService,
              private databaseDataMigrationService:DatabaseDataMigrationService,) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }

  closeModal(){
    this.activeModal.close('cancel');
  }

  fileUploadClicked(event){
    this.activeModal.close(event);
  }


  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }
  downloadPerformanceFile(){

    let reqObj = {
      "RUN_ID" :this.data.run_id,
      "reportType":this.data.label
    }
    this.databaseDataMigrationService.downloadPerformaceParamatersFile(reqObj).subscribe(data=>{


      if(data.type == "application/json"){
        this.openAlert("File does not exists");
      }
     else{
      let blob = new Blob([data],{});
      let filename = 'DBProcedureListForFunctionalValidation_'+this.data.label+this.data.sourceDBName+'_'+this.data.sourceDBSchema+'_'+reqObj.RUN_ID+'.xlsx';
       saveAs.saveAs(blob,filename);
     }
    });

  }
}
