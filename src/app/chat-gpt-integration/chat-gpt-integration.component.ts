import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadJsonModalComponent } from '../upload-json-modal/upload-json-modal.component';
import { NgForm } from '@angular/forms';
import { Sql2PgService } from '../common/Services/sql2pg.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';

@Component({
  selector: 'app-chat-gpt-integration',
  templateUrl: './chat-gpt-integration.component.html',
  styleUrls: ['./chat-gpt-integration.component.css'],
})
export class ChatGptIntegrationComponent implements OnInit {
  @ViewChild('f', { static: false }) genAiForm: NgForm;

  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private sql2PgService: Sql2PgService
  ) {}

  ngOnInit(): void {}
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

  saveGenAiDetails() {
    this.spinner.show();
    const genAidata: any = this.genAiForm.value;
    console.log('Gen Ai submit data - ', genAidata);
    this.sql2PgService.saveGenAiDetails(genAidata).subscribe((res) => {
      this.spinner.hide();
      if (res.status === 'Success') {
        this.openAlert('GenAI enabled successfully');
      } else {
        this.openAlert(res[0].message);
      }
    });
    // if (
    //   this.location &&
    //   this.modelSelection &&
    //   this.maxOutputTokens &&
    //   this.temperature &&
    //   this.topP &&
    //   this.apiCallLimit
    // ) {
    //   this.genAIEnabledSuccessfully = true;
    //   alert('GenAI enabled successfully');
    // } else {
    //   alert('Please fill all credentials');
    // }
  }

  openModal() {
    const modalRef = this.modalService.open(UploadJsonModalComponent, {
      size: 'lg',
      scrollable: true,
    });
  }

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

  openAlert(msg: any, method = false) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      if (result === 'ok') {
      }
    });
  }
}
