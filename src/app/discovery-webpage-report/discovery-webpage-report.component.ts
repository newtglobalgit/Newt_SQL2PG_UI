import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Sql2PgService } from '../common/Services/sql2pg.service';
import { NgxSpinnerService } from 'ngx-spinner'; // Make sure this is imported

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-discovery-webpage-report',
  templateUrl: './discovery-webpage-report.component.html',
  styleUrls: ['./discovery-webpage-report.component.css']
})
export class DiscoveryWebpageReportComponent implements OnInit , OnChanges{


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


  constructor( private sql2PgService: Sql2PgService, private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnChanges() {
    this.discoveryReport();
  }

ngOnInit(): void {
  this.discoveryReport();
}



 
discoveryReport() {
  this.sql2PgService.getDiscoveryWebPageReport(this.runId).subscribe(
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
  this.sql2PgService.downloadDiscoveryPdfReport(this.runId,'Discovery').subscribe(data=>{
    this.spinner.hide();
    let blob = new Blob([data],{});
    let filename =this.dbName+'_'+this.schemaName+'_' + this.runId + '_discoveryReport'+'.pdf';
    FileSaver.saveAs(blob,filename);
  });
}

 downloadExcel(){
  this.spinner.show();
     this.sql2PgService.downloadDiscoveryExcelReport(this.runId).subscribe(data=>{
      this.spinner.hide();
     let blob = new Blob([data],{});
     let filename = this.dbName+'_'+this.schemaName+'_'+'Discovery_' + this.runId +'_Report'+'.xlsx';
     FileSaver.saveAs(blob,filename);
   });
}


}
