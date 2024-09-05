import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DBAssessment {
  private tableData: any[] = [];

  setTableData(data: any[]): void {
    this.tableData = data;
  }

  getTableData(): any[] {
    return this.tableData;
  }
}
