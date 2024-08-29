import { Component, OnInit,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/common/Services/login-service.service';
import { DmapAlertDialogModal } from 'src/app/common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { CommonServices } from 'src/app/common/Services/common-services.service';
import { AnalyticsService } from 'src/app/common/Services/analytics.service';

@Component({
  selector: 'app-license-activation',
  templateUrl: './license-activation.component.html',
  styleUrls: ['./license-activation.component.css']
})
export class LicenseActivationComponent implements OnInit {
  @ViewChild("l",  { static: false }) licenseForm: NgForm;

  enableTrial :string;
  trialKey :any;
  licenseKey:any;
  licenseBuyMessage:any;
  licenseMessage:any;
  selectedVal:string;
  dataValue:string;
  htmlSnippet:string;

  constructor( private loginService:LoginService,
               private commonservice: CommonServices,
               private router: Router,
               private spinner: NgxSpinnerService,
               private modalService: NgbModal,
               private analytics: AnalyticsService) { }

  ngOnInit() {
    //this.licenseBuyMessage = this.loginService.getLicenseBuyMessage();
    //this.licenseMessage =this.licenseBuyMessage.split("\n");
    this.htmlSnippet = this.loginService.getLicenseBuyMessage();
    this.enableTrial = sessionStorage.getItem("enable_trial");

    this.initialize();
  }

  ngAfterViewInit(){
    this.initialize();

  }

  initialize(){
    const floatContainers = document.querySelectorAll('.float-container');

    floatContainers.forEach((element) => {
      if (element.querySelector('input').value) {
          element.classList.add('active');
      }

      this.bindEvents(element);
    });

  }
  /* register events */
  bindEvents(element){
    const floatField = element.querySelector('input');
    floatField.addEventListener('focus', this.handleFocus);
    floatField.addEventListener('blur', this.handleBlur);
  };

  /* add active class and placeholder */
  handleFocus(e){
    const target = e.target;
    target.parentNode.classList.add('active');
    target.setAttribute('placeholder', target.getAttribute('data-placeholder'));
  };

  /* remove active class and placeholder */
  handleBlur(e){
    const target = e.target;
    if(!target.value) {
      target.parentNode.classList.remove('active');
    }
    target.removeAttribute('placeholder');
  };


  onLicenseActivation(){
    // let analyze_enable = '1';
    this.spinner.show();
    let reqObj = {'license_key':this.licenseKey,'user_name':sessionStorage.getItem("user_name"),'user_id':sessionStorage.getItem("user_id")};
    this.commonservice.setShowLicensePage('hide');
    this.loginService.activateLicense(reqObj).subscribe(data => {
      if(data.status == 'success'){
        this.loginService.getLicenseDetails().subscribe(res => {
          let _data = res['current'];
          if (_data.length > 0){
            if(_data[0]['licenseType'] == 'trial' || _data[0]['licenseType'] == 'dmap'){
              this.analytics.updateNodeType({'node_type': 'dmap_node'}).subscribe(node_res=> {
                this.commonservice.setLicenseType(data.license_type);
                this.commonservice.setNodeType('dmap_node');
                if(node_res.status == 'success'){
                  this.getTimeZoneAndRedirect();
                }
              });
            }
            else{
              this.loginService.getNodeType().subscribe(res => {
                this.commonservice.setLicenseType(res.license_type);
                this.commonservice.setNodeType(res.node_type);
                this.openAlert(data.message);
                if(res.node_type == ''){
                    this.router.navigate(['/nodeSelection']);
                    this.spinner.hide();
                }
                // else if (res.node_type =="analytics_master"){
                //   this.router.navigate(['/masterService']);
                // }
                // else if(res.node_type =="analytics_worker"){
                //   this.router.navigate(['/service']);
                // }
                else{
                  this.getTimeZoneAndRedirect();
                }
              });
            }

          }
         });
      }
      else{
        this.spinner.hide();
        this.openAlert(data.message);
      }
      //this.spinner.hide();
    });
  }

  getTimeZoneAndRedirect() {
    this.loginService.getSelectedTimezone().subscribe(res => {
      if(res.timezone == '' || res.timezone == null){
        this.router.navigate(['/nodeSelection']);
        this.spinner.hide();
      }
      else{
        this.router.navigate(['/service']);
        document.getElementById('mySidenav').style.removeProperty('display');
        this.spinner.hide();
      }
    });
  }

  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {'msg':msg, 'title':'Alert'};
    modalRef.result.then((result) => {
      // if ( result == 'ok') {

      // }else{

      // }
    });
  }

  radioChangeHandler(event){
    this.selectedVal = event.target.value;
  }

}
