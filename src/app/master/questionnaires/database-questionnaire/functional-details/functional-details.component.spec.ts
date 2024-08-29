import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalDetailsComponent } from './functional-details.component';

describe('FunctionalDetailsComponent', () => {
  let component: FunctionalDetailsComponent;
  let fixture: ComponentFixture<FunctionalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
