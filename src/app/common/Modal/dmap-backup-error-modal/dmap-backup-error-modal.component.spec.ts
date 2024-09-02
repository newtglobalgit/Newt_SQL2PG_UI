import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapBackupErrorModalComponent } from './dmap-backup-error-modal.component';

describe('DmapBackupErrorModalComponent', () => {
  let component: DmapBackupErrorModalComponent;
  let fixture: ComponentFixture<DmapBackupErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmapBackupErrorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmapBackupErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
