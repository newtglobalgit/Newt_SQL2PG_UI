import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbDetailsComponent } from './db-details.component';

describe('DbDetailsComponent', () => {
  let component: DbDetailsComponent;
  let fixture: ComponentFixture<DbDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
