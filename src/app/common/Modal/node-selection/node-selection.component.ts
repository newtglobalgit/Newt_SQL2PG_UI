import { AmChartsLogo } from '@amcharts/amcharts4/.internal/core/elements/AmChartsLogo';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnalyticsService } from 'src/app/common/Services/analytics.service'
import { CommonServices } from '../../Services/common-services.service';
import { LoginService } from '../../Services/login-service.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';

@Component({
  selector: 'app-node-selection',
  templateUrl: './node-selection.component.html',
  styleUrls: ['./node-selection.component.css']
})
export class NodeSelectionComponent implements OnInit {
  nodeType:string;
  timeZones:any[] = [];
  selectedtimeZoneValue;
  selectedNodeType;
  masterIp: string = null;
  errorInValidForm:boolean = false;
  licenseType:string;
  errorLabel:any;
  appMigCont:boolean = false;
  appNodeIP:any;
  appNodePort:any;
  radioChecked: boolean = true;

  constructor(private router: Router,
              private analytics: AnalyticsService,
              private spinner: NgxSpinnerService,
              private commonservice: CommonServices,
              private loginService:LoginService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.licenseType = this.commonservice.getLicenseType();
    this.selectedNodeType = this.commonservice.getNodeType();
    this.loadTimezones();
    this.selectedtimeZoneValue = 'US/Eastern'
  }
  loadTimezones(){
    this.analytics.getTimeZoneDetails().subscribe(data => {
      this.timeZones = data;
      this.timeZones.unshift(this.selectedtimeZoneValue);
      let temp = new Set(this.timeZones);
      this.timeZones = Array.from(temp);
    });
  }

  submit(){
    this.spinner.show();
    if (this.licenseType == 'dmap pro'){
      this.masterIp = '';

      let cURL :any = window.location.href;
      cURL =cURL.split(':');
      if (cURL.length > 0){
      if (cURL[1]){
        console.log(cURL[1],"cURL[1]")
        this.masterIp =cURL[1].replace('//','');
      }
      else{this.masterIp = 'localhost';}}
      else{ this.masterIp = 'localhost';}
      if (this.masterIp == ''){
        this.masterIp = 'localhost';
      }
    }

    if(this.nodeType == undefined || this.nodeType == ''){
      this.nodeType = this.selectedNodeType;
    }
    if (this.selectedNodeType != 'dmap_node'){
      if(this.nodeType == undefined || this.nodeType == ''){
        this.errorLabel = 'Please select any one of the node type to proceed';
        this.errorInValidForm = true;
        this.spinner.hide();
        return;
      }
    }
    if(this.nodeType == 'analytics_master' && (this.masterIp == undefined || this.masterIp == '')){
      this.errorLabel = 'Please enter master node IP/FQDN to proceed';
      this.errorInValidForm = true;
      this.spinner.hide();
      return;
    }
    if (this.licenseType == 'dmap enterprise' && this.masterIp == 'localhost' ){
      this.errorLabel = "Master Node IP/FQDN can't be localhost, please provide valid IP/FQDN";
      this.errorInValidForm = true;
      this.spinner.hide();
      return;
    }
    if(!this.radioChecked){
      if(this.appNodeIP == undefined || this.appNodeIP == ''){
        this.errorLabel = 'Please enter application container IP to proceed';
        this.errorInValidForm = true;
        this.spinner.hide();
        return;
      }
      if(this.appNodePort == undefined || this.appNodePort == ''){
        this.errorLabel = 'Please enter application container service port to proceed';
        this.errorInValidForm = true;
        this.spinner.hide();
        return;
      }
    }

    if (!this.appMigCont){
      this.appNodeIP = '';
      this.appNodePort = '';
    }


      this.analytics.updateNodeType({'node_type': this.nodeType,'timezone':this.selectedtimeZoneValue, 'master_ip': this.masterIp,'appNodeIP':this.appNodeIP,'appNodePort':this.appNodePort}).subscribe(data => {
        if(data.status == 'success'){
        this.commonservice.setNodeType( this.nodeType);
          this.loginService.setNodeType( this.nodeType);
          this.commonservice.setLicenseType( data.license_type);
          this.commonservice.setShowLicensePage('show');
          if (this.nodeType =="analytics_worker"){
            this.router.navigate(['/dbAssessment']);
          }else{
            this.router.navigate(['/service']);
          }
          this.spinner.hide();
        }else{
          this.spinner.hide();
          this.openAlert(data.message);
        }
            // if ( this.nodeType =="analytics_master"){
            //     this.router.navigate(['/masterService']);
            //   }
            //   else if( this.nodeType =="analytics_worker"){
            //     this.router.navigate(['/service']);
            //   }
            //   else{
            //     this.router.navigate(['/service']);
            //   }
      });



    //this.router.navigate(['/masterService'])
  }
  openAlert(msg){
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = {'msg':msg, 'title':'Alert'};
    modalRef.result.then((result) => {
      // if ( result == 'ok') {

      // }
      // else{

      // }
    });
  }
  setupAppMigCont() {
    this.appMigCont=true;
    this.radioChecked = false;
  }
  setupAppMigContFalse() {
    this.appMigCont=false;
    this.radioChecked = true;
  }

}
