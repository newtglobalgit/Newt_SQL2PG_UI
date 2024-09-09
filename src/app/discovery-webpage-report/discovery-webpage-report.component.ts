import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Sql2PgService } from '../common/Services/sql2pg.service';

@Component({
  selector: 'app-discovery-webpage-report',
  templateUrl: './discovery-webpage-report.component.html',
  styleUrls: ['./discovery-webpage-report.component.css']
})
export class DiscoveryWebpageReportComponent implements OnInit ,  OnChanges {


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


  constructor( private sql2PgService: Sql2PgService, private cdr: ChangeDetectorRef) { }

  ngOnChanges() {
    this.getDiscoveryWebpageSummaryData(this.runId);
  }

ngOnInit(): void {
  this.getDiscoveryWebpageSummaryData(this.runId);
}

getDiscoveryWebpageSummaryData(runId){
  this.sql2PgService.startDiscovery(runId).subscribe((resp) => {
    if (resp.status === "success") {
      console.log(resp.status)
       this.discoveryReport()
      } 
      else {
        console.warn('Response is empty or undefined.');
      }
      },
      (error) => {
      console.error('Error fetching data:', error);
      }
    );

}


 
discoveryReport() {
  this.sql2PgService.getDiscoveryWebPageReport(this.runId).subscribe(
    (response) => {    
      
      this.tableData = response;  
      this.runId = this.tableData[0].runId;
      console.log(this.tableData);
      console.log(this.tableData[0].runId)

     

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

downloadPdf(runId: string, db_name: string, schema: string) {
  // Construct the request object with provided parameters
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
