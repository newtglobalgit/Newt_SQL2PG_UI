import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapBatchDetailsComponent } from './dmap-batch-details.component';

describe('DmapBatchDetailsComponent', () => {
  let component: DmapBatchDetailsComponent;
  let fixture: ComponentFixture<DmapBatchDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapBatchDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapBatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
