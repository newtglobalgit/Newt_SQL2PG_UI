import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UpdatePasswordComponent } from '../common/Modal/update-password/update-password.component';
import { Router } from '@angular/router';
import { Sql2PgService } from '../common/Services/sql2pg.service';
import { viewport } from '@popperjs/core';

@Component({
  selector: 'app-db-assessment',
  templateUrl: './db-assessment.component.html',
  styleUrls: ['./db-assessment.component.css'],
})
export class DbAssessmentComponent implements OnInit {
selectedRow: any;


enableAssessmentReport: boolean = false;
  isShowDataAndGraph: boolean = false; 
  isShowDataAndGraphForDiscovery: boolean = false; 

  showAssessmentComponent: boolean;
  current_run_id: any;

  isDiscoveryInProgress = false;
  isDiscoveryCompleted = false;
  showAssessmentButton = false;
  discoveryMessage = 'Discovery Not Started';


  tableData: any[] = [];
  filteredData: any[] = [];

  enableDiscoveryReport: boolean = false; 
  dropdownOpen: boolean = false; 

  status: String = '';
  stage: String  = '';
  isShowReport: String = '';
  RUN_ID: String = "";  
  isExpanded: boolean =  false;
  iconTitle: string;
  data: any;


  constructor(private modalService: NgbModal, private router: Router, 
    private sql2PgService: Sql2PgService ,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {


    this.getStoredSchemaInfo();

    
    if (!this.tableData || this.tableData.length === 0) {
      console.warn('No table data found.');
    } else {
      this.discoveryMessage = this.selectedRow[5] || 'Discovery Not Started';  
      this.isDiscoveryCompleted = this.selectedRow.discoveryStatus === 'Completed';
    }
    
  }

  getAlertClass(status: string): string {
    switch (status) {
      case 'Not Started':
        return 'alert-info';
      case 'In Progress':
        return 'alert-warning';
      case 'Completed':
        return 'alert-success';
      case 'Error':
        return 'alert-danger';
      default:
        return 'alert-info';
    }
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
 
  async startDiscovery() {
    this.isDiscoveryInProgress = true;
    this.discoveryMessage = 'Discovery in progress...';
    this.selectedRow[5] = 'In Progress';
 
    await this.sleep(3000);
 
   
    this.sql2PgService.startDiscovery(this.current_run_id).subscribe(
      (response) => {
        console.log(this.current_run_id)
        console.log('Discovery API Response:', response);
        // alert(response.error)
       
          this.selectedRow[5] = 'Completed';
          this.discoveryMessage = 'Discovery completed successfully';
          this.isDiscoveryInProgress = false;  
          this.isDiscoveryCompleted = true;    
      },
      (error) => {
        console.error('Error starting discovery:', error);
        this.discoveryMessage = 'Error during discovery';
        this.selectedRow.discoveryStatus = 'Error';
        this.isDiscoveryInProgress = false;  
      }
    );
  }

  startAssessment() {
    console.log('Starting assessment...');
   
  }

    
  
  updatePassword(data) {
    const modalRef = this.modalService.open(UpdatePasswordComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.data = {
      title: 'Update Password',
      runId: data.runId,
      stage: data.stepStatus,
      step: data.step,
    };
    modalRef.result.then((result) => {});
  }

  viewReport(state){

  if (
    state == 'Assessment' &&
    (this.status == 'Completed' || this.status == 'completed')
  ) {

    
    this.enableAssessmentReport = true;
    this.enableDiscoveryReport = false;
    this.isShowDataAndGraph = true;
    this.showAssessmentComponent =true
    console.log("Assess ->"+this.enableAssessmentReport)

 
  }
  if (
    state == 'Discovery' &&
    (this.status == 'Completed' || this.status == 'completed')
  ) {
    this.isShowDataAndGraphForDiscovery = true;
    this.enableDiscoveryReport = true;
    this.enableAssessmentReport =
        this.stage === 'Assessment'

     
  }

}




  getStoredSchemaInfo(){
    this.sql2PgService.getDBAssessmentData().subscribe(
      (response) => {              
        
           
            this.tableData = response
            console.log(this.tableData)

      }
      
    );
  }

  editRow(row: any): void {
    console.log('Editing row:', row);
  }
  
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  viewDiscoveryReport(): void {
    console.log('Discovery Report Selected');
  }

  onSelectRow(row: any) {
    this.selectedRow = row;
    this.current_run_id=row[3]
    this.discoveryMessage = row[5] || 'Discovery Not Started';  // Update message when selecting a row
    this.isDiscoveryCompleted = row[5] === 'Completed';  // Update button visibility based on discovery completion
    console.log('Selected row:', row);
    this.RUN_ID = row[3];
    this.status = row[5];
    this.stage = row[4];
    
    if(this.status != "Not Started")
    {
      this.enableDiscoveryReport=true;
     
    }
  }


  }
  

