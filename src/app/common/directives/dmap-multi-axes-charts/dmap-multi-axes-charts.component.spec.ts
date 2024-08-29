import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapMultiAxesChartsComponent } from './dmap-multi-axes-charts.component';

describe('DmapMultiAxesChartsComponent', () => {
  let component: DmapMultiAxesChartsComponent;
  let fixture: ComponentFixture<DmapMultiAxesChartsComponent>;
  const mock={"containerId":"Test"};
  const mockk={"name":"Test"}
  const mockkk= true;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapMultiAxesChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapMultiAxesChartsComponent);
    component = fixture.componentInstance;
    component.chartSettings=mock;
    component.chartMultiAxesData=mockk;
    component.isMultiAxesShow=mockkk;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
