import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-alert-dialog',
  templateUrl: './dmap-alert-dialog.component.html',
  styleUrls: ['./dmap-alert-dialog.component.css'],
})
export class DmapAlertDialogModal implements OnInit {
  @Input() data:any;
  
  constructor(private activeModal: NgbActiveModal,private _PopupDraggableService: PopupDraggableService
  ) { }

  
  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }
  
  ngAfterViewInit(){
    // setTimeout(() => {
    //   this.activeModal.close('ok');
    // },7000);
  }

  ok() {
    this.activeModal.close('ok');
  }

  cancel() {
    this.activeModal.close('cancel');
  }


}
