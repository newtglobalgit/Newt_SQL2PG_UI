import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-data-alert-dialog',
  templateUrl: './dmap-data-alert-dialog.component.html',
  styleUrls: ['./dmap-data-alert-dialog.component.css'],
})
export class DmapDataAlertDialogComponent implements OnInit {
  @Input() data:any;
  
  dataStatus:string;
  result:any = [];
  dataValue:string;
  selectedVal:string;
  constructor(private activeModal: NgbActiveModal,private _PopupDraggableService: PopupDraggableService ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }

  radioChangeHandler(event){
    this.selectedVal = event.target.value;

  }

  ok() {
    let result = {};
    this.result.comStatus = 'ok';
    this.result.status = this.selectedVal;

    this.activeModal.close(this.result);
  }

  cancel() {
    this.activeModal.close('cancel');
  }


}

