import { Component, OnInit, Input, Inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from 'src/app/common/Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-license-details',
  templateUrl: './dmap-license-details.component.html',
  styleUrls: ['./dmap-license-details.component.css'],
})
export class DmapLicenseDetailsComponent implements OnInit {
  @Input() data: any;

  headers: any[];
  constructor(
    private activeModal: NgbActiveModal,
    private _PopupDraggableService: PopupDraggableService
  ) {}

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }

  cancel() {
    this.activeModal.close('cancel');
  }

  getWidthStyle(heading) {
    return heading.widthStyle;
  }
}
