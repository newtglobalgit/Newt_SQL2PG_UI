import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapParamsModalComponent } from './dmap-params-modal.component';

describe('DmapParamsModalComponent', () => {
  let component: DmapParamsModalComponent;
  let fixture: ComponentFixture<DmapParamsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapParamsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapParamsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
