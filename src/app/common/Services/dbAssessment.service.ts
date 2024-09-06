import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DBAssessment {
  constructor(private http: HttpClient) {}

  private tableData: any[] = [];

  setTableData(data: any[]): void {
    this.tableData = data;
  }

  getTableData(): any[] {
    return this.tableData;
  }

  
}
