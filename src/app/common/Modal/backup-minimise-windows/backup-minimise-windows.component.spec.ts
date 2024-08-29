import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupMinimiseWindowsComponent } from './backup-minimise-windows.component';

describe('BackupMinimiseWindowsComponent', () => {
  let component: BackupMinimiseWindowsComponent;
  let fixture: ComponentFixture<BackupMinimiseWindowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackupMinimiseWindowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackupMinimiseWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
