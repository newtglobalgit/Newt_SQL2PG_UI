import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { PdfChartService } from './pdf-chart.service';
import { TitleCasePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PdfContentService {

  reportData:any[] = []

  constructor(private spinner: NgxSpinnerService, private pdfChartService:PdfChartService,private titlecasePipe:TitleCasePipe ) { }  

  createViewPerformanceTable(data:any){
   
    let row:any[] = [];
    let rows:any[] = [];
    let icon = '';

    // row = []
    row = [{text: 'Object Name', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
          {text: 'Status',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
           {text: 'Source Time(ms)',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true},
           {text: 'Target Time(ms)',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}];
    rows.push(row)

    for(let i in data){
      row = [];
      let fillColor = '#FFF';
      let colorapply = data[i]['color'].toLowerCase();

      if(data[i]['status'] == 'Failed'){
        icon = environment.CROSS_WRONG_ICON;
        
      }else{
        icon = environment.RIGHT_CLICK_ICON;
      }
      row.push({text:data[i]['label'], fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},
                {image:icon, alignment: 'center', width:10, fontSize:10, fillColor:fillColor, border: [true, true, true, true]},
               {text:data[i]['sourceTime'], alignment: 'center',fontSize: 10,  color:colorapply, border: [true, true, true, true]},
               {text:data[i]['targetTime'], alignment: 'center',fontSize: 10, color:colorapply, border: [true, true, true, true]},)
      rows.push(row)
      
    }
 
  let table = {
    widths: ['*',50,'*','*'],
    body:rows
  }
  return table;

  }

  createFunctionPerformanceTable(data:any, type:any){
   
    let row:any[] = [];
    let rows:any[] = [];
    let icon = '';

    // row = []
    row = [{text: 'Object Name', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
          {text: 'Status',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
          {text: 'Parameters',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
           {text: 'Source Time(ms)',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true},
           {text: 'Target Time(ms)',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}];
    rows.push(row)

    for(let i in data){
      row = [];
      let fillColor = '#FFF';
      let colorapply = data[i]['color'].toLowerCase();

      if(data[i]['status'] == 'Failed'){
        icon = environment.CROSS_WRONG_ICON;
        
      }else{
        icon = environment.RIGHT_CLICK_ICON;
      }
      row.push({text:data[i]['label'], fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},
                {image:icon, alignment: 'center', width:10, fontSize:10, fillColor:fillColor, border: [true, true, true, true]},
                {table:{body:this.getParamBody(data[i].params), width:15, fontSize: 10, fillColor:fillColor, border: [true, true, true, true]}},
               {text:data[i]['sourceTime'], alignment: 'center',fontSize: 10,  color:colorapply, border: [true, true, true, true]},
               {text:data[i]['targetTime'], alignment: 'center',fontSize: 10, color:colorapply, border: [true, true, true, true]},)
      rows.push(row)
      
    }
 
  let table = {
    widths: ['*',50,'*','*','*'],
    body:rows
  }
  return table;

  }
  
  getParamBody(data:any){
    let row:any[] = [];
    let rows:any[] = []

    if(data.length>0){
      for(let i in data){
        row = [];
        let fillColor = '#FFF';

        row.push({text:data[i]['name'], fontSize: 12, fillColor:fillColor, border: [false, false, false, false]},
                {text:data[i]['value'], fontSize: 12, fillColor:fillColor, border: [false, false, false, false]})
        rows.push(row)
      }
    }
    else{
      row = [];
      let fillColor = '#FFF';
        row.push({text:' ', fontSize: 12, fillColor:fillColor, border: [false, false, false, false]},
        {text:' ', fontSize: 12, fillColor:fillColor, border: [false, false, false, false]})
        rows.push(row)
    }
    
    return rows;

  }

  createObjectValidattionTable(data:any){
    let row:any[] = [];
    let rows:any[] = []
    let icon = '';

    row = [{text: 'Object Validation', style: 'tableHeader', colSpan: 5, alignment: 'center', fillColor: '#D3D3D3',bold: true},{},{},{},{}];
    rows.push(row)

    row = [{text: 'Objects', style: 'tableHeader',bold: true}, 
           {text: 'Valid Source Count',alignment: 'center', style: 'tableHeader',bold: true}, 
           {text: 'Invalid Source Count',alignment: 'center', style: 'tableHeader',bold: true}, 
           {text: 'Total Source Count',alignment: 'center', style: 'tableHeader',bold: true}, 
           {text: 'Fully Converted Count',alignment: 'center', style: 'tableHeader',bold: true}, 
           {text: 'Not Converted Count',alignment: 'center', style: 'tableHeader',bold: true},  
           {text: 'Status', style: 'tableHeader',bold: true}, 
           {text: 'Message', style: 'tableHeader',bold: true}];
    rows.push(row)

    for(let j in data){
      row = [];
      let fillColor = '#FFF';

      row.push({text:data[j]['type'], fillColor: '#dceafa',fontSize: 10, bold: true,colSpan:8},{},{},{},{},{},{},{})
      rows.push(row)
      let storageData = data[j]['objectAnalysis'];
      for(let i in storageData){
        row = []
        if(storageData[i]['status'] == 'Failure'){
          icon = environment.CROSS_WRONG_ICON;
          fillColor = '#FFF';
        }else{
          icon = environment.RIGHT_CLICK_ICON;
        }
        //if(data[i]['targetTime']>0 || data[i]['sourceTime']>0 ){
        row.push({text:storageData[i]['name'], fontSize: 12, fillColor:fillColor, border: [true, true, true, true]},
                {text:storageData[i]['sourceValid'], fontSize: 12, fillColor:fillColor, border: [true, true, true, true]},
                {text:storageData[i]['sourceInvalid'], fontSize: 12, fillColor:fillColor, border: [true, true, true, true]},
                {text:storageData[i]['sourceCount'], fontSize: 12, fillColor:fillColor, border: [true, true, true, true]},
                {text:storageData[i]['fullyConverted'], fontSize: 12, fillColor:fillColor, border: [true, true, true, true]},
                {text:storageData[i]['notConverted'], fontSize: 12, fillColor:fillColor, border: [true, true, true, true]},
                {image:icon, alignment: 'center', width:15, fontSize: 12, fillColor:fillColor, border: [true, true, true, true]},
                {text:storageData[i]['message'], fontSize: 12, fillColor:fillColor, border: [true, true, true, true]})
        rows.push(row)
      }
    }
    
    let table = {
      widths: ['*',  50, '*', 50, 50],
      body:rows
    }
    return table;
  }

  createDataValidattionTable(data:any){

   
    let row:any[] = [];
    let rows:any[] = [];
    let icon = '';

    // row = []
    row = [{text: 'Object Type', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
          {text: 'Status',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
           {text: 'Comments',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}];
    rows.push(row)

    for(let i in data){
      row = [];
      // let missing = ' ';
      let fillColor = '#FFF';

      if(data[i]['status'] == 'Failed'){
        icon = environment.CROSS_WRONG_ICON;
        
      }else{
        icon = environment.RIGHT_CLICK_ICON;
      }
      row.push({text:data[i]['name'], fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},
                {image:icon, alignment: 'center', width:10, fontSize:10, fillColor:fillColor, border: [true, true, true, true]},
               {text:data[i]['message'], fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},)
      rows.push(row)
      
    }
 
  let table = {
    widths: ['*',50,'*'],
    body:rows
  }
  return table;

  }

  getChartPromiseForDummyChart(){

    let chart = am4core.create("dummychartdiv", am4charts.PieChart);
    chart.padding(0, 0, 0, 0);
    
    chart.data = [
      {
        country: "Lithuania",
        value: 260
      }]
      let series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "value";
      series.dataFields.radiusValue = "value";
      series.dataFields.category = "country";
      series.slices.template.cornerRadius = 6;
      series.colors.step = 3;
      series.radius = am4core.percent(100);
      
      series.labels.template.disabled = true;
      series.ticks.template.disabled = true;

      return chart;
  }

  downloadPerformanceChart(data:any, type:any, runId:any, schemaData:any){
    let spinner = this.spinner
    spinner.show()
    let tableData:any;
    let chartPromise = this.getChartPromiseForDummyChart();
    const content : any[] = [];

    /* let schemaData = this.pdfChartService.getSchemaDetail(runId); */
    let schemaDataTable = this.pdfChartService.createSchemaaDetail(runId,schemaData,'performance');
    if(type == 'view'){
      tableData = this.createViewPerformanceTable(data.performance);
    }
    if(type == 'function' || type == 'procedure'){
      tableData = this.createFunctionPerformanceTable(data.performance, type);
    } 
    
    type= this.titlecasePipe.transform(type);

    Promise.all([
      chartPromise.exporting.pdfmake,
      chartPromise.exporting.getImage("png"),
    ]).then(function(res) {
    let pdfMake = res[0];

    let doc = {
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [30, 45, 30, 30],
      header: this.getHeader,
      footer: (currentPage: any, pageCount: any) => this.getFooter(currentPage, pageCount),
      content: content
    };       
    
    doc.content.push({
      text: schemaData.sourceSchema+" Performance Validation Report",
      fontSize: 18,
      bold: true,
      margin: [0, 10, 0, 5]
    }); 

    doc.content.push({
      table:schemaDataTable,
      width: 530,
      margin:[0, 10, 0, 20],
    });

    doc.content.push({
      text: "Performance Validation Report for "+type+'s',
      fontSize: 11,
      bold: true,
      color:'#274584',
      margin: [0, 10, 0, 5]
    }); 
    
    doc.content.push({
      table:tableData,
      width: 530,
      margin:[0, 10, 0, 200],
      pageBreak:'after'
    });
    
    pdfMake.createPdf(doc).download(schemaData.sourceDBName+'_'+schemaData.sourceSchema+'_'+runId+'_'+type.toLowerCase()+'_performanceReport');  
    spinner.hide();
    });
  }

  downloadTestingMigrationReport(data:any, runId:any, schemaData:any){ 
    let spinner = this.spinner
    spinner.show()
    let tableData:any;
    let chartPromise = this.getChartPromiseForDummyChart();
    
    const content : any[] = [];

    // let schemaData = this.pdfChartService.getSchemaDetail(runId);
    let schemaDataTable = this.pdfChartService.createSchemaaDetail(runId,schemaData,'testMigration');
    this.reportData = []
    this.reportData.push({"type":"Storage Objects", "objectAnalysis":data['object']['Storage Objects']})
    this.reportData.push({"type":"Code Objects", "objectAnalysis":data['object']['Code Objects']})
    this.reportData.push({"type":"Special Objects", "objectAnalysis":data['object']['Special Objects']})
    let objectTableData = this.createObjectValidationTable(this.reportData);
    let dataTableData = this.createDataValidattionTable(data['data']);
  
    Promise.all([
      chartPromise.exporting.pdfmake,
      chartPromise.exporting.getImage("png"),
    ]).then(function(res) {
    let pdfMake = res[0];

    let doc = {
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [30, 45, 30, 30],
      header: this.getHeader,
      footer: (currentPage: any, pageCount: any) => this.getFooter(currentPage, pageCount),
      content: content
    };    
      
    doc.content.push({
      text: schemaData.sourceSchema+" Data Validation Report",
      fontSize: 18,
      bold: true,
      margin: [0, 10, 0, 5]
    }); 

    
    doc.content.push({
      table:schemaDataTable,
      width: 530,
      margin:[0, 10, 0, 20],
    });

    doc.content.push({
      text: "Object Validation",
      fontSize: 11,
      bold: true,
      color:'#274584',
      margin: [0, 10, 0, 5]
    }); 
    
    doc.content.push({
      table:objectTableData,
      width: 530,
      margin:[0, 10, 0, 20]
      // pageBreak:'after'
    });

    doc.content.push({
      text: "Data Validation",
      fontSize: 11,
      bold: true,
      color:'#274584',
      margin: [0, 10, 0, 5]
    }); 
    
    doc.content.push({
      table:dataTableData,
      width: 530,
      margin:[0, 10, 0, 200]
    });
    
    pdfMake.createPdf(doc).download(schemaData.sourceDBName+'_'+schemaData.sourceSchema+'_'+runId+'_dataValidationReport');  
    spinner.hide();
    });
  }
   
  createObjectValidationTable(data:any){
    let row:any[] = [];
    let rows:any[] = [];
    let icon = '';

    // row = []
    row = [{text: 'Object Type', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true},
           {text: 'Valid Source Count',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
           {text: 'Invalid Source Count',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
           {text: 'Total Source Count',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
           {text: 'Fully Converted Count',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
           {text: 'Not Converted Count',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true},  
           {text: 'Status',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
           {text: 'Manually Validated',alignment: 'center', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}, 
           {text: 'Comments', style: 'tableHeader',color:'white', fillColor: '#274584',fontSize: 10,bold: true}];
    rows.push(row)

    for(let j in data){
      row = [];
      // let missing = ' ';
      let fillColor = '#FFF';
      let storageData = data[j]['objectAnalysis'];

      if(storageData.length > 0){
        row.push({text:data[j]['type'], fillColor: '#dceafa',fontSize: 10, bold: true,colSpan:9},{},{},{},{},{},{},{},{})
        rows.push(row)
      }
      
      for(let i in storageData){
        row = []
        if(storageData[i]['status'] == 'Failure'){
          icon = environment.CROSS_WRONG_ICON;
          
        }else{
          icon = environment.RIGHT_CLICK_ICON;
        }
        if(storageData[i]['sourceValid']>0 || storageData[i]['sourceInvalid']>0 || storageData[i]['sourceCount']>0 || storageData[i]['fullyConverted']>0 ||storageData[i]['notConverted']>0 ){
          row.push({text:storageData[i]['name'], fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},
                  {text:storageData[i]['sourceValid'],alignment: 'center', fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},
                  {text:storageData[i]['sourceInvalid'],alignment: 'center', fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},
                  {text:storageData[i]['sourceCount'],alignment: 'center', fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},
                  {text:storageData[i]['fullyConverted'],alignment: 'center', fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},
                  {text:storageData[i]['notConverted'],alignment: 'center', fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},
                  {image:icon, alignment: 'center', width:10, fontSize:10, fillColor:fillColor, border: [true, true, true, true]},
                  {text:storageData[i]['manual_confirm'],alignment: 'center', fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},
                  {text:storageData[i]['message'], fontSize: 10, fillColor:fillColor, border: [true, true, true, true]},)
          rows.push(row)
        }
      }
    }
 
  let table = {
    widths: [95, 30, 30, 30, 30,30,30,45,130],
    body:rows
  }
  return table;
}
  downloadNewSchemaConversionReport(runId:any, reportType:any){ 
    let spinner = this.spinner;
    spinner.show()
    let chartPromise = this.getChartPromiseForDummyChart();
    let storageObjectsErrorData:any[] = [];
    let codeObjectsErrorData:any[] = [];

    let schemaData = this.pdfChartService.getSchemaDetail(runId, reportType);

    let errorData = this.pdfChartService.getErrorData(runId,reportType);
    
    const content : any[] = [];

    if (errorData){
      storageObjectsErrorData = errorData["Storage Objects"];
      codeObjectsErrorData = errorData["Code Objects"];
    }
    
   
    let getErrorDetail = this.pdfChartService.getErrorDetail;
    

    let schemaDataTable = this.pdfChartService.createSchemaaDetail(runId,schemaData,reportType);

    
    let validationData = this.pdfChartService.getValidationData(runId, reportType)

    let validationTable = this.createObjectValidationTable(validationData)
    
    Promise.all([
      chartPromise.exporting.pdfmake,
      chartPromise.exporting.getImage("png"),
    ]).then(function(res) {
    let pdfMake = res[0];
  
    let doc = {
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMargins: [30, 45, 30, 30],
      header:this.getHeader, 
      footer: (currentPage: any, pageCount: any) => this.getFooter(currentPage, pageCount),
      content: content
    };    
      
    doc.content.push({
      text: schemaData.sourceSchema+" Schema Conversion Report",
      fontSize: 18,
      bold: true,
      margin: [0, 10, 0, 5]
    }); 


    doc.content.push({
      table:schemaDataTable,
      width: 530,
      margin:[0, 10, 0, 20],
    });
    
    doc.content.push({
      text: "Conversion Summary",
      fontSize: 12,
      bold: true,
      color:'#274584',
      margin: [0, 10, 0, 5]
    }); 
    
    doc.content.push({
      text: "Conversion of your "+schemaData['sourceDBType']+" schema to "+schemaData['targetDBType']+" is complete. DMAP successfully migrated "+schemaData['totalObjectConverted']+" of "+schemaData['totalObject']+" database objects.  Below is summary of different Database Object types that were assessed and number of objects that were converted in Target database.  Status column indicates if all objects were successfully created in target DB or they require manual remediation.",
      fontSize: 10,
      margin: [0, 7, 0, 5]
    });

    doc.content.push({
      text: "Object Validation",
      fontSize: 11,
      bold: true,
      color:'#274584',
      margin: [0, 10, 0, 5]
    }); 

    doc.content.push({
      table:validationTable,
      width: 530,
      margin:[0, 10, 0, 40],
      //pageBreak:'after'
    });
    if(storageObjectsErrorData.length >0 || codeObjectsErrorData.length > 0 ){
      doc.content.push({
        text:  "Recommendations for Migration to "+schemaData['targetDBType'],
        fontSize: 12,
        bold: true,
        color:'#274584',
        margin: [0, 10, 0, 0]
      });  
      if(storageObjectsErrorData.length > 0){
      doc.content.push({
        text:  "Storage Object Actions",
        fontSize: 11,
        bold:true,
        color:'#274584',
        margin: [0, 10, 0, 0]
      }); 

      getErrorDetail(doc, storageObjectsErrorData);
      // for(let object in storageObjectsErrorData){
      //   let type = storageObjectsErrorData[object]["object_type"].replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ))

      //   let object_typee =  storageObjectsErrorData[object]["object_type"].replace(/\s/g, "");
      //   let object_type = object_typee.replace(/\w\S*/g,(txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()))
      //   if(object_type == 'Index'){
      //     object_type = 'Indexe'
      //   }

      //   doc.content.push({
      //     text:  type+" Changes",
      //     fontSize: 11,
      //     color:'#274584',
      //     margin: [0, 15, 0, 3]
      //   }); 
      //   doc.content.push({
      //     text:  "Please address below issues manually to complete the migration of "+type+"s",
      //     fontSize: 10,
      //     margin: [0, 5, 0, 0]
      //   });
      //   for(let error in storageObjectsErrorData[object]["errors"]){
      //   let object_names = [];
      //   object_names = storageObjectsErrorData[object]["errors"][error]["object_names"].split(',')
      //   doc.content.push({
      //     text:  "Issue "+storageObjectsErrorData[object]["errors"][error]["error_code"]+": "+storageObjectsErrorData[object]["errors"][error]["error_desc"] ,
      //     fontSize: 10,
      //     bold: true,
      //     margin: [0, 8, 0, 0]
      //   }); 
      //   doc.content.push({
      //     text:  "Number of occurrences: "+ storageObjectsErrorData[object]["errors"][error]["total_occurrence"],
      //     fontSize: 10,
      //     margin: [0, 5, 0, 4]
      //   }); 
      //   for(let i in object_names){
      //     doc.content.push({
      //       text:  object_type+'s.'+object_names[i],
      //       fontSize: 10,
      //       margin: [0, 5, 0, 0]
      //     }); 
      //     }
      //   }
      // }
    }
    if(codeObjectsErrorData.length > 0){
      doc.content.push({
        text:  "Code Object Actions",
        fontSize: 11,
        bold:true,
        color:'#274584',
        margin: [0, 10, 0, 0]
      });
      
      getErrorDetail(doc, codeObjectsErrorData); 
      // for(let object in codeObjectsErrorData){
        
      //   let type = codeObjectsErrorData[object]["object_type"].replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ))
      //   let object_typee =  codeObjectsErrorData[object]["object_type"].replace(/\s/g, "");
      //   let object_type = object_typee.replace(/\w\S*/g,(txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()))
        
       
      //   doc.content.push({
      //     text:  type+" Changes",
      //     fontSize: 11,
      //     color:'#274584',
      //     margin: [0, 15, 0, 3]
      //   }); 
      //   doc.content.push({
      //     text:  "Please address below issues manually to complete the migration of "+type+"s",
      //     fontSize: 10,
      //     margin: [0, 5, 0, 0]
      //   }); 
      //   for(let error in codeObjectsErrorData[object]["errors"]){
      //   let object_names = [];
      //   object_names = codeObjectsErrorData[object]["errors"][error]["object_names"].split(',')
      //   doc.content.push({
      //     text:  "Issue "+codeObjectsErrorData[object]["errors"][error]["error_code"]+": "+codeObjectsErrorData[object]["errors"][error]["error_desc"] ,
      //     fontSize: 10,
      //     bold: true,
      //     margin: [0, 8, 0, 0]
      //   }); 
      //   doc.content.push({
      //     text:  "Number of occurrences: "+ codeObjectsErrorData[object]["errors"][error]["total_occurrence"],
      //     fontSize: 10,
      //     margin: [0, 5, 0, 4]
      //   }); 
      //   for(let i in object_names){
      //     doc.content.push({
      //       text:  object_type+'s.'+object_names[i],
      //       fontSize: 10,
      //       margin: [0, 5, 0, 0]
      //     }); 
      //     }
      //   }
      //   }
      }
    }
   
    pdfMake.createPdf(doc).download(schemaData.sourceDBName+'_'+schemaData.sourceSchema+'_'+runId+'_schemaConversionReport');  
    spinner.hide();
    });
  }  

  downloadDiscoveryReport(runId:any, reportType:any){
    let spinner = this.spinner;
    

    spinner.show();

    let commonData = this.pdfChartService.getSchemaDetail(runId,reportType);

    let schemaDataTable = this.pdfChartService.createSchemaaDetail(runId,commonData,reportType);
    
    let chartPromise = this.getChartPromiseForDummyChart();

    let analysisTableData = this.pdfChartService.getstaticAnalysisTableData(runId,reportType);
    let analysisData = this.pdfChartService.createAnalysisTable(analysisTableData, reportType);

    let dependencyTableData = this.pdfChartService.getSimpleTableData(runId,reportType, 'dependency');
    let dependencyData = this.pdfChartService.createSimpleTable(dependencyTableData);

    let migrationSequenceTableData = this.pdfChartService.getSimpleTableData(runId,reportType, 'migrationSequence');
    let migrationSequenceData = this.pdfChartService.createMigrationSequenceTable(migrationSequenceTableData);

    let batchschemaDetailsTableData = this.pdfChartService.getBatchTableData(runId,reportType, 'batchSchemaData');
    let batchschemaDetailsData = this.pdfChartService.createBatchSchemaDetailsTable(batchschemaDetailsTableData);
    

    let batchDetailsTableData = this.pdfChartService.getBatchTableData(runId,reportType, 'batchData');
    let batchDetailsData = this.pdfChartService.createBatchDetailsTable(batchDetailsTableData);

    let discSpaceTableData = this.pdfChartService.getdiscSpaceTableData(runId,reportType, 'discSpace');
    let discSpaceData = this.pdfChartService.creatediscSpaceTableData(discSpaceTableData);

    let specialDatatypesTableData = this.pdfChartService.getSpecialDatatypesTableData(runId,reportType, 'specialDatatypes');
    let specialDatatypesData = this.pdfChartService.createSpecialDatatypesTableData(specialDatatypesTableData);    
    
    const content : any[] = [];
        
    Promise.all([
      chartPromise.exporting.pdfmake,
      chartPromise.exporting.getImage("png"),
    ]).then(function(res) {
      let pdfMake = res[0];

      let doc = {
        pageSize: "A4",
        pageOrientation: "portrait",
        pageMargins: [30, 45, 30, 30],
        header: this.getHeader,
        footer: (currentPage: any, pageCount: any) => this.getFooter(currentPage, pageCount),
        content: content
      };
      
      doc.content.push({
        text: commonData.sourceSchema+" Schema Discovery Report",
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, 5]
      });
  
      doc.content.push({
        table:schemaDataTable,
        width: 530,
        margin:[0, 10, 0, 20],
      });

      if(batchDetailsData){

        doc.content.push({
          text:  "Batch Details",
          fontSize: 11,
          color:'#274584',
          margin: [0, 10, 0, 5]
        }); 
  
        doc.content.push({
          table:batchDetailsData,
          width: 530,
          margin:[0, 10, 0, 20],
        });
    }
  
      if(batchschemaDetailsData){
          
        doc.content.push({
        text:  "Schemas in Batch",
        fontSize: 11,
        color:'#274584',
        margin: [0, 10, 0, 5]
      }); 
  
      doc.content.push({
        table:batchschemaDetailsData,
        width: 530,
        margin:[0, 10, 0, 20],
      });
    }

    
    if(migrationSequenceTableData){
        
      doc.content.push({
      text:  "Migration Sequence",
      fontSize: 11,
      color:'#274584',
      margin: [0, 10, 0, 5]
    }); 

    doc.content.push({
      text:'Based on dependencies and size of database, we recommend following sequence for migration to get better conversion statistics for Storage and Code objects.',
      fontSize: 10,
      margin:[0, 10, 0, 0],
    });
    
    doc.content.push({
      table:migrationSequenceData,
      width: 530,
      margin:[0, 10, 0, 20],
    });
  }

      
      doc.content.push({
        text:  "Database Size",
        fontSize: 11,
        color:'#274584',
        margin: [0, 10, 0, 5]
      });      
      doc.content.push({
        text:commonData.sourceSchema+' schema is ' + commonData.sourceDBSize + ' in size.',
        fontSize: 10,
        margin:[0, 10, 0, 20],
      });
      
      doc.content.push({
        text:  "Dependencies",
        fontSize: 11,
        color:'#274584',
        margin: [0, 10, 0, 5]
      }); 
      
      if(dependencyTableData.length > 0){ 
        doc.content.push({
          text:commonData.sourceSchema+' schema has dependency on below references objects. We recommend to resolve those dependencies first and then proceed with conversion of '+commonData.sourceSchema+' schema to get better conversion statistics for Storage and Code objects.',
          fontSize: 10,
          margin:[0, 10, 0, 0],
        });
        doc.content.push({
          table:dependencyData,
          width: 530,
          margin:[0, 10, 0, 20],
        });
      }else{
        doc.content.push({
          text:commonData.sourceSchema+' schema has no dependency.',
          fontSize: 10,
          margin:[0, 10, 0, 20],
        });

      }

     doc.content.push({
        text:  "Database Objects",
        fontSize: 11,
        color:'#274584',
        margin: [0, 10, 0, 5]
      });  
  
      doc.content.push({
        table:analysisData,
        width: 530,
        margin:[0, 10, 0, 20],
      });

      
    if(discSpaceTableData.length > 0){
        
      doc.content.push({
      text:  "Large Object Details",
      fontSize: 11,
      color:'#274584',
      margin: [0, 10, 0, 5]
    }); 

    doc.content.push({
      table:discSpaceData,
      width: 530,
      margin:[0, 10, 0, 20],
    });
   
  }

  if(specialDatatypesTableData.length > 0){
        
    doc.content.push({
    text:  "Special Datatypes",
    fontSize: 11,
    color:'#274584',
    margin: [0, 10, 0, 5]
  }); 

  doc.content.push({
    table:specialDatatypesData,
    width: 530,
    margin:[0, 10, 0, 20],
  });
  }
      
  
     
      
      pdfMake.createPdf(doc).download(commonData.sourceDBName+'_'+commonData.sourceSchema+'_'+runId+"_discoveryReport.pdf");
      spinner.hide();
    });

  }
  private getHeader() {
    return [
      {
        image: environment.NEWTGLOBAL_ICON,
        alignment: 'right',
        width: 100,
        margin: [5, 2, 15, 20],
      },
    ];
  }


 private getFooter(currentPage: any, pageCount: any) {
    return [
      {
        text: 'Page ' + currentPage.toString() + ' | ' + pageCount,
        color: '#A9A9A9',
        alignment: 'right',
        margin: [35, 0],
      },
    ];
  } 
}