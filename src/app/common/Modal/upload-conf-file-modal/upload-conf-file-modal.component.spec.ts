import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadConfFileModalComponent } from './upload-conf-file-modal.component';

describe('UploadConfFileModalComponent', () => {
  let component: UploadConfFileModalComponent;
  let fixture: ComponentFixture<UploadConfFileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadConfFileModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadConfFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
