import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapMasterEmailSettingsModalComponent } from './dmap-master-email-settings-modal.component';

describe('DmapMasterEmailSettingsModalComponent', () => {
  let component: DmapMasterEmailSettingsModalComponent;
  let fixture: ComponentFixture<DmapMasterEmailSettingsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapMasterEmailSettingsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapMasterEmailSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
