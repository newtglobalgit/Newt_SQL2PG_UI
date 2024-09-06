import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryWebpageReportComponent } from './discovery-webpage-report.component';

describe('DiscoveryWebpageReportComponent', () => {
  let component: DiscoveryWebpageReportComponent;
  let fixture: ComponentFixture<DiscoveryWebpageReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscoveryWebpageReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoveryWebpageReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
