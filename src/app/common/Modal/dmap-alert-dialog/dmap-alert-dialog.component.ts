import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';

@Component({
  selector: 'app-dmap-alert-dialog',
  templateUrl: './dmap-alert-dialog.component.html',
  styleUrls: ['./dmap-alert-dialog.component.css'],
})
export class DmapAlertDialogModal implements OnInit {
  @Input() data: any;

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  ok() {
    this.activeModal.close('ok');
  }

  cancel() {
    this.activeModal.close('cancel');
  }
}
