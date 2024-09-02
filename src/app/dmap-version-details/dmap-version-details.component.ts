import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from 'src/app/common/Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-version-details',
  templateUrl: './dmap-version-details.component.html',
  styleUrls: ['./dmap-version-details.component.css'],
})
export class DmapVersionDetailsComponent implements OnInit {
  @Input() data: any;

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
}
