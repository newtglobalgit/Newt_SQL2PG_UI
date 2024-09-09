import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  userEmail: string = '';
  userName: string = '';
  licenseBuyMessage: string;
  isErrorShow: boolean = false;

  $userLogedIn = new BehaviorSubject<string>(this.userEmail);
  $userLogedInObj = this.$userLogedIn.asObservable();

  $userName = new BehaviorSubject<string>(this.userEmail);
  $userNameObj = this.$userName.asObservable();

  constructor(private http: HttpClient, private config: AppConfigService) {}

  setUserSession(emailaddress: any, user: any) {
    if (emailaddress == null) {
      delete sessionStorage['user_id'];
      delete sessionStorage['isLogin'];
      delete sessionStorage['user_name'];
      delete sessionStorage['userName'];
      delete sessionStorage['token'];
      delete sessionStorage['retry'];
    } else {
      sessionStorage['user_id'] = user.user_id;
      sessionStorage['isLogin'] = true;
      sessionStorage['user_name'] = emailaddress;
      sessionStorage['userName'] = user.user_name;
      sessionStorage['token'] = user.auth_token;
      this.setUserName(user.user_name);
    }
    this.setUserCredentials(emailaddress);
  }

  setUserCredentials(emailaddress: any) {
    this.userEmail = emailaddress;
    this.$userLogedIn.next(this.userEmail);
  }
  setUserName(userName: any) {
    this.userName = userName;
    this.$userName.next(this.userName);
  }

  setLicenseBuyMessage(licenseBuyMessage: any) {
    this.licenseBuyMessage = licenseBuyMessage;
  }

  getIsErrorShow() {
    return this.isErrorShow;
  }

  activateLicense(reqObj: any): Observable<any> {
    return this.http.post(this.config.host + '/getLicenseDetails', reqObj);
  }

  sendsignupDetails(signupDetails: any): Observable<any> {
    return this.http.post(this.config.host + '/signup', signupDetails);
  }

  sendloginDetails(loginDetails: any): Observable<any> {
    return this.http.post(this.config.host + '/login', loginDetails);
  }

  resetPassword(password: any): Observable<any> {
    return this.http.post(this.config.host + '/resetPassword', password);
  }
}
