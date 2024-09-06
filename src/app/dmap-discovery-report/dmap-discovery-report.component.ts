import { Component, OnInit } from '@angular/core';
import { Sql2PgService } from '../common/Services/sql2pg.service';

@Component({
  selector: 'app-dmap-discovery-report',
  templateUrl: './dmap-discovery-report.component.html',
  styleUrls: ['./dmap-discovery-report.component.css']
})
export class DmapDiscoveryReportComponent implements OnInit {

  constructor(private sql2PgService: Sql2PgService,) { }

  ngOnInit(): void {
  }

  
 
}
