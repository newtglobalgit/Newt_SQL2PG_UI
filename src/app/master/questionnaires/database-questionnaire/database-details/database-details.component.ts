import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-database-details',
  templateUrl: './database-details.component.html',
  styleUrls: ['./database-details.component.css']
})
export class DatabaseDetailsComponent implements OnInit {
  @Input() dbQuestionnaireForm: FormGroup;
  @Input() controls: any;
  @Input() formStatus: string;
  @Input() allowFormToEdit:any;

  constructor() { }

  ngOnInit() {
    console.log('MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM')
    console.log(this.controls)
  }
  



}
