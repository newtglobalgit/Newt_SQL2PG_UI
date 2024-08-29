import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergePrioritySelectionModalComponent } from './merge-priority-selection-modal.component';

describe('MergePrioritySelectionModalComponent', () => {
  let component: MergePrioritySelectionModalComponent;
  let fixture: ComponentFixture<MergePrioritySelectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergePrioritySelectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergePrioritySelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
