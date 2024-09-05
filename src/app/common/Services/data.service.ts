// Now you can call methods like this:
// this.dataService.setTableData(someData);
// this.dataService.getTableData();
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private tableData: any[] = [];

  setTableData(data: any[]): void {
    this.tableData = data;
  }

  getTableData(): any[] {
    return this.tableData;
  }
}
