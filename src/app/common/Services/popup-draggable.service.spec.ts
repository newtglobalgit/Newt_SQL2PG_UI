import { TestBed } from '@angular/core/testing';

import { PopupDraggableService } from './popup-draggable.service';

describe('PopupDraggableService', () => {
  let service: PopupDraggableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupDraggableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
