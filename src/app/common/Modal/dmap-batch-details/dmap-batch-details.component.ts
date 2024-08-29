import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from '../../Services/database-list.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-batch-details',
  templateUrl: './dmap-batch-details.component.html',
  styleUrls: ['./dmap-batch-details.component.css'],
})
export class DmapBatchDetailsComponent implements OnInit {
  @Input() data:any;

  constructor(private activeModal: NgbActiveModal,private modalService: NgbModal,private databaseListService: DatabaseListService, private spinner: NgxSpinnerService,private _PopupDraggableService: PopupDraggableService ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }

  ok() {
    this.activeModal.close('ok');
  }

  getWidthStyle(heading){
    return heading.widthStyle;
  }

  cancel() {
    this.activeModal.close('cancel');
  }
  
  viewDetail(data){
    this.openAlert(data);
  }

  reset_rerun_count(run_id, assigned_vm){
    console.log(run_id, assigned_vm);
    let reqObj = {"run_id":run_id,"assigned_vm":assigned_vm}
    this.spinner.show();
    this.databaseListService.resetRerunCount(reqObj).subscribe(data => {
      this.spinner.hide(); 
      this.openAlert(data.message);
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

}
