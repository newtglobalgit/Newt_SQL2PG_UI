import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-db-setup',
  templateUrl: './db-setup.component.html',
  styleUrls: ['./db-setup.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DbSetupComponent implements OnInit {
  sourceDBTypeValue: any = 'MsSql';
  targetDBTypeValue: any = 'Postgres';
  sourceDbs: any = ['MsSql'];
  targetDbs: any = ['Postgres'];

  constructor() {}

  ngOnInit(): void {}
}
