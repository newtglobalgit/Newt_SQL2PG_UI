import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadJsonModalComponent } from '../upload-json-modal/upload-json-modal.component';

@Component({
  selector: 'app-chat-gpt-integration',
  templateUrl: './chat-gpt-integration.component.html',
  styleUrls: ['./chat-gpt-integration.component.css']
})
export class ChatGptIntegrationComponent implements OnInit {

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
  }
  chatGptEnabled: boolean = false;
  genAIEnabledSuccessfully: boolean = false;
  
  location: string = '';
  modelSelection: string = 'Default';
  maxOutputTokens: string = '';
  temperature: number = 1;
  topP: string = '';
  apiCallLimit: string = '';
  maxRetries: string = '';
  retryDelay: string = '';
  maxTokens: string = '';
  maxApiCalls: string = '';
  
  projectId: string = '';
  serviceAccountEmail: string = '';
  
  clearGenAI() {
    this.location = '';
    this.modelSelection = 'Default';
    this.maxOutputTokens = '';
    this.temperature = 1;
    this.topP = '';
    this.apiCallLimit = '';
    this.maxRetries = '';
    this.retryDelay = '';
    this.maxTokens = '';
    this.maxApiCalls = '';
  }
  
  saveGenAI() {
        if (this.location && this.modelSelection && this.maxOutputTokens && this.temperature && this.topP && this.apiCallLimit) {
            this.genAIEnabledSuccessfully = true;
            alert('GenAI enabled successfully');
        } else {
            alert('Please fill all credentials');
        }
    }

    openModal() {
      const modalRef = this.modalService.open(UploadJsonModalComponent, {
        size: 'lg',
        scrollable: true,
      });}
  
  clearServiceAccount() {
    this.projectId = '';
    this.serviceAccountEmail = '';
  }

  activateServiceAccount() {
    if (this.projectId && this.serviceAccountEmail) {
      alert('Service Account activated successfully');
    } else {
      alert('Please fill all required fields');
    }
  }

}
