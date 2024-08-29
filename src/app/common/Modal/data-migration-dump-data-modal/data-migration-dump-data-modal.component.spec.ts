import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMigrationDumpDataModalComponent } from './data-migration-dump-data-modal.component';

describe('DataMigrationDumpDataModalComponent', () => {
  let component: DataMigrationDumpDataModalComponent;
  let fixture: ComponentFixture<DataMigrationDumpDataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataMigrationDumpDataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationDumpDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
