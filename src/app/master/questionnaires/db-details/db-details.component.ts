import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { FileUploadModalComponent } from 'src/app/common/Modal/file-upload-modal/file-upload-modal.component';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
import { QuestionaireService } from 'src/app/common/Services/questionaire.service';
declare var $: any;
import * as ld from 'lodash';

@Component({
  selector: 'app-db-details',
  templateUrl: './db-details.component.html',
  styleUrls: ['./db-details.component.css']
})
export class DbDetailsComponent implements OnInit {
  shortQuestionnaireData:any;

  shortQuestionnaireForm: FormGroup;
  isShow:boolean = false;
  formStatus: string = 'failed';
  errorInValidForm: boolean;
  azure_locations:any = [];
  databaseSID: any;
  constructor(private formBuilder: FormBuilder,
              private questionaireService:QuestionaireService,
              private activeModal: NgbActiveModal,
              private spinner: NgxSpinnerService,
              private datalistService: DatabaseListService,
              private modalService: NgbModal) { }


  ngOnInit() {
    this.get_database_details_data();

  }

  replaceSpacesWithUnderscores(inputString) {
    return inputString.replace(/ /g, '_');
}

  get_database_details_data(){
    this.spinner.show();
    this.datalistService.get_database_details_data().subscribe(data => {
      this.spinner.hide();
      this.shortQuestionnaireData = data.data;
      this.formStatus = data.status;
      this.azure_locations = data.azure_locations;
      if(this.formStatus == 'success'){

        setTimeout(() => {
          $('a#nav-'+ this.replaceSpacesWithUnderscores(this.shortQuestionnaireData.bunits[0].bunit)+'-tab').click();
          $('a#nav-'+this.replaceSpacesWithUnderscores(this.shortQuestionnaireData.bunits[0].bunit)+'-tab').tab('show');
        }, 50);
      }
      this.createControls();
    });

  }

  createControls() {
    /*First Level*/
    this.shortQuestionnaireForm = this.formBuilder.group({
      'bunits':  this.formBuilder.array([])
    });

    /*Second Level*/
    let i_count = 0;
    for(let i of this.shortQuestionnaireData.bunits){
      let control = this.shortQuestionnaireForm.get('bunits') as FormArray;
      control.push(this.formBuilder.group({
        'bunit' : new FormControl(i.bunit, [Validators.required]),
        'bunitValue': this.formBuilder.array([])
      }));

      /*Third Level*/
      let j_count = 0;
      for(let j of i.bunitValue){
        let control_bunitValue = control.at(i_count).get('bunitValue') as FormArray;
        control_bunitValue.push(this.formBuilder.group({
          'appName' : new FormControl(j.appName, [Validators.required]),
          'appValue': this.formBuilder.array([])
        }));

        /*Forth Level*/
        for(let k of j.appValue){
          let control_appValue = control_bunitValue.at(j_count).get('appValue') as FormArray;
          control_appValue.push(this.formBuilder.group({
            'dbName' : new FormControl(k.dbName, [Validators.required]),
            'dbValue': this.formBuilder.group({
              'database_location' : new FormControl(k.dbValue.database_location),
              'azure_location' : new FormControl(k.dbValue.azure_location),
              'db_server_type' : new FormControl(k.dbValue.db_server_type),
              'db_server_count' : new FormControl(k.dbValue.db_server_count),
              'number_cores' : new FormControl(k.dbValue.number_cores),
              'memory_server_gb' : new FormControl(k.dbValue.memory_server_gb),
              'db_server_configuration' : new FormControl(k.dbValue.db_server_configuration),
              'db_storage_provisioned' : new FormControl(k.dbValue.db_storage_provisioned),
              'database_size_gb' : new FormControl(k.dbValue.database_size_gb),
              'host_environment': new FormControl(k.dbValue.host_environment),
              'core_proc_license_factor' : new FormControl(k.dbValue.core_proc_license_factor),
              'db_work_load' : new FormControl(k.dbValue.db_work_load),
              'ha_percentage_prod' : new FormControl(k.dbValue.ha_percentage_prod),
              'dr_percentage_prod' : new FormControl(k.dbValue.dr_percentage_prod),
              'dev_test_percentage_prod' : new FormControl(k.dbValue.dev_test_percentage_prod),
              'other_env_percentage_prod' : new FormControl(k.dbValue.other_env_percentage_prod),
              'hardware_refresh_year' : new FormControl(k.dbValue.hardware_refresh_year),
              'prod_db_host_name' : new FormControl(k.dbValue.prod_db_host_name, this.getValidation(true, "")),
              'prod_db_port' : new FormControl(k.dbValue.prod_db_port, this.getValidation(true, "")),
              'prod_db_is_sid' : new FormControl(k.dbValue.prod_db_is_sid, this.getValidation(true, "")),              
              'prod_db_sid' : new FormControl(k.dbValue.prod_db_sid, this.getValidation(true, "")),
              'prod_db_service_name' : new FormControl(k.dbValue.prod_db_service_name, this.getValidation(true, "")),
              'prod_db_username' : new FormControl(k.dbValue.prod_db_username, this.getValidation(true, "")),
              'prod_db_password' : new FormControl(k.dbValue.prod_db_password, this.getValidation(true, "")),
              'prod_db_env' : new FormControl(k.dbValue.prod_db_env, this.getValidation(true, "")),
              'real_app_cluster_license' : new FormControl(k.dbValue.real_app_cluster_license),
              'real_app_cluster_node_license' : new FormControl(k.dbValue.real_app_cluster_node_license),
              'active_data_guard_license' : new FormControl(k.dbValue.active_data_guard_license),
              'real_app_testing_license' : new FormControl(k.dbValue.real_app_testing_license),
              'adv_compression_license' : new FormControl(k.dbValue.adv_compression_license),
              'adv_security_license' : new FormControl(k.dbValue.adv_security_license),
              'label_security_license' : new FormControl(k.dbValue.label_security_license),
              'database_vault_license' : new FormControl(k.dbValue.database_vault_license),
              'olap_license' : new FormControl(k.dbValue.olap_license),
              'time_10_app_tier_db_cache_license' : new FormControl(k.dbValue.time_10_app_tier_db_cache_license),
              'db_in_memory_license' : new FormControl(k.dbValue.db_in_memory_license),
              'tuning_pack_license' : new FormControl(k.dbValue.tuning_pack_license),
              'db_life_management_license' : new FormControl(k.dbValue.db_life_management_license),
              'data_masking_pack_license' : new FormControl(k.dbValue.data_masking_pack_license),
              'cloud_management_pack_license' : new FormControl(k.dbValue.cloud_management_pack_license),
              'diagnostic_pack_license' : new FormControl(k.dbValue.diagnostic_pack_license),
              'partitioning_license' : new FormControl(k.dbValue.partitioning_license),

            })
          }));
        }/*End of Forth Level*/
        j_count++
      }/*End of Third Level*/
      i_count++;
  }/*End of Second Level*/
  this.shortQuestionnaireForm.valueChanges.subscribe(newVal => {});
}

getValidation(isRequired, regex){
  return this.questionaireService.getValidatorsForControls({isRequired:isRequired, regex:regex});
}


getBunitTabContent(form, i){
  return form.controls.bunits.controls.at(i).controls.bunitValue.controls;
}

submit(ev:Event) {
  if (!this.validateArraySectionForm(ev['appName'], ev['dbName'])) {
    this.getSectionFormValidationErrors(ev['appName'], ev['dbName']);
    this.errorInValidForm = true;
    return;
  } else {
    this.errorInValidForm = false;    
    let copiedShortQuestionnaireForm = ld.cloneDeep(this.shortQuestionnaireForm);
    // find current active tab
    copiedShortQuestionnaireForm.value.bunits = copiedShortQuestionnaireForm.value.bunits.filter(x => x.bunit == this.getCurrentActiveTab());
    // find submitted app section
    copiedShortQuestionnaireForm.value.bunits[0].bunitValue = copiedShortQuestionnaireForm.value.bunits[0].bunitValue.filter(y => y.appName == ev['appName']);
    // find submitted database
    copiedShortQuestionnaireForm.value.bunits[0].bunitValue[0].appValue = copiedShortQuestionnaireForm.value.bunits[0].bunitValue[0].appValue.filter(z => z.dbName == ev['dbName']);
    let reqPayload = copiedShortQuestionnaireForm.value;
    this.spinner.show();    
    this.datalistService.submit_database_details_questionnaire_data(reqPayload).subscribe(data => {
      const requireFieldMissingStatus = this.checkIfAppDBIntakeFilled(ev['appName'], ev['dbName']);
      this.processApiResponse(data, requireFieldMissingStatus);
    });
  }
}

  checkIfAppDBIntakeFilled(appName, dbName) {
    let labels = {
      'database_location' : 'DB Server Location',
      'azure_location' : 'Azure Location',
      'db_server_type' : 'DB Server Type',
      'db_server_count' : 'DB Server (#)',
      'number_cores' : 'Cores (#)',
      'memory_server_gb' : 'DB Server RAM (GB)',
      'db_server_configuration' : 'DB Server Configuration',
      'db_storage_provisioned' : 'Storage Provisioned (in GB)',
      'database_size_gb' : 'Storage Utilized (in GB)',
      'host_environment': 'Host Enviornment',
      'core_proc_license_factor' : 'Oracle Core Processor Licensing Factor',
      'db_work_load' : 'Workload Type',
      'ha_percentage_prod' : 'HA as % of Prod',
      'dr_percentage_prod' : 'DR as % of Prod',
      'dev_test_percentage_prod' : 'Dev & Test as % of Prod',
      'other_env_percentage_prod' : 'Other Env as % of Prod',
      'hardware_refresh_year' : 'Hardware Refresh Time Period (in years)',
    }
    let unfilled_fields = [];
    if (this.shortQuestionnaireForm
      && this.shortQuestionnaireForm.controls
      && this.shortQuestionnaireForm.controls.bunits
      && this.shortQuestionnaireForm.controls.bunits['controls']
      && this.shortQuestionnaireForm.controls.bunits['controls'].length > 0) {
      this.shortQuestionnaireForm.controls.bunits['controls'].forEach(tab => { // first tab level
        if (tab.controls.bunit.value == this.getCurrentActiveTab()) {
          tab.controls.bunitValue.controls.forEach(appLevel => { // second app level
            if (appLevel.controls.appName.value == appName) {
              appLevel.controls.appValue.controls.forEach(dbLevel => { // third db level
                if (dbLevel.controls.dbName.value == dbName) {
                  Object.keys(dbLevel.controls.dbValue.controls).forEach(key => {
                    if (labels[key]) {
                      const controlValue = dbLevel.controls.dbValue.get(key).value;
                      if (!controlValue) {
                        unfilled_fields.push(labels[key])
                      }
                    }
                  });
                }
              });
            }
          });
        }
      });
      unfilled_fields = [...new Set(unfilled_fields)];
      let message = "Production database details have been submitted successfully. Please fill the below required(*) fields in order to submit DB Intake form.<br> "
      if(unfilled_fields.length>0){
        for (let i = 0; i < unfilled_fields.length; i++) {
          message = message+'- '+unfilled_fields[i] + '<br>'
        }
      }
      return {
        "message": message,
        "unfilled_fields": unfilled_fields 
      };
    }
  }

  getSectionFormValidationErrors(appName, dbName) {
    let labels = {
      'prod_db_host_name' : 'Database Host URL / IP address',
      'prod_db_port' : 'Port',
      'prod_db_is_sid' : 'Select SID or Service Name',
      'prod_db_sid' : 'SID',
      'prod_db_service_name' : 'Service Name',
      'prod_db_username' : 'Username',
      'prod_db_password' : 'Password',
      'prod_db_env' : 'Environment'
    }
    let unfilled_fields = [];
    if (this.shortQuestionnaireForm
      && this.shortQuestionnaireForm.controls
      && this.shortQuestionnaireForm.controls.bunits
      && this.shortQuestionnaireForm.controls.bunits['controls']
      && this.shortQuestionnaireForm.controls.bunits['controls'].length > 0) {
      this.shortQuestionnaireForm.controls.bunits['controls'].forEach(tab => { // first tab level
        if (tab.controls.bunit.value == this.getCurrentActiveTab()) {
          tab.controls.bunitValue.controls.forEach(appLevel => { // second app level
            if (appLevel.controls.appName.value == appName) {
              appLevel.controls.appValue.controls.forEach(dbLevel => { // third db level
                if (dbLevel.controls.dbName.value == dbName) {
                  Object.keys(dbLevel.controls.dbValue.controls).forEach(key => {
                    const controlErrors: ValidationErrors = dbLevel.controls.dbValue.get(key).errors;
                    if (controlErrors != null) {
                      Object.keys(controlErrors).forEach(keyError => {
                        if(keyError== 'required')
                          unfilled_fields.push(labels[key])
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
      unfilled_fields = [...new Set(unfilled_fields)];
      let message = "Please fill the below required(*) fields before submitting:<br> "
      if(unfilled_fields.length>0){
        for (let i = 0; i < unfilled_fields.length; i++) {
          message = message+'- '+unfilled_fields[i] + '<br>'
        }
        this.openAlert(message)
      }
    }
  }

  clear(ev:Event) {
    if (this.shortQuestionnaireForm
      && this.shortQuestionnaireForm.controls
      && this.shortQuestionnaireForm.controls.bunits
      && this.shortQuestionnaireForm.controls.bunits['controls']
      && this.shortQuestionnaireForm.controls.bunits['controls'].length > 0) {
      this.shortQuestionnaireForm.controls.bunits['controls'].forEach(tab => { // first tab level
        if (tab.controls.bunit.value == this.getCurrentActiveTab()) {
          tab.controls.bunitValue.controls.forEach(appLevel => { // second app level
            if (appLevel.controls.appName.value == ev['appName']) {
              appLevel.controls.appValue.controls.forEach(dbLevel => { // third db level
                if (dbLevel.controls.dbName.value == ev['dbName']) {
                  let dbValue = dbLevel.controls.dbValue;
                  dbValue.get('database_location').reset();
                  dbValue.get('adv_compression_license').reset();
                  dbValue.get('azure_location').reset();
                  dbValue.get('db_server_type').reset();
                  dbValue.get('db_server_count').reset();
                  dbValue.get('number_cores').reset();
                  dbValue.get('memory_server_gb').reset();
                  dbValue.get('db_server_configuration').reset();
                  dbValue.get('db_storage_provisioned').reset();
                  dbValue.get('database_size_gb').reset();

                  dbValue.get('host_environment').reset();
                  dbValue.get('core_proc_license_factor').reset();
                  dbValue.get('db_work_load').reset();
                  dbValue.get('ha_percentage_prod').reset();
                  dbValue.get('dr_percentage_prod').reset();
                  dbValue.get('dev_test_percentage_prod').reset();
                  dbValue.get('other_env_percentage_prod').reset();
                  dbValue.get('hardware_refresh_year').reset();
                  dbValue.get('real_app_cluster_license').reset();

                  dbValue.get('real_app_cluster_node_license').reset();
                  dbValue.get('active_data_guard_license').reset();
                  dbValue.get('real_app_testing_license').reset();
                  dbValue.get('adv_security_license').reset();
                  dbValue.get('label_security_license').reset();
                  dbValue.get('database_vault_license').reset();
                  dbValue.get('olap_license').reset();
                  dbValue.get('time_10_app_tier_db_cache_license').reset();

                  dbValue.get('db_in_memory_license').reset();
                  dbValue.get('tuning_pack_license').reset();
                  dbValue.get('db_life_management_license').reset();
                  dbValue.get('data_masking_pack_license').reset();
                  dbValue.get('cloud_management_pack_license').reset();
                  dbValue.get('diagnostic_pack_license').reset();
                  dbValue.get('partitioning_license').reset();

                  dbValue.get('prod_db_host_name').reset();
                  dbValue.get('prod_db_port').reset();
                  dbValue.get('prod_db_is_sid').reset();
                  dbValue.get('prod_db_sid').reset();
                  dbValue.get('prod_db_service_name').reset();
                  dbValue.get('prod_db_username').reset();
                  dbValue.get('prod_db_password').reset();
                  dbValue.get('partitioning_license').reset();
                  dbValue.get('prod_db_env').reset();
                }
              });
            }
          });
        }
      });
    }
  }



submitAll(){
  if(!this.validateArrayForm()){
    this.getFormValidationErrors();
    this.errorInValidForm = true;
    return;
  }else{
    this.errorInValidForm = false;
    let req_obj = this.shortQuestionnaireForm.value;
    this.spinner.show();
    this.datalistService.submit_database_details_questionnaire_data(req_obj).subscribe(data => {
      this.processApiResponse(data);
    });

  }
}


  getCurrentActiveTab() {    
    let currentTab = "";
    let tabArea:any = document.getElementById('nav-tab');
    if (tabArea) {
      let tabContent = tabArea.getElementsByClassName('active');
      if (tabContent && tabContent.length>0) {
        currentTab = tabContent[0].innerText;
      }
    }    
    return currentTab;
  }


getFormValidationErrors() {
  let unfilled_fields = [];
  let emptyDB = [];
  if (this.shortQuestionnaireForm
    && this.shortQuestionnaireForm.controls
    && this.shortQuestionnaireForm.controls.bunits
    && this.shortQuestionnaireForm.controls.bunits['controls']
    && this.shortQuestionnaireForm.controls.bunits['controls'].length > 0) {
    this.shortQuestionnaireForm.controls.bunits['controls'].forEach(tab => { // first tab level
      if (tab.controls.bunit.value == this.getCurrentActiveTab()) {
        tab.controls.bunitValue.controls.forEach(appLevel => { // second app level
          appLevel.controls.appValue.controls.forEach(dbLevel => { // third db level
            Object.keys(dbLevel.controls.dbValue.controls).forEach(key => {
              const controlErrors: ValidationErrors = dbLevel.controls.dbValue.get(key).errors;
              if (controlErrors != null) {
                emptyDB.push(dbLevel.controls.dbName.value);
              }
            });
          });
        });
      }
    });
    emptyDB = [...new Set(emptyDB)];
    let message = "DB Details are not entered for below database(s). Please note that its DB peformance, TCO, App & DB Intake reports cannot be generated.<br><br> "
    if (emptyDB.length>0) {
      for (let i = 0; i < emptyDB.length; i++) {
        message = message+'- '+emptyDB[i] + '<br>'
      }
      const modalRef = this.modalService.open(DmapAlertDialogModal);
      modalRef.componentInstance.data = {msg: message, title : 'Alert'};
      modalRef.result.then((result) => {
        if (result === 'ok') {
          this.activeModal.close('cancel');
          let copiedShortQuestionnaireForm = ld.cloneDeep(this.shortQuestionnaireForm);
          // find current active tab
          copiedShortQuestionnaireForm.value.bunits = copiedShortQuestionnaireForm.value.bunits.filter(x => x.bunit == this.getCurrentActiveTab());
          // find submitted app section
          copiedShortQuestionnaireForm.value.bunits[0].bunitValue.forEach(app => {
            // find submitted database
            app.appValue = app.appValue.filter(y => !emptyDB.includes(y.dbName))
          });
          copiedShortQuestionnaireForm.value.bunits[0].bunitValue = copiedShortQuestionnaireForm.value.bunits[0].bunitValue
            .filter(xy => xy.appValue.length > 0);
          if (copiedShortQuestionnaireForm.value.bunits[0].bunitValue.length>0) {
            let reqPayload = copiedShortQuestionnaireForm.value;
            this.spinner.show();
            this.datalistService.submit_database_details_questionnaire_data(reqPayload).subscribe(data => {
              this.processApiResponse(data);
            });
          }
        }
      });
    }
  }
}

openAlert(msg){
  const modalRef = this.modalService.open(DmapAlertDialogModal, {size: 'lg', scrollable: true});
  modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
  modalRef.result.then((result) => {
    if ( result === 'ok') {
      this.cancel();
    }
  });
}

  validateArraySectionForm(appName, dbName) {
    let isValid = true;
    if (this.shortQuestionnaireForm
      && this.shortQuestionnaireForm.controls
      && this.shortQuestionnaireForm.controls.bunits
      && this.shortQuestionnaireForm.controls.bunits['controls']
      && this.shortQuestionnaireForm.controls.bunits['controls'].length > 0) {
      this.shortQuestionnaireForm.controls.bunits['controls'].forEach(tab => { // first tab level
        if (tab.controls.bunit.value == this.getCurrentActiveTab()) {
          tab.controls.bunitValue.controls.forEach(appLevel => { // second app level
            if (appLevel.controls.appName.value == appName) {
              appLevel.controls.appValue.controls.forEach(dbLevel => { // third db level
                if (dbLevel.controls.dbName.value == dbName && dbLevel.status == 'INVALID') {
                  isValid = false;
                }
              });
            }
          });
        }
      });
    }
    return isValid;
  }

  validateArrayForm(){
    let isValid = true;    
    Object.keys(this.shortQuestionnaireForm.controls).forEach(key => {
      if(this.shortQuestionnaireForm.get(key).invalid){
        this.shortQuestionnaireForm.get(key).markAsTouched();
        this.shortQuestionnaireForm.get(key).markAsDirty();
        isValid = false
      }
    });

    let bunits = this.shortQuestionnaireForm.get('bunits') as FormArray;
    for(let i of bunits.controls){
      let bunitValue = i.get('bunitValue') as FormArray;
      for(let j of bunitValue.controls){
        // if(j.get('appLoc').invalid){
        //   j.get('appLoc').markAsTouched();
        //   j.get('appLoc').markAsDirty();
        //   isValid = false;
        // }

        // let appValue = j.get('appValue') as FormArray;
        // for(let k of appValue.controls){
        //   let dbValue = k.get('dbValue');
        // }
      }
    }

    return isValid;
  }

  clearAll(){

    let bunits = this.shortQuestionnaireForm.get('bunits') as FormArray;
    for(let i of bunits.controls){
      let bunitValue = i.get('bunitValue') as FormArray;
      for(let j of bunitValue.controls){
        // j.get('appLoc').reset();
        let appValue = j.get('appValue') as FormArray;
        for(let k of appValue.controls){
          let dbValue = k.get('dbValue');
          dbValue.get('database_location').reset();
          dbValue.get('adv_compression_license').reset();
          dbValue.get('azure_location').reset();
          dbValue.get('db_server_type').reset();
          dbValue.get('db_server_count').reset();
          dbValue.get('number_cores').reset();
          dbValue.get('memory_server_gb').reset();
          dbValue.get('db_server_configuration').reset();
          dbValue.get('db_storage_provisioned').reset();
          dbValue.get('database_size_gb').reset();

          dbValue.get('host_environment').reset();
          dbValue.get('core_proc_license_factor').reset();
          dbValue.get('db_work_load').reset();
          dbValue.get('ha_percentage_prod').reset();
          dbValue.get('dr_percentage_prod').reset();
          dbValue.get('dev_test_percentage_prod').reset();
          dbValue.get('other_env_percentage_prod').reset();
          dbValue.get('hardware_refresh_year').reset();
          dbValue.get('real_app_cluster_license').reset();

          dbValue.get('real_app_cluster_node_license').reset();
          dbValue.get('active_data_guard_license').reset();
          dbValue.get('real_app_testing_license').reset();
          dbValue.get('adv_security_license').reset();
          dbValue.get('label_security_license').reset();
          dbValue.get('database_vault_license').reset();
          dbValue.get('olap_license').reset();
          dbValue.get('time_10_app_tier_db_cache_license').reset();

          dbValue.get('db_in_memory_license').reset();
          dbValue.get('tuning_pack_license').reset();
          dbValue.get('db_life_management_license').reset();
          dbValue.get('data_masking_pack_license').reset();
          dbValue.get('cloud_management_pack_license').reset();
          dbValue.get('diagnostic_pack_license').reset();
          dbValue.get('partitioning_license').reset();

          dbValue.get('prod_db_host_name').reset();
          dbValue.get('prod_db_port').reset();
          dbValue.get('prod_db_is_sid').reset();
          dbValue.get('prod_db_service_name').reset();
          dbValue.get('prod_db_is_sid').reset();
          dbValue.get('prod_db_sid').reset();
          dbValue.get('prod_db_service_name').reset();
          dbValue.get('prod_db_username').reset();
          dbValue.get('prod_db_password').reset();
          dbValue.get('prod_db_env').reset();
        }
      }
    }

  }

  cancel() {
    this.activeModal.close('cancel');
  }
  openApplicationUploadModal(){
    let fileType = '';
    let sampleFile = '';
    let msg = '';
    fileType = 'databaseDetails'
    sampleFile = '/assets/sampleTemplates/DatabaseDetails.xlsx'
    msg = 'Please click the icon to browse or drag & drop excel file to upload database details.'

    const modalRef = this.modalService.open(FileUploadModalComponent, {size: 'lg', scrollable: true});

    modalRef.componentInstance.data = {'fileType':fileType, 'sampleFile': sampleFile, 'isSampleFileShow':true,"message": msg};

    modalRef.result.then((result) => {

        if ( result == 'ok') {
          this.openAlert('File uploaded successfully.');
          this.get_database_details_data();
      } else {
        if(result != 'cancel') this.openAlert('Something went wrong. Please try again.');
      }
    });
  }

  processApiResponse(data: any, processApiResponse?:any) {
    this.spinner.hide();
    if (data.status === 'success') {
      (processApiResponse && processApiResponse.unfilled_fields && processApiResponse.unfilled_fields.length == 0) || (!processApiResponse)
        ? this.openAlert("Database details submitted successfully.")
        : this.openAlert(processApiResponse.message);
    } else {
      this.openAlert(data.message);
    }
  }
}
