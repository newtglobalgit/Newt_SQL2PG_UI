import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-ora2pg-error-modal',
  templateUrl: './dmap-ora2pg-error-modal.component.html',
  styleUrls: ['./dmap-ora2pg-error-modal.component.css']
})
export class DmapOra2pgErrorModalComponent implements OnInit {
  @Input() data:any;

  headings:any[];
  constructor(private activeModal: NgbActiveModal, private _PopupDraggableService: PopupDraggableService ) { }

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

}
