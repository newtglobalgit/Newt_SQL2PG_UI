import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, ValidatorFn, FormGroup } from '@angular/forms';
import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { DmapAlertDialogModal } from '../../Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { DatabaseListService } from '../../Services/database-list.service';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

const RangeValidator: ValidatorFn = (fg: FormGroup) => {
  const lower = fg.get('performanceLowerThresholdValue').value;
  const upper = fg.get('performanceUpperThresholdValue').value;
 return lower !== null && upper !== null && lower < upper 
   ? null 
   : { range: true };
};

@Component({
  selector: 'app-dmap-update-threshold',
  templateUrl: './dmap-update-threshold.component.html',
  styleUrls: ['./dmap-update-threshold.component.css']
})
export class DmapUpdateThresholdComponent implements OnInit {
  @Input() data:any;
  updateThresholdForm: FormGroup;
  numberOnlyPattern = "^[0-9]*$";

  lowerLimit:any = 4;
  upperLimit:any = 6;

  constructor(private activeModal: NgbActiveModal,private spinner: NgxSpinnerService,private databaseListService: DatabaseListService,private modalService: NgbModal,private formBuilder: FormBuilder,private _PopupDraggableService: PopupDraggableService ) { }

  ngOnInit() {//SAIMA_TBD .group is depricated
    this._PopupDraggableService.enableDraggablePopup();
    this.updateThresholdForm = this.formBuilder.group({
      'performanceLowerThresholdValue': new FormControl(null, [Validators.required]),
      'performanceUpperThresholdValue': new FormControl(null, [Validators.required])
    },{
      validator: RangeValidator 
    });
    this.spinner.show();
    let reqObj = {"run_id":this.data.runId}
    this.databaseListService.getPerformanceThreshold(reqObj).subscribe(data => {     
      this.spinner.hide();
      this.lowerLimit = data['lower'];
      this.upperLimit = data['upper'];
    });
  }

  get f_threshold() { return this.updateThresholdForm.controls; }

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

    
  submitThreshold(){
    let reqObj = {'run_id':this.data.runId,'lower':this.f_threshold['performanceLowerThresholdValue'].value,'upper':this.f_threshold['performanceUpperThresholdValue'].value};
    this.activeModal.close(reqObj);
  }

  

  ok() {
    this.activeModal.close('ok');
  }

  cancel() {
    this.activeModal.close('cancel');
  }

  clear(){
    this.updateThresholdForm.reset();
    
  }

}
