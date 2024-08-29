import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapOra2pgErrorModalComponent } from './dmap-ora2pg-error-modal.component';

describe('DmapOra2pgErrorModalComponent', () => {
  let component: DmapOra2pgErrorModalComponent;
  let fixture: ComponentFixture<DmapOra2pgErrorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapOra2pgErrorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapOra2pgErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
