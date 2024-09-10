import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Sql2PgService } from '../common/Services/sql2pg.service';

@Component({
  selector: 'app-assessment-webpage-report',
  templateUrl: './assessment-webpage-report.component.html',
  styleUrls: ['./assessment-webpage-report.component.css']
})
export class AssessmentWebpageReportComponent implements OnInit {

    
@Input() runId;
@Input() showComponent;
@Input() Status;
@Input() Stage;
@Input() isShowReport: string;


  tableData: any[];


  showTable: boolean;
  spinner: any;
  databaseSelected: any;
  resp: Object;
  Enable_Genai= 'n'


  constructor( private sql2PgService: Sql2PgService, private cdr: ChangeDetectorRef) { }

  ngOnChanges() {
    this.getAssessmentWebpageSummaryData();
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
      console.log(this.tableData);
      console.log(this.tableData[0].runId)
      console.log(this.tableData[0].analyticData['Storage Objects'])


     

      this.cdr.detectChanges();
      if (this.runId === this.tableData[0].runId) {
        if (this.tableData && this.tableData.length > 0)
        {
          this.showComponent = true;

          setTimeout(() => {
            this.showTable = true;
          }, 10000);
        }
      }
    
    },
    (error) => {
       console.error('Error fetching data:', error);
    });
}

downloadPdf() {
  console.log("download pdf")
  let reqObj = {
    "runId": this.runId,
    "db_name": "AdventureWorks2019",
    "schema_name": "DBO"
  };

  this.sql2PgService.downloadDiscoveryPdfReport(reqObj).subscribe(data => {
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




