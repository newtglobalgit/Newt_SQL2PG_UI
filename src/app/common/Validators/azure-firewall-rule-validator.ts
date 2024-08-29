import { AbstractControl, ValidationErrors, FormGroup } from "@angular/forms"
import * as _ from 'lodash';

// custom validator to check that two fields match
export function AzureFirewallRuleValidator(from: string, end: string) {
    return (formGroup: FormGroup) => {
        const fromIP = formGroup.controls[from];
        const endIP = formGroup.controls[end];
        let fromIPNumber = '';
        let endIPNumber = '';

        if (fromIP.errors && !fromIP.errors["azureFirewallRule"]) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        let fromIPArray:any [] = fromIP.value.split('.')
        let endIPArray:any [] = endIP.value.split('.')

        for(let i in fromIPArray){
            fromIPNumber = fromIPNumber + fromIPArray[i]
        }

        for(let i in endIPArray){
            endIPNumber = endIPNumber + endIPArray[i]
        }

        if(parseInt(fromIPNumber) > parseInt(endIPNumber)){
            fromIP.setErrors({ azureFirewallRule: true });
        }else{
            fromIP.setErrors(null);
        }

        return null;        
    }

}