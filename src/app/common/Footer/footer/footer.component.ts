import { Component, OnInit, SimpleChanges } from '@angular/core';
import { LoginService } from '../../Services/login-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { ShowLicenseDetailsComponent } from 'src/app/documentation/license/show-license-details/show-license-details.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShowDmapNotificationsComponent } from 'src/app/documentation/notifications/show-dmap-notifications/show-dmap-notifications.component';
import { CommonServices } from '../../Services/common-services.service';
import { ContactUsComponent } from 'src/app/documentation/contact-us/contact-us.component';
import { FaqComponent } from 'src/app/documentation/faq/faq.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DmapBackupProgressModalComponent } from '../../Modal/dmap-backup-progress-modal/dmap-backup-progress-modal.component';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [
    trigger('rotateArrow', [
      state('collapsed', style({
        transform: 'rotate(-180deg)',
      })),
      state('expanded', style({
        transform: 'rotate(0)',
      })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
export class FooterComponent implements OnInit {
  userLogin: string;
  nodeType: string;
  showLicenseDetails: any;
  currentYearForCopyRight = new Date().getFullYear();
  constructor(
    private loginService: LoginService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private commonservice: CommonServices,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.userLogin = sessionStorage.getItem('user_name');

    this.nodeType = sessionStorage.getItem('node_type');

    this.loginService.$userLogedInObj.subscribe((userEmail: any) => {
      let isLogin = sessionStorage.getItem('isLogin');

      if (this.userLogin == null && isLogin != null) {
        this.userLogin = userEmail;
      } else if (isLogin == null || isLogin == undefined) {
        this.userLogin = null;
      }
    });

    this.loginService.$nodeTypeObj.subscribe((nodeTypee: any) => {
      this.nodeType = nodeTypee;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userLogin = sessionStorage.getItem('user_name');
    this.nodeType = sessionStorage.getItem('node_type');
  }


  isCollapsed = false;

  toggleCollapse() {
     this.modalService.open(
      DmapBackupProgressModalComponent,
      { size: 'lg', scrollable: true, backdrop: 'static' }
    );
    this.commonservice.toggleMinWindow();
  }

  get showMinWindow$() {
    return this.commonservice.showMinWindow$;
  }

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

  getDMAPImageDetails() {
    this.spinner.show();
    this.loginService.getDMAPImageDetails().subscribe((data) => {
      this.spinner.hide();
      const modalRef = this.modalService.open(ShowDmapNotificationsComponent, {
        size: 'lg',
        scrollable: true,
      });

      modalRef.componentInstance.data = {
        title: 'DMAP Image Details',
        imageDetails: data[0],
      };
      modalRef.result.then((result) => {
        // if (result.status == 'success') {
        // }
      });
    });
  }

  viewFaqs() {
    const modalRef = this.modalService.open(FaqComponent, {
      size: 'lg',
      scrollable: true,
    });

    modalRef.componentInstance.data = { title: 'Frequently Asked Questions' };
  }

  viewContactDetails() {
    const modalRef = this.modalService.open(ContactUsComponent, {
      size: 'lg',
      scrollable: true,
    });

    modalRef.componentInstance.data = { title: 'Contact Us' };
  }
}
