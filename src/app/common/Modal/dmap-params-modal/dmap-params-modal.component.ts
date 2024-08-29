import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-params-modal',
  templateUrl: './dmap-params-modal.component.html',
  styleUrls: ['./dmap-params-modal.component.css']
})
export class DmapParamsModalComponent implements OnInit {
  @Input() data:any;

  headings:any[];
  constructor(private activeModal: NgbActiveModal,private _PopupDraggableService: PopupDraggableService) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }

  ok() {
    this.activeModal.close('ok');
  }

  cancel() {
    this.activeModal.close('cancel');
  }


}
