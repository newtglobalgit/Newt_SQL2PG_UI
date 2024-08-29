import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-settings',
  templateUrl: './dmap-settings.component.html',
  styleUrls: ['./dmap-settings.component.css']
})
export class DmapSettingsComponent implements OnInit {
  @Input() data:any;
  codeMergeOptions:string;
  defaultMergeOption:string = 'onConflict';

  constructor(private activeModal: NgbActiveModal,private _PopupDraggableService: PopupDraggableService ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.codeMergeOptions = this.defaultMergeOption;
  }

  onRadioSelected(){
    if(this.codeMergeOptions == this.defaultMergeOption){
      return false
    }else{
      return true;
    }
  }

  update(){
    
  }

  cancel() {
    this.activeModal.close('cancel');
  }

}
