import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { DmapBatchDetailsComponent } from 'src/app/common/Modal/dmap-batch-details/dmap-batch-details.component';
import { NgbdConfirmationModal } from 'src/app/common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DmapMasterSettingsModalComponent } from 'src/app/common/Modal/dmap-master-settings-modal/dmap-master-settings-modal.component';
import { CommonServices } from 'src/app/common/Services/common-services.service';
import { DatabaseListService } from 'src/app/common/Services/database-list.service';
declare var $: any;

@Component({
  selector: 'app-master-analytics-dashboard',
  templateUrl: './master-analytics-dashboard.component.html'
})
export class MasterAnalyticsDashboardComponent implements OnInit {
  analyticsDashboard: any = [];
  analyticsDiscoveryData: any;
  analyticsSchemaData: any;
  analyticsAlertData: any = {
    offline_worker_nodes: 0,
    total_schemas_in_error: 0,
    total_unassigned_schemas: 0,
  };
  analyticStatusData: any;
  analyticDashboardCalls: any;
  licenseType: any;
  show_app_excel: boolean;
  analyticsStatusCalls: any;
  disableAnalytics:boolean = true;

  proReportsList = [
    { reportName: 'Assessment Summary Report', requestName: 'summary' },
    { reportName: 'Schema Assessment Reports', requestName: 'schema_reports' },
  ];
  // enterpriseReportsList = [{'reportName':'Assessment Summary Report','requestName':'summary'},
  //               {'reportName':'Schema Assessment Reports','requestName':'schema_reports'},
  //               {'reportName':'Business Case Report','requestName':'business'},
  //               {'reportName':'DB and APP Details','requestName':'db_and_app_details'},
  //               {'reportName':'Azure Cost Report','requestName':'azure_cost'},
  //               {'reportName':'On-Premise Oracle Cost Report','requestName':'on_prem_orcale_cost'},
  //               {'reportName':'DB Performance Analytics','requestName':'db_performance_report'}]

  // enterpriseShortReportsList = [{'reportName':'Assessment Summary Report','requestName':'summary'},
  //               {'reportName':'Schema Assessment Reports','requestName':'schema_reports'},
  //               {'reportName':'Business Case Report','requestName':'business'},
  //               {'reportName':'Azure Cost Report','requestName':'azure_cost'},
  //               {'reportName':'On-Premise Oracle Cost Report','requestName':'on_prem_orcale_cost'},
  //               {'reportName':'DB Performance Analytics','requestName':'db_performance_report'}]

  enterpriseReportsList = [
    { reportName: 'Assessment Summary Report', requestName: 'summary' },
    { reportName: 'Schema Assessment Reports', requestName: 'schema_reports' },
    {
      reportName: 'Application Assessment Report',
      requestName: 'db_app_assessment_report',
    },
    {
      reportName: 'DB Performance Analytics',
      requestName: 'db_performance_report',
    },
    { reportName: 'DB & APP Details', requestName: 'db_and_app_details' },
    {
      reportName: 'Current Oracle Cost Report',
      requestName: 'on_prem_orcale_cost',
    },
    { reportName: 'Azure DB Cost Report', requestName: 'azure_cost' },
    { reportName: 'Azure App Cost Report', requestName: 'azure_app_cost' },
    { reportName: 'Current App Cost Report', requestName: 'current_app_cost' },
    {
      reportName: 'ROI & One Time Migration Cost Report',
      requestName: 'roi_one_time_mig_cost',
    },
  ];

  enterpriseShortReportsList = [
    { reportName: 'Assessment Summary Report', requestName: 'summary' },
    { reportName: 'Schema Assessment Reports', requestName: 'schema_reports' },
    {
      reportName: 'Application Assessment Report',
      requestName: 'db_app_assessment_report',
    },
    {
      reportName: 'DB Performance Analytics',
      requestName: 'db_performance_report',
    },
    { reportName: 'DB & APP Details', requestName: 'db_and_app_details' },
    {
      reportName: 'Current Oracle Cost Report',
      requestName: 'on_prem_orcale_cost',
    },
    { reportName: 'Azure Cost Report', requestName: 'azure_cost' },
    { reportName: 'Azure App Cost Report', requestName: 'azure_app_cost' },
  ];

  reportsList: any;
  isSchemaReportsClicked = true;

  constructor(
    private databaseListService: DatabaseListService,
    private modalService: NgbModal,
    private commonservice: CommonServices,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {

    this.licenseType = this.commonservice.getLicenseType();
    if (this.licenseType == 'dmap pro') {
      this.reportsList = this.proReportsList;
    } else {
      console.log(this.enterpriseReportsList, 'enterpriseReportsList');
      this.reportsList = this.enterpriseReportsList;
    }
    this.getAnalyticsDasboardData();
    this.analyticDashboardCalls = setInterval(() => {
      this.getAnalyticsDasboardData();
    }, 5000);
    this.getAnalyticsStatus();
    this.analyticsStatusCalls = setInterval(() => {
      //this.disableAnalytics = this.databaseListService.getRunAnalyticsAllowed();
      this.getAnalyticsStatus();
    }, 5000);
  }
  ngOnDestroy(): void {
    clearInterval(this.analyticDashboardCalls);
    clearInterval(this.analyticsStatusCalls);
  }
  navigateDashboardTabs(showStatusTab) {
    this.isSchemaReportsClicked = showStatusTab;
  }

  getAnalyticsStatus(){
    this.databaseListService.getAnalyticsStatus().subscribe(data => {
     if(data.allowed){
      this.disableAnalytics = false;
     }
     else{
      this.disableAnalytics = true;
     }
     });
  }

  getAnalyticsDasboardData() {
    this.databaseListService.getMasterAnalyticsDetails().subscribe((data) => {
      this.analyticsDashboard = data;
      this.analyticsSchemaData = data.schema_data;
      this.analyticsAlertData = data.alert;
      this.show_app_excel = data.show_app;
      if (this.licenseType == 'dmap enterprise' && !this.show_app_excel) {
        this.reportsList = this.enterpriseShortReportsList;
      }

      let totalCompleteValue: any = 0;
      if (this.analyticsSchemaData.data.length > 0) {
        for (let i in this.analyticsSchemaData.data) {
          if (this.analyticsSchemaData.data[i]['status'] == 'Completed') {
            totalCompleteValue =
              totalCompleteValue +
              this.analyticsSchemaData.data[i]['analytics_total_schemas'];
          }
        }
      }

      if (this.analyticsDashboard.completion_time == '') {
        this.analyticsDashboard.completion_time = 'Not Started';
      }

      if (this.analyticsDashboard.analytics_status == 'Not Started') {
        this.analyticStatusData = 'Not Started';
      } else if (this.analyticsDashboard.analytics_status == 'In Progress') {
        this.analyticStatusData = 'In Progress';
      } else if (
        this.analyticsDashboard.analytics_status == 'Partially Completed'
      ) {
        this.analyticStatusData = 'Partially Completed';
      } else if (this.analyticsDashboard.analytics_status == 'Error') {
        this.analyticStatusData = 'Completed with Error';
      } else if (this.analyticsDashboard.analytics_status == 'Completed') {
        // if (
        //   this.analyticsDashboard.analytics_error_schema_count == 0 &&
        //   totalCompleteValue == this.analyticsDashboard.total_schemas
        // ) {
          this.analyticStatusData =
            'Completed ' +
            totalCompleteValue.toString() +
            ' of ' +
            this.analyticsDashboard.total_schemas +
            ' assessments';
        // } else {
        //   this.analyticStatusData =
        //     'Completed ' +
        //     totalCompleteValue.toString() +
        //     ' of ' +
        //     this.analyticsDashboard.total_schemas +
        //     ' assessments';
        // }
      }
    });
  }
  viewDetail() {
    this.openAlert(this.analyticsDashboard.analytics_err_msg);
  }

  generateAnalyticsReport() {
    this.spinner.show();
    this.disableAnalytics = true;
    this.databaseListService.getOfflineVmDetails().subscribe((response) => {
      if (response.offline_vms > 0) {
        this.spinner.hide();
        const modalRef = this.modalService.open(NgbdConfirmationModal);
        let message = '';
        if (response.offline_vms == 1) {
          message = 'node is';
        } else {
          message = 'nodes are';
        }
        modalRef.componentInstance.data = {
          msg:
            response.offline_vms +
            ' worker ' +
            message +
            ' offline. ' +
            response.total_analytics_assessment_completed_schemas +
            ' of ' +
            response.total_schemas +
            ' assessments are completed. Do you wish to generate Analytics reports?',
          title: 'Confirmation',
          okButtonLabel: 'Yes',
          cancelButtonLabel: 'No',
          label: 'moveToCompletion',
        };
        modalRef.result.then((result) => {
          if (result == 'ok') {
            this.disableAnalytics = true;
            this.handleAnalytics();
          }
        });
      } else {
        this.disableAnalytics = true;
        this.spinner.hide();
    this.handleAnalytics();
      }
    });
  }
  handleAnalytics() {
    this.databaseListService.validateAnalyticsReport().subscribe((data) => {
        if (data.status !== 'success') {
            this.showAnalyticsConfirmationModal(data.message);
        } else {
            this.generateAnalyticsReportCopy();
        }
    });
}

showAnalyticsConfirmationModal(message) {
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {
        msg: message,
        title: 'Confirmation',
        okButtonLabel: 'Yes',
        cancelButtonLabel: 'No',
        label: 'validate_analytics'
    };
    modalRef.result.then((result) => {
        if (result === 'ok') {
            this.generateAnalyticsReportCopy();
        }
    });
}

generateAnalyticsReportCopy() {
    this.databaseListService.generateAnalyticsReport().subscribe((data) => {
        if (data.status !== 'success') {
            this.openAlert(data.message);
        }
    });
}

  downloadReports() {}
  viewLogs() {}
  viewSchemaDetails(stage, status, report_type) {
    if (status == 'In Error') {
      status = 'Error';
    }
    if (stage == 'auto conversion') {
      if (status == 'Completed') {
        status = 'Processing Done';
      }
      stage = 'schema conversion';
    }
    let reqObj = { stage: stage, status: status, report_type: report_type };
    this.spinner.show();
    let schemaDetails: any = {};
    let dashboardData: any;
    this.databaseListService.getSchemaDetails(reqObj).subscribe((data) => {
      this.spinner.hide();
      if ((data.status = 'success')) {
        dashboardData = data.data;
        if (dashboardData.length > 0) {
          if (stage != null) {
            schemaDetails.title =
              'Schema Details: ' +
              stage.charAt(0).toUpperCase() +
              stage.slice(1) +
              ' - ' +
              status;
          } else {
            schemaDetails.title = 'Schema Details';
          }
          if (status == 'Error') {
            schemaDetails.headers = [
              { name: 'Application', widthStyle: '15%' },
              { name: 'Business Unit', widthStyle: '15%' },
              { name: 'Source Schema', widthStyle: '15%' },
              { name: 'Source DB', widthStyle: '15%' },
              { name: 'Assigned VM', widthStyle: '10%' },
              { name: 'Last Updated', widthStyle: '10%' },
              { name: 'Error', widthStyle: '5%' },
              { name: 'Reset Error Rerun', widthStyle: '25%' },
            ];
            schemaDetails.show_error = 'show';
          } else {
            schemaDetails.headers = [
              { name: 'Application Name', widthStyle: '15%' },
              { name: 'Business Unit', widthStyle: '15%' },
              { name: 'Source Schema Name', widthStyle: '15%' },
              { name: 'Source DB Name', widthStyle: '15%' },
              { name: 'Assigned VM', widthStyle: '15%' },
              { name: 'Last Updated', widthStyle: '15%' },
            ];
            schemaDetails.show_error = 'hide';
          }

          schemaDetails.showId = 'analyticsDasboard';

          schemaDetails.content = dashboardData;

          const modalRef = this.modalService.open(DmapBatchDetailsComponent, {
            size: 'lg',
            scrollable: true,
          });
          modalRef.componentInstance.data = schemaDetails;
          modalRef.result.then((result) => {
            if (result == 'ok') {
              console.log('ok');
            }
            // else {
            // }
          });
        } else {
          if (report_type == 'analytics') {
            this.openAlert(
              'No schemas found. Please run analytics to view schema details.'
            );
          } else {
            this.openAlert(
              'No schemas found in ' + status + ' status to display'
            );
          }
        }
      } else {
        this.openAlert(data.message);
      }
    });
  }
  openAlert(msg) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      // if (result === 'ok') {
      // }
    });
  }

  viewErrorSchemas() {}
  assignUnassignedSchemas() {
    $('#nav-dbList-tab').trigger('click');
  }
  reviewWorkerNodes() {
    $('#nav-workerNode-tab').trigger('click');
  }
  downloadReport(reportType) {
    if (reportType == 'schema_reports') {
      this.spinner.show();
      this.databaseListService.downloadSchemaReport().subscribe((res) => {
        this.handleDownloadedReport(res, 'Schema Discovery and Assessment Reports.zip');
      });
    } else if (reportType == 'summary') {
      this.spinner.show();
      if (this.licenseType == 'dmap enterprise') {
        this.databaseListService.validateResponse({ type: 'summary' }).subscribe((resp) => {
            if (resp.status === false) {
              this.spinner.hide();
              this.openAlert(resp.message);
            } else {
              this.downloadAnalyticsSummaryReport();
            }
          });
      } else {
        this.downloadAnalyticsSummaryReport();
      }
    } else if (reportType == 'business') {
      this.spinner.show();
      this.databaseListService.validateResponse({ type: 'business' }).subscribe((resp) => {
          if (resp.status === false) {
            this.spinner.hide();
            this.openAlert(resp.message);
          } else {
            this.databaseListService.downloadBusinessCaseReport().subscribe((res) => {
              this.handleDownloadedReport(res, 'Oracle to PostgresSQL Business Case.pptx');
              });
          }
        });
    } else if (reportType == 'db_and_app_details') {
      this.spinner.show();
      this.databaseListService.validateResponse({ type: 'db_and_app_details' }).subscribe((resp) => {
          if (resp.status === false) {
            this.spinner.hide();
            this.openAlert(resp.message);
          } else {
            this.databaseListService.downloadDBAPPReport().subscribe((res) => {
              this.handleDownloadedReport(res, 'DB_App_Details.xlsx');
            });
          }
        });
    } else if (reportType == 'azure_cost') {
      this.spinner.show();
      this.databaseListService.validateResponse({ type: 'azure_cost' }).subscribe((resp) => {
          if (resp.status === false) {
            this.spinner.hide();
            this.openAlert(resp.message);
          } else {
            this.databaseListService.downloadAzureCostReport().subscribe((res) => {
              this.handleDownloadedReport(res, 'Azure_Oracle_Cost.xlsx');
              });
          }
        });
    } else if (reportType == 'on_prem_orcale_cost') {
      this.spinner.show();
      this.databaseListService.validateResponse({ type: 'on_prem_orcale_cost' }).subscribe((resp) => {
          if (resp.status === false) {
            this.spinner.hide();
            this.openAlert(resp.message);
          } else {
            this.databaseListService.downloadOnPremOracleCostReport().subscribe((res) => {
              this.handleDownloadedReportWithDate(res, 'CurrentOracleCost');
              });
          }
        });
    } else if (reportType == 'azure_app_cost') {
      this.spinner.show();
      this.databaseListService.validateResponse({ type: 'azure_app_cost' }).subscribe((resp) => {
          if (resp.status === false) {
            this.spinner.hide();
            this.openAlert(resp.message);
          } else {
            this.databaseListService.downloadAzureAppCostReport().subscribe((res) => {
              this.handleDownloadedReportWithDate(res, 'AzureDatabaseCost');
              });
          }
        });
    } else if (reportType == 'db_performance_report') {
      this.spinner.show();
      this.databaseListService.validateResponse({ type: 'db_performance_report' }).subscribe((resp) => {
          if (resp.status === false) {
            this.spinner.hide();
            this.openAlert(resp.message);
          } else {
            this.databaseListService.downloadDBPerformanceReport().subscribe((res) => {
              this.handleDownloadedReport(res, 'DB_Performance_Analytics.zip');
              });
          }
        });
    } else if (reportType == 'db_app_assessment_report') {
      this.spinner.show();
      this.databaseListService.validateResponse({ type: 'db_app_assessment_report' }).subscribe((resp) => {
          if (resp.status === false) {
            this.spinner.hide();
            this.openAlert(resp.message);
          } else {
            this.databaseListService.downloadAppDBReport().subscribe((res) => {
              this.handleDownloadedReport(res, 'Application_Assessment_Reports.zip');
            });
          }
        });
    } else if (reportType == 'current_app_cost') {
      this.spinner.show();
      this.databaseListService.validateResponse({ type: 'current_app_cost' }).subscribe((resp) => {
          if (resp.status === false) {
            this.spinner.hide();
            this.openAlert(resp.message);
          } else {
            this.databaseListService.downloadCurrentAppReport().subscribe((res) => {
              this.handleDownloadedReportWithDate(res, 'CurrentApplicationCost');
              });
          }
        });
    } else if (reportType == 'roi_one_time_mig_cost') {
      this.spinner.show();
      this.databaseListService.validateResponse({ type: 'roi_one_time_mig_cost' }).subscribe((resp) => {
          if (resp.status === false) {
            this.spinner.hide();
            this.openAlert(resp.message);
          } else {
            this.databaseListService.downloadROIOneTimeMigrationReport().subscribe((res) => {
              this.handleDownloadedReport(res, 'ROI&OneTimeMigrationCost.xlsx');
              });
          }
        });
    }
  }
  downloadAnalyticsSummaryReport() {
    this.databaseListService.downloadAnalyticsSummaryReport().subscribe((res) => {
      this.spinner.hide();
      if (res.type == 'application/json') {
        this.openAlert(
          'File does not exists. Please make sure you clicked on "Generate Analytics Report" button to generate the file and Analytics Status is "Completed".'
        );
      } else {
        let client = '';
        let filename = '';
        this.databaseListService.getClientName().subscribe((resp) => {
            client = resp.client_name;
            let blob = new Blob([res], {});
            if (resp.client_name != '') {
              filename =
              'SchemaAnalytics_' +
                client +
                this.get_date() +
                '.xlsx';
            } else {
              filename =
                'SchemaAnalytics_' +
                this.get_date() +
                '.xlsx';
            }
            saveAs.saveAs(blob, filename);
          });
      }
    });
  }
  handleDownloadedReport(res, filename) {
    this.spinner.hide();
    if (res.type === 'application/json') {
        this.openAlert(
            'File does not exist. Please make sure you clicked on "Generate Analytics Report" button to generate the file and Analytics Status is "Completed".'
        );
    } else {
        let blob = new Blob([res], {});
        saveAs.saveAs(blob, filename);
    }
}
handleDownloadedReportWithDate(res, reportType) {
  this.spinner.hide();
  if (res.type === 'application/json') {
      this.openAlert(
          'File does not exist. Please make sure you have filled all the questionnaires and run Analytics process.'
      );
  } else {
      let client = '';
      this.databaseListService.getClientName().subscribe((resp) => {
          client = resp.client_name;
          let blob = new Blob([res], {});
          let filename = `${reportType}_${client}_${this.get_date()}.xlsx`; // e.g., CurrentOracleCost_BlueSkyInc_08Aug2023.xlsx
          saveAs.saveAs(blob, filename);
      });
  }
}

  emailReport(reportType) {
    this.spinner.show();
    let reqObj = { reportType: reportType };
    this.databaseListService.emailReports(reqObj).subscribe((res) => {
      this.spinner.hide();
      if (res.status == 'success') {
        this.openAlert('Email sent successfully.');
      } else {
        this.openAlert(res['message']);
      }
    });
  }

  get_date() {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ];
    let current_datetime = new Date();
    let formatted_date =
      current_datetime.getDate() +
      months[current_datetime.getMonth()] +
      current_datetime.getFullYear();
    return formatted_date;
  }
}
