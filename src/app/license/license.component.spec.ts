import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LicenseComponent } from './license.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../common/Services/login-service.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LicenseComponent;
  let fixture: ComponentFixture<LicenseComponent>;
  var ngbModalService: NgbActiveModal;

  const mock = true;
  // const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  // const heroServiceSpy = jasmine.createSpyObj('LoginService', ['sendloginDetails']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LicenseComponent],
      imports: [
        NgbModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseComponent);
    component = fixture.componentInstance;
    // component.hasAccount = mock;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
