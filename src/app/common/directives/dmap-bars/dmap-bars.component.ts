import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-dmap-bars',
  templateUrl: './dmap-bars.component.html',
  styleUrls: ['./dmap-bars.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DmapBarsComponent implements OnInit {
  @Input() bar:any;
  
  constructor() { }

  ngOnInit() {
    let count = this.bar.name.length;
    if(count >15){
      this.bar.shortName = this.bar.name.slice(0, 15) + '...';
    }else{
      this.bar.shortName = this.bar.name;
    }

    setTimeout(() => {
      
   // $('.innerBar').css({'width':"'" + this.bar.percentage + "%'"});
    }, 50);
  }

  getBarWidth(){
    let innerBarWidth = {'width': this.bar.percentage + "%"};
    return innerBarWidth
  }

}
