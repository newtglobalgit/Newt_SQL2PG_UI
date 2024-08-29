import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationQuestionnaireComponent } from './application-questionnaire.component';

describe('ApplicationQuestionnaireComponent', () => {
  let component: ApplicationQuestionnaireComponent;
  let fixture: ComponentFixture<ApplicationQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
