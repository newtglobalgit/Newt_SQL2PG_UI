import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapMultipleSchemaDeleteComponent } from './dmap-multiple-schema-delete.component';

describe('DmapMultipleSchemaDeleteComponent', () => {
  let component: DmapMultipleSchemaDeleteComponent;
  let fixture: ComponentFixture<DmapMultipleSchemaDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapMultipleSchemaDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapMultipleSchemaDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
