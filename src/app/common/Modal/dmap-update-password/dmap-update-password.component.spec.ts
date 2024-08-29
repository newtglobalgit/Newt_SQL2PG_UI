import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapUpdatePasswordComponent } from './dmap-update-password.component';

describe('DmapUpdatePasswordComponent', () => {
  let component: DmapUpdatePasswordComponent;
  let fixture: ComponentFixture<DmapUpdatePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapUpdatePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapUpdatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
