import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { CommonServices } from '../../Services/common-services.service';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.css']
})
export class FileUploadModalComponent implements OnInit {
  @Input() data:any;
  sourceDBNameValue: any;
  dbNodeIPValue:any;
  appNodeIPValue:any;
  appNodePortValue:any;
  radioChecked: boolean = true;
  appMigCont:boolean = false;
  submitDisabled: boolean = false;
  errorMessage: string = '';

  constructor(private activeModal: NgbActiveModal, private _commonService: CommonServices,private _PopupDraggableService: PopupDraggableService ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.dbNodeIPValue = this.data.dbNodeIP;
    this.appNodeIPValue = this.data.appNodeIP;
    this.appNodePortValue = this.data.appNodePort;
    this._commonService.enableRestoreDMAPFunc(this.dbNodeIPValue);
  }

  savedbname(event){
    this.sourceDBNameValue = event;
    this.data.dbName = this.sourceDBNameValue; 
  }
  checkDbNodeIP(ip: string): void {
    const ipLowerCase = ip.toLowerCase();
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
    const isInvalidIP = ipLowerCase === '0.0.0.0' || (!ipPattern.test(ipLowerCase));

    if (isInvalidIP) {
    this.errorMessage = "Master Node IP/FQDN can't be 'localhost', '0.0.0.0', or an invalid IP/FQDN. Please provide a valid IP/FQDN.";
    this._commonService.setSubmitDisabled(true);
      // You can reset the input or handle the error in any other way here
    }else {
      this.errorMessage = '';
      this._commonService.setSubmitDisabled(false); // Enable submit button
    }
  }
  
  closeModal(){
    this.activeModal.close('cancel');
  }

  fileUploadClicked(event){
    
  }

  saveDBIP(event){
    this.dbNodeIPValue = event;
    this._commonService.enableRestoreDMAPFunc(this.dbNodeIPValue);
    this.data.dbNodeIP = this.dbNodeIPValue; 
    this.checkDbNodeIP(this.dbNodeIPValue);
  }
  saveAppIP(event){
    this.appNodeIPValue = event;
    this.data.appNodeIP = this.appNodeIPValue; 
  }
  saveAppPort(event){
    this.appNodePortValue = event;
    this.data.appNodePort = this.appNodePortValue; 
  }
  setupAppMigCont() {
    this.appMigCont=true;
    this.data.restoreApp = 'Yes';
    this.radioChecked = false;
  }
  setupAppMigContFalse() {
    this.appMigCont=false;
    this.data.restoreApp = 'No';
    this.radioChecked = true;
  }

}
