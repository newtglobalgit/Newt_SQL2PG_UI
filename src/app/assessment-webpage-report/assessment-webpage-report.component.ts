import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Sql2PgService } from '../common/Services/sql2pg.service';

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

downloadPdf() {
  let reqObj = {
    "runId": this.runId,
    "db_name": this.dbName,
    "schema_name": this.schemaName
  };

  this.sql2PgService.downloadAssessmentPdfReport(reqObj).subscribe(data => {
    this.resp = data
    
    if (this.resp === "success") {
      console.log('PDF download was successful');
    } else {
      console.error('Failed to download PDF', data);
    }
  }, error => {
    this.spinner.hide();
    console.error('Error occurred while downloading PDF', error);
  });
}
}




