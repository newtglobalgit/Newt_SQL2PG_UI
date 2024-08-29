import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public host: string;
  public appRemdHost: string;

  constructor(private http: HttpClient) {}

  load() :Promise<any>  {
    const promise = this.http.get('assets/dmap_ui_property.json')
      .toPromise()
      .then(data => {
        //Object.assign(this, data);
        let cURL :any = window.location.href;
        let arrUrl = data['host'].split(":");
        let arrUrl1 = data['appRemdHost'].split(":");
        cURL =cURL.split(':');
        let url = arrUrl[1] ? `${cURL[0] +':'+ cURL[1]}:${arrUrl[1] ? arrUrl[2] : arrUrl[0]}` : arrUrl[0]
        let url1 = arrUrl1[1] ? `${cURL[0] +':'+ cURL[1]}:${arrUrl1[1] ? arrUrl1[2] : arrUrl1[0]}` : arrUrl1[0]
        let dataa = {"host":url }
        let dataa1 = {"appRemdHost":url1}
        Object.assign(this, dataa);
        Object.assign(this, dataa1);
        return dataa;
      });
    return promise;
  }
}
