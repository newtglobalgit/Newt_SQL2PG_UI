import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timer, throwError } from 'rxjs';
import {
  retry,
  tap,
  catchError,
  retryWhen,
  delayWhen,
  scan,
  delay,
} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../Services/login-service.service';
import { DmapAlertDialogModal } from '../Modal/dmap-alert-dialog/dmap-alert-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class RetryOnFailedConnectionInterceptor implements HttpInterceptor {
  alertMessage: any;
  appRemediationStatus: any;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private loginService: LoginService,
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // let customHeaders = req.headers;
    var discoveryBatch_index = req['url'].toString().indexOf('discoveryBatch');
    var assessmentBatch_index = req['url']
      .toString()
      .indexOf('assessmentBatch');
    var resumeBatch_index = req['url'].toString().indexOf('resume_batch');
    var appQuestionnaire = req['url']
      .toString()
      .indexOf('update_app_questionnaire_details');
    var appQuestionnaire_diagrams = req['url']
      .toString()
      .indexOf('update_app_questionnaire_diagrams');
    var dbQuestionnaire = req['url']
      .toString()
      .indexOf('upload_db_questionnaire');
    var tcoQuestionnaire = req['url']
      .toString()
      .indexOf('upload_tco_questionnaire');
    var interfaceList = req['url'].toString().indexOf('interfaceList');
    // var tcoQuestionnaire = req['url']
    //   .toString()
    //   .indexOf('upload_tco_questionnaire');
    var appMigration_getAppDetails = req['url']
      .toString()
      .indexOf('appapi/get_app_details');
    var appMigration_getExistingDecorators = req['url']
      .toString()
      .indexOf('appapi/get_existing_decorators');
      var appMigration_getUploadedAppsInDecorator = req['url']
      .toString()
      .indexOf('appapi/get_uploaded_apps');
    var appMigration_getJreAppDetails = req['url']
      .toString()
      .indexOf('appapi/get_jre_app_details');
    var appMigration_getAppWorkerNodeDetails = req['url']
      .toString()
      .indexOf('appapi/getAppWorkerNodeDetails');
      var appMigration_getDMAPImageDetails = req['url']
      .toString()
      .indexOf('appapi/getDMAPImageDetails');
    var databaseDetails = req['url']
      .toString()
      .indexOf('get_database_details_data');
    var submitAskForm = req['url'].toString().indexOf('submit_ask_form');
    var analyticsDashboard = req['url'].toString().indexOf('analytics_dashboard');
    //var appAssessment = req['url'].toString().indexOf("upload_tco_questionnaire");
    if (
      appMigration_getAppDetails > 0 ||
      appMigration_getExistingDecorators > 0 ||
      appMigration_getUploadedAppsInDecorator > 0 ||
      appMigration_getJreAppDetails > 0 ||
      appMigration_getAppWorkerNodeDetails > 0 ||
      appMigration_getDMAPImageDetails > 0
    ) {
      if(this.checkAppNode()=='failed'){
        return;
      
    } 
    
     else if (this.checkAppNode() == 'app_not_configured') {
       
    }
    else if (this.checkAppNode() == 'success'){
      
    }
    else {
      this.alertMessage =
        'An error has occured while submitting the request. Please try again.';
       
    }}
    
    if (
      discoveryBatch_index < 0 &&
      assessmentBatch_index < 0 &&
      resumeBatch_index < 0 &&
      appQuestionnaire < 0 &&
      appQuestionnaire_diagrams < 0 &&
      dbQuestionnaire < 0 &&
      tcoQuestionnaire < 0 &&
      interfaceList < 0 &&
      appMigration_getAppDetails < 0 &&
      appMigration_getJreAppDetails < 0 &&
      appMigration_getAppWorkerNodeDetails < 0 &&
      appMigration_getExistingDecorators < 0 &&
      appMigration_getUploadedAppsInDecorator < 0 &&
      appMigration_getDMAPImageDetails < 0 &&
      databaseDetails < 0 &&
      submitAskForm < 0 &&
      analyticsDashboard < 0
    ) {
      return next.handle(req).pipe(
        retryWhen((error) =>
          error.pipe(
            scan((retryCount, err) => {
              if (err && err.status == 500) {
                // If status is 500, display and throw the error immediately without retrying
                const errMsg = err?.error?.message || err?.message || "Something went wrong. Please try again.";
                this.openAlert('Alert', errMsg);
                this.spinner.hide();
                throw err;
              } else
              if (retryCount == 5) {
                this.onErrorStatus();
                throw error;
              } else {
                retryCount = retryCount + 1;
                return retryCount;
              }
            }, 0),
            delay(5000)
          )
        )
      );
    } else {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error) {
            
            this.spinner.hide();
            if (
              appMigration_getAppDetails < 0 &&
              appMigration_getJreAppDetails < 0 &&
              appMigration_getAppWorkerNodeDetails < 0 &&
              appMigration_getExistingDecorators < 0 &&
              appMigration_getUploadedAppsInDecorator < 0 &&
              appMigration_getDMAPImageDetails < 0
            ) {
            this.openAlert('Alert', this.alertMessage);
            }
          } else {
            return throwError(error);
          }
        })
      );
    }
  }

  onErrorStatus() {
    this.loginService.setIsErrorShow(true);
    this.loginService.setUserSession(null, undefined);
    this.spinner.hide();
    this.router.navigate(['/login']);
  }

  openAlert(title, msg) {
    if (!this.modalService.hasOpenModals()) {
      const modalRef = this.modalService.open(DmapAlertDialogModal);
      modalRef.componentInstance.data = { msg: msg, title: title };
      modalRef.result.then((result) => {});
    }
  }

  checkAppNode(){
    this.loginService.checkAppNodeStatus().subscribe((data) => {
      this.appRemediationStatus = data['status']
    });
    return this.appRemediationStatus;
  } 
}
