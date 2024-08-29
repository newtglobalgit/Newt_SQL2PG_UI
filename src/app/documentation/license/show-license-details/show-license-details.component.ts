import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from 'src/app/common/Services/popup-draggable.service';

@Component({
  selector: 'app-show-license-details',
  templateUrl: './show-license-details.component.html',
  styleUrls: ['./show-license-details.component.css']
})
export class ShowLicenseDetailsComponent implements OnInit {
  @Input() data:any;
  
  headers:any[];
  constructor(private activeModal: NgbActiveModal, private _PopupDraggableService: PopupDraggableService  ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }

cancel(){
  this.activeModal.close('cancel');
  }

  getWidthStyle(heading){
    return heading.widthStyle;
  }
    
}
