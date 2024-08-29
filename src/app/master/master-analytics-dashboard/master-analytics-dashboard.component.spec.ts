import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAnalyticsDashboardComponent } from './master-analytics-dashboard.component';

describe('MasterAnalyticsDashboardComponent', () => {
  let component: MasterAnalyticsDashboardComponent;
  let fixture: ComponentFixture<MasterAnalyticsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAnalyticsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAnalyticsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
