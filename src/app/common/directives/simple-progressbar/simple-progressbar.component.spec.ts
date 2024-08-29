import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleProgressbarComponent } from './simple-progressbar.component';

describe('SimpleProgressbarComponent', () => {
  let component: SimpleProgressbarComponent;
  let fixture: ComponentFixture<SimpleProgressbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleProgressbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
