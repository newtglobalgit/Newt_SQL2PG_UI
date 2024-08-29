import { AbstractControl, ValidationErrors } from "@angular/forms"

export const AzureResourceGroupNameValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';
  let msg = "Use alphanumeric characters, periods, underscore, hyphens and parenthesis for resource group name. It cannot end with period."
  if (!value) {
    return null
  }

  if(value.length < 1){
    return {azureResourceGroupName: msg}
  }

  let specialCharacters = /^([a-zA-Z0-9-._()]+.)*[a-zA-Z0-9-_()]+$/gm
  if (specialCharacters.test(value) === false) {
    return {azureResourceGroupName: msg}
  }
  return null;
}