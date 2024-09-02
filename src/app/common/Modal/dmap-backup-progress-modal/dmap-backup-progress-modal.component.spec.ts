import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapBackupProgressModalComponent } from './dmap-backup-progress-modal.component';

describe('DmapBackupProgressModalComponent', () => {
  let component: DmapBackupProgressModalComponent;
  let fixture: ComponentFixture<DmapBackupProgressModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmapBackupProgressModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmapBackupProgressModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
