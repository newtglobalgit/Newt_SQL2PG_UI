import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentLogsComponent } from './assessment-logs.component';

describe('AssessmentLogsComponent', () => {
  let component: AssessmentLogsComponent;
  let fixture: ComponentFixture<AssessmentLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
