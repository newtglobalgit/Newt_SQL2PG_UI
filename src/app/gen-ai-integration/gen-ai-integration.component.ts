import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadJsonModalComponent } from '../upload-json-modal/upload-json-modal.component';
import { NgForm } from '@angular/forms';
import { Sql2PgService } from '../common/Services/sql2pg.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gen-ai-integration',
  templateUrl: './gen-ai-integration.component.html',
  styleUrls: ['./gen-ai-integration.component.css'],
})
export class GenAiIntegrationComponent implements OnInit {
  genAIForm: FormGroup;
  @ViewChild('f', { static: false }) genAiForm: NgForm;
  @ViewChild('ff', { static: false }) serviceAccountForm: NgForm;

  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private sql2PgService: Sql2PgService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.genAIForm = this.fb.group({
      location: [''],
      modelSelection: ['Default'],
      maxOutputTokens: [''],
      temperature: [1],
      topP: [''],
      apiCallLimit: [''],
      maxRetries: ['1'],
      retryDelay: ['1'],
      maxTokens: [''],
      maxApiCalls: ['1'],
    });
  }
  existingGenAiDetails: any;
  selectedFile: File | null = null;
  chatGptEnabled: boolean = false;
  genAIEnabledSuccessfully: boolean = false;
  enableServiceAccount: boolean = false;

  location: string = '';
  modelSelection: string = 'Default';
  maxOutputTokens: string = '';
  temperature: number = 1;
  topP: string = '';
  apiCallLimit: string = '';
  maxRetries: string = '1';
  retryDelay: string = '1';
  maxTokens: string = '';
  maxApiCalls: string = '1';

  projectId: string = '';
  serviceAccountEmail: string = '';

  clearGenAI() {
    this.location = '';
    this.modelSelection = 'Default';
    this.maxOutputTokens = '';
    this.temperature = 1;
    this.topP = '';
    this.apiCallLimit = '';
    this.maxRetries = '1';
    this.retryDelay = '1';
    this.maxTokens = '';
    this.maxApiCalls = '1';
  }

  saveGenAiDetails() {
    if (
      this.location &&
      this.modelSelection &&
      this.maxOutputTokens &&
      this.temperature &&
      this.topP &&
      this.apiCallLimit &&
      this.maxRetries &&
      this.retryDelay &&
      this.maxTokens &&
      this.maxApiCalls
    ) {
      this.genAIEnabledSuccessfully = true;
    } else {
      this.openAlert('Please fill all the mandatory fields');
      return false;
    }
    this.spinner.show();
    const genAidata: any = this.genAiForm.value;
    console.log('Gen Ai submit data - ', genAidata);
    this.sql2PgService.saveGenAiDetails(genAidata).subscribe((res) => {
      this.spinner.hide();
      this.openAlert(res.message);
    });

    this.enableServiceAccount = true;
  }

  activateServiceAccount() {
    if (this.projectId && this.serviceAccountEmail) {
      this.genAIEnabledSuccessfully = true;
    } else {
      this.openAlert('Please fill all the mandatory fields');
      return false;
    }
    this.spinner.show();

    const formData = new FormData();

    formData.append('projectId', this.projectId);
    formData.append('serviceAccountEmail', this.serviceAccountEmail);

    if (this.selectedFile) {
      formData.append(
        'serviceAccountFile',
        this.selectedFile,
        this.selectedFile.name
      );
    }

    // const serviceAccountdata: any = this.serviceAccountForm.value;
    console.log('Service Account submit data - ', formData);
    this.sql2PgService.saveServiceAccountDetails(formData).subscribe((res) => {
      this.spinner.hide();
      this.openAlert(res.message);
    });
    this.sql2PgService.genAiActivated = true;
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

  openAlert(msg: any, method = false) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
      if (result === 'ok') {
      }
    });
  }

  onGenAiEnableTick(isChecked: boolean) {
    if (isChecked) {
      console.log('Checkbox is checked');
      this.sql2PgService.fetchGenAiDetails().subscribe((res) => {
        this.existingGenAiDetails = res;
        console.log(
          'Existing Gen AI Details --> ',
          this.existingGenAiDetails.data
        );
        this.genAIForm.patchValue({
          location: this.existingGenAiDetails.data.location,
          modelSelection: this.existingGenAiDetails.data.modelSelection,
          maxOutputTokens: this.existingGenAiDetails.data.maxOutputTokens,
          temperature: this.existingGenAiDetails.data.temperature,
          topP: this.existingGenAiDetails.data.topP,
          apiCallLimit: this.existingGenAiDetails.data.apiCallLimit,
          maxRetries: this.existingGenAiDetails.data.maxRetries,
          retryDelay: this.existingGenAiDetails.data.retryDelay,
          maxTokens: this.existingGenAiDetails.data.maxTokens,
          maxApiCalls: this.existingGenAiDetails.data.maxApiCalls,
        });
        this.spinner.hide();
      });
    } else {
      console.log('Checkbox is unchecked');
      // Handle the uncheck case here if needed
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('File selected:', file.name);
      const input = document.getElementById('fileUpload') as HTMLInputElement;
      const fileName =
        input.files && input.files.length > 0 ? input.files[0].name : '';
      document.getElementById('file-upload-filename')!.textContent = fileName;
    }
  }
}
