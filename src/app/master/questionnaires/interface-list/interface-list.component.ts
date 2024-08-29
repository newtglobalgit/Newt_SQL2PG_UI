import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { AddInterfaceComponent } from 'src/app/common/Modal/add-interface/add-interface.component';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbdConfirmationModal } from 'src/app/common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
import { QuestionaireService } from 'src/app/common/Services/questionaire.service';
import { MinNumberValidator } from 'src/app/common/Validators/min-number-validator';
import { AppServerDetailsComponent } from '../app-server-details/app-server-details.component';


@Component({
  selector: 'app-interface-list',
  templateUrl: './interface-list.component.html',
  styleUrls: ['./interface-list.component.css']

})
export class InterfaceListComponent implements OnInit {
  intakeinterfaceForm: FormGroup;
  migrationOptions_dropdownSettings:IDropdownSettings = {};
  showUploadedArchitectureText:boolean = true;
  interface_architecture_diagram_text:any;
  firstsection: any = [
  ];

  secondsection: any = [
  ];

  thirdsection: any = [

  ];
  interface_name: any;
  disableInterfaceInput: boolean = false;

  setFieldsSectionWise() {
    if (this.masterappData && this.masterappData.length > 0) {
      this.masterappData.forEach(appData => {
        if (appData && appData.length > 0) {
          appData.forEach(field => {
            if (field && field.form_control_name == 'application_name'
              || field && field.form_control_name == 'application_id'
              || field && field.form_control_name == 'interface_name'
              || field && field.form_control_name == 'interface_id'
              || field && field.form_control_name == 'interface_location'
              || field && field.form_control_name == 'interface_spoc_name'
              || field && field.form_control_name == 'interface_spoc_email'
              || field && field.form_control_name == 'interface_description'
              || field && field.form_control_name == 'interface_architecture_diagram'
              || field && field.form_control_name == 'techstack'
              || field && field.form_control_name == 'business_criticality'
              || field && field.form_control_name == 'interface_roadmap'
              || field && field.form_control_name == 'interface_type'
              || field && field.form_control_name == 'interfacing_with'
              || field && field.form_control_name == 'primary_database_name'
              || field && field.form_control_name == 'encrytioin_required'
            ) {
                this.firstsection.push(field);

            } else if (field && field.form_control_name == 'database_connection_protocol'
              || field && field.form_control_name == 'database_connections'
              || field && field.form_control_name == 'number_of_hibernate_files'
              || field && field.form_control_name == 'Number_of_DAO_Files'
              || field && field.form_control_name == 'sql_map_files_(mybatis)'
              || field && field.form_control_name == 'embedded_plsql_statements'
              || field && field.form_control_name == 'Number_of_files_or_reports'
              || field && field.form_control_name == 'embedded_sql_files'

            ) {
                this.secondsection.push(field);
            } else if (field && field.form_control_name == 'test_cases'
              || field && field.form_control_name == 'percentage_testcases_documented'
              || field && field.form_control_name == 'percentage_testcases_automated'
              || field && field.form_control_name == 'dev_env_synced'
              || field && field.form_control_name == 'documentation'
              || field && field.form_control_name == 'cicd_pipeline'

            ) {
                this.thirdsection.push(field);
            }
          });
        }
      });
      let firstsectionTemp = [];
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'application_name'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'application_id'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'interface_name'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'interface_id'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'interface_location'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'interface_spoc_name'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'interface_spoc_email'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'interface_description'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'interface_architecture_diagram'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'techstack'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'business_criticality'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'interface_roadmap'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'interface_type'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'interfacing_with'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'primary_database_name'));
      firstsectionTemp.push(this.firstsection.find(x => x.form_control_name == 'encrytioin_required'));
      this.firstsection = [];
      this.firstsection = this.removeUndefinedValues(firstsectionTemp);

      let secondsectionTemp = [];
      secondsectionTemp.push(this.secondsection.find(x => x.form_control_name == 'database_connection_protocol'));
      secondsectionTemp.push(this.secondsection.find(x => x.form_control_name == 'database_connections'));
      secondsectionTemp.push(this.secondsection.find(x => x.form_control_name == 'number_of_hibernate_files'));
      secondsectionTemp.push(this.secondsection.find(x => x.form_control_name == 'Number_of_DAO_Files'));
      secondsectionTemp.push(this.secondsection.find(x => x.form_control_name == 'sql_map_files_(mybatis)'));
      secondsectionTemp.push(this.secondsection.find(x => x.form_control_name == 'embedded_plsql_statements'));
      secondsectionTemp.push(this.secondsection.find(x => x.form_control_name == 'Number_of_files_or_reports'));
      secondsectionTemp.push(this.secondsection.find(x => x.form_control_name == 'embedded_sql_files'));


      this.secondsection = [];
      this.secondsection = this.removeUndefinedValues(secondsectionTemp);

      let thirdsectionTemp = [];
      thirdsectionTemp.push(this.thirdsection.find(x => x.form_control_name == 'test_cases'));
      thirdsectionTemp.push(this.thirdsection.find(x => x.form_control_name == 'percentage_testcases_documented'));
      thirdsectionTemp.push(this.thirdsection.find(x => x.form_control_name == 'percentage_testcases_automated'));
      thirdsectionTemp.push(this.thirdsection.find(x => x.form_control_name == 'dev_env_synced'));
      thirdsectionTemp.push(this.thirdsection.find(x => x.form_control_name == 'documentation'));
      thirdsectionTemp.push(this.thirdsection.find(x => x.form_control_name == 'cicd_pipeline'));

      this.thirdsection = [];
      this.thirdsection = this.removeUndefinedValues(thirdsectionTemp);
    }
    this.isDataAvailable = true;
  }

  handleFileInput(files: FileList) {
    this.showUploadedArchitectureText = true;
    this.fileToUpload_architecture = files.item(0);
    this.interface_architecture_diagram_text = this.fileToUpload_architecture.name;
  }

  removeUndefinedValues(arr) {
    return arr.filter(item => item !== undefined);
  }

  getControlValue(key) {
    return this.intakeinterfaceForm.get(key).value;
  }
  isControlInValid(key) {
    return this.intakeinterfaceForm.get(key).invalid && this.intakeinterfaceForm.get(key).dirty;

  }
  masterappData: any;
  errorInValidForm: boolean = false;

  isDataAvailable: boolean = false;
  showInterfaceData: boolean = false;
  application_name: any;
  application_id: any;
  appDetails: any;
  interface_action: any;
  interface_id: any;
  appInterfaceDetails: any;
  dropdown_others_values: any = {};
  formStatus: any = 'Not Started';
  isServerValuesreadOnly: any = false;
  fileToUpload_architecture: File | null = null;
  disableServerDetails: boolean = true;
  cicd_pipeline_others:boolean = false;
  techstack_others:boolean = false;




  regexp_number = /^(0|[1-9]\d*)(\.\d+)?$/
  regexp_email = /\S+@\S+\.\S+/
  regexp_percentage = /^\d+(\.\d+)?$/
  regexp_designation = /^.{1,50}$/



  constructor(private formBuilder: FormBuilder,
    private activatedroute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private databaseListService: DatabaseListService,
    private questionaireService: QuestionaireService,
    private modalService: NgbModal ) { }

  ngOnInit(): void {
    this.intakeinterfaceForm = this.formBuilder.group({});
    this.activatedroute.queryParams.subscribe(queryParams => {
      this.appDetails = queryParams;
      this.getApplicationInterfaceDetails();
      this.application_id = this.appDetails['appId'];
      this.application_name = this.appDetails['appName'];
      this.interface_name = this.appDetails['interfaceName'];
      this.interface_action = this.appDetails['interfaceAction'];
      this.interface_id = this.appDetails['interfaceId'];
      if(this.interface_name){
        //do call edit
        this.getInterfaceDetails();
      } else{
        //do call new
      }
    });

    this.migrationOptions_dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3
    };


  }


  ngAfterViewInit(){
    this.valid();
    setTimeout(() => {
      this.valid();
    }, 4000);
  }


  addInterface() {
    const modalRef = this.modalService.open(AddInterfaceComponent, { size: 'lg', scrollable: true });
    modalRef.componentInstance.data = { 'title': 'Add Interface Details', 'appName': this.application_name, 'appId': this.application_id, 'interfaceName': '' };
    modalRef.result.then((result) => {
      //   if ( result == 'ok') {
      // }
    });
  }

  selectChange(item, key){
    if(key == 'interfacing_with'){
      if(item.target.value == 'Database'){
        for(let i=0;i<this.firstsection.length;i++){
          if(this.firstsection[i].form_control_name == 'primary_database_name'){
            this.firstsection[i].mandatory = true;
            this.intakeinterfaceForm.get('primary_database_name').setValidators(this.getValidation(true,""));
            this.intakeinterfaceForm.get('primary_database_name').updateValueAndValidity();
          }
        }
      } else if(item.target.value == 'Application') {
        for(let i=0;i<this.firstsection.length;i++){
          if(this.firstsection[i].form_control_name == 'primary_database_name'){
            this.firstsection[i].mandatory = false;
            this.intakeinterfaceForm.get('primary_database_name').setValidators(this.getValidation(false,""));
            this.intakeinterfaceForm.get('primary_database_name').updateValueAndValidity();
          }
        }
      }

    }

    if(key == "interface_type" || key  == "database_connection_protocol"){
      if(item.target.value == 'Others' || item.target.value == ' Others'){
        this.dropdown_others_values[key+'_others'] = !this.dropdown_others_values[key+'_others'];
      }

    }
  }

  getValidation(isRequired, regex){
    return this.questionaireService.getValidatorsForControls({isRequired:isRequired, regex:regex});
  }

  getApplicationInterfaceDetails() {
    // let reqObj = {'appId':this.application_id,'appName':this.application_name};
    // this.spinner.show();
    this.databaseListService.getMasterInterfaceQuestionnaireDetails({}).subscribe(response => {

      if (response.length > 0) {
        this.masterappData = response;
        this.createFormControls();
        this.setFieldsSectionWise();
        this.intakeinterfaceForm.addControl('application_id', new FormControl('',[Validators.required,]));
        this.intakeinterfaceForm.addControl('application_name', new FormControl('',[Validators.required,]));
        this.intakeinterfaceForm.get('application_id').patchValue(this.appDetails['appId']);
        this.intakeinterfaceForm.get('application_name').patchValue(this.appDetails['appName']);
        //     if(this.masterappData){
        //       this.showInterfaceData = true;
        //     }
        //     else{
        //       this.showInterfaceData = false;
        //     }
      }
      this.spinner.hide();
    }
    );

  }
  createFormControls() {
    for (let i in this.masterappData) {
      let appData = this.masterappData[i];
      for (let j in appData) {
        this.intakeinterfaceForm.addControl(appData[j].form_control_name, new FormControl([], this.getValidatorsForControls(appData[j])));
        if (appData[j].input_type == 'multi_select') {
          let key = appData[j].form_control_name + '_others';
          this.dropdown_others_values[key] = false;
          this.intakeinterfaceForm.addControl(key, new FormControl([], []));
        }

        if(appData[j].form_control_name == 'interface_type' || appData[j].form_control_name == 'database_connection_protocol'){
          let key = appData[j].form_control_name+'_others';
          this.dropdown_others_values[key] = false;
          this.intakeinterfaceForm.addControl(key, new FormControl([],[]));
        }

        if (appData[j].form_control_name == 'testing') {
          appData[j].error_msg = "Invalid format. Hint: Enter a number between 0 to 9999"
        }
        else if (appData[j].form_control_name == 'integration_points' || appData[j].form_control_name == 'server_count' || appData[j].form_control_name == 'app_databases') {
          appData[j].error_msg = "Invalid format. Hint: Enter a number between 0 to 99"
        }
      }
    }
  }



  getValidatorsForControls(control) {
    let validators: any[] = [];
    if (control.mandatory) {
      validators.push(Validators.required);
    }
    if (control.is_question_numeric) {
      validators.push(Validators.pattern(this.regexp_number));
      if (control.form_control_name == 'testing'||control.form_control_name == 'embedded_plsql_statements'||control.form_control_name == 'Number_of_files_or_reports') {
        validators.push(MinNumberValidator.range(0, 9999));
      }
      else if (control.form_control_name == 'database_connections' || control.form_control_name == 'number_of_hibernate_files' || control.form_control_name == 'Number_of_DAO_Files'|| control.form_control_name == 'embedded_sql_files'|| control.form_control_name == 'sql_map_files_(mybatis)'|| control.form_control_name == 'test_cases') {
        validators.push(MinNumberValidator.range(0, 1000));
      }
      else if (control.form_control_name == 'percentage_testcases_documented') {
        validators.push(MinNumberValidator.range(0, 100));
      }

    }

    return validators;
  }
  editInterfaceDetails(interface_name) {
    const modalRef = this.modalService.open(AddInterfaceComponent, { size: 'lg', scrollable: true });
    modalRef.componentInstance.data = { 'title': 'Edit Interface Details', 'appName': this.application_name, 'appId': this.application_id, 'interfaceName': interface_name };
    modalRef.result.then((result) => {
      //   if ( result == 'ok') {
      // }
    });

  }
  openAlert(msg, lgPopup = true) {
    let modalRef;
    if (lgPopup) {
      modalRef = this.modalService.open(DmapAlertDialogModal, { size: 'lg', scrollable: true });
    }
    else {
      modalRef = this.modalService.open(DmapAlertDialogModal);
    }

    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      // if ( result === 'ok') {
      // }
    });
  }

  removeInterfaceDetails(interface_name) {
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = { msg: 'Do you want to remove this interface?', title: 'Confirmation', okButtonLabel: 'Yes', cancelButtonLabel: 'No' };
    modalRef.result.then((result) => {
      if (result === 'ok') {
        let reqObj = { 'appId': this.application_id, 'appName': this.application_name, 'interfaceName': interface_name };
        this.databaseListService.removeApplicationInterfaceDetails(reqObj).subscribe(response => {
          this.spinner.hide();
          if (response['status']) {
            this.openAlert("Interface Details removed successfully")
          }

        });
      }
    });
  }

  clearValues(controls) {

    for (let i in this.masterappData) {
      let appData = this.masterappData[i];
      for (let j in appData) {
        if (appData[j].form_control_name != 'application_id' && appData[j].form_control_name != 'application_name') {
          this.intakeinterfaceForm.get(appData[j].form_control_name).reset();
        }
      }
    }

    this.interface_architecture_diagram_text = '';

    for (let k in this.dropdown_others_values) {
      this.dropdown_others_values[k] = false;
    }
    Object.keys(this.dropdown_others_values).forEach(key => {
      if (key.includes("_others")) {
        this.intakeinterfaceForm.get(key).reset();
      }
    });
  }

  clear() {
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = { msg: 'Are you sure you want to clear the entered details?', title: 'Confirmation', okButtonLabel: 'Ok', cancelButtonLabel: 'Cancel' };
    modalRef.result.then((result) => {
      if (result === 'ok') {
        this.clearValues(this.masterappData);
      }
    });
    this.errorInValidForm = false;
    this.isServerValuesreadOnly = false;
  }



  validateFormControls(controls) {
    let isValid = true;
    for (let i in this.masterappData) {
      let appData = this.masterappData[i];
      for (let j in appData) {
        if (this.intakeinterfaceForm.get(appData[j].form_control_name).invalid) {
          this.intakeinterfaceForm.get(appData[j].form_control_name).markAsTouched();
          this.intakeinterfaceForm.get(appData[j].form_control_name).markAsDirty();
          isValid = false
        }
      }
    }
    return isValid;
  }

  submitForm(action) {
    this.spinner.show();
    let isFormValid = true;
    if (action == 'submit') {
      if (!this.intakeinterfaceForm.valid) {
        this.getFormValidationErrors()
        this.spinner.hide();
        this.errorInValidForm = true;
        return;
      }
    } else if (action == 'save') {
      
      isFormValid = this.getFormValidationErrorssave();
    }

    if (isFormValid) {
      if (this.fileToUpload_architecture != null) {
        let appId = this.intakeinterfaceForm.get('application_id');
        this.databaseListService.postArchitectureFile(appId, this.fileToUpload_architecture).subscribe(response => {
          if (response) {
            this.submit(action);
          } else {
            this.openAlert("Failed to upload the file");
          }
        }, error => {
        });
      }
      else {
        this.submit(action);
      }
    }
    this.spinner.hide();
  }

  async submit(action) {
    let reqObj = { 'appId': this.getControlValue('application_id'), 'appName': this.getControlValue('application_name') };
    let res = await this.databaseListService.getApplicationServerDetails(reqObj).toPromise();
    if (!this.disableServerDetails && action == 'submit' && res.length != this.getControlValue('server_count')) {
      this.openAlert(`You have entered details for ${res.length} servers. Please enter details for remaining ${this.getControlValue('server_count') - res.length} servers before submitting the form`);
      return;
    }
    this.spinner.show();
    let req_obj: any = {};
    // delete this.intakeinterfaceForm.value['all_servers'];
    // delete this.intakeinterfaceForm.value['server_separately'];
    if(!this.intakeinterfaceForm.get('interface_id').valid){
      this.intakeinterfaceForm.get('interface_id').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('interface_name').valid){
      this.intakeinterfaceForm.get('interface_name').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('interface_location').valid){
      this.intakeinterfaceForm.get('interface_location').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('interface_spoc_name').valid){
      this.intakeinterfaceForm.get('interface_spoc_name').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('interface_spoc_email').valid){
      this.intakeinterfaceForm.get('interface_spoc_email').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('interface_description').valid){
      this.intakeinterfaceForm.get('interface_description').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('database_connections').valid){
      this.intakeinterfaceForm.get('database_connections').patchValue("");
    }
    if(typeof this.intakeinterfaceForm.get('number_of_hibernate_files').value != 'string'){
      this.intakeinterfaceForm.get('number_of_hibernate_files').patchValue(null);
    }

    if(typeof this.intakeinterfaceForm.get('Number_of_DAO_Files').value != 'string'){
      this.intakeinterfaceForm.get('Number_of_DAO_Files').patchValue(null);
    }
    if(typeof this.intakeinterfaceForm.get('sql_map_files_(mybatis)').value != 'string'){
      this.intakeinterfaceForm.get('sql_map_files_(mybatis)').patchValue(null);
    }
    if(!this.intakeinterfaceForm.get('embedded_plsql_statements').valid){
      this.intakeinterfaceForm.get('embedded_plsql_statements').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('Number_of_files_or_reports').valid){
      this.intakeinterfaceForm.get('Number_of_files_or_reports').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('embedded_sql_files').valid){
      this.intakeinterfaceForm.get('embedded_sql_files').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('test_cases').valid){
      this.intakeinterfaceForm.get('test_cases').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('percentage_testcases_documented').valid){
      this.intakeinterfaceForm.get('percentage_testcases_documented').patchValue("");
    }
    if(!this.intakeinterfaceForm.get('percentage_testcases_automated').valid){
      this.intakeinterfaceForm.get('percentage_testcases_automated').patchValue("");
    }

    if(!this.intakeinterfaceForm.get('business_criticality').valid){
      this.intakeinterfaceForm.get('business_criticality').patchValue(null);
    }
    if(!this.intakeinterfaceForm.get('interface_roadmap').valid){
      this.intakeinterfaceForm.get('interface_roadmap').patchValue(null);
    }
    if(!this.intakeinterfaceForm.get('interface_type').valid){
      this.intakeinterfaceForm.get('interface_type').patchValue(null);
    }
    if(!this.intakeinterfaceForm.get('interfacing_with').valid){
      this.intakeinterfaceForm.get('interfacing_with').patchValue(null);
    }
    if(!this.intakeinterfaceForm.get('encrytioin_required').valid){
      this.intakeinterfaceForm.get('encrytioin_required').patchValue(null);
    }
    if(!this.intakeinterfaceForm.get('database_connection_protocol').valid){
      this.intakeinterfaceForm.get('database_connection_protocol').patchValue(null);
    }
    if(!this.intakeinterfaceForm.get('dev_env_synced').valid){
      this.intakeinterfaceForm.get('dev_env_synced').patchValue(null);
    }
    if(!this.intakeinterfaceForm.get('documentation').valid){
      this.intakeinterfaceForm.get('documentation').patchValue(null);
    }
    if(typeof this.intakeinterfaceForm.get('techstack_others').value != 'string'){
      this.intakeinterfaceForm.get('techstack_others').patchValue("");
    }
    if(typeof this.intakeinterfaceForm.get('interface_type_others').value != 'string'){
      this.intakeinterfaceForm.get('interface_type_others').patchValue("");
    }
    if(typeof this.intakeinterfaceForm.get('database_connection_protocol_others').value != 'string'){
      this.intakeinterfaceForm.get('database_connection_protocol_others').patchValue("");
    }



    // Object.keys(this.intakeinterfaceForm).forEach(key => {
    //   if(!this.intakeinterfaceForm.get(key).valid && this.intakeinterfaceForm.get(key)){

    //   }
    //   this.intakeinterfaceForm.controls[key].markAsDirty();
    // });

    req_obj = this.intakeinterfaceForm.value;

    req_obj['action'] = action;
    req_obj['interface_action'] = this.interface_action;
    req_obj['interface_count'] = this.interface_id;

    if (this.interface_architecture_diagram_text != null && this.interface_architecture_diagram_text != ''){
      req_obj['interface_architecture_diagram'] = this.interface_architecture_diagram_text;
    } else {
      req_obj['interface_architecture_diagram'] = '';
    }

    this.databaseListService.submitAppInterfaceetails(req_obj).subscribe(response => {

      if (response.status) {
        this.formStatus = response['questionnaire_status'];
        if(this.interface_name){
          this.getInterfaceDetails();
        }

        this.spinner.hide();
        this.errorInValidForm = false;
        if (action == 'save') {
          this.formStatus='In Progress';
          this.disableInterfaceInput = true;
          this.openAlert("Interface assessment details saved successfully.", false);
        } else {
          this.formStatus='Complete';
          this.disableInterfaceInput = true;
          this.openAlert("Interface assessment details submitted successfully.", false);
        }

      } else {
        this.spinner.hide();
        this.openAlert(response.message);
      }

    });

  }

  getInterfaceDetails(){
    let reqObj = {'appId':this.appDetails['appId'],'appName':this.appDetails['appName'],'interface_name':this.appDetails['interfaceName']};
    this.spinner.show();
    this.databaseListService.getInterfaceDetails(reqObj).subscribe(response => {

      if (response.length > 0){
        let appData = response[0];
        this.formStatus = appData['questionnaire_status'];
        Object.keys(appData).forEach(key => {
          if (key != 'interface_architecture_diagram' && key != 'application_id' && key != 'application_name' && key!='questionnaire_status' && this.intakeinterfaceForm.get(key)){

            this.intakeinterfaceForm.get(key).patchValue(appData[key]);
          }
          if (key.indexOf('_others')){
            if (appData[key]){
              this.dropdown_others_values[key] = true;
            }
          }
          if (key == 'interface_architecture_diagram'){
            this.interface_architecture_diagram_text = appData[key];
            //this.intakeinterfaceForm.get(key).patchValue(appData[key]);
            this.showUploadedArchitectureText = true;
          }
        });


      }
      this.isDataAvailable = true;
      this.spinner.hide();
    });
    this.valid();
  }

  valid(){
    var nameObj = document.getElementsByName("testing");
    for(var i=0; i<nameObj.length; i++){
        nameObj[i].click();
    }
  }

  getFormValidationErrors() {
    let labels = {
      application_name:'Application Name',
      application_id:'Application ID',
      interface_name: 'Interface Name',
      interface_id: 'Interface ID',
      interface_location: 'Interface Location',
      interface_spoc_name: 'Interface SPOC Name',
      interface_spoc_email: 'Interface SPOC Email',
      primary_database_name:"Primary Database Name",
      interface_description: 'Interface Description & Special Considerations',
      techstack: 'Tech stack',
      business_criticality: 'Business Criticality',
      interface_roadmap: 'Interface Roadmap',
      interface_type: 'Interface Type',
      interfacing_with: 'Interfacing With',
      encrytioin_required: 'Requires Encryption (TLS/SSL)',
      database_connections: 'Number of Database Connections',
      embedded_plsql_statements: 'Number of Embedded PL/SQL statements in all files',
      Number_of_files_or_reports:'Total Number of files/reports',
      embedded_sql_files: 'Number of <files/reports> having embedded SQL',
      test_cases: 'Number of Test Cases',
      percentage_testcases_documented: 'Percentage of Test Cases Documented',
      percentage_testcases_automated: 'Percentage of Test Cases Automated',
      dev_env_synced: 'Is Dev environment code in sync with production codebase?',
      documentation: 'Documentation',
      cicd_pipeline: 'CICD Pipeline',
      cicd_pipeline_others:'CICD Pipeline others'
    }
    let unfilled_fields = []
    this.logErrorsAndTrackFields(this.intakeinterfaceForm, labels, unfilled_fields);
    let message = "Please fill the below required(*) fields before submitting:<br> "
    let filter_list = unfilled_fields.filter(fill => fill !== undefined)
    if (filter_list.length > 0) {
      for (let i = 0; i < filter_list.length; i++) {
        message = message + '- ' + filter_list[i] + '<br>'
      }

      this.openAlert(message)

    }

  }
  getFormValidationErrorssave() {
    let labels = {
      interface_name: 'Interface Name',
      interface_id: 'Interface ID'
    }
    let unfilled_fields = []
    this.logErrorsAndTrackFields(this.intakeinterfaceForm, labels, unfilled_fields);
    let message = "Please fill the below required(*) fields before saving:<br> "
    let filter_list = unfilled_fields.filter(fill => fill !== undefined)
    if (filter_list.length > 0) {
      for (let i = 0; i < filter_list.length; i++) {
        message = message + '- ' + filter_list[i] + '<br>'
      }

      this.openAlert(message)
      return false;
    }
   return true;
  }
  onItemSelect(item: any,key) {
    if (item == 'Others'){
      this.dropdown_others_values[key+'_others'] = !this.dropdown_others_values[key+'_others'];
    }
  }

  // onItemDeSelect(item: any,key) {
  //   if (item == 'Others'){
  //     this.dropdown_others_values[key+'_others'] = !this.dropdown_others_values[key+'_others'];
  //   }
  // }

  onSelectAll(items: any,key) {
    if (items.includes('Others')){
      this.dropdown_others_values[key+'_others'] = true;
    }
  }
  onDeSelectAll(items: any,key) {
    this.dropdown_others_values[key+'_others'] = false;
  }

  onSelect(item: any,key){
    console.log(item,key);
  }
  serverCount() {
    let appServerDetails;
    let currentServerDetailsCount;
    let server_count = this.getControlValue('server_count');
    if (!server_count || server_count == 0) {
      this.openAlert("Please enter valid server count before continuing to add details for each server.");
      return;
    }
    this.spinner.show();
    let reqObj = { 'appId': this.getControlValue('application_id'), 'appName': this.getControlValue('application_name') };
    this.databaseListService.getApplicationServerDetails(reqObj).subscribe(response => {
      if (response.length > 0) {
        appServerDetails = response;
        currentServerDetailsCount = response.length

      }
      const modalRef = this.modalService.open(AppServerDetailsComponent, { size: 'lg', scrollable: true });
      modalRef.componentInstance.data = { 'title': 'Enter Infra Structure Details', 'server_count': server_count, 'appServerDetails': appServerDetails, 'currentServerDetailsCount': currentServerDetailsCount };
      modalRef.result.then((result) => {
        if (result > 0) {
          this.isServerValuesreadOnly = true;
        }
        else {
          if (this.disableServerDetails) {
            this.isServerValuesreadOnly = false;
          } else {
            this.intakeinterfaceForm.get('servers_core').patchValue(0);
            this.intakeinterfaceForm.get('servers_ram').patchValue(0);
            this.intakeinterfaceForm.get('servers_storage').patchValue(0);
            this.isServerValuesreadOnly = true;
          }
        }
        let obj = { 'appName': this.getControlValue('application_name') };
        this.databaseListService.getServerRequiredValuesByApplication(obj).subscribe(response => {

          if (response.length > 0) {
            let appData = response[0];
            Object.keys(appData).forEach(key => {
              if (key == 'servers_core' || key == 'servers_ram' || key == 'servers_storage') {

                this.intakeinterfaceForm.get(key).patchValue(appData[key] ? appData[key] : 0);
              }
            });
          }
        });

      });
      // modalRef.componentInstance.updatedValues.subscribe(
      // );
      this.spinner.hide();
    });



  }

  logErrorsAndTrackFields(formGroup: FormGroup, labels: any, unfilledFields: string[]) {
    Object.keys(formGroup.controls).forEach(key => {
      const controlErrors: ValidationErrors = formGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          if (keyError == 'required') {
            unfilledFields.push(labels[key]);
          }
        });
      }
    });
  }

}


