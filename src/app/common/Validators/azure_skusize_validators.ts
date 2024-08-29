import { AbstractControl, ValidationErrors } from "@angular/forms"

export const AzureSKUSizeValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: number = control.value || 0;
  let msg = "Value needs to be greater or equal than 5 GB."
  if (!value) {
    return null
  }

  if (value < 5) {
    return {azureSKUSize: msg}
  }
  return null;
}