import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbDetailsTemplateComponent } from './db-details-template.component';

describe('DbDetailsTemplateComponent', () => {
  let component: DbDetailsTemplateComponent;
  let fixture: ComponentFixture<DbDetailsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbDetailsTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbDetailsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
