import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UpdatePasswordComponent } from '../common/Modal/update-password/update-password.component';
import { Router } from '@angular/router';
import { Sql2PgService } from '../common/Services/sql2pg.service';

@Component({
  selector: 'app-db-assessment',
  templateUrl: './db-assessment.component.html',
  styleUrls: ['./db-assessment.component.css'],
})
export class DbAssessmentComponent implements OnInit {

reports() {
throw new Error('Method not implemented.');
}
  tableData: any[] = [];
  filteredData: any[] = [];
  selectedRow: any = null;
  current_run_id: any;

  isDiscoveryInProgress = false;
  isDiscoveryCompleted = false;
  showAssessmentButton = false;
  discoveryMessage = 'Discovery Not Started';

  enableDiscoveryReport: boolean = true; 
  dropdownOpen: boolean = false; 

  constructor(private modalService: NgbModal, private router: Router, 
    private sql2PgService: Sql2PgService
  ) {}

  ngOnInit(): void {


    this.getStoredSchemaInfo();
    // console.log(this.tableData.length)
    // this.tableData = this.dbAssessment.getTableData();

    // this.tableData = [this.tableData]
  
    // if (!this.tableData || this.tableData.length === 0) {
    //   console.warn('No table data found.');
    // } 
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

  onRadioClicked(row: any): void {
    console.log('Selected row:', row);
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

  getStoredSchemaInfo(){
    this.sql2PgService.getDBAssessmentData().subscribe(
      (response) => {              
        
           
            this.tableData = response
            console.log(this.tableData)

      }
      
    );
  }
  onSelectRow(row: any) {
    this.selectedRow = row;
    this.current_run_id=row[3]
    this.discoveryMessage = row[5] || 'Discovery Not Started';  // Update message when selecting a row
    this.isDiscoveryCompleted = row[5] === 'Completed';  // Update button visibility based on discovery completion
  }


  }
  

