import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiFieldFilter'
})
export class MultiFieldFilterPipe implements PipeTransform {
  transform(items: any, filterValue: any, isAnd: boolean): any {
    if(items.length == 0){
      return [];
    }
    let _filterValue = {}
    let updateSeachKeys = Object.keys(items[0]);
    let searchKeys = updateSeachKeys.filter( item => item != 'active_worker_nodes');
    for(let i in searchKeys){
      let key = searchKeys[i]
      _filterValue[key] = filterValue;
    }

    if (_filterValue && Array.isArray(items)) {
      let filterKeys = Object.keys(_filterValue);
      if (isAnd) {
        return items.filter(item =>
            filterKeys.reduce((memo, keyName) =>
                (memo && new RegExp(_filterValue[keyName], 'gi').test(item[keyName])) || _filterValue[keyName] === "", true));
      } else {
        return items.filter(item => {
          return filterKeys.some((keyName) => {
            return new RegExp(_filterValue[keyName], 'gi').test(item[keyName]) || _filterValue[keyName] === "";
          });
        });
      }
    } else {
      return items;
    }
  }
}