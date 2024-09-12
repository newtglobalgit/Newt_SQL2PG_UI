import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Sql2PgService } from '../common/Services/sql2pg.service';
import saveAs from 'file-saver';

@Component({
  selector: 'app-assessment-webpage-report',
  templateUrl: './assessment-webpage-report.component.html',
  styleUrls: ['./assessment-webpage-report.component.css']
})
export class AssessmentWebpageReportComponent implements OnInit , OnChanges{

    
@Input() runId;
@Input() Status;
@Input() Stage;
@Input() showComponent;
@Input() schemaName: string;
@Input() dbName: string;


  tableData: any[];


  showTable: boolean;
  spinner: any;
  databaseSelected: any;
  resp: Object;


  constructor( private sql2PgService: Sql2PgService, private cdr: ChangeDetectorRef) { }
  ngOnChanges(): void {
    this.getAssessmentWebpageSummaryData()

   
  }
  
 

ngOnInit(): void {
  this.getAssessmentWebpageSummaryData();
}

getAssessmentWebpageSummaryData(){
 
       this.assessmentReport()

}


 
assessmentReport() {
  this.sql2PgService.getAssessmentWebPageReport(this.runId).subscribe(
    (response) => {    
      
      this.tableData = response;  
      this.runId = this.tableData[0].runId;
   
      this.cdr.detectChanges();
      if (this.runId === this.tableData[0].runId) {
        if (this.tableData && this.tableData.length > 0)
        {
          this.showComponent = true;

          setTimeout(() => {
            this.showTable = true;
          }, 5000);
        }
      }
    
    },
    (error) => {
       console.error('Error fetching data:', error);
    });
}

downloadPdf(){
  this.spinner.show();
  this.sql2PgService.downloadAssessmentPdfReport(this.runId,'Assessment').subscribe(data=>{
    this.spinner.hide();
    let blob = new Blob([data],{});
    let filename =this.tableData[0].sourceDBName+'_'+this.tableData[0].sourceDBSchema+'_' + this.runId + '_SchemaAssessmentReport'+'.pdf';
    saveAs.saveAs(blob,filename);
  });
}

 downloadExcel(){
     this.sql2PgService.downloadAssessmentExcelReport(this.runId).subscribe(data=>{
     let blob = new Blob([data],{});
     let filename = this.tableData[0].sourceDatabase+'_'+this.tableData[0].sourceSchema+'_'+'Assessment_' + this.runId +'_Report'+'.xlsx';
     saveAs.saveAs(blob,filename);
   });
}

}




