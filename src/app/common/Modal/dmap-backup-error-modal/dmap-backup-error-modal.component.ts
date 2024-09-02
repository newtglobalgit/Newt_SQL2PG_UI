import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DmapBackupProgressModalComponent } from '../dmap-backup-progress-modal/dmap-backup-progress-modal.component';
import 'jqueryui';

@Component({
  selector: 'app-dmap-backup-error-modal',
  templateUrl: './dmap-backup-error-modal.component.html',
  styleUrls: ['./dmap-backup-error-modal.component.css'],
})
export class DmapBackupErrorModalComponent implements OnInit {
  @Input() data: any;

  constructor(
    private modalService: NgbActiveModal,
    private ngModalService: NgbModal
  ) {}
  // errorData:string;

  ngOnInit(): void {}

  close() {
    this.modalService.close('cancel');
    this.ngModalService.open(DmapBackupProgressModalComponent, {
      size: 'lg',
      scrollable: true,
      backdrop: 'static',
    });
  }
}
