import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  @Input() data:any;
  
  headers:any[];
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

cancel(){
  this.activeModal.close('cancel');
  }

  getWidthStyle(heading){
    return heading.widthStyle;
  }
}
