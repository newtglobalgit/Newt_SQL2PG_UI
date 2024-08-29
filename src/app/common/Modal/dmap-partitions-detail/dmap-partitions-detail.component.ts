import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-partitions-detail',
  templateUrl: './dmap-partitions-detail.component.html',
  styleUrls: ['./dmap-partitions-detail.component.css']
})
export class DmapPartitionsDetailComponent implements OnInit {
  @Input() data:any;
  
  constructor(private activeModal: NgbActiveModal,private _PopupDraggableService: PopupDraggableService ) { }

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
