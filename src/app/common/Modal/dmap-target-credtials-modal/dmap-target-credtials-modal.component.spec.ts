import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DmapTargetCredtialsModal } from './dmap-target-credtials-modal.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { inject } from '@angular/core';


describe('DmapTargetCredtialsModalComponent', () => {
  let component: DmapTargetCredtialsModal;
  let fixture: ComponentFixture<DmapTargetCredtialsModal>;
  var ngbModalService:NgbActiveModal;
  const mock = {
    "title": "Unit Test Label",
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmapTargetCredtialsModal ],
      imports: [HttpClientTestingModule, FormsModule, NgbModule, NgxPaginationModule ],
      providers:[NgbActiveModal]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmapTargetCredtialsModal);
    component = fixture.componentInstance;
    component.data = mock;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  
});
