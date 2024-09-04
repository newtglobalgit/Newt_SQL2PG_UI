import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs';
import { DmapAlertDialogModal } from '../Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../Services/login-service.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class ReqHeaderAndErrorHandlingInterceptor implements HttpInterceptor {
  private AUTH_HEADER = 'auth-token';
  private RETRY_COUNT = 3;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private spinner: NgxSpinnerService,
    private loginService: LoginService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let customHeaders = req.headers;
    // add token in header if present
    customHeaders = this.addAuthToken(customHeaders);
    // added cache headers
    customHeaders = customHeaders
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache');
    req = req.clone({
      headers: customHeaders,
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // if(error && error.status === 0 && req.url.indexOf('api/dblist') >= 0){
        //   /* let retryCount = parseInt(this.loginService.getConnectionRetryCount());
        //   if(isNaN(retryCount)){retryCount = 0}

        //   if(retryCount >= this.RETRY_COUNT){   */
        //  /*    this.onErrorStatus()
        //     this.openAlert('Error', 'Failed to connect to the server. Please try to relogin.');    */
        //   /* }else{
        //     this.loginService.setConnectionRetryCount(retryCount+1);
        //   } */
        // }

        // else
        if (error && error.status != 0 && error.status === 403) {
          this.onErrorStatus();
          this.modalService.dismissAll();
          this.openAlert(
            'Session Expired',
            'Your session is expired, Please login again'
          );
        } else if (error && error.status != 0 && error.status === 404) {
          // this.loginService.setLicenseBuyMessage(error.error.license_message);
          this.onLicenseError();
        } else {
          return throwError(error);
        }
      })
    );
  }

  onErrorStatus() {
    // this.loginService.setUserSession(null, undefined);
    this.spinner.hide();
    this.router.navigate(['/login']);
  }

  onLicenseError() {
    //this.loginService.setUserSession(null, undefined);
    this.spinner.hide();
    this.router.navigate(['/license']);
  }

  openAlert(title, msg) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: title };
    modalRef.result.then((result) => {
      window.location.reload();
    });
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    if (!sessionStorage['token']) {
      return request;
    }
    /* If you are calling an outside domain then do not add the token.
    if (!request.url.match(/www.mydomain.com\//)) {
      return request;
    }*/
    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, sessionStorage['token']),
    });
  }

  private addAuthToken(headers: HttpHeaders): HttpHeaders {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    if (!sessionStorage['token']) {
      return headers;
    }
    return headers.set(this.AUTH_HEADER, sessionStorage['token']);
  }
}
