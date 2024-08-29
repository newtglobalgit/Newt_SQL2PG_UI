import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServerDetailsComponentComponent } from './add-server-details-component.component';

describe('AddServerDetailsComponentComponent', () => {
  let component: AddServerDetailsComponentComponent;
  let fixture: ComponentFixture<AddServerDetailsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddServerDetailsComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddServerDetailsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
