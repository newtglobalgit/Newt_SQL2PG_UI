import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { UpdatePasswordComponent } from '../common/Modal/update-password/update-password.component';
import { Router } from '@angular/router';
import { Sql2PgService } from '../common/Services/sql2pg.service';
import { DmapMultipleSchemaDeleteComponent } from '../common/Modal/dmap-multiple-schema-delete/dmap-multiple-schema-delete.component';

@Component({
  selector: 'app-db-assessment',
  templateUrl: './db-assessment.component.html',
  styleUrls: ['./db-assessment.component.css'],
})
export class DbAssessmentComponent implements OnInit {
  isShowDataAndGraph: string;

  tableData: any[] = [];
  filteredData: any[] = [];
  selectedRow: any;

  enableAssessmentReport: boolean = false;
  isAssessmentButtonDisabled: boolean = false;

  showAssessmentComponent: boolean = false;
  current_run_id: any;
  enable_genai: any;

  isAssessmentInProgress = false;
  isAssessmentCompleted = false;
  isDiscoveryInProgress = false;
  isDiscoveryCompleted = false;
  showAssessmentButton = false;
  discoveryMessage = 'Discovery Not Started';

  enableDiscoveryReport: boolean = false;
  dropdownOpen: boolean = false;

  status: String = '';
  stage: String = '';
  isShowReport: String = '';
  RUN_ID: String = '';
  isExpanded: boolean = false;
  iconTitle: string;
  data: any;
  showDiscoveryDropDown: boolean;
  showAssessmentDropDown: boolean;
  showDetails: boolean = true;
  showDiscoveryComponent: boolean = true;

  constructor(
    private modalService: NgbModal,
    private sql2PgService: Sql2PgService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getStoredSchemaInfo();

    if (!this.tableData || this.tableData.length === 0) {
      console.warn('No table data found.');
    } else {
      this.discoveryMessage = this.selectedRow[5] || 'Discovery Not Started';
      this.isDiscoveryCompleted =
        this.selectedRow.discoveryStatus === 'Completed';
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
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async startDiscovery() {
    this.isDiscoveryInProgress = true;
    this.discoveryMessage = 'Discovery in progress...';
    this.selectedRow[5] = 'In Progress';

    await this.sleep(3000);

    this.sql2PgService.startDiscovery(this.current_run_id).subscribe(
      (response) => {
        console.log(this.current_run_id);
        console.log('Discovery API Response:', response);
        // alert(response.error)
        if (response.status == 'success') {
          this.showAssessmentComponent = false;
          this.showDiscoveryComponent = true;
          this.selectedRow[5] = 'Completed';
          this.discoveryMessage = 'Discovery completed successfully';
          this.isDiscoveryInProgress = false;
          this.isDiscoveryCompleted = true;
          this.selectedRow[4] = 'Assessment';
        }
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
    this.isAssessmentInProgress = true;
    this.isAssessmentButtonDisabled = !this.isAssessmentButtonDisabled;
    this.discoveryMessage = 'Assessment in progress...';
    this.selectedRow[5] = 'In Progress';
    if (this.sql2PgService.genAiActivated) {
      this.enable_genai = 'y';
    } else {
      this.enable_genai = 'n';
    }

    this.sql2PgService
      .startAssessment(this.current_run_id, this.enable_genai)
      .subscribe(
        (response) => {
          console.log(this.current_run_id);
          console.log('Assessment API Response:', response);
          // alert(response.error)
          if (response.status == 'success') {
            this.showAssessmentComponent = true;
            this.showDiscoveryComponent = false;
          }
          this.selectedRow[5] = 'Completed';
          this.discoveryMessage = 'Assessment completed successfully';
          this.isAssessmentInProgress = false;
          this.isAssessmentCompleted = true;

          // }
        },
        (error) => {
          console.error('Error starting Assessment:', error);
          this.discoveryMessage = 'Error during Assessment';
          this.selectedRow.discoveryStatus = 'Error';
          this.isDiscoveryInProgress = false;
        }
      );
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

  viewReport(state) {
    if (
      state == 'Assessment' &&
      (this.status == 'Completed' || this.status == 'completed')
    ) {
      this.enableAssessmentReport = true;
      this.enableDiscoveryReport = true;
      this.showDiscoveryComponent = false;
      this.showAssessmentComponent = true;
    }
    if (
      state == 'Discovery' &&
      (this.status == 'Completed' || this.status == 'completed')
    ) {
      this.enableDiscoveryReport = true;
      this.showAssessmentComponent = false;
      this.enableAssessmentReport = this.stage === 'Assessment';
      this.showDiscoveryComponent = true;
    }
  }

  getStoredSchemaInfo() {
    this.sql2PgService.getDBAssessmentData().subscribe((response) => {
      this.tableData = response;
      console.log(this.tableData);
    });
  }

  editRow(row: any): void {
    console.log('Editing row:', row);
  }

  toggleDropdown(): void {
    this.resetView();
    this.dropdownOpen = !this.dropdownOpen;
  }
  resetView() {
    this.showDetails = true;
    this.showDiscoveryComponent = true;
    this.showAssessmentComponent = false;
  }

  onSelectRow(row: any, selected: boolean) {
    if (selected) {
      this.selectedRow = row;
      this.current_run_id = row[3];
      this.discoveryMessage = row[5] || 'Discovery Not Started'; // Update message when selecting a row
      this.isDiscoveryCompleted = row[5] === 'Completed'; // Update button visibility based on discovery completion

      this.resetView();
      console.log('Selected row:', row);
      this.RUN_ID = row[3];
      this.status = row[5];
      this.stage = row[4];

      if (
        (this.stage === 'Discovery' && this.status === 'Completed') ||
        (this.stage === 'Assessment' && this.status === 'Error')
      ) {
        this.enableDiscoveryReport = true;
        this.enableAssessmentReport = false;
        this.showAssessmentComponent = false;
        this.showDiscoveryComponent = true;
      } else if (this.stage === 'Assessment' && this.status === 'Completed') {
        this.enableDiscoveryReport = true;
        this.enableAssessmentReport = true;
        this.showDiscoveryComponent = true;
      } else {
        this.enableDiscoveryReport = false;
        this.enableAssessmentReport = false;
        this.showDetails = false;
        this.showDiscoveryComponent = false;
      }
    }
  }

  multipleDeleteSchemas() {
    this.spinner.show();
    // let checkedScemaEntry = this.databaseListService.getSavedCheckedDBRecords();
    let checkedScemaEntry = [];
    let selectedSchema = {};
    if (checkedScemaEntry.length == 0) {
      selectedSchema['runId'] = '';
      selectedSchema['sourceDBSchema'] = '';
    } else {
      selectedSchema = checkedScemaEntry[0];
    }

    let schemasToDelete;
    this.sql2PgService.getMultipleSchemasToDelete().subscribe(
      (data) => {
        schemasToDelete = data;
        for (let i in schemasToDelete) {
          if (schemasToDelete[i].runId == selectedSchema['runId']) {
            schemasToDelete[i]['defaultSelection'] = true;
          } else {
            schemasToDelete[i]['defaultSelection'] = false;
          }
        }

        const modalRef = this.modalService.open(
          DmapMultipleSchemaDeleteComponent,
          { size: 'lg', scrollable: true }
        );
        modalRef.componentInstance.data = {
          title: 'Delete Multiple Schemas',
          data: schemasToDelete,
          selectedSchema: selectedSchema,
        };
        modalRef.result.then((result) => {
          // if (result == 'ok') {
          // }
        });
      },
      (error) => {}
    );
  }
}
