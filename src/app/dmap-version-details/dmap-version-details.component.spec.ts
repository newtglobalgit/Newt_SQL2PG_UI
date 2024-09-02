import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapVersionDetailsComponent } from './dmap-version-details.component';

describe('DmapVersionDetailsComponent', () => {
  let component: DmapVersionDetailsComponent;
  let fixture: ComponentFixture<DmapVersionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmapVersionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmapVersionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
