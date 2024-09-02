import { Component, OnInit, SimpleChanges } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

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
  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.userLogin = sessionStorage.getItem('user_name');

    this.nodeType = sessionStorage.getItem('node_type');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userLogin = sessionStorage.getItem('user_name');
    this.nodeType = sessionStorage.getItem('node_type');
  }

  isCollapsed = false;
}
