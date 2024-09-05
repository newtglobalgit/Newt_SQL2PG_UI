import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';

import { Sql2PgService } from '../common/Services/sql2pg.service';
import { NgbdConfirmationModal } from '../common/Modal/dmap-confirmation-dialog/dmap-confirmation-dialog.component';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { DmapVersionDetailsComponent } from '../dmap-version-details/dmap-version-details.component';
import { DmapLicenseDetailsComponent } from '../dmap-license-details/dmap-license-details.component';
import { DmapBackupProgressModalComponent } from '../common/Modal/dmap-backup-progress-modal/dmap-backup-progress-modal.component';

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
  visibleMiscellaneous;
  visibleValidation: boolean = false;
  visibleSettings: boolean = false;
  visibleMisc: boolean = false;
  nodeType: string;
  userLogin: string;
  licenseType: any;
  settings_label: any;
  showArrow1: boolean = false;
  showArrow2: boolean = true;
  showArrow3: boolean = true;

  disableAnalytics: boolean = true;
  appRemediationLive: boolean = false;
  analyticsStatusCalls: any;
  globalMenuData: any;
  activeMenuItem = '';
  appContainerDown: boolean = true;
  appNodeNotConfigured: boolean = true;
  visibleSchemaValidation: boolean = false;

  visibleDataMigration: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router,
    private sql2PgService: Sql2PgService
  ) {}

  ngOnInit(): void {
    this.sideNavBarOpen = true;
    this.userLogin = sessionStorage.getItem('user_name');
    this.nodeType = sessionStorage.getItem('nodeType');
    this.licenseType = sessionStorage.getItem('licenseType');

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

  toggleCollapseAssessment(): void {
    this.visibleAssessment = !this.visibleAssessment;
    this.showArrow1 = !this.showArrow1;
  }
  toggleCollapseSettings(): void {
    this.visibleSettings = !this.visibleSettings;
    this.showArrow2 = !this.showArrow2;
  }
  toggleCollapseMiscellaneous(): void {
    this.visibleMiscellaneous = !this.visibleMiscellaneous;
    this.showArrow3 = !this.showArrow3;
  }

  putActiveClass(subMenuItems, menuName = '') {
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

  async getDMAPVersionDetails() {
    const modalRef = this.modalService.open(DmapVersionDetailsComponent, {
      size: 'lg',
      scrollable: true,
    });

    modalRef.componentInstance.data = {
      title: 'DMAP Version',
    };
  }

  viewLicenseDetails() {
    const modalRef = this.modalService.open(DmapLicenseDetailsComponent, {
      size: 'lg',
      scrollable: true,
    });

    modalRef.componentInstance.data = {
      title: 'License Details',
    };

    modalRef.result.then((result) => {});

    this.spinner.hide();
  }

  dmapBackup() {
    const modalRef = this.modalService.open(NgbdConfirmationModal);
    modalRef.componentInstance.data = {
      msg: 'On completion of backup, please save the downloaded .tar.gz file in a secure location. If you reinstall the DMAP image and create a new container for DMAP, then the downloaded backup file will be required to restore the data of DB schema assessments and migrations done using DMAP.  Data will be restored to the point you previously backed up data.',
      title: 'Confirmation',
      okButtonLabel: 'Continue',
      cancelButtonLabel: 'Cancel',
      label: 'restoreDmap',
    };
    modalRef.result.then((result) => {
      if (result == 'ok') {
        const progressModalRef = this.modalService.open(
          DmapBackupProgressModalComponent,
          { size: 'lg', scrollable: true, backdrop: 'static' }
        );
        this.sql2PgService.backupDMAP().subscribe((res) => {
          if (res.type == 'application/json' || res.type == 'text/html') {
            progressModalRef.componentInstance.vmBkpStatus = res;
          } else {
            let blob = new Blob([res], {});
            let filename = 'dmap_complete.tar.gz';
            FileSaver.saveAs(blob, filename);
            this.openAlert('Backup Downloaded Successfully.', true);
          }
        });
      }
    });
  }

  openAlert(msg, closeAll: boolean) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      if (result === 'ok' && closeAll) {
        this.modalService.dismissAll();
      }
    });
  }
}
