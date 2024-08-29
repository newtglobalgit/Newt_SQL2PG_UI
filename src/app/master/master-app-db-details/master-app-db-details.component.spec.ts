import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAppDbDetailsComponent } from './master-app-db-details.component';

describe('MasterAppDbDetailsComponent', () => {
  let component: MasterAppDbDetailsComponent;
  let fixture: ComponentFixture<MasterAppDbDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAppDbDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAppDbDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
