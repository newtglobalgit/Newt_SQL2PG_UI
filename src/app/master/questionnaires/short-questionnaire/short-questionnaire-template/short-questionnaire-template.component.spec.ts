import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortQuestionnaireTemplateComponent } from './short-questionnaire-template.component';

describe('ShortQuestionnaireTemplateComponent', () => {
  let component: ShortQuestionnaireTemplateComponent;
  let fixture: ComponentFixture<ShortQuestionnaireTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortQuestionnaireTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortQuestionnaireTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
