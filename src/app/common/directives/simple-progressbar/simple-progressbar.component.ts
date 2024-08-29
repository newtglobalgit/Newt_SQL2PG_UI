import { Component, OnInit, Input, OnChanges, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-simple-progressbar',
  templateUrl: './simple-progressbar.component.html',
  styleUrls: ['./simple-progressbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SimpleProgressbarComponent implements OnInit, OnChanges {
  @Input() progressBarItems:any[];  
  @Input() currentIndex:any;
  @Output() highlightText = new EventEmitter<any>(); 
  
  progressBar$:Subscription;

  maxIndexPosition:number;

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() { 
  }

  ngOnChanges() {
    this.initialize();
  }  

  ngOnDestroy() {
  }

  initialize(){
    this.currentIndex = parseInt(this.currentIndex)    
    this.spinner.show("progressBarSpinner");
    if(this.progressBarItems != undefined){
      for(let i in this.progressBarItems){
        this.progressBarItems[i]['isClicked'] = false;
      }
    }
  }

  onProgressbarMouseover(name:string){    
    this.highlightText.emit(name)
  }

  onProgressbarClicked(item:any){  
    if(item.isClicked){
      item.isClicked = false;
      this.clearOtherFlags(item);
      this.highlightText.emit(undefined)
    }else{
      item.isClicked = true;
      this.clearOtherFlags(item);
      this.highlightText.emit(item.name)

    }
  }

  clearOtherFlags(item){
    for(let i in this.progressBarItems){
      if(this.progressBarItems[i].name != item.name){
        this.progressBarItems[i].isClicked = false;
      }
    }
  }

}
