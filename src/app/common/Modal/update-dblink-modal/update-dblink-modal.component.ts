import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from '../../Services/database-list.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-update-dblink-modal',
  templateUrl: './update-dblink-modal.component.html',
  styleUrls: ['./update-dblink-modal.component.css']
})
export class UpdateDblinkModalComponent implements OnInit {
  @Input() data: any;
  @ViewChild('f',  { static: false }) masterEmailSettingsForm: NgForm;
  name: any;
  host: any;
  dbType: any;
  username: any;
  passwordValue: any;
  dbTypeOptions: any[] = ['Oracle', 'PostgreSQL'];
  passwordType:string = 'password';
  portValue: any;
  dbValue: any;

  constructor(private databaseListService: DatabaseListService,
    private spinner: NgxSpinnerService,
    private _PopupDraggableService: PopupDraggableService,
    private modalService: NgbModal, private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    let details = this.data.data
    this.name = details.name;
    this.host = details.host;
    this.dbType = details.dbtype;
    this.username = details.username;
    this.passwordValue = details.password;
    this.portValue = details.port;
    this.dbValue = details.dbname;

  }

  submit(){
    this.spinner.show();
    let reqObj = {'type_id': this.data.data.id, 'dbtype': this.dbType, 'host': this.host, 'user': this.username,
                  'password': this.passwordValue, 'port': this.portValue, 'dbname': this.dbValue, 'run_id': this.data.run_id}
              
    console.log(reqObj);
    this.databaseListService.updateDbLinkDetails(reqObj).subscribe(resp => {
      if(resp.status == 'success'){
        this.spinner.hide();
        this.activeModal.close();
        this.openAlert(resp.message);
        
      }else{
        this.spinner.hide();
        this.openAlert(resp.message);
      }
    });
  }

  togglePassword(type){
    this.passwordType = type;
  }

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }
  DbChange(db){
    this.dbType = db;
  }

  cancel() {
    this.activeModal.close('cancel');
  }

}
