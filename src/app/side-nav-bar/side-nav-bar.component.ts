import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';

import { LoginService } from '../common/Services/login-service.service';
import { Sql2PgService } from '../common/Services/sql2pg.service';

import { Observable } from 'rxjs';
import { DmapVersionDetailsComponent } from '../dmap-version-details/dmap-version-details.component';
import { DmapLicenseDetailsComponent } from '../dmap-license-details/dmap-license-details.component';

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
    this.spinner.show();
    let res = [{ status: 'failed' }];

    const modalRef = this.modalService.open(DmapVersionDetailsComponent, {
      size: 'lg',
      scrollable: true,
    });

    modalRef.componentInstance.data = {
      title: 'DMAP Version',
      imageDetails: '1234',
      appImageDetails: '5678',
    };
    this.spinner.hide();
    // this.sql2PgService.getDMAPVersionDetails().subscribe((data) => {
    //   this.spinner.hide();
    //   const modalRef = this.modalService.open(DmapVersionDetailsComponent, {
    //     size: 'lg',
    //     scrollable: true,
    //   });

    //   modalRef.componentInstance.data = {
    //     title: 'DMAP Version',
    //     imageDetails: data[0],
    //     appImageDetails: res[0],
    //   };
    //   modalRef.result.then((result) => {});
    // });
  }

  viewLicenseDetails() {
    let showFeature = sessionStorage.getItem('show_license_details');
    let headers;
    let featureDetails;
    let final_featureDetails = [];
    this.spinner.show();

    const modalRef = this.modalService.open(DmapLicenseDetailsComponent, {
      size: 'lg',
      scrollable: true,
    });

    headers = [
      { name: 'Feature', widthStyle: '30%' },
      { name: 'Allowed', widthStyle: '30%' },
      { name: 'Used', widthStyle: '30%' },
    ];
    modalRef.componentInstance.data = {
      title: 'License Details',
      node_type: this.nodeType,
      show_features: showFeature,
      historyLicense: 'history',
      activeLicense: 'current',
      featureDetails: final_featureDetails,
      headers: headers,
    };

    modalRef.result.then((result) => {});

    this.spinner.hide();

    // this.sql2PgService.getLicenseDetails().subscribe((data) => {
    //   this.spinner.hide();
    //   const modalRef = this.modalService.open(DmapLicenseDetailsComponent, {
    //     size: 'lg',
    //     scrollable: true,
    //   });
    //   if (data['current'].length > 0) {
    //     featureDetails = data['current'][0].featuresDetail;
    //   } else {
    //     featureDetails = [];
    //   }

    //   for (let i in featureDetails) {
    //     if (this.nodeType == 'analytics_master') {
    //       if (
    //         featureDetails[i]['feature'] == 'Analytics schema assessment limit'
    //       ) {
    //         final_featureDetails.push(featureDetails[i]);
    //       }
    //     } else {
    //       if (
    //         featureDetails[i]['feature'] != 'Analytics schema assessment limit'
    //       ) {
    //         final_featureDetails.push(featureDetails[i]);
    //       }
    //     }
    //   }

    //   headers = [
    //     { name: 'Feature', widthStyle: '30%' },
    //     { name: 'Allowed', widthStyle: '30%' },
    //     { name: 'Used', widthStyle: '30%' },
    //   ];
    //   modalRef.componentInstance.data = {
    //     title: 'License Details',
    //     node_type: this.nodeType,
    //     show_features: showFeature,
    //     historyLicense: data['history'],
    //     activeLicense: data['current'],
    //     featureDetails: final_featureDetails,
    //     headers: headers,
    //   };

    //   modalRef.result.then((result) => {});
    // });
  }
}
