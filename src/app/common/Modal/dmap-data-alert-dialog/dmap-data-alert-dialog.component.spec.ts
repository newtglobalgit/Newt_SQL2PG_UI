import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapDataAlertDialogComponent } from './dmap-data-alert-dialog.component';

describe('DmapDataAlertDialogComponent', () => {
  let component: DmapDataAlertDialogComponent;
  let fixture: ComponentFixture<DmapDataAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapDataAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapDataAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
