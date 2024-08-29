import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeDMAPAccordiansComponentsFunctions = new EventEmitter();  
  subsVar: Subscription;
    
  constructor() { }    
    
  onViewDetailButtonClick(data:any) {    
    this.invokeDMAPAccordiansComponentsFunctions.emit(data);    
  }  
}
