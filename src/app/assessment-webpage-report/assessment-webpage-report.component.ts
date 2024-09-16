import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Sql2PgService } from '../common/Services/sql2pg.service';
import saveAs from 'file-saver';
import FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner'; // Make sure this is imported


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
  databaseSelected: any;
  resp: Object;


  constructor( private sql2PgService: Sql2PgService, private cdr: ChangeDetectorRef , 
    private spinner: NgxSpinnerService,

  ) { }
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
  this.spinner.show();
  this.sql2PgService.getAssessmentWebPageReport(this.runId).subscribe(
    (response) => {    
      
      this.tableData = response;  
      this.runId = this.tableData[0].runId;
   
      this.cdr.detectChanges();
      if (this.runId === this.tableData[0].runId) {
        if (this.tableData && this.tableData.length > 0)
        {
          this.showComponent = true;
          this.showTable = true;
         
        }
      }
      this.spinner.hide();
    },
    (error) => {
      this.spinner.hide();
       console.error('Error fetching data:', error);
    });
}


downloadPdf(){
  console.log("after /download")

  this.spinner.show();
  this.sql2PgService.downloadAssessmentPdfReport(this.runId,'Assessment').subscribe(data=>{
    console.log("after /download")
    console.log(data)
    this.spinner.hide();
    let blob = new Blob([data],{});
    let filename =this.dbName+'_'+this.schemaName+'_' + this.runId + '_discoveryReport'+'.pdf';
    FileSaver.saveAs(blob,filename);
  });
}

 downloadExcel(){
    this.spinner.show();
    this.sql2PgService.downloadAssessmentExcelReport(this.runId).subscribe(data=>{
    this.spinner.hide();
    let blob = new Blob([data],{});
    let filename = this.dbName+'_'+this.schemaName+'_'+'Discovery_' + this.runId +'_Report'+'.xlsx';
    saveAs.saveAs(blob,filename);
   });
}

}




