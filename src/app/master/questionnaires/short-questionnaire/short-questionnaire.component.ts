
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
import { QuestionaireService } from 'src/app/common/Services/questionaire.service';
declare var $: any;
import 'jqueryui';
import { PopupDraggableService } from 'src/app/common/Services/popup-draggable.service';

@Component({
  selector: 'app-short-questionnaire',
  templateUrl: './short-questionnaire.component.html',
  styleUrls: ['./short-questionnaire.component.css']
})
export class ShortQuestionnaireComponent implements OnInit {
  shortQuestionnaireData:any;/* = {"client_name":"Blue Sky Inc","client_executive":"Blue Sky Inc",
  "bunits":[{"bunit":"Communication","bunitValue":[{"appName":"COMM1",
                            "appLoc":null,
                            "appValue":[{"dbName":"ORCLDB6",
                                   "dbValue":{"database_size_gb":null,
                                        "number_cores":128,
                                        "memory_server_gb":null,
                                        "data_size_growth_percentage":8,
                                        "num_socket":''}
                                 }]
                            },
                            {"appName":"COMM3",
                            "appLoc":2900000,
                            "appValue":[{"dbName":"ORCL",
                                   "dbValue":{"database_size_gb":32000,
                                        "number_cores":16,
                                        "memory_server_gb":32000,
                                        "data_size_growth_percentage":8,
                                        "num_socket":null}
                                 },
                                 {"dbName":"ORCLDB3",
                                   "dbValue":{"database_size_gb":32000,
                                        "number_cores":16,
                                        "memory_server_gb":32000,
                                        "data_size_growth_percentage":10,
                                        "num_socket":4}
                                 }]
                            },
                            {"appName":"DMAP",
                            "appLoc":null,
                            "appValue":[{"dbName":"ORCLDB5",
                                   "dbValue":{"database_size_gb":'',
                                        "number_cores":64,
                                        "memory_server_gb":4086,
                                        "data_size_growth_percentage":8,
                                        "num_socket":null}
                                 }]
                           }]
        },
        // {"bunit":"Manufacturing","bunitValue":[{"appName":"MANU1",
        //                     "appLoc":null,
        //                     "appValue":[{"dbName":"ORCLDB1",
        //                            "dbValue":{"database_size_gb":32000,
        //                                 "number_cores":128,
        //                                 "memory_server_gb":null,
        //                                 "data_size_growth_percentage":8,
        //                                 "num_socket":8}
        //                          }]
        //                     }]
        // },
        {"bunit":"Research","bunitValue":[{"appName":"GENAPP",
                           "appLoc":null,
                           "appValue":[{"dbName":"ORCLDB4",
                                 "dbValue":{"database_size_gb":15000,
                                      "number_cores":128,
                                      "memory_server_gb":12000,
                                      "data_size_growth_percentage":10,
                                      "num_socket":6}
                             }]
                            }]
        }]
  };*/

  shortQuestionnaireForm: FormGroup;
  isShow:boolean = false;
  formStatus: string = 'failed';
  errorInValidForm: boolean;
  constructor(private formBuilder: FormBuilder,
              private questionaireService:QuestionaireService,
              private activeModal: NgbActiveModal,
              private spinner: NgxSpinnerService,
              private datalistService: DatabaseListService,
              private _PopupDraggableService: PopupDraggableService,
              private modalService: NgbModal) { }

  
  ngOnInit() {
    this._PopupDraggableService.enableDraggablePopup();
    this.get_short_questionnaire_data();
     
  }

  get_short_questionnaire_data(){
    this.spinner.show();
    this.datalistService.get_short_questionnaire_data().subscribe(data => {
      this.spinner.hide();
      this.shortQuestionnaireData = data.data;
      this.formStatus = data.status;
      if(this.formStatus == 'success'){
        
        setTimeout(() => { 
          $('a#nav-'+ this.shortQuestionnaireData.bunits[0].bunit+'-tab').click();
          $('a#nav-'+this.shortQuestionnaireData.bunits[0].bunit+'-tab').tab('show');
        }, 50);
      }
      this.createControls();
    });
     
  }
                
  createControls() {
    /*First Level*/
    this.shortQuestionnaireForm = this.formBuilder.group({
      'client_name': new FormControl(this.shortQuestionnaireData['client_name'], [Validators.required]),
      'client_executive': new FormControl(this.shortQuestionnaireData['client_executive'], [Validators.required]),
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
          'appLoc' : new FormControl(j.appLoc, this.getValidation(true, "number")),
          'appValue': this.formBuilder.array([])
        }));
        
        /*Forth Level*/
        for(let k of j.appValue){        
          let control_appValue = control_bunitValue.at(j_count).get('appValue') as FormArray;
          control_appValue.push(this.formBuilder.group({
            'dbName' : new FormControl(k.dbName, [Validators.required]),
            'dbValue': this.formBuilder.group({
              'database_size_gb' : new FormControl(k.dbValue.database_size_gb, this.getValidation(true, "number")),
              'number_cores' : new FormControl(k.dbValue.number_cores, this.getValidation(true, "number")),
              'memory_server_gb': new FormControl(k.dbValue.memory_server_gb, this.getValidation(true, "number")),
              'data_size_growth_percentage' : new FormControl(k.dbValue.data_size_growth_percentage, this.getValidation(true, "percentage")),
              'num_socket' : new FormControl(k.dbValue.num_socket, this.getValidation(true, "number"))
            })
          }));
        }/*End of Forth Level*/
        j_count++
      }/*End of Third Level*/
      i_count++;
  }/*End of Second Level*/ 
  this.shortQuestionnaireForm.valueChanges.subscribe(newVal => console.log(newVal));  
}

getValidation(isRequired, regex){
  return this.questionaireService.getValidatorsForControls({isRequired:isRequired, regex:regex});
}

getBunitTabContent(form, i){
  return form.controls.bunits.controls.at(i).controls.bunitValue.controls;
}



submit(){ 
  if(!this.validateArrayForm()){
    this.errorInValidForm = true;
    return;
  }else{
    this.errorInValidForm = false;
    let req_obj = this.shortQuestionnaireForm.value;
    console.log(this.shortQuestionnaireForm.value);
    console.log(JSON.stringify(this.shortQuestionnaireForm.value));
    this.spinner.show();
    this.datalistService.submit_short_questionnaire_data(req_obj).subscribe(data => {
      this.spinner.hide();
      if(data.status == 'success'){
        this.openAlert("Short Questionnaire details submitted successfully.");
      }else{
        this.openAlert(data.message);
      }
    });  
    
  }
}

openAlert(msg){
  const modalRef = this.modalService.open(DmapAlertDialogModal);
  modalRef.componentInstance.data = {msg: msg, title : 'Alert'};
  modalRef.result.then((result) => {
    if ( result === 'ok') {
      this.cancel();
    }
  });
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
        if(j.get('appLoc').invalid){          
          j.get('appLoc').markAsTouched();
          j.get('appLoc').markAsDirty();
          isValid = false;
        }

        let appValue = j.get('appValue') as FormArray;
        for(let k of appValue.controls){
          let dbValue = k.get('dbValue');

          if(dbValue.get('database_size_gb').invalid){         
            dbValue.get('database_size_gb').markAsTouched();
            dbValue.get('database_size_gb').markAsDirty();
            isValid = false;
          }

          if(dbValue.get('number_cores').invalid){         
            dbValue.get('number_cores').markAsTouched();
            dbValue.get('number_cores').markAsDirty();
            isValid = false;
          }

          if(dbValue.get('memory_server_gb').invalid){         
            dbValue.get('memory_server_gb').markAsTouched();
            dbValue.get('memory_server_gb').markAsDirty();
            isValid = false;
          }

          if(dbValue.get('data_size_growth_percentage').invalid){         
            dbValue.get('data_size_growth_percentage').markAsTouched();
            dbValue.get('data_size_growth_percentage').markAsDirty();
            isValid = false;
          }

          if(dbValue.get('num_socket').invalid){         
            dbValue.get('num_socket').markAsTouched();
            dbValue.get('num_socket').markAsDirty();
            isValid = false;
          }

        }
      }    
    }

    return isValid;
  }

  clear(){

    let bunits = this.shortQuestionnaireForm.get('bunits') as FormArray;
    for(let i of bunits.controls){
      let bunitValue = i.get('bunitValue') as FormArray;
      for(let j of bunitValue.controls){
        j.get('appLoc').reset();
        let appValue = j.get('appValue') as FormArray;
        for(let k of appValue.controls){
          let dbValue = k.get('dbValue');
          dbValue.get('database_size_gb').reset();
          dbValue.get('number_cores').reset();
          dbValue.get('memory_server_gb').reset();
          dbValue.get('data_size_growth_percentage').reset();
          dbValue.get('num_socket').reset();

        }
      }    
    }

  }

  cancel() {
    this.activeModal.close('cancel');
  }

}
