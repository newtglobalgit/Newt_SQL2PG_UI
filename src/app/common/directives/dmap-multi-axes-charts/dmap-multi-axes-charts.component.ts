import { Component, OnInit, Input, SimpleChanges, NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_kelly);

import * as _ from 'underscore';


@Component({
  selector: 'app-dmap-multi-axes-charts',
  templateUrl: './dmap-multi-axes-charts.component.html'
})
export class DmapMultiAxesChartsComponent implements OnInit {
  @Input() chartMultiAxesData:any;
  @Input() chartSettings:any;
  @Input() isMultiAxesShow:boolean;
  @Input() schemaData:any;

  isShow:boolean;
  chart:any;
  maxAxis:any;

  constructor(private zone:NgZone) { }

  ngOnInit() {
  }
  
  ngAfterViewInit(){
  }

  ngOnChanges(changes:SimpleChanges){
    if(this.chartSettings != undefined){      
      this.maxAxis = _.max(this.chartMultiAxesData, function(o){return o.value;});
      this.initialize();
    }
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  initialize(){
    this.isShow = this.isMultiAxesShow;

    if(this.isShow){      
      setTimeout(() => {
        this.createCharts();      
      }, 1000);
    }

  }

  formatChartData(chartData){
    for(let i in chartData){
      chartData[i].sourceTime = parseInt(chartData[i].sourceTime);
      chartData[i].targetTime = parseInt(chartData[i].targetTime);
    }
    
    return chartData;

  }

  createCharts(){
    // Create chart instance
    let chart = am4core.create(this.chartSettings.containerId+'_'+this.chartMultiAxesData.name, am4charts.XYChart);
    chart.data = this.formatChartData(this.chartMultiAxesData.performance);
    chart.scrollbarX = new am4core.Scrollbar();

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "label";
    categoryAxis.renderer.minGridDistance = 10; 
    categoryAxis.renderer.labels.template.rotation = 270;

    // Create series
    this.createAxisAndSeries('sourceTime', "SourceTime", false, "circle", chart);
    this.createAxisAndSeries('targetTime', "TargetTime", true, "triangle", chart);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    // Legend
    chart.legend = new am4charts.Legend();

    this.chart = chart;
  }

  createAxisAndSeries(field, name, opposite, bulletInput, chart) {
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    
    var lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = field;
    lineSeries.dataFields.categoryX = "label";
    lineSeries.strokeWidth = 2;
    lineSeries.yAxis = valueAxis;
    lineSeries.name = name;
    lineSeries.tooltipText = "{name}: [bold]{valueY}[/]";
    lineSeries.tensionX = 0.8;

    if(field == 'sourceTime'){      
      lineSeries.stroke = am4core.color("#F38400"); 
    }else if(field == 'targetTime'){
      lineSeries.stroke = am4core.color("#5ec288"); 
    }
    
    /* lineSeries.propertyFields.stroke  = 'red';
    lineSeries.fill = "red"; */
    
    var interfaceColors = new am4core.InterfaceColorSet();
     
  switch(bulletInput) {
    case "triangle":
      var bullet = lineSeries.bullets.push(new am4charts.Bullet());
      bullet.width = 12;
      bullet.height = 12;
      bullet.horizontalCenter = "middle";
      bullet.verticalCenter = "middle";
      
      var triangle = bullet.createChild(am4core.Triangle);
      triangle.stroke = interfaceColors.getFor("background");
      triangle.strokeWidth = 2;
      triangle.direction = "top";
      triangle.width = 12;
      triangle.height = 12;
      break;
    case "rectangle":
      var bulletRectangle = lineSeries.bullets.push(new am4charts.Bullet());
      bulletRectangle.width = 10;
      bulletRectangle.height = 10;
      bulletRectangle.horizontalCenter = "middle";
      bulletRectangle.verticalCenter = "middle";
      
      var rectangle = bulletRectangle.createChild(am4core.Rectangle);
      rectangle.stroke = interfaceColors.getFor("background");
      rectangle.strokeWidth = 2;
      rectangle.width = 10;
      rectangle.height = 10;
      break;
    default:
      var bulletDefault = lineSeries.bullets.push(new am4charts.CircleBullet());
      bulletDefault.circle.stroke = interfaceColors.getFor("background");
      bulletDefault.circle.strokeWidth = 2;
      break;
  }
  valueAxis.renderer.line.strokeOpacity = 1;
  valueAxis.renderer.line.strokeWidth = 2;
  valueAxis.renderer.line.stroke = lineSeries.stroke;
  valueAxis.renderer.labels.template.fill = lineSeries.stroke;
  valueAxis.renderer.opposite = opposite;
  valueAxis.renderer.grid.template.disabled = true;
}

}
