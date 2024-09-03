import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGptIntegrationComponent } from './chat-gpt-integration.component';

describe('ChatGptIntegrationComponent', () => {
  let component: ChatGptIntegrationComponent;
  let fixture: ComponentFixture<ChatGptIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatGptIntegrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatGptIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
