import { AbstractControl, ValidationErrors } from "@angular/forms"

export const AzurePostgresqlAdminLoginValidator = function (control: AbstractControl): ValidationErrors | null {
  let excludedValues = ['azure_superuser', 'azure_pg_admin', 'admin', 'administrator', 'root', 'guest', 'public', 'pg_']
  let value: string = control.value || '';
  let msg = "Use alpha numeric characters. It should be atleast 1 character long."
  if (!value) {
    return null
  }

  if(value.length < 1){
    return {azurePostgresqlAdminLogin: msg}
  }
  
  if (excludedValues.indexOf(value) > -1){
    if(excludedValues[excludedValues.indexOf(value)].length == value.length){
      return { azurePostgresqlAdminLogin: 'LoginId can not contain azure_superuser, azure_pg_admin, admin, administrator, root, guest, public or start with pg_'};
    }
  }
  
  let startWithPG_ = /^([PG]+_)+$/gm
  if (startWithPG_.test(value) === true) {
    return {azurePostgresqlAdminLogin: 'LoginId can not start from PG_'}
  }
  
  let startWithpg_ = /^([pg]+_)+$/gm
  if (startWithpg_.test(value) === true) {
    return {azurePostgresqlAdminLogin: 'LoginId can not start from pg_'}
  }

  let specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  if (specialCharacters.test(value) === true) {
    return {azurePostgresqlAdminLogin: msg}
  }
  return null;
}