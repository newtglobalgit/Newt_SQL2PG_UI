import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'ngbd-confirmation-modal',
  templateUrl: './dmap-confirmation-dialog.component.html',
  styleUrls: ['./dmap-confirmation-dialog.component.css'],
})
export class NgbdConfirmationModal {
  @Input() data:any;
  userChoice: string= 'yes';;
  
  constructor(private activeModal: NgbActiveModal,private spinner: NgxSpinnerService,private _PopupDraggableService: PopupDraggableService  ) {}

  
  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }
  
  ngAfterViewInit(){
  }

  ok() {
    this.activeModal.close('ok');
    
  }

  cancel(){
    this.activeModal.close('cancel');

  }
  close(){
    this.activeModal.close('close');
  }

}

