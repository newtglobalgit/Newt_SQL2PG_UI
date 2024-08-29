import { Component, OnInit, Input, SimpleChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonServices } from '../../Services/common-services.service';
import { PdfChartService } from '../../Services/pdf-chart.service';


@Component({
  selector: 'app-horizontal-stack-chart',
  templateUrl: './horizontal-stack-chart.component.html',
  styleUrls: ['./horizontal-stack-chart.component.css']
})
export class HorizontalStackChartComponent implements OnInit {
  @Input() chartStackData:any[];
  @Input() isChartStackShow:boolean;
  @Input() chartSettings:any;
  @Input() xAxisLabel:string;
  @Input() chartId:string;
  @Input() reportType:string;
  @Input() schemaData:any;

  isShow:boolean;
  chart:any;
  fontSize13:number = 10;

  constructor(private zone:NgZone, private commonServices:CommonServices, private pdfChartService:PdfChartService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
  }

  ngOnChanges(changes:SimpleChanges){
    if(this.chartSettings != undefined){
      this.initialize();
    }
  }

  initialize(){
    this.isShow = this.isChartStackShow;
    this.cdRef.detectChanges();

    if(this.isShow){      
      setTimeout(() => {
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

  createCharts(){
    this.zone.runOutsideAngular(() => {   
      this.createTablesStackChart();
    });
  } 

  createTablesStackChart(){
    let chart:any; 

    // if (chart) {
    //   chart.dispose();
    // }
    
    // Create chart instance
    chart = am4core.create(this.chartSettings.containerId, am4charts.XYChart);    
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    
    // Add data
    // this.chartStackData = this.chartStackData.reverse();
    chart.data = this.chartStackData;
    
    // Create y-axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "objectType";
    /* Grid styling */
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.opacity = 0.5;    
    categoryAxis.renderer.grid.template.strokeDasharray = "5,2";
    /* label styling */
    categoryAxis.renderer.labels.template.fontSize = this.fontSize13;    
    categoryAxis.renderer.labels.template.fontWeight = 'bold';
    categoryAxis.renderer.labels.template.fontFamily = 'Roboto';


    // Create x-axes
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    // valueAxis.logarithmic = true;

    /* X-axis scaling distance (vaertical lines of graphs*/
    valueAxis.renderer.baseGrid.disabled = false;
    valueAxis.renderer.line.strokeOpacity = 0.5;
    valueAxis.renderer.minGridDistance = 100;    

    /* Style the grid for valueaxis */
    valueAxis.renderer.grid.template.opacity = 0.5;
    valueAxis.renderer.grid.template.strokeDasharray = "5,2";

    /* Ticks (which extenf outside the baseline) */
    valueAxis.renderer.ticks.template.disabled = false;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
    valueAxis.renderer.ticks.template.strokeWidth = 0.5;
    valueAxis.renderer.ticks.template.length = 10;

    valueAxis.renderer.labels.template.fontSize = this.fontSize13;
    valueAxis.renderer.labels.template.fontWeight = 'bold';
    valueAxis.renderer.labels.template.fontFamily = 'Roboto'

    valueAxis.extraMax = 0.15; /* total bullet */
    valueAxis.calculateTotals = true; /* total bullet */
    
    this.commonServices.setChartContainerHeightDynamically(chart);
    this.cdRef.detectChanges();

    setTimeout(() => {    
      for(let i in this.chartSettings.fields){
        this.createSeries(this.chartSettings.fields[i].short, this.chartSettings.fields[i].long, chart);
      }

      // Create series for total
      var totalSeries = chart.series.push(new am4charts.ColumnSeries());
      totalSeries.dataFields.valueX = "none";
      totalSeries.dataFields.categoryY = "objectType";
      totalSeries.stacked = true;

      totalSeries.hiddenInLegend = true;
      totalSeries.columns.template.strokeOpacity = 0;

      var totalBullet = totalSeries.bullets.push(new am4charts.LabelBullet());
      totalBullet.dx = 10;
      totalBullet.label.horizontalCenter = "left";
      totalBullet.label.text = "[font-size: 12px;]{total}: {converted}/{manual}[/]";
      totalBullet.label.hideOversized = false;
      totalBullet.label.truncate = false;
      totalBullet.label.fontSize = this.fontSize13;
      totalBullet.label.background.fill = am4core.color("white");
      totalBullet.label.background.fillOpacity = 0.2;
      // totalBullet.label.padding(5, 10, 5, 10);
      totalBullet.label.fill = am4core.color("black");      
      chart.maskBullets = false;
      
      /* Legend Styling */
      chart.legend = new am4charts.Legend();
      chart.legend.position = "bottom"; 

      var markerTemplate = chart.legend.markers.template;
      markerTemplate.width = this.fontSize13;
      markerTemplate.height = this.fontSize13;
      chart.legend.fontSize = this.fontSize13;

      this.chart = chart;
  
      let chartDetail = {index:5, name:this.chartSettings.mainHeading, value:this.chartStackData, type:'chartStackData'};
      this.pdfChartService.setChartData(this.chartId, this.schemaData, chartDetail, this.reportType);
      
      chartDetail = {index:5, name:this.chartSettings.mainHeading, value:this.chart, type:'chart'};
      this.pdfChartService.setChartData(this.chartId, this.schemaData, chartDetail, this.reportType);
    }, 1000);
  }

  // Create series
  createSeries(field, name, chart) {
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = field;
    series.dataFields.categoryY = "objectType";
    series.stacked = true;
    series.name = name;
    series.fontSize = this.fontSize13;   
    series.fontFamily = 'Roboto';
  

    /* Percentage filled within two grid */
    let columnTemplate = series.columns.template;
    columnTemplate.strokeOpacity = 0;
    columnTemplate.height = am4core.percent(50)
    
    
    /* Bullet inside the bar */
    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.locationX = 0.5;
    labelBullet.label.fontSize = this.fontSize13;
    labelBullet.label.hideOversized = true;


    
    series.columns.template.tooltipText = '[font-size: 12px; bold]' + name + ' [/]\n[font-size: 12px;]{valueX.value}[/]';
    series.columns.template.tooltipY = 0;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.pointerOrientation = "down";

    if(field == 'manual'){
      labelBullet.label.text = "{manualPercent}";
      series.stroke = am4core.color('#687078');
      series.fill = am4core.color('#687078');
      series.fillOpacity = 0.8;
    }else{
      labelBullet.label.text = "{convertedPercent}";
      series.stroke = am4core.color('#2da02c');
      series.fill = am4core.color('#2da02c');
      series.fillOpacity = 0.8;
    }
    labelBullet.label.fill = am4core.color("#fff");


  }

}
