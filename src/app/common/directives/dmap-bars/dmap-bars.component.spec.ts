import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapBarsComponent } from './dmap-bars.component';

describe('DmapBarsComponent', () => {
  let component: DmapBarsComponent;
  let fixture: ComponentFixture<DmapBarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapBarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
