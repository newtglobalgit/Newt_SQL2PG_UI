import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
enableAssessmentReport: any;
  isShowDataAndGraph: string;


reports() {
throw new Error('Method not implemented.');
}
  tableData: any[] = [];
  filteredData: any[] = [];

  enableDiscoveryReport: boolean = true; 
  dropdownOpen: boolean = false; 

  status: String = 'Completed';
  stage: String  = 'Discovery';
  isShowReport: String = 'Discovery';
  RUN_ID: String = "20240828170749";  
  isExpanded: boolean =  false;
  iconTitle: string;
  data: any;


  constructor(private modalService: NgbModal, private router: Router, 
    private sql2PgService: Sql2PgService ,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {


    this.getStoredSchemaInfo();
    
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
    
    this.enableDiscoveryReport = true;
    this.enableAssessmentReport = true;
    this.isShowDataAndGraph = 'Assessment';
 
  }
  if (
    state == 'Discovery' &&
    (this.status == 'Completed' || this.status == 'completed')
  ) {
    this.isShowDataAndGraph = 'Discovery';
    this.enableDiscoveryReport = true;
    this.enableAssessmentReport =
      this.stage === 'Assessment' || this.stage === 'Migration';
    
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


  }
  

