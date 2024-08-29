import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDmapNotificationsComponent } from './show-dmap-notifications.component';

describe('ShowDmapNotificationsComponent', () => {
  let component: ShowDmapNotificationsComponent;
  let fixture: ComponentFixture<ShowDmapNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDmapNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDmapNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
