import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmapUploadFileComponent } from './dmap-upload-file.component';

describe('DmapUploadFileComponent', () => {
  let component: DmapUploadFileComponent;
  let fixture: ComponentFixture<DmapUploadFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapUploadFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
