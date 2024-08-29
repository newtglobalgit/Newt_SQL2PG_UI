import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapProdDbDetailsComponent } from './dmap-prod-db-details.component';

describe('DmapProdDbDetailsComponent', () => {
  let component: DmapProdDbDetailsComponent;
  let fixture: ComponentFixture<DmapProdDbDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapProdDbDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapProdDbDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
