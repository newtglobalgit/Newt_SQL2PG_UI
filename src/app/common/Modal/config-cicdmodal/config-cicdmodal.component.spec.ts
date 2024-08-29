import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCICDModalComponent } from './config-cicdmodal.component';

describe('ConfigCICDModalComponent', () => {
  let component: ConfigCICDModalComponent;
  let fixture: ComponentFixture<ConfigCICDModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigCICDModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigCICDModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
