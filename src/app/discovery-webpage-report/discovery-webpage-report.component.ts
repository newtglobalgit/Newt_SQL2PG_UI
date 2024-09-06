import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Sql2PgService } from '../common/Services/sql2pg.service';

@Component({
  selector: 'app-discovery-webpage-report',
  templateUrl: './discovery-webpage-report.component.html',
  styleUrls: ['./discovery-webpage-report.component.css']
})
export class DiscoveryWebpageReportComponent implements OnInit {
appStatus: String = 'Completed';
appStage: String  = 'Discovery';
isShowReport: String = 'Discovery';
RUN_ID: String = "20240906181300";
  showComponent: boolean = false;
  isExpanded: boolean =  false;
  iconTitle: string;
  data: any;
  data_runId: any;
  showTable: boolean;

  constructor( private sql2PgService: Sql2PgService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  loadAccordion() {
    this.showComponent = !this.showComponent;
    this.isExpanded = !this.isExpanded;
    this.iconTitle = this.isExpanded ? 'Expand the tab' : 'Collapse the tab';


          this.sql2PgService.startDiscovery(this.RUN_ID).subscribe(
            (response) => {              
              if (response.status === "success") {
                    console.log(response.status)
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
  this.sql2PgService.getDiscoveryWebPageReport(this.RUN_ID).subscribe(
    (response) => {               
      this.data = response;  
      console.log(this.data);

      this.cdr.detectChanges();
      
      this.data_runId = this.data[0].runId;
      if (this.data_runId === this.RUN_ID) {
        if (this.data && this.data.length > 0)
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

}
