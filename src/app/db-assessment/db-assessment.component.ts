import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UpdatePasswordComponent } from '../common/Modal/update-password/update-password.component';
import { Router } from '@angular/router';
import { DataService } from '../common/Services/data.service';

@Component({
  selector: 'app-db-assessment',
  templateUrl: './db-assessment.component.html',
  styleUrls: ['./db-assessment.component.css'],
})
export class DbAssessmentComponent implements OnInit {
  tableData: any[] = [];
  filteredData: any[] = [];

  constructor(private modalService: NgbModal, private router: Router, 
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.tableData = this.dataService.getTableData();

    this.tableData = [this.tableData]
  
    if (!this.tableData || this.tableData.length === 0) {
      console.warn('No table data found.');
      // Handle empty data case
    } else {
      console.log('Fetched tableData:', this.tableData);
      console.log(this.tableData[0])
    }
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
  


  }
  

