import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DbListComponent } from './db-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DmapTableComponent } from '../common/directives/dmap-table/dmap-table.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MultiFieldFilterPipe } from '../common/Pipes/multi-field-filter.pipe';

fdescribe('DbListComponent', () => {
  let component: DbListComponent;
  let fixture: ComponentFixture<DbListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbListComponent, DmapTableComponent, MultiFieldFilterPipe],
      imports: [HttpClientTestingModule, FormsModule, NgbModule, NgxPaginationModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
