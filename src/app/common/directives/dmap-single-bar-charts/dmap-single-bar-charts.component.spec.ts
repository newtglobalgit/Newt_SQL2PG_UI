import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapSingleBarChartsComponent } from './dmap-single-bar-charts.component';

describe('DmapSingleBarChartsComponent', () => {
  let component: DmapSingleBarChartsComponent;
  let fixture: ComponentFixture<DmapSingleBarChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapSingleBarChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapSingleBarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
