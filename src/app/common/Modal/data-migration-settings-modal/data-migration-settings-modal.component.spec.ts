import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMigrationSettingsModalComponent } from './data-migration-settings-modal.component';

describe('DataMigrationSettingsModalComponent', () => {
  let component: DataMigrationSettingsModalComponent;
  let fixture: ComponentFixture<DataMigrationSettingsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataMigrationSettingsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataMigrationSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
