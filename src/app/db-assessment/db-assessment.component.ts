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
  filteredTableData: any[] = [];  


  tableData: any[] = [];
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
  sourceSchemas:any[]=[]
  // filter
  selectedValuesDict: { [key: string]: string[] } = {};
  originalData: any;
  filterAppFlag: boolean = false;
  filterDataSelectedFlag: boolean = false;
  refreshInterval: boolean = true;

  arrayOfSourceShema: any[];
  arrayOfSourceDB: any[];
  arrayOfTargetDB: any[];
  arrayOfRunID: any[];
  arrayOfStage: any[];
  arrayOfStatus: any[];
  searchDmapAppTable: string;
  appDetailCalls: NodeJS.Timeout;

  filterapplied:boolean= false;
  lastupdated_date: any;
  searchfilteredTableData: any;
  searchfilterapplied: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private sql2PgService: Sql2PgService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {


    this.searchfilteredTableData = [...this.tableData]; 

    // this.pingAndGetAppData();

    this.getStoredSchemaInfo();
    
    // setInterval(() => {
    //   this.checkDropdownStatus();
    // }, 1000);



    if (!this.tableData || this.tableData.length === 0) {
      console.warn('No table data found.');
    } else {
      this.selectedRow[5]='Not Started';
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
    this.selectedRow[5] = 'In Progress';

    await this.sleep(3000);

    this.sql2PgService.startDiscovery(this.current_run_id).subscribe(
      (response) => {
        console.log(this.current_run_id);
        console.log('Discovery API Response:', response);
        if (response.status == 'success') {
          this.showAssessmentComponent = false;
          this.showDiscoveryComponent = true;
          this.selectedRow[5] = 'Completed';
          this.isDiscoveryInProgress = false;
          this.isDiscoveryCompleted = true;
        }
        else if(response.status == 'failed')
        {
          this.selectedRow[5] = 'Error';
          this.isDiscoveryInProgress = !this.isDiscoveryInProgress;
        }
      },
      (error) => {
        console.error('Error starting discovery:', error);
        this.selectedRow[5] = 'Error';
        this.isDiscoveryInProgress = false;
      }
    );
  }

  startAssessment() {
    console.log('Starting assessment...');
    this.selectedRow[4] = 'Assessment';
    this.isAssessmentInProgress = true;
    this.isAssessmentButtonDisabled = !this.isAssessmentButtonDisabled;
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
          if (response.status == 'success') {
            this.showAssessmentComponent = true;
            this.showDiscoveryComponent = false;
            this.isAssessmentButtonDisabled = this.isAssessmentButtonDisabled;
            this.selectedRow[5] = 'Completed';
          }
          else if(response.status == 'failed'){
            this.isAssessmentButtonDisabled = !this.isAssessmentButtonDisabled;
            this.selectedRow[5] = 'Error';

          }
          this.isAssessmentInProgress = false;
          this.isAssessmentCompleted = true;

          // }
        },
        (error) => {
          console.error('Error starting Assessment:', error);
          this.selectedRow[5] = 'Error';
          this.isAssessmentButtonDisabled = true;
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
      runId: this.current_run_id
      
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
    if (
      state == 'Assessment' &&
      (this.status == 'In Progress' || this.status == 'Error')
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
      // console.log(this.tableData);
      this.getAppData()
      // this.sourceSchemas=this.tableData[0];
    });
  }

  checkDropdownStatus() {
    if (
      document
        .getElementById('drpdownAppName')
        ?.getAttribute('aria-expanded') === 'true' ||
      document
        .getElementById('drpdownAppRunID')
        ?.getAttribute('aria-expanded') === 'true' ||
      document
        .getElementById('drpdownAppStage')
        ?.getAttribute('aria-expanded') === 'true' ||
      document
        .getElementById('drpdownAppStatus')
        ?.getAttribute('aria-expanded') === 'true' ||
      document
        .getElementById('drpdownAppLastUpdated')
        ?.getAttribute('aria-expanded') === 'true' ||
      document
        .getElementById('drpdownAssignVm')
        ?.getAttribute('aria-expanded') === 'true'
    ) {
      this.filterAppFlag = true;
      // console.log('at least one dropdown is open');
    } else {
      if (this.filterDataSelectedFlag) {
        this.filterAppFlag = true;
        // console.log('all dropdowns are closed with data');
      } else {
        this.filterAppFlag = false;
        // console.log('all dropdowns are closed');
      }
    }
  }

  onDropdownClick(event: MouseEvent) {
    const target = event.target as HTMLInputElement;
    // Check if the clicked element is a checkbox
    if (target.tagName === 'INPUT' && target.type === 'checkbox') {
      // Get the value of the clicked checkbox
      const clickedValue = target.value;
      // this.selectedValues.push(clickedValue);
      const thElement = target.closest('th');
      const stageText = thElement
        .querySelector('span.marginRight5.defaultCursor')
        ?.textContent?.trim();
      // Check if the selected values dictionary already has an entry for the current stage text
      if (target.checked) {
        if (this.selectedValuesDict.hasOwnProperty(stageText)) {
          this.selectedValuesDict[stageText].push(clickedValue);
        } else {
          this.selectedValuesDict[stageText] = [clickedValue];
        }
      } else {
        // If the checkbox is unchecked, remove the clicked value from the selectedValuesDict
        if (this.selectedValuesDict.hasOwnProperty(stageText)) {
          this.selectedValuesDict[stageText] = this.selectedValuesDict[
            stageText
          ].filter((value) => value !== clickedValue);
          if (this.selectedValuesDict[stageText].length === 0) {
            delete this.selectedValuesDict[stageText];
          }
        }
      }
      // console.log(this.selectedValuesDict)
      let filteredData = [];
      if (Object.keys(this.selectedValuesDict).length != 0) {
        for (const stageText in this.selectedValuesDict) {
          if (this.selectedValuesDict.hasOwnProperty(stageText)) {
            const selectedValues = this.selectedValuesDict[stageText];
            let stageFilteredData = [];
            // console.log(selectedValues)

            switch (stageText) {
              case 'Source Schema':
                stageFilteredData = this.originalData.filter((row) =>
                  selectedValues.includes(row[0])
                );
                break;
              case 'Source DB':
                stageFilteredData = this.originalData.filter((row) =>
                  selectedValues.includes(row[1])
                );
                break;
              case 'Target DB':
                stageFilteredData = this.originalData.filter((row) =>
                  selectedValues.includes(row[2])
                );
                break;  
              case 'Run ID':
                stageFilteredData = this.originalData.filter((row) =>
                  selectedValues.includes(String(row[3]).trim())  // Convert to string and remove extra spaces
                );
                break;
              case 'Stage':
                stageFilteredData = this.originalData.filter((row) =>
                  selectedValues.includes(row[4])
                );
                break;
              case 'Status':
                stageFilteredData = this.originalData.filter((row) =>
                  selectedValues.includes(row[5])
                );
                break;
              case 'Last Updated':
                stageFilteredData = this.originalData.filter((row) =>
                  selectedValues.includes(row[6])
                );
                break;
            }
            // console.log(stageFilteredData) 
            const setFilteredData = new Set([
              ...filteredData,
              ...stageFilteredData,
            ]);
            filteredData = [...setFilteredData];
            if (filteredData.length > 0) {
              this.filterAppFlag = true;
              this.filterDataSelectedFlag = true;
              this.tableData = [...filteredData];
              // console.log( this.tableData)
            }
          }
        }
      } else {
        this.filterAppFlag = false;
        this.filterDataSelectedFlag = false;
        this.tableData = this.originalData;
      }
    }
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
      } 
      else if(this.stage === 'Discovery' && this.status === 'Not Started')
        {
          this.enableDiscoveryReport = false;
          this.enableAssessmentReport = false;
          this.showDiscoveryComponent = false
        }
        else {
        this.enableDiscoveryReport = false;
        this.enableAssessmentReport = false;
        this.showDetails = false;
        this.showDiscoveryComponent = false;
      }
    }
  }

  search(query: string) {
    this.searchfilterapplied =true
    if (query) {
      this.searchfilteredTableData = this.tableData.filter(row => 
        
        row[0].toLowerCase().includes(query.toLowerCase()) 
      );
      


    } else {
      this.searchfilteredTableData = [...this.tableData]; 
    }
  }

  clearSearch(searchInput: HTMLInputElement) {
    searchInput.value = '';
    this.search(''); 
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

  getAppData() {
    this.sql2PgService.getDBAssessmentData().subscribe((resp) => {
      if (resp.status == 'No Data Available') {
        this.tableData = [];
      } else if (resp.status == 'fail') {
        alert('Alert');
        this.refreshInterval = false;
      } else {
        this.tableData = resp.map((resp) => ({ ...resp }));
        this.originalData = this.tableData;
        // console.log(this.originalData)
        this.arrayOfSourceShema = [
          ...new Set(this.originalData.map((data) => data[0]).filter((item) => item !== null))
        ];
        // console.log(this.arrayOfSourceShema)
        this.arrayOfSourceDB = [
          ...new Set(this.originalData.map((data) => data[1])),
        ];
        // console.log(this.arrayOfSourceDB)
        this.arrayOfTargetDB = [
          ...new Set(this.originalData.map((data) => data[2])),
        ];
        // console.log(this.arrayOfTargetDB)
        this.arrayOfRunID = [
          ...new Set(this.originalData.map((data) => data[3])),
        ];
        // console.log(this.arrayOfRunID)
        this.arrayOfStage = [
          ...new Set(this.originalData.map((data) => data[4])),
        ];
        // console.log(this.arrayOfStage)
        this.arrayOfStatus = [
          ...new Set(this.originalData.map((data) => data[5])),
        ];
        // console.log(this.arrayOfStatus)
        
      }
    });
  }

  resetFilters() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(
      (checkbox) => ((checkbox as HTMLInputElement).checked = false)
    );
    
    this.filterAppFlag = false;
    this.tableData=this.originalData; 
    for (const key of Object.keys(this.selectedValuesDict)) {
      delete this.selectedValuesDict[key];
    }
    this.searchDmapAppTable = undefined;
    console.log("reset")
    console.log(this.tableData)
  }
}
