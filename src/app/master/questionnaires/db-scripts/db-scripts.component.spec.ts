import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbScriptsComponent } from './db-scripts.component';

describe('DbScriptsComponent', () => {
  let component: DbScriptsComponent;
  let fixture: ComponentFixture<DbScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbScriptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
