import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapLicenseDetailsComponent } from './dmap-license-details.component';

describe('DmapLicenseDetailsComponent', () => {
  let component: DmapLicenseDetailsComponent;
  let fixture: ComponentFixture<DmapLicenseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmapLicenseDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmapLicenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
