import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgModule,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../common/Services/login-service.service';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.css'],
})
export class LicenseComponent {
  @ViewChild('l', { static: false }) licenseForm: NgForm;

  licenseKey: any;
  selectedVal: string;
  htmlSnippet: string;
  showInvalidLicenseMsg: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initialize();
  }

  initialize() {
    const floatContainers = document.querySelectorAll('.float-container');

    floatContainers.forEach((element) => {
      if (element.querySelector('input').value) {
        element.classList.add('active');
      }

      this.bindEvents(element);
    });
  }
  /* register events */
  bindEvents(element) {
    const floatField = element.querySelector('input');
    floatField.addEventListener('focus', this.handleFocus);
    floatField.addEventListener('blur', this.handleBlur);
  }

  /* add active class and placeholder */
  handleFocus(e) {
    const target = e.target;
    target.parentNode.classList.add('active');
    target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
  }

  /* remove active class and placeholder */
  handleBlur(e) {
    const target = e.target;
    if (!target.value) {
      target.parentNode.classList.remove('active');
    }
    target.removeAttribute('placeholder');
  }

  onLicenseActivation() {
    this.spinner.show();
    let reqObj = {
      license_key: this.licenseKey,
    };
    this.loginService.activateLicense(reqObj).subscribe((data) => {
      if (data.valid == true) {
        sessionStorage.setItem('auth_token', data.message.auth_token);
        this.router.navigate(['/dbSetup']);
      } else {
        this.showInvalidLicenseMsg = true;
        this.htmlSnippet = data.message.message;
        // this.openAlert(data.message);
      }
      this.spinner.hide();
    });
  }

  openAlert(msg) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {});
  }

  radioChangeHandler(event) {
    this.selectedVal = event.target.value;
  }
}
