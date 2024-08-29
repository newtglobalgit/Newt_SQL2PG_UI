import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-short-questionnaire-template',
  templateUrl: './short-questionnaire-template.component.html',
  styleUrls: ['./short-questionnaire-template.component.css']
})
export class ShortQuestionnaireTemplateComponent implements OnInit {
  @Input() shortQuestionnaireForm: FormGroup;
  @Input() content: any;
  constructor() { }

  ngOnInit() {
  }
  
  

  getAppControls(form){
    return form.controls;
  }

  getAppvalue(form){
    return form.controls.appValue.controls;
  }

  getDBName(control){  
    return control.get('dbName').value;
  }

  getAppName(control){
    return control.get('appName').value;
  }

  getDBControls(form){
    return form.controls.dbValue;
  }

  isAppLOCValid(form, key){
    return form.get(key).invalid;
  }
  
  isNotValid(form, key){
    return form.controls.dbValue.get(key).invalid;
  }
}
