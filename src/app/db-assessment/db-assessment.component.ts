import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  

  constructor(private modalService: NgbModal, private router: Router, 
    private dbAssessment: DBAssessment
  ) {}

  ngOnInit(): void {

    this.tableData.length =0;
    console.log(this.tableData.length)
    this.tableData = this.dbAssessment.getTableData();

    this.tableData = [this.tableData]
  
    if (!this.tableData || this.tableData.length === 0) {
      console.warn('No table data found.');
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
  

