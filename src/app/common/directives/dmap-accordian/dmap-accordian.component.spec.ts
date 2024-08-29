import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapAccordianComponent } from './dmap-accordian.component';
import { DmapAssesstmentReportComponent } from '../../../db-reports/dmap-assesstment-report/dmap-assesstment-report.component';
import { DmapSchemamigrationReportComponent } from '../../../db-reports/dmap-schemamigration-report/dmap-schemamigration-report.component';
import { DmapDatamigrationReportComponent } from '../../../db-reports/dmap-datamigration-report/dmap-datamigration-report.component';
import { DmapChartsComponent } from '../dmap-charts/dmap-charts.component';
import { DmapSingleBarChartsComponent } from '../dmap-single-bar-charts/dmap-single-bar-charts.component';
import { DmapStackChartsComponent } from '../dmap-stack-charts/dmap-stack-charts.component';
import { DmapFloatingBarChartsComponent } from '../dmap-floating-bar-charts/dmap-floating-bar-charts.component';
import { DmapValidationTableComponent } from '../../dmap-validation-table/dmap-validation-table.component';
import { DmapErrorCardsComponent } from '../dmap-error-cards/dmap-error-cards.component';
import { DmapValidationReportsComponent } from '../../../db-reports/dmap-datamigration-report/dmap-validation-reports/dmap-validation-reports.component';
import { DmapPerfomrmaceBenchmarkComponent } from '../../../db-reports/dmap-datamigration-report/dmap-perfomrmace-benchmark/dmap-perfomrmace-benchmark.component';
import { DmapDataMigrationPerformanceTableComponent } from '../../dmap-data-migration-performance-table/dmap-data-migration-performance-table.component';
import { DmapBarsComponent } from '../dmap-bars/dmap-bars.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


describe('DmapAccordianComponent', () => {
  let component: DmapAccordianComponent;
  let fixture: ComponentFixture<DmapAccordianComponent>;
  const mockk =  [
    {	
    	"createdBy": "Himanshu Chauhan",
        "runId": "20190911102045",
        "sourceDBName": "WDB",
        "sourceDBSchema": "wdb",
        "sourceDBHost": "wdb-pgs.cqswlsq35jl6.us-east-1.rds.amazonaws.com",
        "sourceDBPort": "1521",
        "targetDBName": "APG10RDSNG",
        "targetDBHost": "ngapg10rds.cqswlsq35jl6.us-east-1.rds.amazonaws.com",
        "targetDBPort": "5432",
        "step": "Data Migration",
        "stepStatus": "Completed",
        "lastUpdated": "09-11-2019"
    }
  ]
  const mock ={"tableHeaders":["Test","Test1"]};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapAccordianComponent,DmapBarsComponent,DmapDataMigrationPerformanceTableComponent,DmapPerfomrmaceBenchmarkComponent,DmapValidationReportsComponent,DmapErrorCardsComponent ,DmapValidationTableComponent,DmapAssesstmentReportComponent,DmapFloatingBarChartsComponent,DmapSchemamigrationReportComponent,DmapDatamigrationReportComponent,DmapStackChartsComponent,DmapChartsComponent,DmapSingleBarChartsComponent] ,
      imports: [ NgbModule,HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapAccordianComponent);
    component = fixture.componentInstance;
    component.accordianData = mockk;
    component.accordianSettings = mock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
