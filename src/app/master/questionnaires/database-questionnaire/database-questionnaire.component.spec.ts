import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseQuestionnaireComponent } from './database-questionnaire.component';

describe('DatabaseQuestionnaireComponent', () => {
  let component: DatabaseQuestionnaireComponent;
  let fixture: ComponentFixture<DatabaseQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
