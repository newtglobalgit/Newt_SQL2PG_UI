import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentWebpageReportComponent } from './assessment-webpage-report.component';

describe('AssessmentWebpageReportComponent', () => {
  let component: AssessmentWebpageReportComponent;
  let fixture: ComponentFixture<AssessmentWebpageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentWebpageReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentWebpageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
