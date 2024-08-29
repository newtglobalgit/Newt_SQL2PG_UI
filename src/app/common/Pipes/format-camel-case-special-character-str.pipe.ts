import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'formatCamelCaseSpecialCharacterStr'
})
export class FormatCamelCaseSpecialCharacterStrPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return _.startCase(value);
  }

}

