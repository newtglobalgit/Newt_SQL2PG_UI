import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MergeTypeService { 
  
  priorities = [
    {level: 1, type: 'NOT IN', value: 'NOT_IN', detail : [{type:'The exception is where have NULL in the NOT IN sub query, This the NOT IN always be false and will not return any rows . Not In does not have the ability to compare the NULL values.'},
                                                {type:'The NOT IN operator is used when want to retrieve a column that has no entries in the table or referencing table.'},
                                                {type:'Where using NOT IN the query performs nested full tables scans.'}]
    },
    {level: 2, type: 'NOT EXISTS', value: 'NOT_EXISTS', detail : [{type:'Exists cannot return NULL. It’s checking solely for the presence or absence of a row in the subquery and, hence, it can only return true or false.'},
                                                        {type:'Not EXISTS query can use an index within the sub-query.'}
                                                      ]
    },
    {level: 3, type: 'MERGE CONDITION', value: 'MERGE_CONDITION',detail : [{type:'MATCHED'}, {type:'NOT MATCHED BY SOURCE'}, {type:'NOT MATCHED BY TARGET'}]},
    {level: 4, type: 'ON CONFLICT', value: 'ON_CONFLICT',  hint: 'ON CONFLICT clause is a powerful clause to resolve any conflict between the data and the data to modify.',  
                                                 detail : [{type:'ON CONFLICT DO UPDATE'}, 
                                                           {type: 'ON CONFLICT DO NOTHING'}, 
                                                           {type:'INSERT ON CONFLICT [DO UPDATE] [DO NOTHING]', detail: [{type: 'INSERT ON CONFLICT DO UPDATE: If record matched, it is updated with the new data value.'},
                                                                                                                         {type:'INSERT ON CONFLICT DO NOTHING: If record matched, it skips the record or error'}]},
                                                           {type: 'UPSERT with ON CONFLICT'},
                                                           {type: 'ON CONFLICT Delete'}]}
  ];

  constructor() { }

  getMergeTpyes(){
    return this.priorities.slice();
  }
}
