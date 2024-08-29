import { Injectable } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatGptService {

  constructor(private http: HttpClient, private config:AppConfigService) { }

  getTableData():Observable<any> {
    return this.http.get(this.config.host+'/getChatGPTTableData');
  }

  isChatGPTEnabled():Observable<any> {
    return this.http.get(this.config.host+'/getChatgptStatus');
  }

  saveChatGPTData(obj):Observable<any> {
    return this.http.post(this.config.host+'/saveChatGPTData',obj);
  }

  updateChatGPTData(obj):Observable<any> {
    return this.http.post(this.config.host+'/updateChatGPTData',obj);
  }

  deleteChatGPTData(obj):Observable<any>{
    return this.http.post(this.config.host+'/deleteChatGPTData',obj);
  }
  isTokenValid(obj):Observable<any>{
    return this.http.post(this.config.host+'/validateOpenAIToken',obj);
  }

}
