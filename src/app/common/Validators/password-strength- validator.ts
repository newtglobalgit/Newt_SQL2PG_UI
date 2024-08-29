import { AbstractControl, ValidationErrors } from "@angular/forms"

export const PasswordStrengthValidator = function (control: AbstractControl): ValidationErrors | null {

  let value: string = control.value || '';
  let msg = "Password must be 8 characters long and should contain atleast one of each - uppercase, lowercase, number, and special charachter."

  if (!value) {
    return null
  }

  if(value.length < 8){
    return {passwordStrength: msg}
  }  

  let upperCaseCharacters = /[A-Z]+/g
  if (upperCaseCharacters.test(value) === false) {
    // return { passwordStrength: `text has to contine Upper case characters,current value ${value}` };
    return {passwordStrength: msg}
  }

  let lowerCaseCharacters = /[a-z]+/g
  if (lowerCaseCharacters.test(value) === false) {
    // return { passwordStrength: `text has to contine lower case characters,current value ${value}` };
    return {passwordStrength: msg}
  }


  let numberCharacters = /[0-9]+/g
  if (numberCharacters.test(value) === false) {
    // return { passwordStrength: `text has to contine number characters,current value ${value}` };
    return {passwordStrength: msg}
  }

  let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  if (specialCharacters.test(value) === false) {
    // return { passwordStrength: `text has to contine special character,current value ${value}` };
    return {passwordStrength: msg}
  }
  return null;
}