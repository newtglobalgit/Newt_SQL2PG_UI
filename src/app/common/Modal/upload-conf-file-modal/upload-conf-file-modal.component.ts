import { Component, OnInit, Input } from '@angular/core';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseDataMigrationService } from '../../Services/database-data-migration.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from '../../Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-upload-conf-file-modal',
  templateUrl: './upload-conf-file-modal.component.html',
  styleUrls: ['./upload-conf-file-modal.component.css']
})
export class UploadConfFileModalComponent implements OnInit {
  @Input() data;
  constructor(private activeModal: NgbActiveModal,
              private modalService: NgbModal, 
              private _PopupDraggableService: PopupDraggableService,
              private databaseDataMigrationService:DatabaseDataMigrationService,
              private spinner: NgxSpinnerService,) { }
  fileData:any;
  files:any;

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
  }
  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

  closeModal(){
    this.activeModal.close('cancel');
  }

  fileUploadClicked(event){   
    this.fileData = event;
  }

  upload(){
    //call the upload method to upload file and close the modal on success
    let obj = {}
    obj['run_id'] = this.data.runId;
    obj['file'] =this.fileData['file'];
    obj['fileName']=this.fileData['fileName'];
    this.files=this.fileData['fileData'];
    let filename = JSON.stringify(obj['fileName']).toString();
    let index = filename.lastIndexOf(".");
    let strsubstring = filename.substring(index, (filename.length-1));
    this.spinner.show();
    if (strsubstring == '.conf')
    {
      if(this.files[0].size>0){
      console.log('File Uploaded sucessfully');
      this.databaseDataMigrationService.uploadfile(obj).subscribe((res:any) => {
        this.spinner.hide();
            if(res.status){
              this.activeModal.close('ok');
            }
            else{
              this.activeModal.close('fail');
            }
          }, error =>{
          })
    }
    else{
      this.spinner.hide();
      console.log('Please upload correct File, File should not be empty');
      this.openAlert("Please upload a valid file, File should not be empty");
    }
  }

    else {
      this.spinner.hide();
       console.log('Please upload correct File Name, File extension should be .conf');
       this.openAlert("Please upload a valid file, File extension should be .conf");

    }


    
  
   
    
    
  }

}
