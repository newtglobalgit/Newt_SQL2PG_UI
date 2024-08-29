import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatabaseListService } from '../../Services/database-list.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import { DmapTargetCredtialsModal } from '../dmap-target-credtials-modal/dmap-target-credtials-modal.component';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-schema-migration-confirmation-modal',
  templateUrl: './schema-migration-confirmation-modal.component.html',
  styleUrls: ['./schema-migration-confirmation-modal.component.css']
})
export class SchemaMigrationConfirmationModalComponent implements OnInit {
  @Input() data:any;

  schemaMigrationList:any[] = [];
  checkedSchemas:any[] = []
  isAllRowChecked:number;
  p: number = 1;
  selected_schemas:any[] = [];
  showPagination:boolean = false;
  showCheckBoxes:boolean = false;
  showSubmitButton:boolean = false;
  selectedSchema:any;
  showText:boolean = false;
  schemaConversionsubmittedcount:any;

  constructor(private databaseListService:DatabaseListService,
              private activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private _PopupDraggableService: PopupDraggableService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.ngOnChanges();
    for (let k in this.schemaMigrationList){
      if (this.schemaMigrationList[k].runId == this.data.selectedSchema.runId){
        this.schemaMigrationList[k].isRowChecked = !this.schemaMigrationList[k].isRowChecked;
      }
    }
    for (let j in this.schemaMigrationList){
      if (this.schemaMigrationList[j].runId == this.data.selectedSchema.runId){
        if (this.schemaMigrationList[j]['status'] != 'Add'){
          this.checkedSchemas.push(this.data.selectedSchema.runId);
          this.showText = true;
        }
      }
    }

    if (this.checkedSchemas.length > 0 && this.data.selectedSchema.runId != ''){
      this.showSubmitButton = true;
    }
  }
  ngOnChanges(): void {

    this.schemaMigrationList = this.data['data'];

    if (this.schemaMigrationList.length >0){
      this.showPagination = true;
    }
    else{
      this.showPagination = false;
    }
    for (let i in this.schemaMigrationList){
      if(this.schemaMigrationList[i]['status'] != 'Add' || this.schemaMigrationList[i]['status'] == ''){
          this.showCheckBoxes = true;
          break;
      }
    }

    this.schemaConversionsubmittedcount = this.schemaMigrationList.filter((obj) => obj.status === 'Add').length;

    this.setCheckboxes();

    this.setAllCheckBox();

    if (this.schemaConversionsubmittedcount == this.schemaMigrationList.length){
      this.showSubmitButton = true;
    }
  }
  setCheckboxes(){
    for(let i in this.schemaMigrationList){
      if(this.checkedSchemas.indexOf(this.schemaMigrationList[i].runId) > -1){
        this.schemaMigrationList[i].isRowChecked = true;
      }else{
        this.schemaMigrationList[i].isRowChecked = false;
      }
    }
  }
  onCheckboxClicked(data){
    for(let k in  this.schemaMigrationList){
      if(this.schemaMigrationList[k].runId == this.data.selectedSchema.runId){
        this.schemaMigrationList[k].defaultSelection = false;
      }
    }
    for (let k in this.schemaMigrationList){
      if (this.schemaMigrationList[k].runId == data.runId){
        this.schemaMigrationList[k].isRowChecked = !this.schemaMigrationList[k].isRowChecked;
      }
    }
    if(data.runId == -1){
      if(data.event.target.checked){
        this.checkAll('add');
        this.showSubmitButton = true;

      }else{
        this.checkAll('remove');
        this.showSubmitButton = false;
      }
    }else if(this.checkedSchemas.indexOf(data.runId) > -1){
      this.checkedSchemas.splice(this.checkedSchemas.indexOf(data.runId), 1)
      this.setAllCheckBox()
    }else{
      this.checkedSchemas.push(data.runId);
      this.setAllCheckBox()
    }

    if (this.checkedSchemas.length > 0){
      this.showSubmitButton = true;
    }
    else{
      this.showSubmitButton = false;
    }
  }
  setAllCheckBox(){
    /* check the selectAll checkbox if a user select all the checkboxes one by one */
    let _schemaList = this.schemaMigrationList.filter(function(item){
      return item.isRowChecked;
    });
    if(_schemaList.length == this.schemaMigrationList.length && this.schemaMigrationList.length > 0){
      this.isAllRowChecked = -1;
      this.showSubmitButton = true;
    }
    else{this.isAllRowChecked = undefined;this.showSubmitButton = false;}
  }
  checkAll(action){

    for(let i in this.schemaMigrationList){
      if(action == 'add' && this.checkedSchemas.indexOf(this.schemaMigrationList[i].runId) == -1){
        this.checkedSchemas.push(this.schemaMigrationList[i].runId);
      }else if(action == 'remove'){
        this.checkedSchemas.splice(this.checkedSchemas.indexOf(this.schemaMigrationList[i].runId), 1)
      }
    }

    this.setCheckboxes();
  }
  cancel(){
    this.activeModal.close('cancel');
  }
  updateSchemaDetails(data){
    let schema;
    schema = data.schemaDtls;
    schema.schema_changed = data.event.target.value;
    for(let i in this.schemaMigrationList){
      if(this.schemaMigrationList[i].runId == schema.runId){
        this.schemaMigrationList[i].schema_changed = data.event.target.value;
      }
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
  submit(){
    this.spinner.show();
    let reqObj = [];
    let targetsDetails = [];
    for (let i in this.schemaMigrationList){

      for (let j in this.checkedSchemas){
        if(this.schemaMigrationList[i].runId == this.checkedSchemas[j] && this.schemaMigrationList[i].status != 'Add'){
          if ('schema_changed' in this.schemaMigrationList[i]){
            console.log('');
          }
          else{
            this.schemaMigrationList[i].schema_changed = 'No'
          }
          reqObj.push(this.schemaMigrationList[i])
        }
      }
    }
    for (let i in this.schemaMigrationList){
      if (this.schemaMigrationList[i].targetDB == null){
        if(this.checkedSchemas.includes(this.schemaMigrationList[i].runId)){
          targetsDetails.push(this.schemaMigrationList[i].runId);
        }

      }
    }

    if(reqObj.length == 0){
      this.spinner.hide();
      if (this.schemaConversionsubmittedcount == this.schemaMigrationList.length){
        this.openAlert("All schemas are submitted to run schema conversion.");
      }
      else{
        this.openAlert("Please select atleast one schema to submit the details.");
      }
    }
    else if(targetsDetails.length > 0){
      this.spinner.hide();
      this.openAlert("Target Details are not available for RunId(s): "+targetsDetails.join(', ')+". Please fill the details before submitting for Schema Conversion.")
    }
    else{
      this.databaseListService.updateSchemaMigrationData(reqObj).subscribe(data => {
        this.spinner.hide();
        if(data.status == 'success'){
          this.activeModal.close('ok');
        }
        else{
          this.spinner.hide();
          this.openAlert(data.message)
        }
      });}
  }
  updateTargetDetails(schema){
    this.databaseListService.getTargetDetails(schema.runId).subscribe(response => {
      if (response['status'] == 'SUCCESS'){
        let data = response['data']
        const modalRef = this.modalService.open(DmapTargetCredtialsModal, {size: 'lg', scrollable: true});
        modalRef.componentInstance.data = {'title':'Target Database Configuration', 'runId': schema.runId,
                                            'show_all_target_details':true,
                                            'target_db_type':data.target_db_type,'target_env':'','toolsUsed':'',
                                            'target_db_host':data.target_db_host,'target_db_port':data.target_db_port,
                                            'target_db_username':data.target_db_username,'target_db_databse':data.target_db_databse,
                                            'sourceDBSchema':data.target_db_schema};
        modalRef.result.then((result) => {
          // if ( result.status == 'success') {
          // }else if(result == 'cancel'){
          // }else{

          // }
        });
      }
      // else{
      // }
      });

  }

}
