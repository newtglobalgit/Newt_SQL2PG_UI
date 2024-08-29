import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseListService } from '../../Services/database-list.service';
import { NgxSpinnerService } from "ngx-spinner";
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-target-credtials-modal',
  templateUrl: './dmap-target-credtials-modal.component.html',
  styleUrls: ['./dmap-target-credtials-modal.component.css']
})
export class DmapTargetCredtialsModal implements OnInit {
  @Input() data:any;

  @ViewChild("t",  { static: false }) dbTargetCredentialsForm: NgForm;
  modalTargetTypeValue:string;
  modalTargetEnvValue:string;
  modalToolUsedValue:string;
  modalDatabaseSchemaValue:string;
  modalTargetDBHost:string;
  modalTargetDBName:string;
  modalTargetDBPort:string;
  modalTargetDBUserName:string;
  modalTargetDBPassword:string;

  modalInterimDBHost:string;
  modalInterimDBName:string;
  modalInterimSchema:string;
  modalInterimDBPort:string;
  modalInterimDBUserName:string;
  modalInterimDBPassword:string;
  targetDetail:any = {};
  numberOnlyPattern = "^((?!(0))[0-9]{4})$"; 

  targetCon:boolean = false;
  makeTargetreadOnly:boolean = true;

  passwordType:string = 'password';
  disableTarget: boolean = false;

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal, private databaseListService:DatabaseListService,private spinner: NgxSpinnerService,private _PopupDraggableService: PopupDraggableService  ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.modalTargetTypeValue = this.data.target_db_type;
    this.modalTargetEnvValue = this.data.target_env;
    this.modalToolUsedValue = this.data.toolsUsed;
    this.modalDatabaseSchemaValue = this.data.sourceDBSchema;
    if ('show_all_target_details' in this.data){
      this.modalTargetDBHost = this.data.target_db_host;
      this.modalTargetDBName = this.data.target_db_databse;
      this.modalTargetDBPort = this.data.target_db_port;
      this.modalTargetDBUserName = this.data.target_db_username;
    }

  }

  fillTarget(){
    this.targetDetail['runId'] = this.data.runId;
    this.targetDetail['targetDBHost'] = this.modalTargetDBHost;
    this.targetDetail['targetDBType'] = this.modalTargetTypeValue;
    this.targetDetail['targetDBName'] = this.modalTargetDBName;
    this.targetDetail['targetDBPort'] = this.modalTargetDBPort;
    this.targetDetail['targetDBUserName'] = this.modalTargetDBUserName;
    this.targetDetail['targetDBPassword'] = this.modalTargetDBPassword;
    }
   fillInterim(){
    this.targetDetail['runId'] = this.data.runId;
    this.targetDetail['interimDBHost'] = this.modalInterimDBHost;
    this.targetDetail['interimDBName'] = this.modalInterimDBName;
    this.targetDetail['interimDBSchema'] = this.modalInterimSchema;
    this.targetDetail['interimDBPort'] = this.modalInterimDBPort;
    this.targetDetail['interimDBUserName'] = this.modalInterimDBUserName;
    this.targetDetail['interimDBPassword'] = this.modalInterimDBPassword;
   } 


  submitTarget(){
    
    if(this.data.title && this.data.interimTitle){
      this.targetDetail['status'] = "target_interim"
      this.fillInterim();
      this.fillTarget();
    }
    else if(this.data.title){
      this.targetDetail['status'] = "target"
      this.fillTarget();
    }
    else if(this.data.interimTitle){
      this.targetDetail['status'] = "interim"
      this.fillInterim();
    }
    this.databaseListService.updateconfigDetails(this.targetDetail).subscribe(data => {
      if(data.status == 'success'){
        this.openSuccessModal(data);
      }
      else{

        if(this.targetDetail['status'] == 'target'){
          this.openAlert(data.message);
        }
      }
    });
  }

  openSuccessModal(response){    
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {'msg':'Target details updated successfully.', 'title':'Alert'};
    modalRef.result.then((result) => {
      if ( result == 'ok') {
        this.activeModal.close(response);
      }
      // else{
      // }
    });
  }

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }


  clear(){
  
    this.makeTargetreadOnly = true;
    this.dbTargetCredentialsForm.controls['modalTargetDBHost'].reset();
    this.dbTargetCredentialsForm.controls['modalTargetDBName'].reset();
    this.dbTargetCredentialsForm.controls['modalTargetDBPort'].reset();
    this.dbTargetCredentialsForm.controls['modalTargetDBUserName'].reset();
    this.dbTargetCredentialsForm.controls['modalTargetDBPassword'].reset();
    this.dbTargetCredentialsForm.controls['modalInterimDBHost'].reset();
    this.dbTargetCredentialsForm.controls['modalInterimDBName'].reset();
    this.dbTargetCredentialsForm.controls['modalInterimSchema'].reset();
    this.dbTargetCredentialsForm.controls['modalInterimDBPort'].reset();
    this.dbTargetCredentialsForm.controls['modalInterimDBUserName'].reset();
    this.dbTargetCredentialsForm.controls['modalInterimDBPassword'].reset();
    this.dbTargetCredentialsForm.controls['modalTargetDBHost'].reset();
    

  }

  cancel() {
    this.activeModal.close('cancel');
  }

  testTargetDbConnection(){
    this.disableTarget = true;
    this.spinner.show();
    let reqObj = {'targetDBType':this.modalTargetTypeValue,'targetDBHost':this.modalTargetDBHost,'targetDBName':this.modalTargetDBName,'targetDBPort':this.modalTargetDBPort,'targetDBUserName':this.modalTargetDBUserName,'targetDBPassword':this.modalTargetDBPassword};
    this.databaseListService.testTargetDbConnection(reqObj).subscribe(data => {     
      this.spinner.hide();
      this.disableTarget = false;
      if (data[0].status === 'SUCCESS' ) {
        this.targetCon = true;
        this.makeTargetreadOnly = false;
        this.openAlert('Connection Successful.');
        
     }
     else{
      this.targetCon = false;
      this.makeTargetreadOnly = true;  
      this.openAlert(data[0].message);
     }
    }, error =>{ 
      this.spinner.hide();     
      this.openAlert('Something went wrong. Please try again.');
    });
  }

  togglePassword(type){
    this.passwordType = type;
  }

}
