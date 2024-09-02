import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
})
export class UpdatePasswordComponent implements OnInit {



  selectedValue: string | null = null;  
  updatePasswordForm: FormGroup;
  passwordSelected = false;
  selectedType = "";
  sourceForm: FormGroup;
  targetForm: FormGroup;

  constructor(private fb: FormBuilder
    , private cd: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
   
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
    throw new Error('Method not implemented.');
  }

  onRadioChange(value: string) {
    this.selectedValue = value;
    this.cd.detectChanges(); 
  }


  submit() {
    if (this.selectedValue === 'source') {
      const sourcePassword = this.sourceForm.value.sourcePasswordValue;
      const sourceConfirmPassword = this.sourceForm.value.sourceConfirmPasswordValue;

      this.passToBackend({ password: sourcePassword, confirmPassword: sourceConfirmPassword });
    } else if (this.selectedValue === 'target') {
      const targetPassword = this.targetForm.value.targetPasswordValue;
      const targetConfirmPassword = this.targetForm.value.targetConfirmPasswordValue;

      this.passToBackend({ password: targetPassword, confirmPassword: targetConfirmPassword });
    }
  }

  passToBackend(data: any) {
    console.log('Passing data to backend:', data);
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
 


  
}
