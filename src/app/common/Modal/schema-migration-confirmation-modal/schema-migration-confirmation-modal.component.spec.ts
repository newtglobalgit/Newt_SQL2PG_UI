import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaMigrationConfirmationModalComponent } from './schema-migration-confirmation-modal.component';

describe('SchemaMigrationConfirmationModalComponent', () => {
  let component: SchemaMigrationConfirmationModalComponent;
  let fixture: ComponentFixture<SchemaMigrationConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaMigrationConfirmationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaMigrationConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
