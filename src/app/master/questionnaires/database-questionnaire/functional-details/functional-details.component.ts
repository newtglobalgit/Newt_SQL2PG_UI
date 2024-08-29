import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { QuestionaireService } from 'src/app/common/Services/questionaire.service';

declare var $: any;
@Component({
  selector: 'app-functional-details',
  templateUrl: './functional-details.component.html',
  styleUrls: ['./functional-details.component.css']
})
export class FunctionalDetailsComponent implements OnInit {
  @Input() dbQuestionnaireForm: FormGroup;
  @Input() controls: any;
  @Input() formStatus: string;

  constructor(private questionaireService:QuestionaireService) { }

  ngOnInit() {    
    console.log("%######################################")
    console.log(this.controls)

     /*Open the first tab on the screen */
    setTimeout(() => { 
      $('a#nav-appRelated_detail-tab').click();
      $('a#nav-appRelated_detail-tab').tab('show');
    }, 50);
  }
}
