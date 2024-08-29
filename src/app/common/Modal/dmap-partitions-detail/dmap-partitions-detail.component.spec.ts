import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapPartitionsDetailComponent } from './dmap-partitions-detail.component';

describe('DmapPartitionsDetailComponent', () => {
  let component: DmapPartitionsDetailComponent;
  let fixture: ComponentFixture<DmapPartitionsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapPartitionsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapPartitionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
