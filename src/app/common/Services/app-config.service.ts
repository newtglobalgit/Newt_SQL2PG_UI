import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  public host: string;
  public appRemdHost: string;

  constructor(private http: HttpClient) {}

  load(): Promise<any> {
    const promise = this.http
      .get('assets/dmap_ui_property.json')
      .toPromise()
      .then((data) => {
        let cURL: any = window.location.href;
        let arrUrl = data['host'].split(':');
        cURL = cURL.split(':');
        let url = arrUrl[1]
          ? `${cURL[0] + ':' + cURL[1]}:${arrUrl[1] ? arrUrl[2] : arrUrl[0]}`
          : arrUrl[0];
        let dataa = { host: url };
        Object.assign(this, dataa);
        return dataa;
      });
    return promise;
  }
}
