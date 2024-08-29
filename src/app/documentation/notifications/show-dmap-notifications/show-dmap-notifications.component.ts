import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from 'src/app/common/Services/popup-draggable.service';

@Component({
  selector: 'app-show-dmap-notifications',
  templateUrl: './show-dmap-notifications.component.html',
  styleUrls: ['./show-dmap-notifications.component.css']
})
export class ShowDmapNotificationsComponent implements OnInit {
  @Input() data:any;

  constructor(private activeModal: NgbActiveModal,private _PopupDraggableService: PopupDraggableService ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }

  cancel(){
    this.activeModal.close('cancel');
    }

}
