import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbdConfirmationModal } from '../common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DatabaseListService } from '../common/Services/database-list.service';
import { LoginService } from '../common/Services/login-service.service';
import { ShowLicenseDetailsComponent } from '../documentation/license/show-license-details/show-license-details.component';
import { ShowDmapNotificationsComponent } from '../documentation/notifications/show-dmap-notifications/show-dmap-notifications.component';
import { AssessmentLogsComponent } from '../common/Modal/assessment-logs/assessment-logs.component';
import { DmapMasterEmailSettingsModalComponent } from '../common/Modal/dmap-master-email-settings-modal/dmap-master-email-settings-modal.component';
import { DmapMasterSettingsModalComponent } from '../common/Modal/dmap-master-settings-modal/dmap-master-settings-modal.component';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { MenuMappingService } from '../common/Services/menu-mapping.service';
import { CommonServices } from '../common/Services/common-services.service';
import { DmapBackupProgressModalComponent } from '../common/Modal/dmap-backup-progress-modal/dmap-backup-progress-modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.css'],
})
export class SideNavBarComponent implements OnInit {
  isShowNavBar: boolean = false;
  isShowNavBarWelcomeSection: boolean = true;
  sideNavBarOpen: boolean = false;
  visible: boolean = false;
  visibleAssessment: boolean = true;
  visibleValidation: boolean = false;
  visibleSettings: boolean = false;
  visibleMisc: boolean = false;
  nodeType: string;
  userLogin: string;
  licenseType: any;
  settings_label: any;
  showArrow1: boolean = true;
  showArrow2: boolean = false;
  showArrow3: boolean = true;
  showArrow4: boolean = true;
  showArrow5: boolean = true;
  disableAnalytics: boolean = true;
  appRemediationLive: boolean = false;
  analyticsStatusCalls: any;
  globalMenuData: any;
  activeMenuItem = '';
  appContainerDown: boolean = true;
  appNodeNotConfigured: boolean = true;
  visibleSchemaValidation: boolean = false;
  showArrow6: boolean = true;
  showArrow7: boolean = true;
  visibleDataMigration: boolean = false;

  constructor(
    private menuMapping: MenuMappingService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private databaseListService: DatabaseListService,
    private commonServices: CommonServices,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.commonServices.callMenuControl$.subscribe((data:any) => {
      if (data != undefined && data === true && sessionStorage.getItem('isLogin')) {
        this.getMenuAndPageMapping();
      }
    });
    if (sessionStorage.getItem('isLogin')) {
      this.getMenuAndPageMapping();
    }
    // this.sideNavBarOpen = this.dmapExtensionScanService.sideNavBarOpen;
    this.sideNavBarOpen = true;
    this.userLogin = sessionStorage.getItem('user_name');
    this.nodeType = sessionStorage.getItem('nodeType');
    this.licenseType = sessionStorage.getItem('licenseType');
    this.loginService.$nodeTypeObj.subscribe((nodeTypee: any) => {
      this.nodeType = nodeTypee;
    });

    this.analyticsStatusCalls = setInterval(() => {
      this.disableAnalytics = this.databaseListService.getRunAnalyticsAllowed();
    }, 5000);

    this.loginService.$userLogedInObj.subscribe((userEmail: any) => {
      let isLogin = sessionStorage.getItem('isLogin');

      if (this.userLogin == null && isLogin != null) {
        this.userLogin = userEmail;
      } else if (isLogin == null || isLogin == undefined) {
        this.userLogin = null;
      }
    });

    if (
      this.licenseType == 'dmap pro' ||
      this.licenseType == 'dmap enterprise'
    ) {
      this.settings_label = 'Node';
    } else {
      this.settings_label = 'Time Zone';
    }

    if (window.location.href.indexOf('dbScripts') > 1) {
      this.sideNavBarOpen = false;
    }

    const currentRoute = this.router.url;
    if (currentRoute.includes('dbDashboard')) {
      this.activeMenuItem = 'dbDashboard';
    } else if (currentRoute.includes('appDashboard')) {
      this.activeMenuItem = 'appDashboard';
    }
  }

  isLinkActive(route: string) {
    return this.router.isActive(route, true);
  }

  ngOnDestroy(): void {
    clearInterval(this.analyticsStatusCalls);
  }

  // pingAndGetAppNodeStatus() {
  //   this.appContainerDown = this.dmapExtensionScanService.appContainerDown;
  //   this.appNodeNotConfigured =
  //     this.dmapExtensionScanService.appNodeNotConfigured;
  //   setInterval(() => {
  //     this.appContainerDown = this.dmapExtensionScanService.appContainerDown;
  //     this.appNodeNotConfigured =
  //       this.dmapExtensionScanService.appNodeNotConfigured;
  //   }, 3000);
  // }

  getMenuAndPageMapping() {
    this.menuMapping.getMenuAndPageMapping().subscribe((data) => {
      if (data) {
        this.globalMenuData = data;
      } else {
        console.error('menu data issue..');
      }
    });
  }

  getAnalyticsStatus() {
    this.databaseListService.getAnalyticsStatus().subscribe((data) => {
      if (data.allowed) {
        this.disableAnalytics = false;
      } else {
        this.disableAnalytics = true;
      }
    });
  }

  toggleCollapse(): void {
    this.visible = !this.visible;
    this.showArrow1 = !this.showArrow1;
  }
  toggleCollapseAssessment(): void {
    this.visibleAssessment = !this.visibleAssessment;
    this.showArrow2 = !this.showArrow2;
  }
  toggleCollapseValidation(): void {
    this.visibleValidation = !this.visibleValidation;
    this.showArrow3 = !this.showArrow3;
  }
  toggleCollapseSettings(): void {
    this.visibleSettings = !this.visibleSettings;
    this.showArrow4 = !this.showArrow4;
  }
  toggleCollapseMisc(): void {
    this.visibleMisc = !this.visibleMisc;
    this.showArrow5 = !this.showArrow5;
  }
  toggleCollapseSchemaValidation():void{
    this.visibleSchemaValidation = !this.visibleSchemaValidation;
    this.showArrow6 = !this.showArrow6;
  }
  toggleCollapseDataMigration():void{
    this.visibleDataMigration = !this.visibleDataMigration;
    this.showArrow7 = !this.showArrow7;
  }

  async getDMAPImageDetails() {
    this.spinner.show();
    // this.pingAndGetAppNodeStatus();

    if (this.appContainerDown === false && this.appNodeNotConfigured === false) {
      let dbRes:any = [];
      let appRes:any = [];
      try {
        dbRes = await this.loginService.getDMAPImageDetails().toPromise();
      } catch (err) {
        dbRes = [{status: 'failed'}];
      }

      try {
        // appRes = await this.dmapExtensionScanService.getDMAPAppImageDetails().toPromise();
      } catch (err) {
        appRes = [{status: 'failed'}];
      }
            this.spinner.hide();
            const modalRef = this.modalService.open(
              ShowDmapNotificationsComponent,
              {
                size: 'lg',
                scrollable: true,
              }
            );
            modalRef.componentInstance.data = {
              title: 'DMAP Image Details',
              imageDetails: dbRes[0],
              appImageDetails: appRes[0],
            };
            modalRef.result.then((result) => {
              // if (result.status == 'success') {
              // }
            });
    } else {
      this.spinner.show();
      let res = [{ status: 'failed' }];
      this.loginService.getDMAPImageDetails().subscribe((data) => {
        this.spinner.hide();
        const modalRef = this.modalService.open(
          ShowDmapNotificationsComponent,
          {
            size: 'lg',
            scrollable: true,
          }
        );

        modalRef.componentInstance.data = {
          title: 'DMAP Version',
          imageDetails: data[0],
          appImageDetails: res[0],
        };
        modalRef.result.then((result) => {
          // if (result.status == 'success') {
          // }
        });
      });
    }
  }

  // getDMAPImageDetails() {
  //   this.spinner.show();
  //   this.loginService.getDMAPImageDetails().subscribe((data) => {
  //     this.spinner.hide();
  //     const modalRef = this.modalService.open(ShowDmapNotificationsComponent, {
  //       size: 'lg',
  //       scrollable: true,
  //     });

  //     modalRef.componentInstance.data = {
  //       title: 'DMAP Version',
  //       imageDetails: data[0],
  //     };
  //     modalRef.result.then((result) => {
  //       if (result.status == 'success') {
  //       }
  //     });
  //   });
  // }

  viewLicenseDetails() {
    let showFeature = sessionStorage.getItem('show_license_details');
    let headers;
    let featureDetails;
    let final_featureDetails = [];
    this.nodeType = sessionStorage.getItem('node_type');
    // let reqObj = { user_name: sessionStorage.getItem('user_name') };
    this.spinner.show();
    this.loginService.getLicenseDetails().subscribe((data) => {
      this.spinner.hide();
      const modalRef = this.modalService.open(ShowLicenseDetailsComponent, {
        size: 'lg',
        scrollable: true,
      });
      if (data['current'].length > 0) {
        featureDetails = data['current'][0].featuresDetail;
      } else {
        featureDetails = [];
      }

      for (let i in featureDetails) {
        if (this.nodeType == 'analytics_master') {
          if (
            featureDetails[i]['feature'] == 'Analytics schema assessment limit'
          ) {
            final_featureDetails.push(featureDetails[i]);
          }
        } else {
          if (
            featureDetails[i]['feature'] != 'Analytics schema assessment limit'
          ) {
            final_featureDetails.push(featureDetails[i]);
          }
        }
      }

      headers = [
        { name: 'Feature', widthStyle: '30%' },
        { name: 'Allowed', widthStyle: '30%' },
        { name: 'Used', widthStyle: '30%' },
      ];
      modalRef.componentInstance.data = {
        title: 'License Details',
        node_type: this.nodeType,
        show_features: showFeature,
        historyLicense: data['history'],
        activeLicense: data['current'],
        featureDetails: final_featureDetails,
        headers: headers,
      };

      modalRef.result.then((result) => {
        // if (result.status == 'success') {
        // }
      });
    });
  }


  masterBackup() {
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {
      msg: 'On completion of backup, please save the downloaded .tar.gz file in a secure location. If you reinstall the DMAP image and create a new container for DMAP, then the downloaded backup file will be required to restore the data of DB schema assessments and migrations done using DMAP.  Data will be restored to the point you previously backed up data.',
      title: 'Confirmation',
      okButtonLabel: 'Continue',
      cancelButtonLabel: 'Cancel',
      label: 'restoreDmap',
      showRadioButtons: true 
    };
    modalRef.result.then((result) => {
      if (result == 'ok') {
        const appBackupRequired = modalRef?.componentInstance?.data?.showRadioButtons 
        ? modalRef.componentInstance.userChoice === 'yes' 
        : false;
        const progressModalRef = this.modalService.open(
          DmapBackupProgressModalComponent,
          { size: 'lg', scrollable: true, backdrop: 'static' }
        );
        this.databaseListService.backupDMAP(appBackupRequired).subscribe((res) => {
          if (res.type == 'application/json' || res.type == "text/html") {
            progressModalRef.componentInstance.vmBkpStatus = res
          } else {
            let blob = new Blob([res], {});
            let filename = 'dmap_complete.tar.gz';
            FileSaver.saveAs(blob, filename);
            this.openAlert(
              "Backup Downloaded Successfully.",
              true
            );
            this.commonServices.closeMinimizedWindow();           }
        });
      }
    });
  }


  // invokeChatGPT(){
  //   const modalRef = this.modalService.open(ChatGptIntegrationComponent, {
  //     size: 'lg',
  //     scrollable: true,
  //   });
  //   modalRef.componentInstance.data = {
  //     title: 'ChatGPT Integration',
  //   };
  //   modalRef.result.then((result) => {
  //     // if (result == 'ok') {
  //     // }
  //   });
  // }

  viewLogs() {
    const modalRef = this.modalService.open(AssessmentLogsComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.data = {
      title: 'View/Download Worker Node Logs',
    };
    modalRef.result.then((result) => {
    });
  }

  private downloadKit(platform: string, kitType: string): void {
    let downloadObservable: Observable<any>;
    
    if (kitType === 'data_migration') {
      downloadObservable = this.databaseListService.downloadDMKit(platform);
    } else if (kitType === 'schema_validation') {
      downloadObservable = this.databaseListService.schemaValidationDMKit(platform);
    } else if (kitType === 'data_validation') {
      downloadObservable = this.databaseListService.dataValidationDMKit(platform);
    }

    downloadObservable.subscribe((res) => {
      const blob = new Blob([res], {});
      let filename;
      if (platform === 'linux') {
        filename = '${kitType}_kit.tar';
      } else {
        filename = '${kitType}_kit.zip';
      }
      FileSaver.saveAs(blob, filename);
      if (res['status'] === false) {
        this.openAlert(res['message'], false);
      }
    });
  }
  downloadDMKit(platform: string): void {
    this.downloadKit(platform, 'data_migration');
  }
  
  schemaValidationDMKit(platform: string): void {
    this.downloadKit(platform, 'schema_validation');
  }
  
  dataValidationDMKit(platform: string): void {
    this.downloadKit(platform, 'data_validation');
  }

  mailSettings(title, type) {
    const modalRef = this.modalService.open(
      DmapMasterEmailSettingsModalComponent,
      { size: 'lg', scrollable: true, centered: true }
    );
    modalRef.componentInstance.data = { title: title, emailType: type };

    // const modalContent = document.querySelector(
    //   '.modal-content'
    // ) as HTMLElement;
    // modalContent.style.width = '527px';

    modalRef.result.then((result) => {
      // if (result == 'ok') {
      // }
    });
  }

  mailServerSettings(title, type) {
    const modalRef = this.modalService.open(
      DmapMasterEmailSettingsModalComponent,
      { size: 'lg', scrollable: true }
    );
    modalRef.componentInstance.data = { title: title, emailType: type };
    modalRef.result.then((result) => {
      // if (result == 'ok') {
      // }
    });
  }

  // settings(settings_label) {
  //   let node_type;
  //   this.nodeType = sessionStorage.getItem('nodeType');
  //   if (this.nodeType == 'analytics_master') {
  //     node_type = 'analytics_master';
  //   } else {
  //     node_type = 'dmap_node';
  //   }

  //   const modalRef = this.modalService.open(DmapMasterSettingsModalComponent, {
  //     size: 'lg',
  //     scrollable: true,
  //   });
  //   modalRef.componentInstance.data = {
  //     title: settings_label + ' Settings',
  //     node_type: node_type,
  //   };
  //   modalRef.result.then((result) => {
  //     // if (result == 'ok') {
  //     // }
  //   });
  // }

  // appSettings() {
  //   const modalRef = this.modalService.open(AppNodeSettingsComponent, {
  //     size: 'lg',
  //     scrollable: true,
  //   });
  //   modalRef.result.then((result) => {
  //     if (result == 'ok') {
  //       console.log('ok');
  //     }
  //   });
  // }

  putActiveClass(subMenuItems, menuName = '') {
    // if (
    //   menuName == 'appDashboard' ||
    //   menuName == 'appAssessment' ||
    //   menuName == 'appConversion' ||
    //   menuName == 'appWorkerNodeSetup' ||
    //   menuName == 'appJreUpgrade' ||
    //   menuName == 'appMethodMapping'
    // ) {
    //   this.loginService.checkAppNodeStatus().subscribe((data) => {
    //     if (data) {
    //       console.log('app_node_status_sidenav',data['status']);
    //       if (data['status'] == 'success') {
    //         this.appRemediationLive = true;
    //       } else if (data['status'] == 'app_not_configured') {
    //         this.appRemediationLive = false;
    //         this.spinner.hide();
    //         const modalRef = this.modalService.open(NgbdConfirmationModal);
    //         modalRef.componentInstance.data = {
    //           msg: 'Application Remediation node details is not configured.Do you want to setup Application Migration Container ?',
    //           title: 'Confirmation',
    //           okButtonLabel: 'Yes',
    //           cancelButtonLabel: 'No',
    //         };
    //         modalRef.result.then((result) => {
    //           if (result == 'ok') {
    //             const modalRef = this.modalService.open(
    //               AddWorkerNodeComponent,
    //               { size: 'lg', scrollable: true }
    //             );
    //             modalRef.componentInstance.data = {
    //               title: 'Add Master Node',
    //               type: 'master_app_node',
    //             };
    //             modalRef.result.then((result) => {
    //               if (result == 'ok') {
    //                 this.spinner.hide();
    //               }
    //             });
    //           }
    //         });
    //       } else if (data['status'] == 'network_change'){
    //         this.appRemediationLive = false;
    //         this.spinner.hide();
    //         const modalRef = this.modalService.open(NgbdConfirmationModal);
    //         modalRef.componentInstance.data = {
    //           msg: 'Network change detected. Do you want to update the app node details?',
    //           title: 'Confirmation',
    //           okButtonLabel: 'Yes',
    //           cancelButtonLabel: 'No',
    //         };
    //         modalRef.result.then((result) => {
    //           if (result == 'ok') {
    //             const modalRef = this.modalService.open(
    //               AddWorkerNodeComponent,
    //               { size: 'lg', scrollable: true }
    //             );
    //             modalRef.componentInstance.data = {
    //               title: 'Update Master Node',
    //               type: 'update_app_node',
    //             };
    //             modalRef.result.then((result) => {
    //               if (result == 'ok') {
    //                 this.spinner.hide();
    //               }
    //             });
    //           } else {
    //           }
    //         });
    //       }
    //     }
    //     this.spinner.hide();
    //   });
    // } else {
    //   this.spinner.hide();
    // }

    const buttonEle = document.getElementById(
      subMenuItems
    ) as HTMLButtonElement;
    var btns = buttonEle.getElementsByClassName('d-flex');
      console.log(btns);
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var current = document.getElementsByClassName('active');

        if (current.length > 0) {
          current[0].className = current[0].className.replace(' active', '');
        }

        this.className += ' active';
      });
    }
  }

  generateAnalyticsReport(subMenuItems) {
    this.putActiveClass(subMenuItems);
    this.spinner.show();
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
            //$('#nav-analyticsDashboard-tab').trigger('click');
          }
        });
      } else {
        this.spinner.hide();
        this.disableAnalytics = true;
        this.databaseListService.generateAnalyticsReport().subscribe((data) => {
          if (data.status != 'success') {
            this.openAlert(data.message, false);
          }
          // else {
          // }
        });
      }
    });
  }

  openAlert(msg, closeAll:boolean) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      if (result === 'ok' && closeAll) {
        this.modalService.dismissAll();
      }
    });
  }
}
