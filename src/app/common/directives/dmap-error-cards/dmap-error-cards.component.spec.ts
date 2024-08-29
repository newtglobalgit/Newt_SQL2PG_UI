import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapErrorCardsComponent } from './dmap-error-cards.component';

describe('DmapErrorCardsComponent', () => {
  let component: DmapErrorCardsComponent;
  let fixture: ComponentFixture<DmapErrorCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapErrorCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapErrorCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
