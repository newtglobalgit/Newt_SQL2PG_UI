import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServices } from '../../Services/common-services.service';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';


@Component({
  selector: 'app-dmap-migration-error-modal',
  templateUrl: './dmap-migration-error-modal.component.html',
  styleUrls: ['./dmap-migration-error-modal.component.css'],
})
export class DmapMigrationErrorModal implements OnInit {
  @Input() data:any;

  headings:any[];
  nodeType:any;
  
  constructor(private activeModal: NgbActiveModal,private commonservice:CommonServices,private _PopupDraggableService: PopupDraggableService ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.nodeType = this.commonservice.getNodeType();
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
  
  moveToCompletion(){
    this.activeModal.close('moveToCompletion');
  }
  getFontWeight(data){
    let fontWeight = {}
    if(data.errorDescription == 'Object Name' || data.type =='Valid/ Invalid'){
      fontWeight = {'font-weight':"bold"};
    }
    
    return fontWeight
  }

}
