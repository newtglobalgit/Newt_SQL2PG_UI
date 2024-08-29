import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationAssessmentQuestionnaireComponent } from './application-assessment-questionnaire.component';

describe('ApplicationAssessmentQuestionnaireComponent', () => {
  let component: ApplicationAssessmentQuestionnaireComponent;
  let fixture: ComponentFixture<ApplicationAssessmentQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationAssessmentQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationAssessmentQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
