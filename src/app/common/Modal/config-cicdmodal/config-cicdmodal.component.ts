import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModalComponent } from '../file-upload-modal/file-upload-modal.component';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
declare var $: any;
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-config-cicdmodal',
  templateUrl: './config-cicdmodal.component.html',
  styleUrls: ['./config-cicdmodal.component.css']
})
export class ConfigCICDModalComponent implements OnInit {
  @Input() data:any;
  cloudTypeValue:string = 'AWS';
  avaibilityRegionValue:string;
  avaibilityZoneValue:string;

  avaibilityRegionList:any[];
  awsavaibilityRegion:any[] = ['AWS Region 1', 'AWS Region 2'];
  azureavaibilityRegion:any[] = ['Azure Region 1', 'Azure Region 2'];
  
  avaibilityZoneList:any[];
  awsavaibilityZone:any[] = ['AWS Zone 1', 'AWS Zone 2'];
  azureavaibilityZone:any[] = ['Azure Zone 1', 'Azure Zone 2'];

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal,    private _PopupDraggableService: PopupDraggableService
  ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.avaibilityRegionList = this.awsavaibilityRegion;
    this.avaibilityZoneList = this.awsavaibilityZone;
    this.avaibilityRegionValue = this.awsavaibilityRegion[0];
    this.avaibilityZoneValue = this.awsavaibilityZone[0];
  }

  onCloudTypeSelected(){
    this.avaibilityRegionList = [];
    
    if(this.cloudTypeValue == 'AWS'){
      this.avaibilityRegionList = this.awsavaibilityRegion;
      this.avaibilityZoneList = this.awsavaibilityZone;
    }else{      
      this.avaibilityRegionList = this.azureavaibilityRegion;
      this.avaibilityZoneList = this.azureavaibilityZone;
    }
  }
  
  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {'msg':msg, 'title':'Alert'};
    modalRef.result.then((result) => {
      // if ( result == 'ok') {        
        
      // }else{

      // }
    });
  }

  uploadTestScripts() {
    this.openUploadModal('testScripts', '/assets/sampleTemplates/TestScripts.xlsx');
  }
  
  rehydrateData() {
    this.openUploadModal('loadTestData', '/assets/sampleTemplates/loadData.xlsx');
  }

  openUploadModal(fileType: string, sampleFile: string) {
    const data = {
      fileType: fileType,
      sampleFile: sampleFile,
      isSampleFileShow: false
    };
  
    const modalRef = this.modalService.open(FileUploadModalComponent, { size: 'lg', scrollable: true });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      if (result == 'ok') {
        this.openAlert('File uploaded successfully.');
      }
    });
  }

  onAvaibilityRegionSelected(){}

  loadData(){}
  
  ok(){    
    this.activeModal.close('ok');
  }

  cancel() {
    this.activeModal.close('cancel');
  }
}
