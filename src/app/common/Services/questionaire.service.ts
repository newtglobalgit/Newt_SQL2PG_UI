import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

import commonData from '../../../assets/questionaire/db_details/db_common_tab.json';
import ownerData from '../../../assets/questionaire/db_details/db_owner_tab.json';
import hardwareData from '../../../assets/questionaire/db_details/db_hardware_tab.json';
import envData from '../../../assets/questionaire/db_details/db_env_tab.json';
import licenseData from '../../../assets/questionaire/db_details/db_license_tab.json';
import applicationRelatedData from '../../../assets/questionaire/db_details/fn_application_related_details.json';
import oracleTechData from '../../../assets/questionaire/db_details/fn_oracle_tech.json';
import oracleSecurityData from '../../../assets/questionaire/db_details/fn_oracle_security.json';
import hrDrMigData from '../../../assets/questionaire/db_details/fn_hrdr_migration.json';
import tcoCommonData from '../../../assets/questionaire/tco_details/tco_common.json';
import tcoOracleCostData from '../../../assets/questionaire/tco_details/tco_oracle_cost_data.json';
import tcoDCHardwareData from '../../../assets/questionaire/tco_details/tco_dc_hardware_data.json';
import tcoDCRealEstateseData from '../../../assets/questionaire/tco_details/tco_dc_real_estates_data.json';

import appoCommonData from '../../../assets/questionaire/application_details/app_detail_tab.json';
import appOwnerData from '../../../assets/questionaire/application_details/app_owner_tab.json';
import appTechData from '../../../assets/questionaire/application_details/app_tech_tab.json';
import appFunctionalData from '../../../assets/questionaire/application_details/app_func_tab.json';
import shortDCRealEstateseData from '../../../assets/json/short_questionnaire_json.json';

import appDetails from '../../../assets/questionaire/application_assesment/application_details.json';
import appIntegration from '../../../assets/questionaire/application_assesment/application_integration.json';
import databaseServers from '../../../assets/questionaire/application_assesment/database_servers.json';
import appDocumentation from '../../../assets/questionaire/application_assesment/documentation.json';

import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class QuestionaireService {
  /* DB Questionaire Variables*/  
  COMMON_DETAILS:any[] = []
  OWNER_CONTACTS:any[] = []
  HARDWARE_DETAILS:any[]= []
  ENV_DETAILS:any[] = []
  LICENSE_DETAILS:any[] = []   

  /* Functional Related Details */
  APP_RELATED_DETAILS:any[] = []
  ORACLE_TECH_DETAIL:any[] = []  
  ORACLE_SECURITY_DETAIL:any[] = []  
  HA_DR_MIGRATION_DETAILS:any[] = [] 

  TCO_COMMON_DETAILS:any
  TCO_ORACLE_DETAIL:any[] = []
  TCO_DATA_CENTER_HARDWARE_COST:any[] = []
  TCO_DATA_CENTER_REAL_ESTATE:any[] = []

  APP_COMMON_DETAILS:any[] = []
  APP_OWNER_DETAIL:any[] = []
  APP_TECH_STACK_DETAILS:any[] = []
  APP_FUNCTIONAL_DETAILS:any[] = []
  
  
  APP_DETAILS:any[] = []
  APP_INTEGRATION:any[] = []
  DATABASE_SERVERS:any[] = []
  APP_DOCUMENTATION:any[] = []
  

  //regexp_number = /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm
  regexp_number = /^(0|[1-9]\d*)(\.\d+)?$/
  regexp_email = /\S+@\S+\.\S+/
  regexp_percentage =/^\d+(\.\d+)?$/
  regexp_designation=/^.{1,50}$/

  constructor(private http: HttpClient) { }
  
  // getCommonControls():Promise<any>  {
  //   const promise = this.http.get('assets/questionaire/db_details/common_tab.json')
  //     .toPromise()
  //     .then(data => {
  //       let response = data;
  //       console.log('In getCommonControls()')
  //       console.log(response)
  //       return response;
  //     });
  //   return promise;
  // }

  // getJSON(fileLocation): Observable<any> {
  //   return this.http.get(fileLocation);
  // }

  

  // getOwnersTabControls(){
  //   this.getJSON('assets/questionaire/db_details/owner_tab.json').subscribe(data => {
  //     console.log(data);
  //     return data;
  //   });
  // }

  // // getOwnersTabControls():Promise<any>  {
  // //   const promise = this.http.get('assets/questionaire/db_details/owner_tab.json')
  // //     .toPromise()
  // //     .then(data => {
  // //       let response = data;
  // //       console.log('In getOwnersTabControls()')
  // //       console.log(response)
  // //       return response;
  // //     });
  // //   return promise;
  // // }

  getShortQuestionnaireData() {
    return shortDCRealEstateseData;
  }

  getValidatorsForControls(control:any){
    let validators:any[] = [];
    if(control.isRequired){
      validators.push(Validators.required);
    }
    if(control.regex.length > 0){ 
      if(control.regex == 'number')  {validators.push(Validators.pattern(this.regexp_number))}
      if(control.regex == 'email')  {validators.push(Validators.pattern(this.regexp_email))}
      if(control.regex == 'percentage')  {validators.push(Validators.pattern(this.regexp_percentage))}
      if(control.regex == 'designation')  {validators.push(Validators.pattern(this.regexp_designation))}
    }
  
    return validators;
  }

  getTCOFields(){
    this.TCO_COMMON_DETAILS = tcoCommonData.data;
    this.TCO_ORACLE_DETAIL = tcoOracleCostData.data;
    this.TCO_DATA_CENTER_HARDWARE_COST = tcoDCHardwareData.data;
    this.TCO_DATA_CENTER_REAL_ESTATE = tcoDCRealEstateseData.data;

    let TCO_DETAILS = {tcoDetails:[
      {seq: 1, tabLabel: 'Oracle License Cost Details', controls: this.TCO_ORACLE_DETAIL},
      {seq: 2, tabLabel: 'Data Center Hardware Cost Details', controls: this.TCO_DATA_CENTER_HARDWARE_COST},
      {seq: 3, tabLabel: 'Data Center Estates & Power Details', controls: this.TCO_DATA_CENTER_REAL_ESTATE}
     ],
     tcoCommonDetail: this.TCO_COMMON_DETAILS 
    }
    return TCO_DETAILS;

  }

  getfunctionalDetails(){
    this.APP_RELATED_DETAILS = applicationRelatedData.data;
    this.ORACLE_TECH_DETAIL = oracleTechData.data;
    this.ORACLE_SECURITY_DETAIL = oracleSecurityData.data;
    this.HA_DR_MIGRATION_DETAILS = hrDrMigData.data;

    let FUNCTIONAL_DETAILS = {FNDetail:[
      {seq: 1, tabLabel: 'Application Related', controls: this.APP_RELATED_DETAILS},
      {seq: 2, tabLabel: 'Oracle Technical Features', controls: this.ORACLE_TECH_DETAIL},
      {seq: 3, tabLabel: 'Oracle Security Features', controls: this.ORACLE_SECURITY_DETAIL},
      {seq: 4, tabLabel: 'HA DR and Migration Related', controls: this.HA_DR_MIGRATION_DETAILS}
     ]}
    return FUNCTIONAL_DETAILS;
  }

  getDBFields(){
    this.COMMON_DETAILS = commonData.data;
    this.OWNER_CONTACTS = ownerData.data;
    this.HARDWARE_DETAILS = hardwareData.data;
    this.ENV_DETAILS = envData.data;
    this.LICENSE_DETAILS = licenseData.data;
    
    let index = this.COMMON_DETAILS.findIndex(x => x.key === "azure_location");
    this.COMMON_DETAILS[index].ui_control.options.sort();

    let DB_DETAILS = {DBDetails:[
      {seq: 1, tabLabel: 'Owners Contact', controls: this.OWNER_CONTACTS},
      {seq: 2, tabLabel: 'Hardware Details and Future Growth Rate', controls: this.HARDWARE_DETAILS},
      {seq: 3, tabLabel: 'Environment Details', controls: this.ENV_DETAILS},
      {seq: 4, tabLabel: 'Oracle License', controls: this.LICENSE_DETAILS}
     ],
     DBCommonDetails: this.COMMON_DETAILS
    }

    return DB_DETAILS;
  }
  
  getAppDetails(){
    this.APP_COMMON_DETAILS = appoCommonData.data;
    this.APP_OWNER_DETAIL = appOwnerData.data;
    this.APP_TECH_STACK_DETAILS = appTechData.data;
    this.APP_FUNCTIONAL_DETAILS = appFunctionalData.data;

    let TCO_DETAILS = {appDetails:[
      {seq: 1, tabLabel: '', controls: this.APP_COMMON_DETAILS},
      {seq: 2, tabLabel: '', controls: this.APP_OWNER_DETAIL},
      {seq: 3, tabLabel: '', controls: this.APP_TECH_STACK_DETAILS},
      {seq: 4, tabLabel: '', controls: this.APP_FUNCTIONAL_DETAILS}
     ],
     tcoCommonDetail: this.TCO_COMMON_DETAILS 
    }
    return TCO_DETAILS;

  }
  getAppAssessmentDetails(){
    
    this.APP_INTEGRATION = appIntegration.data;
    this.APP_DETAILS = appDetails.data;
    this.DATABASE_SERVERS = databaseServers.data;
    this.APP_DOCUMENTATION = appDocumentation.data;

    let APP_DETAILS = {appDetails:[
      {seq: 1, tabLabel: '', controls: this.APP_INTEGRATION},
      {seq: 2, tabLabel: '', controls: this.APP_DETAILS},
      {seq: 3, tabLabel: '', controls: this.DATABASE_SERVERS},
      {seq: 4, tabLabel: '', controls: this.APP_DOCUMENTATION}
     ],
     tcoCommonDetail: this.TCO_COMMON_DETAILS 
    }
    return APP_DETAILS;

  }
}
