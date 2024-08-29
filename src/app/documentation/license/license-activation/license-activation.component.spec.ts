import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseActivationComponent } from './license-activation.component';

describe('LicenseActivationComponent', () => {
  let component: LicenseActivationComponent;
  let fixture: ComponentFixture<LicenseActivationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicenseActivationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
