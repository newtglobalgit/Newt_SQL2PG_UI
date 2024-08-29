import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapFloatingBarChartsComponent } from './dmap-floating-bar-charts.component';

describe('DmapFloatingBarChartsComponent', () => {
  let component: DmapFloatingBarChartsComponent;
  let fixture: ComponentFixture<DmapFloatingBarChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapFloatingBarChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapFloatingBarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
