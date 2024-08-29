import { Component, OnInit, Input, SimpleChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_kelly);

import * as _ from 'underscore';
import { PdfChartService } from '../../Services/pdf-chart.service';
import { CommonServices } from '../../Services/common-services.service';

@Component({
  selector: 'app-dmap-floating-bar-charts',
  templateUrl: './dmap-floating-bar-charts.component.html',
  styleUrls: ['./dmap-floating-bar-charts.component.css']
})
export class DmapFloatingBarChartsComponent implements OnInit {
  @Input() chartFloatingData:any[];
  @Input() chartSettings:any;
  @Input() isChartFloatShow:any;
  @Input() chartId:string;
  @Input() reportType:string;
  @Input() schemaData:any;

  isShow:boolean;
  maxAxis:any;
  chart:any;
  fontSize13:number = 11
  sourceSchema:any = '';
  manualConversionEffort :any = 0;

  constructor(private zone:NgZone, private pdfChartService:PdfChartService, private commonServices:CommonServices, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.sourceSchema = this.schemaData.sourceSchema;
    this.manualConversionEffort = this.schemaData.manualConversionEffort;
  }

  ngAfterViewInit(){
  }

  ngOnChanges(changes:SimpleChanges){
    if(this.chartSettings != undefined){
      this.initialize();
    }
  }

  initialize(){    
    this.isShow = this.isChartFloatShow;
    this.cdRef.detectChanges();

    if(this.isShow){      
      setTimeout(() => {
        this.maxAxis = _.max(this.chartFloatingData, function(o){return o.endTime;});
        this.createCharts(); 
      }, 1000);
    }
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  formatChartData(chart){
    for(let i in this.chartFloatingData){
      this.chartFloatingData[i].color = chart.colors.next();
      
      // this.chartFloatingData[i].startTime = this.chartFloatingData[i].startTime; //parseFloat(this.chartFloatingData[i].startTime);
      // this.chartFloatingData[i].endTime = this.chartFloatingData[i].endTime; //parseFloat(this.chartFloatingData[i].endTime);
    }

    return this.chartFloatingData;
  }

  createCharts(){


    let chart = am4core.create(this.chartSettings.containerId, am4charts.XYChart);
    chart.data = this.formatChartData(chart);   
    
    /* Setting for Y-axis */
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.inversed = true;
    /* Grid styling */
    categoryAxis.renderer.grid.template.location = 0;  
    categoryAxis.renderer.grid.template.strokeDasharray = "5,2";
    /* Label styling */
    categoryAxis.renderer.labels.template.fontSize = this.fontSize13;    
    categoryAxis.renderer.labels.template.fontFamily = 'Roboto';
    categoryAxis.renderer.labels.template.fontWeight = 'bold';
    
    /* Settings for X-axis */
    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minGridDistance = 50;
    /* Title of the X-axis */
    valueAxis.title.text = this.chartSettings.xAxisLabel; 
    valueAxis.title.fontSize = this.fontSize13;    
    valueAxis.title.fontWeight = 'bold';

    /* Grid styling */
    valueAxis.renderer.grid.template.location = 0;  
    valueAxis.renderer.grid.template.strokeDasharray = "5,2";
    /* Label styling */
    valueAxis.renderer.labels.template.fontSize = this.fontSize13;
    valueAxis.renderer.labels.template.fontFamily = 'Roboto'
    valueAxis.renderer.labels.template.fontWeight = 'bold';

    /* X-axis scaling distance (vaertical lines of graphs*/
    valueAxis.renderer.baseGrid.disabled = false;
    valueAxis.renderer.line.strokeOpacity = 0.5;

    /* Ticks (which extenf outside the baseline) */
    valueAxis.renderer.ticks.template.disabled = false;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
    valueAxis.renderer.ticks.template.strokeWidth = 0.5;
    valueAxis.renderer.ticks.template.length = 10;

    /* Forcing to start the grid from zero */
    valueAxis.min = 0;  
    let percentOffset = (5/100)*this.maxAxis.endTime;  /* adding 5 percent offset */
    valueAxis.max = Math.ceil(this.maxAxis.endTime + percentOffset);
    valueAxis.strictMinMax= true;

    let columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.dataFields.categoryY = "name";
    columnSeries.dataFields.valueX = "endTime";
    columnSeries.dataFields.openValueX = "startTime";
    columnSeries.fontSize = this.fontSize13;   
    columnSeries.fontFamily = 'Roboto';
    columnSeries.fill = am4core.color('#2da02c');

    columnSeries.columns.template.adapter.add("fill", (fill, target) => {      
      return am4core.color('#274584');
    });
    
    /* Gradient styling */
    var fillModifier = new am4core.LinearGradientModifier();
    fillModifier.gradient.addColor(am4core.color('#274584'));
    fillModifier.brightnesses = [0, 0, 0, 1];
    fillModifier.offsets = [0, 0.2, 0, 1];
    fillModifier.gradient.rotation = 0;
    columnSeries.columns.template.fillModifier = fillModifier;

    var totalBullet = columnSeries.bullets.push(new am4charts.LabelBullet());
      totalBullet.dx = 10;
      totalBullet.label.horizontalCenter = "left";
      totalBullet.label.text = "{valueX} hrs";
      totalBullet.label.hideOversized = false;
      totalBullet.label.truncate = false;
      totalBullet.label.fontSize = this.fontSize13;
      totalBullet.label.background.fill = am4core.color("white");
      totalBullet.label.background.fillOpacity = 0.2;
      // totalBullet.label.padding(5, 10, 5, 10);
      totalBullet.label.fill = am4core.color("black");      
      chart.maskBullets = false;
      
    /* Tooltip styling */
    columnSeries.columns.template.tooltipText = "[font-size:12px; bold]{categoryY}[/]\n[font-size:12px;]\n[font-size:12px;] {valueX} man hours";
    columnSeries.columns.template.tooltipY = 0;
    columnSeries.tooltip.label.textAlign = "middle";
    columnSeries.tooltip.pointerOrientation = "down";

    /* Horizontal bar styling */
    let columnTemplate = columnSeries.columns.template;
    columnTemplate.strokeOpacity = 0;
    columnTemplate.height = am4core.percent(50);

    this.commonServices.setChartContainerHeightDynamically(chart);
    this.chart = chart;

    let chartDetail = {index:7, name:this.chartSettings.mainHeading, value:this.chart, type:'chart'}    
    this.pdfChartService.setChartData(this.chartId, this.schemaData, chartDetail, this.reportType);
  }

}
