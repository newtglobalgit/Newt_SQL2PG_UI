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

  enableDiscoveryReport: boolean = true; // Only Discovery is enabled
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
    // Logic to handle viewing the Discovery report
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


  }
  

