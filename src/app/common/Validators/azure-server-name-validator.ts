import { AbstractControl, ValidationErrors } from "@angular/forms"

export const AzureServerNameValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';
  let msg = "Use lowercase letters, numbers, and hyphens for server name and it should be atleast 3 characters long. It must not start or end with a hyphen."
  if (!value) {
    return null
  }

  if(value.length < 3){
    return {azureServerName: msg}
  }
  
  let specialCharacters = /^([a-z0-9]+-)*[a-z0-9]+$/gm
  if (specialCharacters.test(value) === false) {
    return {azureServerName: msg}
  }
  return null;
}