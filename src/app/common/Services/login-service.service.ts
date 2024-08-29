import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { AppConfigService } from './app-config.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userEmail:string = '';
  userName:string = '';
  userUrl:string
  isErrorShow:boolean = false;
  licenseBuyMessage:string;
  nodeType:string = '';

  $userLogedIn = new BehaviorSubject<string>(this.userEmail)
  $userLogedInObj = this.$userLogedIn.asObservable();

  $userName = new BehaviorSubject<string>(this.userEmail)
  $userNameObj = this.$userName.asObservable();

  $nodeType = new BehaviorSubject<string>(this.nodeType)
  $nodeTypeObj = this.$nodeType.asObservable();

  constructor(private http: HttpClient, private config:AppConfigService) { 
  }

  getLicenseBuyMessage(){
    return this.licenseBuyMessage;
  }

  setLicenseBuyMessage(licenseBuyMessage:any){
    this.licenseBuyMessage = licenseBuyMessage;
  }

  getIsErrorShow(){
    return this.isErrorShow;
  }

  setIsErrorShow(isErrorShow:any){
    this.isErrorShow = isErrorShow;
  }

  getUserCredentials(){
    return this.userEmail;
  }

  setUserSession(emailaddress:any, user:any){         
    if(emailaddress == null)  {
      delete sessionStorage['user_id'];         
      delete sessionStorage['isLogin'];         
      delete sessionStorage['user_name'];
      delete sessionStorage['userName'];
      delete sessionStorage['token'];
      delete sessionStorage['retry'];
    }else{
      sessionStorage['user_id'] = user.user_id;         
      sessionStorage['isLogin'] = true;         
      sessionStorage['user_name'] = emailaddress;
      sessionStorage['userName'] = user.user_name;
      sessionStorage['token'] = user.auth_token;
      this.setUserName(user.user_name);
    }
    this.setUserCredentials(emailaddress) ;
    
  }

  setUserCredentials(emailaddress:any){ 
    this.userEmail = emailaddress;
    this.$userLogedIn.next(this.userEmail);
  }
  setUserName(userName:any){ 
    this.userName = userName;
    this.$userName.next(this.userName);
  }

  setNodeType(nodeType:any){ 
    sessionStorage['node_type'] = nodeType;
    this.nodeType = nodeType;
    this.$nodeType.next(this.nodeType);
  }

  setConnectionRetryCount(num:any){
    if(num != undefined) sessionStorage['retry'] = num;
    else delete sessionStorage['retry'];
  }

  getConnectionRetryCount(){
    return sessionStorage['retry']
  }

  isUserLoggedIn(){
    let isLoggedIn = false;
    if(sessionStorage['isLogin']){
      isLoggedIn = true
    }

    return isLoggedIn
  }
  sendloginDetails(login_details:any): Observable<any> {
    return this.http.post(this.config.host+'/login', login_details);
  }

  getUserName(): Observable<any>{
    return this.http.get(this.config.host+'/getUserName');
  }

  resetPassword(password:any): Observable<any>{
    return this.http.post(this.config.host+'/resetPassword', {"password": password},httpOptions);
  }

  sendsignupDetails(signup_details:any): Observable<any> {
    return this.http.post(this.config.host+'/signup', signup_details,httpOptions);
  }

  sendlogoutDetails(logout_details:any): Observable<any> {
    return this.http.post(this.config.host+'/logout', logout_details);
  }

 startTrialLicense(reqObj:any): Observable<any> {
    return this.http.post(this.config.host+'/startTrialLicense',reqObj);
  }
  
 activateLicense(reqObj:any): Observable<any> {
    return this.http.post(this.config.host+'/activateLicense', reqObj);
  }

  getLicenseDetails(){
    return this.http.get(this.config.host+'/getLicenseDetails');
  }

  getDMAPImageVersion(): Observable<any> {
    return this.http.get(this.config.host+'/checkDMAPImageVersion');
  }

  getDMAPImageDetails(){
    return this.http.get(this.config.host+'/getDMAPImageDetails');
  }

  getNodeType(): Observable<any> {
    return this.http.get(this.config.host+'/get_node_type');
  }
  
  getSelectedTimezone(): Observable<any> {
    return this.http.get(this.config.host+'/get_selected_timezone');
  }

  checkAppNodeStatus(): Observable<any> {
    return this.http.get(this.config.host+'/ping_app_node');
  }

  updateDMAPhost(reqObj:any): Observable<any> {
    return this.http.post(this.config.host+'/submit_dmap_host',reqObj);
  }

  disableLogsInProd() {
    if (environment.production) {
      console.log = function (): void { };
    }
  }

  getMasterNodeDetails(): Observable<any> {   
    
    return this.http.get(this.config.host+'/getMasterNodeDetails',{
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(data => data);
  }
  
}
