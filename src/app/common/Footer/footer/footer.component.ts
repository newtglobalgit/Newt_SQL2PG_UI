import { Component, OnInit, SimpleChanges } from '@angular/core';
import { LoginService } from '../../Services/login-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [
    trigger('rotateArrow', [
      state(
        'collapsed',
        style({
          transform: 'rotate(-180deg)',
        })
      ),
      state(
        'expanded',
        style({
          transform: 'rotate(0)',
        })
      ),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
  ],
})
export class FooterComponent implements OnInit {
  userLogin: string;
  nodeType: string;
  showLicenseDetails: any;
  currentYearForCopyRight = new Date().getFullYear();

  // Add showMinWindow$ observable
  showMinWindow$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  isCollapsed = false;

  constructor(
    private loginService: LoginService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.userLogin = sessionStorage.getItem('user_name');
    this.nodeType = sessionStorage.getItem('node_type');

    this.loginService.$userLogedInObj.subscribe((userEmail: any) => {
      let isLogin = sessionStorage.getItem('isLogin');

      if (this.userLogin == null && isLogin != null) {
        this.userLogin = userEmail;
      } else if (isLogin == null || isLogin == undefined) {
        this.userLogin = null;
      }
    });

    this.loginService.$nodeTypeObj.subscribe((nodeTypee: any) => {
      this.nodeType = nodeTypee;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userLogin = sessionStorage.getItem('user_name');
    this.nodeType = sessionStorage.getItem('node_type');
  }

  toggleCollapse() {
    // Toggle the collapse state
    this.isCollapsed = !this.isCollapsed;

    // Optionally update showMinWindow$ if you want to control its visibility
    this.showMinWindow$.next(!this.isCollapsed);
  }
}
