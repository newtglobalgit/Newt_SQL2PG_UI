import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapAwrConfirmationComponent } from './dmap-awr-confirmation.component';

describe('DmapAwrConfirmationComponent', () => {
  let component: DmapAwrConfirmationComponent;
  let fixture: ComponentFixture<DmapAwrConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmapAwrConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmapAwrConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
