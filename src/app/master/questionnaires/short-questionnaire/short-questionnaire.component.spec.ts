import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortQuestionnaireComponent } from './short-questionnaire.component';

describe('ShortQuestionnaireComponent', () => {
  let component: ShortQuestionnaireComponent;
  let fixture: ComponentFixture<ShortQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
