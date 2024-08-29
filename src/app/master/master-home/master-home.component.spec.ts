import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterHomeComponent } from './master-home.component';

describe('MasterHomeComponent', () => {
  let component: MasterHomeComponent;
  let fixture: ComponentFixture<MasterHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
