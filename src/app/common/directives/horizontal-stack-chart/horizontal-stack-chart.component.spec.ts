import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalStackChartComponent } from './horizontal-stack-chart.component';

describe('HorizontalStackChartComponent', () => {
  let component: HorizontalStackChartComponent;
  let fixture: ComponentFixture<HorizontalStackChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalStackChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalStackChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
