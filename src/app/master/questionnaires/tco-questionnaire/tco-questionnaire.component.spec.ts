import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcoQuestionnaireComponent } from './tco-questionnaire.component';

describe('TcoQuestionnaireComponent', () => {
  let component: TcoQuestionnaireComponent;
  let fixture: ComponentFixture<TcoQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcoQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcoQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
