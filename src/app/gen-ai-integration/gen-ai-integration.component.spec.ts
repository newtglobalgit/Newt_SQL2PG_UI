import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenAiIntegrationComponent } from './gen-ai-integration.component';

describe('GenAiIntegrationComponent', () => {
  let component: GenAiIntegrationComponent;
  let fixture: ComponentFixture<GenAiIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenAiIntegrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GenAiIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
