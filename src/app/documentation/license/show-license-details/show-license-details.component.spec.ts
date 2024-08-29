import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLicenseDetailsComponent } from './show-license-details.component';

describe('ShowLicenseDetailsComponent', () => {
  let component: ShowLicenseDetailsComponent;
  let fixture: ComponentFixture<ShowLicenseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowLicenseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLicenseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
