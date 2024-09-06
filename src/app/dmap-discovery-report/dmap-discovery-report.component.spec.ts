import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapDiscoveryReportComponent } from './dmap-discovery-report.component';

describe('DmapDiscoveryReportComponent', () => {
  let component: DmapDiscoveryReportComponent;
  let fixture: ComponentFixture<DmapDiscoveryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmapDiscoveryReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmapDiscoveryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
