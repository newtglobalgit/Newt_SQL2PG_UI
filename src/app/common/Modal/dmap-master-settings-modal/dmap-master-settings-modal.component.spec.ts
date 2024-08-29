import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapMasterSettingsModalComponent } from './dmap-master-settings-modal.component';

describe('DmapMasterSettingsModalComponent', () => {
  let component: DmapMasterSettingsModalComponent;
  let fixture: ComponentFixture<DmapMasterSettingsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapMasterSettingsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapMasterSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
