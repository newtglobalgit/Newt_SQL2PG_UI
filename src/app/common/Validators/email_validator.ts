import { AbstractControl, ValidationErrors } from "@angular/forms"

export const EmailValidator = function (control: AbstractControl): ValidationErrors | null {

    let value: string = control.value || '';
    let msg = "In-valid Email address"
    if (!value) {
        return null;
    }
    
    let specialCharacters = /\S+@\S+\.\S+/gm
    if (specialCharacters.test(value) === false) {
        return {email: msg};
    } 

    return null;
}