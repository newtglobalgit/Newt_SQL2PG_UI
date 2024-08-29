import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServices } from '../../Services/common-services.service';
import { DmapBackupErrorModalComponent } from '../dmap-backup-error-modal/dmap-backup-error-modal.component';
import { DatabaseListService } from '../../Services/database-list.service';
import { NgxSpinnerService } from 'ngx-spinner';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-backup-progress-modal',
  templateUrl: './dmap-backup-progress-modal.component.html',
  styleUrls: ['./dmap-backup-progress-modal.component.css']
})
export class DmapBackupProgressModalComponent implements OnInit {

  constructor(private modalService: NgbActiveModal, private ngModalService: NgbModal, private commonservice: CommonServices, private databaseListService: DatabaseListService, private spinner: NgxSpinnerService, private _PopupDraggableService: PopupDraggableService ) { }

  vmBkpStatus: any;
  intervalVar: any;

  ngOnInit(): void {
    this._PopupDraggableService.enableDraggablePopup();
    this.getLiveStatus();
  }


  ngOnDestroy(): void {
    clearInterval(this.intervalVar);
  }

  getLiveStatus(): void {
    this.intervalVar = setInterval(() => {
      this.databaseListService.checkBackupStatus().subscribe((res) => {
        this.vmBkpStatus = res
      });
    }, 3000);
  }


  close() {
    this.modalService.close('cancel');
  }

  toggleMinWindow() {
    this.commonservice.toggleMinWindow();
    this.modalService.close('cancel');
  }

  showMinErrorDialog(errMsg) {
    const modalRef = this.ngModalService.open(
      DmapBackupErrorModalComponent,
      { size: 'md', scrollable: true, backdrop: 'static' }
    );
    modalRef.componentInstance.data = {
      title: 'Backup Error',
      msg: errMsg ? errMsg : "Something is wrong with this VM. Please fix and try again."
    };
    // this.commonservice.showMinErrorWindow();
    this.modalService.close('cancel');
  }
}
