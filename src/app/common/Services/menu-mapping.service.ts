import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class MenuMappingService {

  private globalMenuData: any;

  constructor(private http: HttpClient, private config:AppConfigService) { }

  // getGlobalMenuData(): any {
  //   if(this.globalMenuData === null){
  //     this.getMenuAndPageMappings();
  //     console.log(this.globalMenuData ,'value is called')
  //     return this.globalMenuData;
  //   }else{
  //     return this.globalMenuData;
  //   }
  // }

  getMenuAndPageMappings(): Observable<any> {
     this.http.get(this.config.host+'/getmenuControls').subscribe((response) => {
      this.globalMenuData = response;
    });
    return this.globalMenuData;
  }

  getMenuAndPageMapping():Observable<any> {
    return this.http.get(this.config.host+'/getmenuControls');

  }
}
