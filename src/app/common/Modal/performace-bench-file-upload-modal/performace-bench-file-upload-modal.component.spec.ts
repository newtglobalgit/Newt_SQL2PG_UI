import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformaceBenchFileUploadModalComponent } from './performace-bench-file-upload-modal.component';

describe('PerformaceBenchFileUploadModalComponent', () => {
  let component: PerformaceBenchFileUploadModalComponent;
  let fixture: ComponentFixture<PerformaceBenchFileUploadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformaceBenchFileUploadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformaceBenchFileUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
