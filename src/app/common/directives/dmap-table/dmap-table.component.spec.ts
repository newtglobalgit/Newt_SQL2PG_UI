import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DmapTableComponent } from './dmap-table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MultiFieldFilterPipe } from '../../Pipes/multi-field-filter.pipe';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



describe('DmapTableComponent', () => {
  let component: DmapTableComponent;
  let fixture: ComponentFixture<DmapTableComponent>;
  var ngbModalService:NgbActiveModal;

  const mock1 = "Test Label";
  
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
  
  
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapTableComponent,MultiFieldFilterPipe ],
      providers: [NgbActiveModal],
      imports: [  NgbModule,NgxPaginationModule,FormsModule,HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    ngbModalService = TestBed.get(NgbActiveModal);
    fixture = TestBed.createComponent(DmapTableComponent);
    component = fixture.componentInstance;
    component.tableSettings = mock1;
    component.tableData = mockk;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
