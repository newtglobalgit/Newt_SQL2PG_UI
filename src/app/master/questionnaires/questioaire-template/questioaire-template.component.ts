import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {  IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-questioaire-template',
  templateUrl: './questioaire-template.component.html',
  styleUrls: ['./questioaire-template.component.css']
})
export class QuestioaireTemplateComponent implements OnInit {
  @Input() formData: FormGroup;
  @Input() controls: any[];
  @Input() formStatus: string;
  @Output() onUpload: EventEmitter<any> = new EventEmitter<any>();

  multidropdownSettings:IDropdownSettings = {}; 
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
   // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
    //console.log(this.controls)
    //console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
    // console.log(this.formStatus)
    this.multidropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  
  
  getControlValue(key){
    return this.formData.get(key).value;
  }

  handleFileInput(files: FileList, key) {
    this.onUpload.emit({'control':key, 'files':files});
  }

  isControlInValid(key){
    return this.formData.get(key).invalid && this.formData.get(key).dirty;
      
  }

  onItemSelect(item: any,key) {
   // console.log(item);
  }

  onItemDeSelect(item: any,key) {
   //console.log(item);
  }

  onSelectAll(items: any,key) {
    //console.log(items);
  }

}
