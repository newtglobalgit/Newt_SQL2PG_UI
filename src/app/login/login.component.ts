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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private loginService: LoginService
  ) {}

  ngOnInit() {}

  onResetPassword() {
    console.log(this.resetPasswordForm.value);
    this.loginService
      .resetPassword(this.resetPasswordForm.value['password'])
      .subscribe((data) => {
        this.resetPasswordData = data;
        if (this.resetPasswordData.status == 'success') {
          this.resetPasswordForm.reset();
        }
      });
  }

  onSignUp() {
    this.loginService.sendsignupDetails(this.signUpForm.value).subscribe(
      (data) => {
        if (data.status == 'success') {
          this.showSignUpLink = false;
          // this.openAlert('User successfully created');
          this.router.navigate(['/login']);
        } else if (data.status == 'password null') {
          // this.openAlert('Password should not be empty');
        } else if (data.status == 'email format') {
          // this.openAlert('Wrong Email format');
        } else if (data.status == 'Failed') {
          // this.openAlert('Username already exists');
        } else if (data.status == 'user_exists') {
          this.showSignUpLink = false;
          // this.openAlert(
          //   'Only one user is allowed to signup, use existing credentials'
          // );
        }
      },
      (error) => {}
    );
  }

  onLogin() {
    this.router.navigate(['/dbSetup']);
  }
}
