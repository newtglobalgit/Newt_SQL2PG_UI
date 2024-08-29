import { AbstractControl, ValidationErrors, FormGroup } from "@angular/forms"

// custom validator to check that two fields match
export function NotContainLoginId(subStringControlName: string, stringControlName: string) {
    return (formGroup: FormGroup) => {
        const subStringControl = formGroup.controls[subStringControlName];
        const stringControl = formGroup.controls[stringControlName];

        if (stringControl.errors && !stringControl.errors["notContainId"]) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (stringControl.value.includes(subStringControl.value)) {
            stringControl.setErrors({ notContainId: true });
        } else {
            stringControl.setErrors(null);
        }
    }
}