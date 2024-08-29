import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from '../../Services/database-list.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbdConfirmationModal } from '../dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { UpdateDblinkModalComponent } from '../update-dblink-modal/update-dblink-modal.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dblink-view',
  templateUrl: './dblink-view.component.html',
  styleUrls: ['./dblink-view.component.css']
})
export class DblinkViewComponent implements OnInit {
  @Input() data:any;

  constructor(private databaseListService: DatabaseListService,
    private spinner: NgxSpinnerService,     private _PopupDraggableService: PopupDraggableService    ,
    private modalService: NgbModal, private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }
  ok() {
    this.activeModal.close('ok');
  }

  ngOnChanges(){
    this.getDbLinkDetails();
  }

  cancel() {
    this.activeModal.close('cancel');
  }

  getDbLinkDetails(){
    this.databaseListService.getDbLinkDetails({"run_id":this.data.runId}).subscribe(resp=>{
      if(resp.status == 'success'){
          this.data.data = resp.data;
      }
    });

  }

  deleteDbLinkDetails(item){
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {msg : 'Do you want to delete dblink?', title : 'Confirmation',okButtonLabel : 'Yes',cancelButtonLabel:'No'};
    modalRef.result.then((result) => {
      if(result === 'ok'){
        this.spinner.show()
        this.databaseListService.deleteDbLinkDetails({'id': item.id, 'run_id': this.data.runId}).subscribe(resp => {
          this.spinner.hide();
          if(resp.status == 'success'){
            this.getDbLinkDetails();
            this.openAlert(resp.message);
          }
          else{
            this.openAlert(resp.message);
          }
        });
      }

    });
  }

  updateDbLinkDetails(item){
    const modalRef = this.modalService.open(UpdateDblinkModalComponent, {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = {'title':'Update DBLINK Details', 'data': item, 'run_id': this.data.runId};
    modalRef.result.then((result) => {
      this.getDbLinkDetails();

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
