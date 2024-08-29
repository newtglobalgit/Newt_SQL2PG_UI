import { Component, OnInit, Inject, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NotContainLoginId } from '../../Validators/not-contain-login-id';
import { AzureFirewallRuleValidator } from '../../Validators/azure-firewall-rule-validator';
import {  IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatabaseDataMigrationService } from '../../Services/database-data-migration.service';
import { any } from 'underscore';
//import { type } from 'os';
declare var $: any;
import * as _ from 'lodash';
import { UploadConfFileModalComponent } from '../upload-conf-file-modal/upload-conf-file-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';
import { DatabaseSchemaMigrationService } from '../../Services/database-schemMigration.service';
import { saveAs } from 'file-saver';
import { CommonServices } from '../../Services/common-services.service';
import { MinNumberValidator } from '../../Validators/min-number-validator';
import 'jqueryui';
import { PopupDraggableService } from '../../Services/popup-draggable.service';

@Component({
  selector: 'app-data-migration-settings-modal',
  templateUrl: './data-migration-settings-modal.component.html',
  styleUrls: ['./data-migration-settings-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DataMigrationSettingsModalComponent implements OnInit {
  settingsData:any;
  dmSettingsForm: FormGroup;
  migrationMethodList = [{label:'Copy', value:'COPY'},{label:'Insert', value:'INSERT'}];
  /*   migrationMethodList = [{item_text:'Copy', item_id:1},{item_text:'Insert', item_id:2},{item_text:'SQL Dump', item_id:3}]; */
  migrationOptionsList = [{ item_id: 0, item_text: 'Truncate Tables' },
                          { item_id: 1, item_text: 'Drop Foriegn Keys' },
                          { item_id: 2, item_text: 'Disable Triggers ' }];
  migrationMethod_dropdownSettings:IDropdownSettings = {};              
  migrationOptions_dropdownSettings:IDropdownSettings = {};     
  tableSelectionType:string = 'all';
  sourceTableList:any[] = [];
  sourceTableListSelected:any[] = [];
  targetTableList:any[] = [];
  targetTableListSelected:any[] = [];
  migrationOptionsListSelected:any[]=[];
  isMigrationOptions:boolean = true;
  errorInValidForm:boolean = false;
  isRedBorder:boolean = false
  ispgdumpCheckboxSelected:boolean = false;
  outputFilenameValue:any;
  outputDirectoryValue:any;
  isRadioChecked:boolean = false;
  isUploadFile:boolean;
  dataTransferMode:any;
  confFilename:any;
  tempdataTransferMode:any;
  fileData:any;
  quickTestCount:any;
  isUploadedSuccess:boolean;
  isDisabled:boolean = true;

  constructor(private dialogRef: MatDialogRef<DataMigrationSettingsModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,              
              private formBuilder: FormBuilder,
              private modalService: NgbModal,
              private databaseDataMigrationService:DatabaseDataMigrationService,
              private databaseSchemaMigrationService:DatabaseSchemaMigrationService,
              private commonServices:CommonServices,
              private cdRef: ChangeDetectorRef,
              private _PopupDraggableService: PopupDraggableService
            ) { }

  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.migrationMethod_dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };

    this.migrationOptions_dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dmSettingsForm = this.formBuilder.group({
      'migrationMethod': new FormControl('',[Validators.required]),
      'migrationOptions': new FormControl('',[Validators.required]),
      'tablesType': new FormControl('',[Validators.required]),
      'tableList': new FormControl('',[Validators.required]),
      'tableInput': new FormControl(''),
      'tableSelect': new FormControl(''),
      'pgdump': new FormControl(''),
      'dumptableFilenameInput':new FormControl(''),
      'dumpTable': new FormControl(''),
      'ignoreSettings': new FormControl(''),
      'runQuickMigration': new FormControl(''),
      'jobsValue': new FormControl('',[Validators.required,MinNumberValidator.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      'oracleCopiesValue': new FormControl('',[Validators.required,MinNumberValidator.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      'parallelTablesValue': new FormControl('',[Validators.required,MinNumberValidator.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      'parallelismDegreeValue': new FormControl('',[Validators.required,MinNumberValidator.range(0,1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      'parallelMinRowsValue': new FormControl('',[Validators.required,MinNumberValidator.min(100000), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      'dataLimitValue': new FormControl('',[Validators.required,MinNumberValidator.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])
    }/* , {
      validators: [NotContainLoginId('administratorLogin', 'administratorLoginPassword'),AzureFirewallRuleValidator('publicipstart', 'publicipend')],
    } */);

    this.getSettingsDetail(this.data.runId);
  }
  

  getSettingsDetail(runId){
   
    this.migrationOptionsListSelected = [];
    let reqObj = {'run_id':runId}
    this.databaseDataMigrationService.getDataMigrationSettings(reqObj).subscribe(response => {
      this.settingsData = response;
      // this.confFilename = response[0].file_path;
      /* Set value for Migration Options/Mode */
      if(response[0].migration_mode == null){
        //this.commonServices.setMigrationMode(this.migrationMethodList[0].value); 
        this.dmSettingsForm.get('migrationMethod').patchValue(this.migrationMethodList[0].value);
      }else{
        this.commonServices.setMigrationMode(response[0].migration_mode); 
        this.dmSettingsForm.get('migrationMethod').patchValue(response[0].migration_mode);
      }
       

      /* Set value for  Migration Options*/

      this.isMigrationOptions = false
      if(response[0].truncate_table ==1){
        this.migrationOptionsListSelected.push(this.migrationOptionsList[0])
      }
      if(response[0].drop_fkey ==1){
        this.migrationOptionsListSelected.push(this.migrationOptionsList[1])
      }
      if(response[0].disable_triggers ==1){
        this.migrationOptionsListSelected.push(this.migrationOptionsList[2])
      }
      this.dmSettingsForm.get('migrationOptions').patchValue(this.migrationOptionsListSelected);
      setTimeout(() => {        
        this.isMigrationOptions = true;
      }, 50);

      /* Set radio btns for Specifies tables will be */
      if(response[0].allow_tables ==1){
        this.dmSettingsForm.get('tablesType').patchValue('allowed');
      }else{        
        this.dmSettingsForm.get('tablesType').patchValue('exclude');
      }

      /* Set radio btns for table list */
      if(response[0].user_selected_table == 0){
        this.dmSettingsForm.get('tableList').patchValue('0');
        this.onSelectTablesSelection('0')
      }
      else if(response[0].user_selected_table == 1){        
        this.dmSettingsForm.get('tableList').patchValue('1');
        this.onSelectTablesSelection('1')
        if(response[0].table_list != null){
          this.dmSettingsForm.get('tableInput').patchValue(response[0].table_list);
        }
      }
      else if(response[0].user_selected_table == 2){
        this.dmSettingsForm.get('tableList').patchValue('2');
        this.onSelectTablesSelection('2')
        if(response[0].table_list != null){
          this.sourceTableList = response[0].source_db_tables;
          // this.targetTableList = response[0].table_list == null?[]:response[0].table_list;
          this.dmSettingsForm.get('tableSelect').patchValue(response[0].table_list.split(','));
          this.targetTableList = response[0].table_list.split(',');
          this.sourceTableList = _.difference(this.sourceTableList, this.targetTableList);
        }
      }

      if(response[0].generate_dump_only == 1){
        this.dmSettingsForm.get('pgdump').patchValue('dumpdata');
        this.dataTransferMode = 'dumpdata';

      }else{        
        this.dmSettingsForm.get('pgdump').patchValue('livedata');
        this.dataTransferMode = 'livedata';

      }

      this.dmSettingsForm.get('dumptableFilenameInput').patchValue(response[0].dump_output_filename);

      if(response[0].dump_file_per_table == 1){
        this.dmSettingsForm.get('dumpTable').patchValue('dumpTable')
      }else{
        this.dmSettingsForm.get('dumpTable').patchValue('')
      }

      if(response[0].ignore_dmap_settings == 1){
        this.dmSettingsForm.get('ignoreSettings').patchValue('ignoreSettingsChecked');
        this.onUploadCustomConfChecked(true);
      }

      if(response[0].mig_quick_test == 1){
        this.dmSettingsForm.get('runQuickMigration').patchValue(true);
      }
      else{
        this.dmSettingsForm.get('runQuickMigration').patchValue(false);
      }

      this.quickTestCount = response[0].quick_test_count;

      this.dmSettingsForm.get('jobsValue').patchValue(response[0].mig_jobs);
      this.dmSettingsForm.get('oracleCopiesValue').patchValue(response[0].mig_oracle_copies);
      this.dmSettingsForm.get('parallelTablesValue').patchValue(response[0].mig_parallel_tables);
      this.dmSettingsForm.get('parallelismDegreeValue').patchValue(response[0].mig_parallelism_degree);
      this.dmSettingsForm.get('parallelMinRowsValue').patchValue(response[0].mig_parallel_min_rows);
      this.dmSettingsForm.get('dataLimitValue').patchValue(response[0].mig_data_limit);
    }, error => {
      this.cancel();
    });
  }

  onMigrationMethodChange(event){
    this.dmSettingsForm.get('migrationMethod').patchValue(event.target.value);
  }

  cancel(){
    this.dialogRef.close({'action': 'close'})
  }

  onItemSelect(item: any) {
    this.validateMultiSelect();
  }

  onItemDeSelect(item: any) {
    this.validateMultiSelect();
  }

  onSelectAll(items: any) {
  }

  onSelectTablesSelection(type){    
    this.tableSelectionType = type


    if(type == '1'){
      this.sourceTableList = []
      this.targetTableList = []
      this.dmSettingsForm.get('tableSelect').patchValue([]);
      
      this.dmSettingsForm.controls['tableSelect'].clearValidators();
      this.dmSettingsForm.controls['tableSelect'].updateValueAndValidity();
      this.dmSettingsForm.controls['tableInput'].setValidators([Validators.required]);
      this.dmSettingsForm.controls['tableInput'].updateValueAndValidity();
      this.dmSettingsForm.controls['tableInput'].enable();
    }
    else if(type == '2'){
      this.dmSettingsForm.get('tableInput').patchValue('');
      this.sourceTableList = this.settingsData[0].source_db_tables
      this.dmSettingsForm.get('tableSelect').patchValue([]);

      this.dmSettingsForm.controls['tableInput'].clearValidators();
      this.dmSettingsForm.controls['tableInput'].updateValueAndValidity();
      this.dmSettingsForm.controls['tableSelect'].setValidators([Validators.required]);
      this.dmSettingsForm.controls['tableSelect'].updateValueAndValidity();
      this.dmSettingsForm.controls['tableInput'].disable();
    }
    else{
      this.dmSettingsForm.controls['tableInput'].disable();
      this.dmSettingsForm.controls['tableInput'].clearValidators();
      this.dmSettingsForm.controls['tableInput'].updateValueAndValidity();
      this.dmSettingsForm.controls['tableSelect'].clearValidators();
      this.dmSettingsForm.controls['tableSelect'].updateValueAndValidity();
    }
  }

  onSelectTablesList(selectionBox){
    this.sourceTableListSelected = [];
    this.targetTableListSelected = [];

    if(selectionBox == 'left'){      
      let selectedItem = $("#leftValues option:selected");
      for(let i in selectedItem){
        if(selectedItem[i].value != undefined){
          this.sourceTableListSelected.push(selectedItem[i].value);
        }
      }
    }

    if(selectionBox == 'right'){
      let selectedItem = $("#rightValues option:selected");
      
      for(let i in selectedItem){
        if(selectedItem[i].value != undefined){
          this.targetTableListSelected.push(selectedItem[i].value);
        }
      }
    }
  }

  moveSelectedTables(type){
    if(type == 'toRight'){
      this.sourceTableList = _.difference(this.sourceTableList, this.sourceTableListSelected); 
      
      for(let i in this.sourceTableListSelected){
        this.targetTableList.push(this.sourceTableListSelected[i]);
      }
    }
    
    if(type == 'toLeft'){
      this.targetTableList = _.difference(this.targetTableList, this.targetTableListSelected);
      
      for(let i in this.targetTableListSelected){
        this.sourceTableList.push(this.targetTableListSelected[i]);
      }
      this.sourceTableList = _.uniq(this.sourceTableList.slice()); 
    }

    this.sourceTableListSelected = [];
    this.targetTableListSelected = [];
    
    this.dmSettingsForm.get('tableSelect').patchValue(this.targetTableList);
  }

  validateMultiSelect(){    
    this.isRedBorder = false;
    if(!this.dmSettingsForm.get('migrationOptions').valid){
      this.isRedBorder = true;
    }
  }

  submit(){
    this.errorInValidForm = false;
    
    if(!this.dmSettingsForm.valid){
      this.errorInValidForm = true;
      this.validateMultiSelect();
      return;
    }
    let _table_list:any;
    let pg_dump_only:any; 
    let dump_per_table:any;
    let reqObj:any;
    let mig_quick_test:any;
    /* {'run_id':20200825142215,'allow_tables':0/1,'user_selected_table':0/1,'table_list':'table1,table2',
    'drop_fkey':0/1,'truncate_table':0/1,'disable_triggers':0/1,'mig_generate_dump_only':0/1,'migration_mode':'INSERT'/'COPY'/'PGDUMP'} */
    

    if(this.dmSettingsForm.get('ignoreSettings').value){
       reqObj = {run_id: this.data.runId, ignore_dmap_settings :1}
     }
    else{

      /* if(this.dmSettingsForm.get('pgdump').value == 'dumpdata'){
        pg_dump_only = 1;
      }
      else{
        pg_dump_only = 0;
      } */

      if(this.dmSettingsForm.get('dumpTable').value){
        dump_per_table = 1;
      }
      else{
        dump_per_table = 0;
      }

      if(this.dmSettingsForm.get('tableList').value == '0'){
        _table_list ='';
      }
      else if(this.dmSettingsForm.get('tableList').value == '1'){
        _table_list = this.dmSettingsForm.get('tableInput').value;
      }
      else if(this.dmSettingsForm.get('tableList').value == '2'){
        _table_list = this.dmSettingsForm.get('tableSelect').value.toString()
      }
      this.commonServices.setMigrationMode(this.dmSettingsForm.get('migrationMethod').value); 

      reqObj = {run_id: this.data.runId, 
                    allow_tables:this.dmSettingsForm.get('tablesType').value == 'allowed'?1:0,
                    user_selected_table:parseInt(this.dmSettingsForm.get('tableList').value),
                    table_list:_table_list,
                    truncate_table: _.findIndex(this.dmSettingsForm.get('migrationOptions').value, { 'item_id': 0 }) > -1?1:0,
                    drop_fkey: _.findIndex(this.dmSettingsForm.get('migrationOptions').value, { 'item_id': 1 }) > -1?1:0,
                    disable_triggers: _.findIndex(this.dmSettingsForm.get('migrationOptions').value, { 'item_id': 2 }) > -1?1:0,
                    migration_mode:this.dmSettingsForm.get('migrationMethod').value,
                    generate_dump_only:this.dmSettingsForm.get('pgdump').value == 'dumpdata'?1:0,
                    dump_output_filename:this.dmSettingsForm.get('dumptableFilenameInput').value,
                    dump_file_per_table:dump_per_table,
                    ignore_dmap_settings :0,
                    mig_quick_test:this.dmSettingsForm.get('runQuickMigration').value === true?1:0,
                    jobs:this.dmSettingsForm.get("jobsValue").value,
                    oracleCopies:this.dmSettingsForm.get("oracleCopiesValue").value,
                    parallelTables:this.dmSettingsForm.get("parallelTablesValue").value,
                    parallelismDegree:this.dmSettingsForm.get("parallelismDegreeValue").value,
                    parallelMinRows:this.dmSettingsForm.get("parallelMinRowsValue").value,
                    dataLimit:this.dmSettingsForm.get("dataLimitValue").value,
                    // jobs:1,
                    // oracleCopies:1,
                    // parallelTables:1,
                    // parallelismDegree:0,
                    // parallelMinRows:100000
                  };
    console.log(reqObj,this.dmSettingsForm.get('runQuickMigration').value);
    }
    this.databaseDataMigrationService.setDataMigrationSettings(reqObj).subscribe(response => {
      if(response.status == 'success'){
        this.dialogRef.close({'action': 'success', settingsData:reqObj})
      }else{
        this.openAlert('Something went wrong. Please try again.')
      }
    }, error => {
      this.cancel();
    })
   }

  onCheckboxClicked(data){
    
    this.ispgdumpCheckboxSelected = data;

    if(this.ispgdumpCheckboxSelected){
    this.dmSettingsForm.get('tableSelect').patchValue([]);
      
      this.dmSettingsForm.controls['tableSelect'].clearValidators();
      this.dmSettingsForm.controls['tableSelect'].updateValueAndValidity();
      this.dmSettingsForm.controls['tableInput'].clearValidators();
      this.dmSettingsForm.controls['tableInput'].updateValueAndValidity();
      this.dmSettingsForm.controls['migrationOptions'].clearValidators();
      this.dmSettingsForm.controls['migrationOptions'].updateValueAndValidity();
      this.dmSettingsForm.controls['tablesType'].clearValidators();
      this.dmSettingsForm.controls['tablesType'].updateValueAndValidity();
      this.dmSettingsForm.controls['tableList'].clearValidators();
      this.dmSettingsForm.controls['tableList'].updateValueAndValidity();
    }
  }

  onUploadCustomConfChecked(isChecked){
    if(isChecked){
        this.dmSettingsForm.get('migrationMethod').disable();
        this.dmSettingsForm.get('tablesType').disable();
        this.dmSettingsForm.get('tableInput').disable();
        this.dmSettingsForm.get('tableList').disable();
        this.dmSettingsForm.get('pgdump').disable();
        this.dmSettingsForm.get('dumptableFilenameInput').disable();
        this.dmSettingsForm.get('dumpTable').disable();
        this.dmSettingsForm.get('runQuickMigration').disable();
        this.dmSettingsForm.get('tableSelect').disable();
        this.dmSettingsForm.get('jobsValue').disable();
        this.dmSettingsForm.get('oracleCopiesValue').disable();
        this.dmSettingsForm.get('parallelTablesValue').disable();
        this.dmSettingsForm.get('parallelismDegreeValue').disable();
        this.dmSettingsForm.get('parallelMinRowsValue').disable();
        this.dmSettingsForm.get('dataLimitValue').disable();
        this.tempdataTransferMode =this.dataTransferMode;
        this.dataTransferMode='';
    }
    else{
       this.dmSettingsForm.get('migrationMethod').enable();
       this.dmSettingsForm.get('tablesType').enable();
       this.dmSettingsForm.get('tableInput').enable();
       this.dmSettingsForm.get('tableList').enable();
       this.dmSettingsForm.get('pgdump').enable();
       this.dmSettingsForm.get('dumptableFilenameInput').enable();
       this.dmSettingsForm.get('dumpTable').enable();
       this.dmSettingsForm.get('runQuickMigration').enable();
       this.dmSettingsForm.get('tableSelect').enable();
       this.dmSettingsForm.get('jobsValue').enable();
       this.dmSettingsForm.get('oracleCopiesValue').enable();
       this.dmSettingsForm.get('parallelTablesValue').enable();
       this.dmSettingsForm.get('parallelismDegreeValue').enable();
       this.dmSettingsForm.get('parallelMinRowsValue').enable();
       this.dmSettingsForm.get('dataLimitValue').disable();
       this.dataTransferMode = this.tempdataTransferMode;
    }
  }

  onUploadCustomeConfBtnClicked(isChecked){
    this.isUploadFile = isChecked;
       
    const modalRef = this.modalService.open(UploadConfFileModalComponent, {size: 'lg', scrollable: true});

    modalRef.componentInstance.data = {'runId':this.data.runId};
    modalRef.result.then((result) => {
        if ( result == 'ok') {
          this.isUploadedSuccess = true;
      } else {
        if(result != 'cancel') this.isUploadedSuccess = false; /* this.openAlert('Something went wrong. Please try again.'); */
      }
    });
    
  }

  onDownloadCustomeConfBtnClicked(isChecked){

  }

  onDumpPerFileSelect(data){   
    this.isRadioChecked = data;
  }

  onSelectDataTransferMode(mode){
    this.dataTransferMode = mode;

    if(mode == 'livedata'){
      this.dmSettingsForm.controls['dumptableFilenameInput'].clearValidators();
      this.dmSettingsForm.controls['dumptableFilenameInput'].updateValueAndValidity();
      // this.dmSettingsForm.controls['dumpTable'].clearValidators();
      // this.dmSettingsForm.controls['dumpTable'].updateValueAndValidity();

      
      this.dmSettingsForm.controls['migrationOptions'].setValidators([Validators.required]);
      this.dmSettingsForm.controls['migrationOptions'].updateValueAndValidity();
    }

    else if(mode == 'dumpdata'){
      this.dmSettingsForm.controls['migrationOptions'].clearValidators();
      this.dmSettingsForm.controls['migrationOptions'].updateValueAndValidity();

      this.dmSettingsForm.controls['dumptableFilenameInput'].setValidators([Validators.required]);
      this.dmSettingsForm.controls['dumptableFilenameInput'].updateValueAndValidity();
    }
  }

  fileUploadClicked(event){
    this.fileData = event;
  }
  

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }
  onSelectQuickMigration(isChecked){
    if(isChecked){
      this.dmSettingsForm.get('runQuickMigration').patchValue(true);
    }
    else{
      this.dmSettingsForm.get('runQuickMigration').patchValue(false);
    }

  }

  downloadConfFile(){
    let reqObj = {
      "RUN_ID" :this.data.runId,
    }
    this.databaseSchemaMigrationService.downloadORA2PGConfFile(reqObj).subscribe(data=>{
      
      
      if(data.type == "application/json"){
        this.openAlert("File does not exists");
      }
     else{
      let blob = new Blob([data],{});
      let filename = 'ora2pg_'+reqObj.RUN_ID+'.conf';
       saveAs.saveAs(blob,filename);
     }
    });
    
  }

}
