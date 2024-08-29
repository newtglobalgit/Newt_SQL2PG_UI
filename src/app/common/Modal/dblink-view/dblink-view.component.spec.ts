import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DblinkViewComponent } from './dblink-view.component';

describe('DblinkViewComponent', () => {
  let component: DblinkViewComponent;
  let fixture: ComponentFixture<DblinkViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DblinkViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DblinkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
