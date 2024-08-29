import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapStackChartsComponent } from './dmap-stack-charts.component';

describe('DmapStackChartsComponent', () => {
  let component: DmapStackChartsComponent;
  let fixture: ComponentFixture<DmapStackChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapStackChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapStackChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
