import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbAssessmentComponent } from './db-assessment.component';

describe('DbAssessmentComponent', () => {
  let component: DbAssessmentComponent;
  let fixture: ComponentFixture<DbAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbAssessmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
