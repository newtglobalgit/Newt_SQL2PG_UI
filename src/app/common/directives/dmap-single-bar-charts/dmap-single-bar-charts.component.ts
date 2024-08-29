import { Component, OnInit, Input, SimpleChanges, NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_kelly);

import * as _ from 'underscore';
import { PdfChartService } from '../../Services/pdf-chart.service';

@Component({
  selector: 'app-dmap-single-bar-charts',
  templateUrl: './dmap-single-bar-charts.component.html'
})
export class DmapSingleBarChartsComponent implements OnInit {
  @Input() chartSingleBarData:any;
  @Input() chartSettings:any;
  @Input() isChartSingleShow:boolean;
  @Input() chartId:string;
  @Input() reportType:string;
  @Input() schemaData:any;

  isShow:boolean;
  chart:any;
  maxAxis:any;

  constructor(private zone:NgZone, private pdfChartService:PdfChartService) { }

  ngOnInit() {
  }
  
  ngAfterViewInit(){
    /* this.maxAxis = _.max(this.chartSingleBarData, function(o){return o.value;});
    this.createCharts(); */
  }

  ngOnChanges(changes:SimpleChanges){
    if(this.chartSettings != undefined){
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
    this.isShow = this.isChartSingleShow;

    if(this.isShow){      
      setTimeout(() => {
        this.maxAxis = _.max(this.chartSingleBarData, function(o){return o.value;});
        this.createCharts();      
      }, 1000);
    }
  }

  createCharts(){
    // Create chart instance
    let chart = am4core.create(this.chartSettings.containerId, am4charts.XYChart);
    chart.data = this.chartSingleBarData;
    // Create axes
    
    /* Setting for X-axis */
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "label";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 50;
    categoryAxis.renderer.labels.template.rotation = 270;    
    categoryAxis.renderer.labels.template.verticalCenter  = 'middle';    
    categoryAxis.renderer.labels.template.fontSize = 12;    
    categoryAxis.renderer.labels.template.fontFamily = 'Roboto';
    categoryAxis.renderer.labels.template.rotation = 90;
    // categoryAxis.renderer.labels.template.location = 0.0001; 
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "left";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    // categoryAxis.renderer.labels.template.verticalCenter = "top";
    
    /* Settings for Y-axis */
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());    
    valueAxis.title.text = 'Man Hours';   
    valueAxis.title.fontSize = 12;    
    valueAxis.title.fontWeight = 'bold';
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontFamily = 'Roboto'
    
    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "label";
    series.name = "Man Hours";
    series.columns.template.tooltipText = "[font-size: 12px;]{categoryX}: [font-size: 12px; bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;
    series.fontSize = 12;   
    series.fontFamily = 'Roboto';
    
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    // Legend
    chart.legend = new am4charts.Legend(); 

    var markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 12;
    markerTemplate.height = 12;
    chart.legend.fontSize = 12;

    this.chart = chart;
    
    let chartDetail = {index:4, name:this.chartSettings.mainHeading, value:this.chartSingleBarData, type:'chartSingleBarData'};
    this.pdfChartService.setChartData(this.chartId, this.schemaData, chartDetail, this.reportType);
    
    chartDetail = {index:4, name:this.chartSettings.mainHeading, value:this.chart, type:'chart'}    
    this.pdfChartService.setChartData(this.chartId, this.schemaData, chartDetail, this.reportType)

  }

}
