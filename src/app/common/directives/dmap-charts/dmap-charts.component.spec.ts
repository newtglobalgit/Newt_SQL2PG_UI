import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapChartsComponent } from './dmap-charts.component';

describe('DmapChartsComponent', () => {
  let component: DmapChartsComponent;
  let fixture: ComponentFixture<DmapChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
