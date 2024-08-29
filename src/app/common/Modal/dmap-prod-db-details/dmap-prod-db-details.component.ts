import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from '../../Services/database-list.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-prod-db-details',
  templateUrl: './dmap-prod-db-details.component.html',
  styleUrls: ['./dmap-prod-db-details.component.css']
})
export class DmapProdDbDetailsComponent implements OnInit {
  @Input() data:any;

  @ViewChild("t",  { static: false }) submitProdDbCredentials: NgForm;

  numberOnlyPattern = "^((?!(0))[0-9]{4})$";
  passwordType:string = 'password'; 
  
  modalProdDBHost:any;
  modalProdDBPort:any;
  modalProdDBUserName:any;
  modalProdDBPassword:any;
  modalProdDBName:any;
  oracleConnect:string = 'sid';
  prodDBSidValue:any;
  prodDBServiceNameValue:any;
  disableConnection:boolean = false;
  disableSubmit:boolean = false;


  constructor(private activeModal: NgbActiveModal,
              private spinner: NgxSpinnerService,
              private modalService: NgbModal,
              private _PopupDraggableService: PopupDraggableService,
              private databaseListService:DatabaseListService) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.getProdDbDetails();
  }
  getProdDbDetails(){
    this.modalProdDBName = this.data.dbName;
    let reqObj = {};
    reqObj['db_name'] = this.data.dbName;
    reqObj['script_name'] = this.data.scriptName;
    this.databaseListService.getProdDbDetails(reqObj).subscribe(data => {
      let prodDetails = data.data;
      if(data.status == 'success'){
        this.spinner.hide();
        this.modalProdDBHost = prodDetails['prod_host_ip'];
        this.modalProdDBPort = prodDetails['prod_host_port'];
        this.modalProdDBUserName = prodDetails['prod_host_username'];
        this.oracleConnect= prodDetails['prod_db_is_sid'] ?'sid':'servicename';
        this.prodDBSidValue = prodDetails['prod_host_sid'];
        this.prodDBServiceNameValue = prodDetails['prod_host_sname'];
        if (prodDetails['prod_db_is_sid'] == null){
          this.oracleConnect = 'sid';
        }
        
      }
      else{
        this.spinner.hide();
        this.modalProdDBHost = '';
        this.modalProdDBPort = '';
        this.modalProdDBUserName = '';
        this.oracleConnect= 'sid';
        this.prodDBSidValue = '';
        this.prodDBServiceNameValue = '';
         
      }
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

  testProdDbConnection(){
    this.spinner.show();
    this.disableConnection = true;
    let  reqObj:any = {};
    if (this.oracleConnect == 'sid'){
      reqObj['prod_host_sid'] = this.prodDBSidValue;
      reqObj['prod_db_is_sid'] = this.oracleConnect === 'sid';
      reqObj['prod_host_sname'] = '';
    }
    else{
      reqObj['prod_host_sid'] = '';
      reqObj['prod_host_sname'] = this.prodDBServiceNameValue;
      reqObj['prod_db_is_sid'] = this.oracleConnect === 'sid'
    }
    reqObj['prod_host_ip'] = this.modalProdDBHost;
    reqObj['prod_host_port'] = this.modalProdDBPort;
    reqObj['prod_host_username'] = this.modalProdDBUserName;
    reqObj['prod_host_password'] = this.modalProdDBPassword;
    reqObj['db_name'] = this.data.dbName;
    reqObj['script_name'] = this.data.scriptName;

    this.databaseListService.testProdDbConnection(reqObj).subscribe(data => {
      this.disableConnection = true;
      if(data.status == 'success'){
        this.disableConnection = false;
        this.spinner.hide();
        this.openAlert("Prod database connection successful.");
      }
      else{
        this.disableConnection = false;
        this.spinner.hide();
          this.openAlert(data.message);
      }
    });

  }

  clear(){
    //this.submitProdDbCredentials.resetForm();
    this.oracleConnect = 'sid'
    this.submitProdDbCredentials.controls['modalProdDBHost'].reset();
    this.submitProdDbCredentials.controls['modalProdDBPort'].reset();
    this.submitProdDbCredentials.controls['prodDBSidValue'].reset();
    this.submitProdDbCredentials.controls['prodDBServiceNameValue'].reset();
    this.submitProdDbCredentials.controls['modalProdDBUserName'].reset();
    this.submitProdDbCredentials.controls['modalProdDBPassword'].reset();
  }

  ok() {
    this.activeModal.close('ok');
  }
  cancel() {
    this.activeModal.close('cancel');
  }
  onRadioButtonSelected(event){
    this.oracleConnect = event.target.value;
  }

  submitTarget(){
    this.spinner.show();
    this.disableSubmit = true;
    let  reqObj:any = {};
    if (this.oracleConnect == 'sid'){
      reqObj['prod_host_sid'] = this.prodDBSidValue;
      reqObj['prod_db_is_sid'] = this.oracleConnect === 'sid';
      reqObj['prod_host_sname'] = '';
    }
    else{
      reqObj['prod_host_sid'] = '';
      reqObj['prod_host_sname'] = this.prodDBServiceNameValue;
      reqObj['prod_db_is_sid'] = this.oracleConnect === 'sid'
    }
    reqObj['prod_host_ip'] = this.modalProdDBHost;
    reqObj['prod_host_port'] = this.modalProdDBPort;
    reqObj['prod_host_username'] = this.modalProdDBUserName;
    reqObj['prod_host_password'] = this.modalProdDBPassword;
    reqObj['db_name'] = this.data.dbName;
    reqObj['script_name'] = this.data.scriptName;

    
    this.databaseListService.submitProdDbDetails(reqObj).subscribe(data => {
      this.disableSubmit = true;
      if(data.status == 'success'){
        this.disableSubmit = false;
        this.spinner.hide();
        this.openAlert("Script executed successfully.");
        this.ok();
      }
      else{
        this.disableSubmit = false;
        this.spinner.hide();
          this.openAlert(data.message);
      }
    });

  }
  togglePassword(type){
    this.passwordType = type;
  }


}
