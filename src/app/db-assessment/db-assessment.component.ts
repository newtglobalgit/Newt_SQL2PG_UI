import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Sql2PgService } from '../common/Services/sql2pg.service';
import { UpdatePasswordComponent } from '../common/Modal/update-password/update-password.component';
import { Router } from '@angular/router';
import { DBAssessment } from '../common/Services/dbAssessment.service';

@Component({
  selector: 'app-db-assessment',
  templateUrl: './db-assessment.component.html',
  styleUrls: ['./db-assessment.component.css'],
})
export class DbAssessmentComponent implements OnInit {
  tableData: any[] = [];
  filteredData: any[] = [];
  selectedRow: any = null;
  current_run_id: any;

  // New state variables
  isDiscoveryInProgress = false;
  isDiscoveryCompleted = false;
  showAssessmentButton = false;
  discoveryMessage = 'Not Started';  // Default message

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private dbAssessment: DBAssessment,
    private sql2PgService: Sql2PgService
  ) {}

  ngOnInit(): void {
    console.log(this.dbAssessment.getTableData());
    this.tableData = this.dbAssessment.getTableData();
    this.tableData=[this.tableData]
    this.selectedRow = this.dbAssessment.getTableData();
    this.current_run_id = this.selectedRow[3];

    if (!this.tableData || this.tableData.length === 0) {
      console.warn('No table data found.');
    } else {
      this.discoveryMessage = this.selectedRow[5] || 'Discovery Not Started';  // Update message based on status
      this.isDiscoveryCompleted = this.selectedRow.discoveryStatus === 'Completed';
    }
  }

  // Dynamically update the alert class based on discovery status
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

  startDiscovery() {
    this.isDiscoveryInProgress = true;
    this.discoveryMessage = 'Discovery in progress...';
    this.selectedRow[5] = 'In Progress';

    // Make API call to start discovery
    this.sql2PgService.startDiscovery(this.current_run_id).subscribe(
      (response) => {
        console.log(this.current_run_id)
        console.log('Discovery API Response:', response);
        // Update the status after the API call completes
        if(response.status=='Success'){
          this.selectedRow.discoveryStatus = 'Completed';
          this.discoveryMessage = 'Discovery completed successfully';
          this.isDiscoveryInProgress = false;  // Re-enable buttons
          this.isDiscoveryCompleted = true;    // Mark discovery as completed
        }
        else{
          alert(response.message)
        }
        
      },
      (error) => {
        console.error('Error starting discovery:', error);
        this.discoveryMessage = 'Error during discovery';
        this.selectedRow.discoveryStatus = 'Error';
        this.isDiscoveryInProgress = false;  // Re-enable button in case of error
      }
    );
  }

  startAssessment() {
    console.log('Starting assessment...');
    // Implement the assessment logic
  }

  onSelectRow(row: any) {
    this.selectedRow = row;
    this.discoveryMessage = row.discoveryStatus || 'Not Started';  // Update message when selecting a row
    this.isDiscoveryCompleted = row.discoveryStatus === 'Completed';  // Update button visibility based on discovery completion
  }
}

