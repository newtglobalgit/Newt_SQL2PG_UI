import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapUpdateThresholdComponent } from './dmap-update-threshold.component';

describe('DmapUpdateThresholdComponent', () => {
  let component: DmapUpdateThresholdComponent;
  let fixture: ComponentFixture<DmapUpdateThresholdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapUpdateThresholdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapUpdateThresholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
