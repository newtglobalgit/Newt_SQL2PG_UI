import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapSettingsComponent } from './dmap-settings.component';

describe('DmapSettingsComponent', () => {
  let component: DmapSettingsComponent;
  let fixture: ComponentFixture<DmapSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
