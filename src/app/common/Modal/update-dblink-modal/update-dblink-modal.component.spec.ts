import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDblinkModalComponent } from './update-dblink-modal.component';

describe('UpdateDblinkModalComponent', () => {
  let component: UpdateDblinkModalComponent;
  let fixture: ComponentFixture<UpdateDblinkModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDblinkModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDblinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
