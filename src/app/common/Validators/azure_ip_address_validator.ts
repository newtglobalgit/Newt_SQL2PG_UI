import { AbstractControl, ValidationErrors } from "@angular/forms"

export const AzureIpAddressValidator = function (control: AbstractControl): ValidationErrors | null {

    let value: string = control.value || '';
    let msg = "In-valid IP address format."
    if (!value) {
        return null;
    }
    
    let specialCharacters = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm
    if (specialCharacters.test(value) === false) {
        return {azureIpAddress: msg};
    } 

    return null;
}