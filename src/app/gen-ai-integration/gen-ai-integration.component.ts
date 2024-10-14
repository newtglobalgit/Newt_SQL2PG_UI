import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadJsonModalComponent } from '../upload-json-modal/upload-json-modal.component';
import { NgForm } from '@angular/forms';
import { Sql2PgService } from '../common/Services/sql2pg.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmapAlertDialogModal } from '../common/Modal/dmap-alert-dialog/dmap-alert-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from '../common/Services/login-service.service';

@Component({
  selector: 'app-gen-ai-integration',
  templateUrl: './gen-ai-integration.component.html',
  styleUrls: ['./gen-ai-integration.component.css'],
})
export class GenAiIntegrationComponent implements OnInit {
  genAIForm: FormGroup;
  @ViewChild('f', { static: false }) genAiForm: NgForm;
  @ViewChild('ff', { static: false }) serviceAccountForm: NgForm;
  userId: any;
  userName: any;

  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private sql2PgService: Sql2PgService,
    private fb: FormBuilder,
    private loginService : LoginService
  ) {}

  ngOnInit(): void {
    const [user_id  , user_name] =this.loginService.getUserData()
    this.userId = user_id
    this.userName = user_name
    console.log(user_id +" "+ user_name)
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
  temperature: any = 1;
  topP: any = 1;
  apiCallLimit: string = '';
  maxRetries: string = '1';
  retryDelay: string = '1';
  maxTokens: string = '';
  maxApiCalls: string = '1';
  locationInvalid: boolean = false;
  
  fileName: string | null = null; 
  isFileRequired: boolean = false;
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
    const maxTokens = Number(this.maxOutputTokens);
    if (
      this.location &&!this.locationInvalid&&
      this.modelSelection &&
      this.maxOutputTokens &&maxTokens <= 8192&&
      this.temperature !== null &&
      this.temperature !== undefined &&
      this.temperature >= 0 &&
      this.temperature <= 2 &&
      this.topP !== null &&
      this.topP !== undefined &&
      this.topP >= 0 &&
      this.topP <= 1 &&
      this.apiCallLimit &&
      this.maxRetries &&
      this.retryDelay &&
      this.maxTokens &&
      this.maxApiCalls
    ) {
      this.genAIEnabledSuccessfully = true;
    } else {
      if (this.topP < 0 || this.topP > 1) {
        this.openAlert('Top P value must be between 0 and 1');
      } else if (this.temperature < 0 || this.temperature > 2) {
        this.openAlert('Temperature value must be between 0 and 2');
      } 
      else if (this.locationInvalid) {
        this.openAlert('enter valid location');
      } 
      else if ( maxTokens > 8192) {
        this.openAlert('Max Output Tokens cannot exceed more than 8192'); 
      }
      else {
        this.openAlert('Please fill all the mandatory fields');
      }
      return false;
    }
    this.spinner.show();
    const genAidata: any = this.genAiForm.value;
    genAidata.userId = this.userId
    genAidata.userName = this.userName
    genAidata.isEnabled = this.genAIEnabledSuccessfully
    console.log('Gen Ai submit data - ', genAidata);
    this.sql2PgService.saveGenAiDetails(genAidata).subscribe((res) => {
      this.spinner.hide();
      this.openAlert(res.message);
    });

    this.enableServiceAccount = true;
  }

  validateLocation(value: string) {
    const regex = /^[A-Za-z0-9\- ]+$/; // Allows letters, numbers, hyphens, spaces
    const isNumeric = /^\d+$/; // Only numbers

    if (!regex.test(value) || isNumeric.test(value)) {
      this.locationInvalid = true; // Set to true if invalid or only numeric
    } else {
      this.locationInvalid = false; // No errors, valid input
      this.location = value; // Assign the valid value
    }
  }

  activateServiceAccount() {
    this.validateFileUpload();
    if (this.projectId && this.serviceAccountEmail&&!this.isFileRequired) {
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
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
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
  validateFileUpload() {
    if (!this.fileName) {
      console.log("no file")
      this.isFileRequired = true; // Set the flag if no file is uploaded
    } else {
      this.isFileRequired = false; // Clear the flag if the file is uploaded
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name; // Store the file name
      console.log(this.fileName);
      this.isFileRequired = false;
      console.log('File selected:', file.name);
      const input = document.getElementById('fileUpload') as HTMLInputElement;
      const fileName =
        input.files && input.files.length > 0 ? input.files[0].name : '';
      document.getElementById('file-upload-filename')!.textContent = fileName;
    }
  }
}
