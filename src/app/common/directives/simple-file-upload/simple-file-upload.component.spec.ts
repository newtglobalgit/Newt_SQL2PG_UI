import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFileUploadComponent } from './simple-file-upload.component';

describe('SimpleFileUploadComponent', () => {
  let component: SimpleFileUploadComponent;
  let fixture: ComponentFixture<SimpleFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
