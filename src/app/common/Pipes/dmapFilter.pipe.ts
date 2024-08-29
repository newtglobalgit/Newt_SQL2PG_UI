import {PipeTransform, Pipe } from '@angular/core';
import { Database } from '../../common/Model/database.model';


@Pipe({
    name: 'dmapTableFilter'
})
export class DMAPFilterPipe implements PipeTransform{
    transform(tableData: Database[], searchDmapTable:string):Database[]{
        if(!tableData || !searchDmapTable){
            return tableData
        }

        return tableData.filter(d => 
           /*  d.runId.indexOf(searchDmapTable) !== -1 ||  */
            d.createdBy.toLowerCase().indexOf(searchDmapTable.toLowerCase()) !== -1 ||
            d.sourceDBName.toLowerCase().indexOf(searchDmapTable.toLowerCase()) !== -1 ||
            d.targetDBName.toLowerCase().indexOf(searchDmapTable.toLowerCase()) !== -1 ||
            d.lastUpdated.toLowerCase().indexOf(searchDmapTable.toLowerCase()) !== -1 ||
            d.stepStatus.toLowerCase().indexOf(searchDmapTable.toLowerCase()) !== -1
        );
    }
}