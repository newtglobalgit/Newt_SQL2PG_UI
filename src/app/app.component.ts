import {
  Component,
  ViewEncapsulation,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import { LoginService } from './common/Services/login-service.service';
import { Router } from '@angular/router';
import { DatabaseListService } from './common/Services/database-list.service';
import { CommonServices } from './common/Services/common-services.service';
import { MenuMappingService } from './common/Services/menu-mapping.service';
import introJs from 'intro.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'DMAP';
  userLogin: string;
  userName: string;
  isLogin: string;
  isShowNavBar: boolean = false;
  currentUrl: any;
  isShowNavBarWelcomeSection: boolean = true;
  sideNavBarOpen: boolean = true;
  sideNavBarArrow: boolean = true;
  disableToggleButton: boolean = true;

  constructor(
    private router: Router,
    private location: Location,
    private spinner: NgxSpinnerService,
    private commonServices: CommonServices,
    private loginService: LoginService,
    private databaseListService: DatabaseListService,
    private menuMapping: MenuMappingService
  ) {
    /* Hide Navigation bar if user is on Login or signup page  */
    router.events.subscribe((val) => {
      if (
        location.path() == '/login' ||
        location.path() == '/signup' ||
        location.path() == '/appQuestionnaire' ||
        location.path() == '/dbScripts' ||
        location.path() == '/dbQuestionnaire' ||
        // location.path() == '/tcoQuestionnaire' ||
        location.path() == '/applicationAssessment' ||
        // location.path() == '/databaseDetails' ||
        // location.path() == '/askForm' ||
        location.path() == '/resetPassword' ||
        location.path() == '/license'||
        location.path() == '/interfaceQuestionnaire' 

      ) {
        this.isShowNavBar = false;
      } else {
        this.isShowNavBar = true;
      }

      if (
        location.path().includes('login') ||
        location.path().includes('signup') ||
        location.path().includes('appQuestionnaire') ||
        location.path().includes('interfaceQuestionnaire') ||
        location.path().includes('dbScripts') ||
        location.path().includes('dbQuestionnaire') ||
        location.path().includes('tcoQuestionnaire') ||
        location.path().includes('applicationAssessment') ||        
        location.path().includes('databaseDetails') ||
        location.path().includes('nodeSelection') ||
        location.path().includes('askForm') ||
        location.path().includes('license') ||
        location.path().includes('resetPassword') ||
        location.path().includes('viewDBAnalyticsStatus')
      ) {
        document.getElementById('mySidenav').style.cssText = 'display: none;';
        document.getElementById('mySidenav').style.width = '0%';
        document.getElementById('main').style.marginLeft = '1%';
        this.sideNavBarOpen = false;
        this.sideNavBarArrow = false;
        this.disableToggleButton = false;
      } else {
        document.getElementById('mySidenav').style.removeProperty('display');
        document.getElementById('mySidenav').style.width = '20%';
        this.sideNavBarOpen = true;
        this.sideNavBarArrow = true;
        this.disableToggleButton = true;
      }

      if (
        location.path().includes('schemaMapping') ||
        location.path().includes('jreUpgrade') ||
        location.path().includes('createDecorator')
      ) {
        this.isShowNavBarWelcomeSection = false;
      }
    });
    //this.loginService.disableLogsInProd();
    /* Set the License Type (in order to hide some feature for Trial License)*/
    // this.loginService.getLicenseDetails().subscribe(data => {
    //   let _data = data['current'];
    //   for(let i in _data){
    //     if(_data[i].hasOwnProperty('licenseType')){
    //       this.commonServices.setLicenseType(_data[i]['licenseType']);
    //     }
    //   }
    // });
  }

  ngOnInit() {
    // this.menuMapping.getMenuAndPageMappings();
    // document.getElementById('mySidenav').style.width = '20%';
    document.getElementById('main').style.width = '100%';

    this.currentUrl = window.location.href;
    if (
      this.currentUrl.indexOf('appQuestionnaire') >= 0 ||
      this.currentUrl.indexOf('interfaceQuestionnaire') >= 0 ||
      this.currentUrl.indexOf('dbScripts') >= 0 ||
      this.currentUrl.indexOf('dbQuestionnaire') >= 0 ||
      this.currentUrl.indexOf('tcoQuestionnaire') >= 0 ||
      this.currentUrl.indexOf('applicationAssessment') >= 0 ||
      this.currentUrl.indexOf('interfaceList') >= 0 ||
      this.currentUrl.indexOf('databaseDetails') >= 0 ||
      this.currentUrl.indexOf('askForm') >= 0 ||
      this.currentUrl.indexOf('viewDBAnalyticsStatus') >= 0
    ) {
      console.log('');
    } else {
      if (!this.loginService.isUserLoggedIn()) {
        this.router.navigate(['/login']);
      }

      this.userLogin = sessionStorage.getItem('user_name');
      this.userName = sessionStorage.getItem('userName');

      this.loginService.$userLogedInObj.subscribe((userEmail: any) => {
        let isLogin = sessionStorage.getItem('isLogin');

        if (this.userLogin == null && isLogin != null) {
          this.userLogin = userEmail;
        } else if (isLogin == null || isLogin == undefined) {
          this.userLogin = null;
        }
      });

      this.loginService.$userNameObj.subscribe((userName: any) => {
        let isLogin = sessionStorage.getItem('isLogin');
        if (this.userName == null && isLogin != null) {
          this.userName = userName;
        } else if (isLogin == null || isLogin == undefined) {
          this.userName = null;
        }
      });
    }
  }

  startTour() {
    introJs().start();
  }

  logOut() {
    let reqObj = { user_id: sessionStorage['user_id'] };

    this.loginService.sendlogoutDetails(reqObj).subscribe((data) => {});
    delete sessionStorage['refId'];
    delete sessionStorage['appRefId'];
    delete sessionStorage['mainRefId'];
    this.loginService.setUserSession(null, undefined);
    this.databaseListService.removeAllCheckedDBRecords();
    this.router.navigate(['/login']);

    // document.getElementById('mySidenav').style.cssText = 'transition: all 0s';
    // document.getElementById('mySidenav').style.width = '0%';
    // document.getElementById('main').style.marginLeft = '0%';
    // this.sideNavBarOpen = false;
  }

  closeNav() {
    document.getElementById('mySidenav').style.cssText =
      'transition: all 0.5s ; display: none;';
    // document.getElementById('mySidenav').style.width = '0%';
    document.getElementById('side-white-div').style.width = '2%';
    document.getElementById('main').style.marginLeft = '1%';
    this.sideNavBarOpen = false;
  }
  openNav() {
    document.getElementById('mySidenav').style.cssText =
      'transition: all 0.5ms ;';
    // document.getElementById('sidenavid').style.cssText =
    //   'transition: all 0.5ms ;';
    document.getElementById('mySidenav').style.width = '20%';
    document.getElementById('mySidenav').style.height = 'fit-content';
    document.getElementById('side-white-div').style.width = '0%';
    document.getElementById('main').style.marginLeft = '1%';
    this.sideNavBarOpen = true;
  }
}
