import { Component, OnInit, Input, NgZone, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);
declare var $: any;
import * as _ from 'underscore';
import { PdfChartService } from '../../Services/pdf-chart.service';

@Component({
  selector: 'app-dmap-charts',
  templateUrl: './dmap-charts.component.html'
})
export class DmapChartsComponent implements OnInit {
  @Input() chartData:any;
  @Input() isChartShow:boolean;
  @Input() chartId:string;
  @Input() reportType:string;
  @Input() schemaData:any;

  chart:any;
  isShow:boolean;

  constructor(private zone:NgZone, private pdfChartService:PdfChartService) { }

  ngOnInit() {
    this.formatChartData();
  }

  ngAfterViewInit(){
    // this.createCharts(); /* temp commenting on 1/31/2020 */
  }

  ngOnChanges(changes:SimpleChanges){
    this.isShow = this.isChartShow;

    if(this.isShow){
      this.formatChartData();  
      
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

  formatChartData(){
    this.isShow = this.isChartShow;  
    for(let i in this.chartData.levels){
      let value = this.chartData.levels[i].value = parseInt(this.chartData.levels[i].value);
      let total = this.chartData.total = parseInt(this.chartData.total);
      this.chartData.levels[i].percentage = ((value/total)*100).toFixed(2);
    }
    
    for(let i in this.chartData.mostDifficult){
      this.chartData.mostDifficult[i].value = parseInt(this.chartData.mostDifficult[i].value)
    }

    let max :any = _.max(this.chartData.mostDifficult, function(o){return o.value;});
    let maxNumber:number = parseInt(max.value);
    for(let i in this.chartData.mostDifficult){
      let value = this.chartData.mostDifficult[i].value;      
      this.chartData.mostDifficult[i].percentage = ((value/maxNumber)*100).toFixed(2);
    }
  }

  createCharts(){
    this.zone.runOutsideAngular(() => {   
      this.createTablesPieChart(this.chartData);
    });

    $('.progress-outer').css({"border": '1px solid transparent',
                              "padding": '0px',
                              "border-radius": '0px',
                              "margin-top":" 0px",
                              "margin-left": "0px"
                            });

    
    $('.progress-inner').css({"border": '1px solid transparent',
                              /* "padding":"3px", */
                              "border-radius": '0px'});

  }

  createTablesPieChart(chartData){    
    // Create chart instance
    let chart = am4core.create("chartDiv_"+chartData.name+"_"+this.chartId, am4charts.PieChart);
    chart.data = chartData.levels;

    // Create pie series
    let pieSeries = chart.series.push(new am4charts.PieSeries());    
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "name";
    pieSeries.dataFields.hidden = "hidden";    
    pieSeries.fontSize = 12;   
    pieSeries.fontFamily = 'Roboto';
    
    // Let's cut a hole in our Pie chart the size of 40% the radius
    chart.innerRadius = am4core.percent(40);

    // Disable ticks and labels
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

    // Disable tooltips
    pieSeries.slices.template.tooltipText = "";

    pieSeries.colors.list = [
      am4core.color("#845EC2"), //purple - very difficult
      am4core.color("#F38400"), //orange - difficult
      am4core.color("#ffc107"), //yellow - moderate
      am4core.color("#A1CAF1") //blue - low
    ];


    chart.legend = new am4charts.Legend();
    chart.legend.position = "right"; 

    var markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 12;
    markerTemplate.height = 12;
    chart.legend.fontSize = 12;

    this.chart = chart;

    let chartDetail = {index:1, name:chartData.name, value:this.chart, type:'chart'}    
    this.pdfChartService.setChartData(this.chartId, this.schemaData, chartDetail, this.reportType)
    
    let mostDiffBars = chartData.mostDifficult
    for(let i in mostDiffBars){
      let _mostDiffBars = {index:1, name:chartData.name, value:mostDiffBars[i], type:'bar'}
      this.pdfChartService.setChartData(this.chartId, this.schemaData, _mostDiffBars, this.reportType)
    }
  }

}
