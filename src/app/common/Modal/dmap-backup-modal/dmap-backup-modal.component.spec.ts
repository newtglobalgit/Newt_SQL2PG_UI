import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapBackupModalComponent } from './dmap-backup-modal.component';

describe('DmapBackupModalComponent', () => {
  let component: DmapBackupModalComponent;
  let fixture: ComponentFixture<DmapBackupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapBackupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapBackupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
