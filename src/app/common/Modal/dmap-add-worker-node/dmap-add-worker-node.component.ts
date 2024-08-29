import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from '../../Services/database-list.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbdConfirmationModal } from '../dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-dmap-add-master-node',
  templateUrl: './dmap-add-worker-node.component.html',
  styleUrls: ['./dmap-add-worker-node.component.css'],
})
export class DmapAddMasterNodeComponent implements OnInit {
  @Input() data:any;

  @ViewChild('f',  { static: false }) addWorkerNodeForm: NgForm;

  modalWorkerNodeIPValue:any;
  workerNodeDetail:any = {};
  modalWorkerNodeUIPortValue:any = 8080;
  modalWorkerNodeServicePortValue:any = 5002;
  modalWorkerNodeUsernameValue:any;
  modalWorkerNodePasswordValue:any;
  workerNodePasswordType:string = 'password';
  disableTestConnection:boolean = false;

  password:any;
  confirmationPassword:any;
  passwordType:string = 'password';
  passwordConfirmationType:string = 'password';

  constructor(private activeModal: NgbActiveModal,
    private databaseListService:DatabaseListService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private _PopupDraggableService: PopupDraggableService
  ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    if(this.data['type'] == 'updateip') {

      this.modalWorkerNodeIPValue  = this.data['nodeDetails']['worker_node_ip'] ;

    this.modalWorkerNodeServicePortValue = this.data['nodeDetails']['node_service_port'];

    this.modalWorkerNodeUIPortValue = this.data['nodeDetails']['node_ui_port'] ;

    this.modalWorkerNodeUsernameValue  = this.data['nodeDetails']['node_username'] ;
  
      }
  }
  toggleConfirmationPassword(type){
    this.passwordConfirmationType = type;
  }
  ok() {
    this.activeModal.close('ok');
  }

  cancel() {
    this.activeModal.close('cancel');
  }
  private handleUpdateResponse(data:  any, successMessage: string): void {
    if (data.status === 'success') {
      this.spinner.hide();
      this.openAlert(successMessage);
      this.ok();
    } else {
      this.spinner.hide();
      this.openAlert(data.message);
    }
  }
  submitWorkerNode(){
    if(this.data.type == 'updatepassword'){
      let updatePasswordDetails:any = {};
      updatePasswordDetails['password'] = this.password;
      updatePasswordDetails['ip'] = this.data.ip;
      updatePasswordDetails['node_name'] = this.data.node_name;
      updatePasswordDetails['update_type'] = "password";
      this.spinner.show();
      this.databaseListService.updateWorkerNodeDetails(updatePasswordDetails).subscribe(data => {
        this.handleUpdateResponse(data, 'Password updated successfully.');
      });
    }
    else if(this.data.type == 'updateip'){
      let nodeDetails:any = this.data.nodeDetails;
      let updateDetails:any = {};
      updateDetails['node_name'] = nodeDetails.node_name;
      updateDetails['ip'] = this.modalWorkerNodeIPValue;
      updateDetails['update_type'] = "ip";
      updateDetails['service_port'] = this.modalWorkerNodeServicePortValue;
      updateDetails['ui_port'] = this.modalWorkerNodeUIPortValue;
      updateDetails['node_username'] = this.modalWorkerNodeUsernameValue;
      updateDetails['node_password'] = this.modalWorkerNodePasswordValue;

      this.spinner.show();
      this.databaseListService.updateWorkerNodeDetails(updateDetails).subscribe(data => {
        this.handleUpdateResponse(data, 'IP/FQDN updated successfully.');
      });
    }
    else{

    this.workerNodeDetail['workerNodeIP'] = this.modalWorkerNodeIPValue;
    this.workerNodeDetail['modalWorkerNodeServicePort'] = this.modalWorkerNodeServicePortValue;
    this.workerNodeDetail['modalWorkerNodeUIPort'] = this.modalWorkerNodeUIPortValue;
    this.workerNodeDetail['modalWorkerNodeUsername'] = this.modalWorkerNodeUsernameValue;
    this.workerNodeDetail['modalWorkerNodePassword'] = this.modalWorkerNodePasswordValue;

    if(!this.data.hasOwnProperty('nodeName')){
      const modalRef = this.modalService.open(NgbdConfirmationModal);
      modalRef.componentInstance.data = {msg : 'If a new worker node is added for DMAP analytics assessment, then any prior schema assessments or convresions done on that node are cleared. Do you want to add this node?', title : 'Confirmation',okButtonLabel : 'Yes',cancelButtonLabel:'No',label:'moveToCompletion'};
      modalRef.result.then((result) => {
      if ( result == 'ok') {
        this.spinner.show();
        this.databaseListService.submitworkerNodeDetails(this.workerNodeDetail).subscribe(data => {
          this.handleUpdateResponse(data, 'Worker node added successfully.');
        });

      }
      });

    }
    else{
      const modalRef = this.modalService.open(NgbdConfirmationModal);
      modalRef.componentInstance.data = {msg : 'Can the VM backup be restoerd behind the scenes without displaying any message to user? If a VM being replaced then the option to replace it shall be disabled till the operation completes.', title : 'Confirmation',okButtonLabel : 'Yes',cancelButtonLabel:'No',label:'moveToCompletion'};
      modalRef.result.then((result) => {
        if(result == 'ok'){
          this.spinner.show();
          this.workerNodeDetail['workerNodeName'] = this.data.nodeName;
          console.log(this.workerNodeDetail);
          this.databaseListService.replaceWorkerNode(this.workerNodeDetail).subscribe(data => {
            this.spinner.show();
            if(data.status == 'success'){
              this.spinner.hide();
              this.openAlert("Worker node replaced successfully.");
              this.ok();
            }
            else{
              this.spinner.hide();
              this.openAlert(data.message);
            }
        });
        }
      });

    }
  }
  }

  testWorkerNode(){
    this.workerNodeDetail['workerNodeIP'] = this.modalWorkerNodeIPValue;
    this.workerNodeDetail['modalWorkerNodeUsername'] = this.modalWorkerNodeUsernameValue;
    this.workerNodeDetail['modalWorkerNodePassword'] = this.modalWorkerNodePasswordValue;
    this.workerNodeDetail['modalWorkerNodeServicePort'] = this.modalWorkerNodeServicePortValue;
    this.workerNodeDetail['modalWorkerNodeUIPort'] = this.modalWorkerNodeUIPortValue;
    this.disableTestConnection = true;
    this.spinner.show();
    this.databaseListService.testWorkerNodeConnection(this.workerNodeDetail).subscribe(data => {
      this.disableTestConnection = false;
      if(data.status == 'success'){
        this.spinner.hide();
        this.openAlert("Worker node connection successful.");
      }
      else{
        this.spinner.hide();
          this.openAlert(data.message);
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

  clear(){

    this.addWorkerNodeForm.controls['modalWorkerNodeIP'].reset();
    this.addWorkerNodeForm.controls['modalWorkerNodeServicePort'].reset();
    this.addWorkerNodeForm.controls['modalWorkerNodeUIPort'].reset();
    this.addWorkerNodeForm.controls['modalWorkerNodeUsername'].reset();
    this.addWorkerNodeForm.controls['modalWorkerNodePassword'].reset();

  }


  toggleWorkerNodePassword(type){
    this.workerNodePasswordType = type;
  }

}
