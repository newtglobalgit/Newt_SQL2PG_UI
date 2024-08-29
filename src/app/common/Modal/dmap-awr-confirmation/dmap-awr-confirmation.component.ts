import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-awr-confirmation',
  templateUrl: './dmap-awr-confirmation.component.html',
  styleUrls: ['./dmap-awr-confirmation.component.css'],
})
export class DmapAwrConfirmationComponent implements OnInit {

  @Input() data:any;
  constructor(private activeModal: NgbActiveModal,private _PopupDraggableService: PopupDraggableService) { }
  awrFrequency:any = '';
  awrStartDate: any;
  awrEndDate: any;

  ngOnInit(): void {
    this._PopupDraggableService.enableDraggablePopup();
  }

  cancel() {
    this.activeModal.close('cancel');
  }
  submit() {
    let result  ={'awrStartDate':this.awrStartDate,'awrEndDate':this.awrEndDate}
    this.activeModal.close(result);
  }

}
