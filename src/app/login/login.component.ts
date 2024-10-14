import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../common/Services/login-service.service';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('f', { static: false }) signUpForm: NgForm;
  @ViewChild('l', { static: false }) loginForm: NgForm;
  @ViewChild('p', { static: false }) resetPasswordForm: NgForm;

  sideNavBarOpen: boolean = false;
  userLogin: string;
  hasAccount: boolean = true;
  forgotPassword: boolean = false;
  isConnectionFailed: boolean = true;
  loginFailedMsg: any;
  showSignUpLink: boolean = true;
  userName: string;

  password: string;
  confirmationPassword: string;
  passwordType: string = 'password';
  passwordConfirmationType: string = 'password';

  resetPasswordData: any;

  currentUrl: any;
  cURL: any;
  nodeType: any;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private loginService: LoginService,
    private spinner: NgxSpinnerService
  ) {
    router.events.subscribe((val) => {
      this.currentUrl = window.location.href;
      if (this.currentUrl.indexOf('login') >= 0) {
        this.hasAccount = true;
        this.forgotPassword = false;
      }
      if (this.currentUrl.indexOf('signup') >= 0) {
        this.hasAccount = false;
      }
      if (this.currentUrl.indexOf('resetPassword') >= 0) {
        this.hasAccount = true;
        this.forgotPassword = true;
      }
    });
  }

  ngOnInit() {
    this.initialize();
  }

  ngAfterViewInit() {
    this.initialize();

    // if (this.loginService.isUserLoggedIn()) {
    //   this.loginService.getNodeType().subscribe((data) => {
    //     this.commonservice.setNodeType(data.node_type);
    //     this.commonservice.setLicenseType(data.license_type);
    //     this.router.navigate(['/dbSetup']);
    //   });
    // }
  }

  initialize() {
    this.getUserName();
    const floatContainers = document.querySelectorAll('.float-container');

    floatContainers.forEach((element) => {
      if (element.querySelector('input').value) {
        element.classList.add('active');
      }

      this.bindEvents(element);
    });
  }
  bindEvents(element) {
    const floatField = element.querySelector('input');
    floatField.addEventListener('focus', this.handleFocus);
    floatField.addEventListener('blur', this.handleBlur);
  }

  handleFocus(e) {
    const target = e.target;
    target.parentNode.classList.add('active');
    target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
  }

  handleBlur(e) {
    const target = e.target;
    if (!target.value) {
      target.parentNode.classList.remove('active');
    }
    target.removeAttribute('placeholder');
  }

  togglePassword(type) {
    this.passwordType = type;
  }

  toggleConfirmationPassword(type) {
    this.passwordConfirmationType = type;
  }

  getUserName() {
    // this.loginService.getUserName().subscribe((data) => {
    //   this.userName = data.username;
    //   if (this.hasAccount && this.forgotPassword)
    //     $('#emailAddress').trigger('focus');
    // });
  }

  onResetPassword() {
    console.log(this.resetPasswordForm.value);
    let reqObj: any = {};
    reqObj['password'] = this.resetPasswordForm.value['password'];
    this.loginService.resetPassword(reqObj).subscribe((data) => {
      this.resetPasswordData = data;
      if (this.resetPasswordData.status == 'success') {
        this.resetPasswordForm.reset();
        this.getUserName();
      }
    });
  }

  onSignUp() {
    console.log('Sign up form values --> ', this.signUpForm.value);
    this.loginService.sendsignupDetails(this.signUpForm.value).subscribe(
      (data) => {
        if (data.status == 'success') {
          this.showSignUpLink = false;
          this.openAlert('User successfully created');
          this.router.navigate(['/login']);
        } else if (data.status == 'password null') {
          this.openAlert('Password should not be empty');
        } else if (data.status == 'email format') {
          this.openAlert('Wrong Email format');
        } else if (data.status == 'Failed') {
          this.openAlert('Username already exists');
        } else if (data.status == 'user_exists') {
          this.showSignUpLink = false;
          this.openAlert(
            'Only one user is allowed to signup, use existing credentials'
          );
        }
      },
      (error) => {}
    );
  }

  onLogin() {
    console.log('login details --->', this.loginForm.value);
    this.loginFailedMsg = undefined;
    this.spinner.show();
    this.loginService.sendloginDetails(this.loginForm.value).subscribe(
      (data) => {
        if (data.status == 'failed') {
          this.loginService.setUserSession(null, undefined);
          this.loginFailedMsg = 'Username and Password mismatch';
        } else if (data.status == 'usernotfound') {
          this.loginService.setUserSession(null, undefined);
          this.loginFailedMsg =
            'Unable to find the user, please create a new account';
        } else if (
          data.status == 'success' &&
          (data.license_status == 'license_not_found' ||
            data.license_status == 'license_in_active')
        ) {
          this.loginService.setUserSession(
            this.loginForm.value.emailAddress,
            data
          );
          this.loginService.setLicenseBuyMessage(data.license_message);
          this.router.navigate(['/license']);
        } else if (
          data.status == 'success' &&
          data.license_status == 'license_active'
        ) {
          sessionStorage.setItem('auth_token', data.auth_token);
          if (data.license_message) {
            this.spinner.hide();
            this.openAlert(data.license_message);
          }
          this.loginService.setUserSession(
            this.loginForm.value.emailAddress,
            data
          );
          this.router.navigate(['/dbSetup']);
        } else if (
          data.status == 'success' &&
          data.license_status == 'license_not_required'
        ) {
          sessionStorage.setItem('auth_token', data.auth_token);
          this.loginService.setUserSession(
            this.loginForm.value.emailAddress,
            data
          );
          this.router.navigate(['/dbSetup']);
        } else {
          this.loginService.setLicenseBuyMessage(data.license_message);
        }
        setTimeout(() => {
          if (this.loginFailedMsg != 'Username and Password mismatch') {
          }
        }, 1000);
        this.spinner.hide();
      },
      (error) => {
        this.isConnectionFailed = this.loginService.getIsErrorShow();
        this.spinner.hide();
      }
    );
  }

  openAlert(msg) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {});
  }
}
