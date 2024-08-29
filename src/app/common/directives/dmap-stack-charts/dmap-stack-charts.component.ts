import { Component, OnInit, Input, NgZone, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_kelly);

import * as _ from 'underscore';
import { PdfChartService } from '../../Services/pdf-chart.service';

@Component({
  selector: 'app-dmap-stack-charts',
  templateUrl: './dmap-stack-charts.component.html'
})
export class DmapStackChartsComponent implements OnInit {
  @Input() chartStackData:any[];
  @Input() isChartStackShow:boolean;
  @Input() chartSettings:any;
  @Input() xAxisLabel:string;
  @Input() chartId:string;
  @Input() reportType:string;
  @Input() schemaData:any;

  chart:any;
  maxAxis:any;
  isShow:boolean = false;

  constructor(private zone:NgZone, private pdfChartService:PdfChartService) { }

  ngOnInit() {
    this.formatChartData();
  }

  ngAfterViewInit(){
    /*this.createCharts(); */
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
    this.isShow = this.isChartStackShow;

    if(this.isShow){
      this.formatChartData();  
      
      setTimeout(() => {
        this.createCharts();      
      }, 1000);
    }
  }

  formatChartData(){
    this.maxAxis = _.max(this.chartStackData, function(o){return o.total;});

    for(let i in this.chartStackData){
      this.chartStackData[i].completelyConverted = parseInt(this.chartStackData[i].completelyConverted);
      this.chartStackData[i].simpleAction = parseInt(this.chartStackData[i].simpleAction);
      this.chartStackData[i].mediumAction = parseInt(this.chartStackData[i].mediumAction);
      this.chartStackData[i].significantAction = parseInt(this.chartStackData[i].significantAction);
    }
  }

  createCharts(){
    this.zone.runOutsideAngular(() => {   
      this.createTablesStackChart(this.chartStackData);
    });
  } 

  createSeries(field, chart){
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = field.short;
    series.dataFields.categoryX = "label";
    series.name = field.long;
    series.tooltipText = "[font-size: 12px;]{name}: [font-size: 12px; bold]{valueY}[/]";
    series.stacked = true;
    series.fontSize = 12;   
    series.fontFamily = 'Roboto';

    // let colors:any[] = ["#5ec288", "#F38400", "#ffc107", "#A1CAF1"];

    if(field.long == 'Significant Action'){
      let gradient = new am4core.LinearGradient();
      gradient.addColor(am4core.color('#845EC2'));
      gradient.addColor(am4core.color('#845EC2'));
      series.fill = gradient;
      series.stroke = am4core.color("#845EC2");//.lighten(-0.5)
    }else if(field.long == 'Medium Action'){      
      let gradient = new am4core.LinearGradient();
      gradient.addColor(am4core.color('#F38400'));
      gradient.addColor(am4core.color('#F38400'));
      series.stroke = am4core.color("#F38400");
      series.fill = gradient;
    }else if(field.long == 'Simple Action'){      
      let gradient = new am4core.LinearGradient();
      gradient.addColor(am4core.color('#ffc107'));
      gradient.addColor(am4core.color('#ffc107'));
      series.stroke = am4core.color("#ffc107");
      series.fill = gradient;
    }else if(field.long == 'Completely Converted') {      
      let gradient = new am4core.LinearGradient();
      gradient.addColor(am4core.color('#A1CAF1'));
      gradient.addColor(am4core.color('#A1CAF1'));
      series.stroke = am4core.color("#A1CAF1");
      series.fill = gradient;
    }

    return series;
  }

  createTablesStackChart(chartStackData){    
    // Create chart instance
    let chart = am4core.create(this.chartSettings.containerId, am4charts.XYChart);
    chart.data = chartStackData;
    chart.marginRight = 20;

    /* Setting for X-axis */
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "label";
    categoryAxis.title.text = this.chartSettings.xAxisLabel;
    categoryAxis.title.fontSize = 12;
    categoryAxis.title.fontWeight = 'bold';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;  
    categoryAxis.renderer.labels.template.fontSize = 12;    
    categoryAxis.renderer.labels.template.fontFamily = 'Roboto';
    categoryAxis.renderer.labels.template.rotation = 90; 
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "left";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";


    let  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = this.chartSettings.yAxisLabel;
    valueAxis.min = 0;
    valueAxis.max = parseInt(this.maxAxis);
    valueAxis.extraMax = 0.15; /* total bullet */
    valueAxis.calculateTotals = true; /* total bullet */
    valueAxis.title.text = 'Count';    
    valueAxis.title.fontSize = 12;    
    valueAxis.title.fontWeight = 'bold';
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontFamily = 'Roboto'
    

    // Create series
    let xAxisFields = this.chartSettings.fields;
    for(let i in xAxisFields){
      this.createSeries(xAxisFields[i], chart)
    }   

    // Create series for total
    var totalSeries = chart.series.push(new am4charts.ColumnSeries());
    totalSeries.dataFields.valueY = "none";
    totalSeries.dataFields.categoryX = "label";
    totalSeries.stacked = true;
    totalSeries.hiddenInLegend = true;
    totalSeries.columns.template.strokeOpacity = 0;

    var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
    totalBullet.dy = -20;
    totalBullet.label.text = "{valueY.total}";
    totalBullet.label.hideOversized = false;
    totalBullet.label.fontSize = 12;
    totalBullet.label.background.fill = totalSeries.stroke;
    totalBullet.label.background.fillOpacity = 0.2;
    totalBullet.label.padding(5, 10, 5, 10);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    // Legend
    chart.legend = new am4charts.Legend();  

    var markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 12;
    markerTemplate.height = 12;
    chart.legend.fontSize = 12;

    this.chart = chart;

    let chartDetail = {index:5, name:this.chartSettings.mainHeading, value:this.chartStackData, type:'chartStackData'};
    this.pdfChartService.setChartData(this.chartId, this.schemaData, chartDetail, this.reportType);
    
    chartDetail = {index:5, name:this.chartSettings.mainHeading, value:this.chart, type:'chart'};
    this.pdfChartService.setChartData(this.chartId, this.schemaData, chartDetail, this.reportType);
  }


}
