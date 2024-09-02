import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
})
export class UpdatePasswordComponent implements OnInit {


  formpassword: string | null = null;
  sourceForm: FormGroup;
  targetForm: FormGroup;

  constructor(private fb: FormBuilder,
    private activeModal: NgbActiveModal,
  ) {
    this.sourceForm = this.fb.group({
      sourcePasswordValue: ['', Validators.required],
      sourceConfirmPasswordValue: ['', Validators.required]
    });

    this.targetForm = this.fb.group({
      targetPasswordValue: ['', Validators.required],
      targetConfirmPasswordValue: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  selectDB(db: string) {
    this.formpassword = db;
  }

  clearSelection() {
    this.formpassword = null;
    this.sourceForm.reset();
    this.targetForm.reset();
  }

// sourcecolmd6: boolean = false;
// sourcecolmd12: boolean = true;
// data: any;
// f: any;
// selectedOption: string | null = null;
// formpassword: any = null; // Track the selected radio button value
// selectedDB: string = ''; // Track which DB's password fields are shown (source or target)

//   // Forms for source and target password validation
// sourceForm: FormGroup;
// targetForm: FormGroup;



//   constructor(private activeModal: NgbActiveModal,
//     private formBuilder: FormBuilder,
//     // private databaseListService: DatabaseListService,
//     private spinner: NgxSpinnerService,
//     private modalService: NgbModal,
//     ) { }


//   ngOnInit(): void {
//     // Initialize forms with empty values and validations
//     this.sourceForm = this.formBuilder.group({
//       sourcePasswordValue: ['', Validators.required],
//       sourceConfirmPasswordValue: ['', [Validators.required, this.mustMatch('sourcePasswordValue')]]
//     });

//     this.targetForm = this.formBuilder.group({
//       targetPasswordValue: ['', Validators.required],
//       targetConfirmPasswordValue: ['', [Validators.required, this.mustMatch('targetPasswordValue')]]
//     });
//   }


//    // Handle radio button selection and update the selectedDB variable
//    selectDB(dbType: string) {
//     this.selectedDB = dbType; // Show appropriate password fields
//     console.log(this.selectedDB)
//     // Reset the forms when switching between source and target
//     this.sourceForm.reset();
//     this.targetForm.reset();
//   }

//   // Custom validator to match password and confirm password fields
//   mustMatch(passwordControlName: string) {
//     return (control: any) => {
//       const formGroup = control.parent;
//       if (formGroup) {
//         const passwordControl = formGroup.get(passwordControlName);
//         if (passwordControl && passwordControl.value !== control.value) {
//           return { mustMatch: true };
//         }
//       }
//       return null;
//     };
//   }

//   // Dummy method to test source DB connection
//   testSourceDbConnection() {
//     if (this.sourceForm.valid) {
//       console.log('Source DB connection tested.');
//     }
//   }



//   // Dummy method to test target DB connection
//   testTargetDbConnection() {
//     if (this.targetForm.valid) {
//       console.log('Target DB connection tested.');
//     }
//   }

//   // Dummy submit method for source DB password
//   submitSource() {
//     if (this.sourceForm.valid) {
//       console.log('Source password submitted:', this.sourceForm.value);
//     }
//   }

//   // Dummy submit method for target DB password
//   submitTarget() {
//     if (this.targetForm.valid) {
//       console.log('Target password submitted:', this.targetForm.value);
//     }
//   }

 

//   clearTarget() {
//     this.formpassword = null;
//     this.selectedOption = null;
//   }
  
  
  ok(){
    this.activeModal.close();
  }

  cancel() {
    this.activeModal.close('cancel');
  }
}

