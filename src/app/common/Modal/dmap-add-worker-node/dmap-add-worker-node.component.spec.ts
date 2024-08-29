import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapAddMasterNodeComponent } from './dmap-add-worker-node.component';

describe('DmapAddMasterNodeComponent', () => {
  let component: DmapAddMasterNodeComponent;
  let fixture: ComponentFixture<DmapAddMasterNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapAddMasterNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapAddMasterNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
