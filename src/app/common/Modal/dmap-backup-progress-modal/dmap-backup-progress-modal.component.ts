import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sql2PgService } from '../../Services/sql2pg.service';
import { DmapBackupErrorModalComponent } from '../dmap-backup-error-modal/dmap-backup-error-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import 'jqueryui';

@Component({
  selector: 'app-dmap-backup-progress-modal',
  templateUrl: './dmap-backup-progress-modal.component.html',
  styleUrls: ['./dmap-backup-progress-modal.component.css'],
})
export class DmapBackupProgressModalComponent implements OnInit {
  constructor(
    private modalService: NgbActiveModal,
    private ngModalService: NgbModal,
    private sql2PgService: Sql2PgService,
    private spinner: NgxSpinnerService
  ) {}

  vmBkpStatus: any;
  intervalVar: any;

  ngOnInit(): void {
    this.getLiveStatus();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalVar);
  }

  getLiveStatus(): void {
    this.intervalVar = setInterval(() => {
      this.sql2PgService.checkBackupStatus().subscribe((res) => {
        this.vmBkpStatus = res;
      });
    }, 3000);
  }

  close() {
    this.modalService.close('cancel');
  }

  toggleMinWindow() {
    // this.commonservice.toggleMinWindow();
    this.modalService.close('cancel');
  }

  showMinErrorDialog(errMsg) {
    const modalRef = this.ngModalService.open(DmapBackupErrorModalComponent, {
      size: 'md',
      scrollable: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.data = {
      title: 'Backup Error',
      msg: errMsg
        ? errMsg
        : 'Something is wrong with this VM. Please fix and try again.',
    };
    // this.commonservice.showMinErrorWindow();
    this.modalService.close('cancel');
  }
}
