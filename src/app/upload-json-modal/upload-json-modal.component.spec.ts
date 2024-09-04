import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadJsonModalComponent } from './upload-json-modal.component';

describe('UploadJsonModalComponent', () => {
  let component: UploadJsonModalComponent;
  let fixture: ComponentFixture<UploadJsonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadJsonModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadJsonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
