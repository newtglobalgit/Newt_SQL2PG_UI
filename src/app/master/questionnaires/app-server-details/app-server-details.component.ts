import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddInterfaceComponent } from 'src/app/common/Modal/add-interface/add-interface.component';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbdConfirmationModal } from 'src/app/common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
import { AddServerDetailsComponentComponent } from 'src/app/common/Modal/add-server-details-component/add-server-details-component.component';
import 'jqueryui';
import { PopupDraggableService } from 'src/app/common/Services/popup-draggable.service';

@Component({
  selector: 'app-app-server-details',
  templateUrl: './app-server-details.component.html',
  styleUrls: ['./app-server-details.component.css']
})
export class AppServerDetailsComponent implements OnInit {
  @Output() updatedValues = new EventEmitter<{servers_core: string, servers_ram: string, servers_storage: string}>();
  isDataAvailable:boolean = false;
  showInterfaceData:boolean = false;
  application_name:any;
  application_id:any;
  appDetails:any;
  appServerDetails:any;
  @Input() data:any;
  hideaddServerDetails:boolean = false;
  currentServerDetailsCount :any = 0;
  isAddServerDetailsavailable:boolean= false;

  constructor(private activatedroute:ActivatedRoute,
              private spinner: NgxSpinnerService,
              private databaseListService: DatabaseListService,
              private activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private _PopupDraggableService: PopupDraggableService
            ) { }

  ngOnInit(): void {
    this._PopupDraggableService.enableDraggablePopup();
    this.activatedroute.queryParams.subscribe(queryParams => {
      this.appDetails=queryParams;
      this.application_id = this.appDetails['appId'];
      this.application_name = this.appDetails['appName'];
      this.isDataAvailable = true;
    });
    this.appServerDetails = this.data.appServerDetails;
    if(this.appServerDetails){
      this.showInterfaceData = true;
    }
    else{
      this.showInterfaceData = false;
    }
    //this.getApplicationServerDetails();
    if(this.data.currentServerDetailsCount >= (this.data.server_count)){
      this.hideaddServerDetails = true
    }
  }
  addServerDetails(){
    const modalRef = this.modalService.open(AddServerDetailsComponentComponent, {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = {'title':'Enter Infra Structure Details','appName':this.application_name,'appId':this.application_id};
    modalRef.result.then((result) => {
    let reqObj = {'appId':this.application_id,'appName':this.application_name};
    this.databaseListService.getApplicationServerDetails(reqObj).subscribe(response => {
      console.log(response,"response")
    if (response.length > 0){
      this.appServerDetails = response;
      this.showInterfaceData = true;
      this.enableAddServerLink(response);
      } else if (response.length < 1) {
        this.showInterfaceData = false;
      }
    });
      //this.reloadData();

  });
  }
  cancel() {

    this.getAppServerDetailsValues();
    if(this.isAddServerDetailsavailable){
      this.activeModal.close('ok')
    }else{
      if (this.appServerDetails){
        this.activeModal.close(this.appServerDetails.length);
      }
      else{
        this.activeModal.close(0);
      }

    }


  }
  getAppServerDetailsValues(){
    let reqObj = {'appName':this.application_name};
    this.databaseListService.getServerRequiredValuesByApplication(reqObj).subscribe(response => {
      if (response.length > 0){
        if(response[0]['servers_core']!=null &&response[0]['servers_ram']!=null&&response[0]['servers_storage']!=null ){
          this.isAddServerDetailsavailable = true;
        }

    }
      });
  }
  getApplicationServerDetails(){
    let reqObj = {'appId':this.application_id,'appName':this.application_name};
    this.spinner.show();
    this.databaseListService.getApplicationServerDetails(reqObj).subscribe(response => {

      if (response.length > 0){

        this.appServerDetails = response;
        this.currentServerDetailsCount = this.appServerDetails.length
        if(this.appServerDetails){
          this.showInterfaceData = true;
        }
        else{
          this.showInterfaceData = false;
        }
      }
      this.spinner.hide();
      });

  }
  editInterfaceDetails(app_server_detail_id){
    const modalRef = this.modalService.open(AddServerDetailsComponentComponent, {size: 'lg', scrollable: true});
    modalRef.componentInstance.data = {'title':'Enter Infra Structure Details','appName':this.application_name,'appId':this.application_id,'appServerDetailId':app_server_detail_id,'action':'edit'};
    modalRef.result.then((result) => {
      // window.location.reload();
      this.reloadData();
    //   if ( result == 'ok') {
    // }
  });

  }
  reloadData(){
    this.spinner.show();
    let reqObj = {'appId':this.application_id,'appName':this.application_name};
    this.databaseListService.getApplicationServerDetails(reqObj).subscribe(response => {
      if (response.length > 0){
        this.appServerDetails = response;
      }
      else{
        this.appServerDetails =null;
      }
      this.spinner.hide();
      });

  }
  enableAddServerLink(response){
    if (response.length == 0) {
      this.showInterfaceData = false;
    } else
    if(response.length >= (this.data.server_count)){
          this.hideaddServerDetails = true
        }
        else{
          // this.appServerDetails = null;
          this.hideaddServerDetails = false;
        }
  }

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

  removeInterfaceDetails(app_server_detail_id){
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {msg : 'Do you want to remove this server details?', title : 'Confirmation',okButtonLabel : 'Yes',cancelButtonLabel:'No'};
    modalRef.result.then((result) => {
      if ( result == 'ok') {
        let reqObj = {'appId':this.application_id,'appName':this.application_name,'appServerDetailId':app_server_detail_id};
        this.databaseListService.removeApplicationServerDetails(reqObj).subscribe(response => {
          if(response['status']){
            this.reloadData();
            // this.databaseListService.getApplicationServerDetails(reqObj).subscribe(response => {
            // if (response.length > 0){
            //   this.getAppServerDetailsValues();
            //   this.appServerDetails = response;
             
            //   if(response.length >= (this.data.server_count)){
            //     this.hideaddServerDetails = true
            //   }
            //   else{
            //     this.appServerDetails = null;
            //     this.hideaddServerDetails = false;
            //   }
            //   }
            // });
          }

          });
          this.databaseListService.getApplicationServerDetails(reqObj).subscribe(response => {
          if (response.length > 0){
            this.appServerDetails = response;
            this.enableAddServerLink(response);
            }
          });
          this.getAppServerDetailsValues();
          //this.reloadData();

      }
    });
  }

  // cancel() {
  //   this.activeModal.close('cancel');
  // }

}
