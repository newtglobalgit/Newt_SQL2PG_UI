import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sql2PgService } from '../../Services/sql2pg.service';
import { DmapAlertDialogModal } from '../dmap-alert-dialog/dmap-alert-dialog.component';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
})
export class UpdatePasswordComponent implements OnInit {

  @Input() data: any;

  selectedValue: string | null = null;  
  updatePasswordForm: FormGroup;
  passwordSelected = false;
  selectedType = "";
  sourceForm: FormGroup;
  targetForm: FormGroup;
  runId: any;

  constructor(private fb: FormBuilder
    , private cd: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private sql2pgservice : Sql2PgService
   
  ) {
    this.sourceForm = this.fb.group({
      sourcePasswordValue: ['', Validators.required],
      sourceConfirmPasswordValue: ['', Validators.required],
    }, {
      validator: this.mustMatch('sourcePasswordValue', 'sourceConfirmPasswordValue')
    });

    this.targetForm = this.fb.group({
      targetPasswordValue: ['', Validators.required],
      targetConfirmPasswordValue: ['', Validators.required],
    }, {
      validator: this.mustMatch('targetPasswordValue', 'targetConfirmPasswordValue')
    });
  }
  ngOnInit(): void {
    if (this.data) {
      this.runId = this.data.runId;
    }}

  onRadioChange(value: string) {
    this.selectedValue = value;
    this.cd.detectChanges(); 
  }

  submit() {
    if (this.selectedValue === 'source') {
      const sourcePassword = this.sourceForm.value.sourcePasswordValue;
      const sourceConfirmPassword = this.sourceForm.value.sourceConfirmPasswordValue;
  
      const payload = { sourcePassword: sourcePassword, RUN_ID: this.runId };
      this.spinner.show();

      this.sql2pgservice.updatePassword(payload).subscribe(
        (response) => {
          this.spinner.hide();
          if (response[0].status == 'SUCCESS') {
            this.openAlert('Source DB Password updated successfully.');
            this.activeModal.close();
          }
        },
        (error) => {
          console.error('API error:', error);
          this.spinner.hide();
          this.openAlert('Failed to update Source DB Password.');
        }
      );
    } else if (this.selectedValue === 'target') {
      const targetPassword = this.targetForm.value.targetPasswordValue;
      const targetConfirmPassword = this.targetForm.value.targetConfirmPasswordValue;
  
      const payload = { targetPassword: targetPassword, RUN_ID: this.runId };
      this.spinner.show();

      this.sql2pgservice.updatePassword(payload).subscribe(
        (response) => {
          this.spinner.hide();
          console.log(response.status,'123456')
          if (response[0].status == 'SUCCESS') {
            this.openAlert('Target DB Password updated successfully.');
            this.activeModal.close();
          }
          if(response[0].status == 'FAILURE')
          {
            this.spinner.hide();
            this.openAlert('Failed to update Target DB Password.');
            this.activeModal.close();

          }
        },
       
      );
    }
  }
  
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  
  clearForm() {
    if (this.selectedValue === 'source') {
      this.sourceForm.reset();
    } else if (this.selectedValue === 'target') {
      this.targetForm.reset();
    }
  }
  cancel() {
    this.activeModal.close('cancel');
  }


  openAlert(msg: string) {
    const modalRef = this.modalService.open(DmapAlertDialogModal);
    modalRef.componentInstance.data = { msg: msg, title: 'Alert' };
    modalRef.result.then((result) => {
    });
  }
  
 


  
}
