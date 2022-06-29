import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from "moment";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'
import { CopilotModel } from '../models/copilot-model';
import { ServerResponseModel } from '../models/service-response-model';

@Injectable({
  providedIn: 'root'
})
export class CopilotService {

  constructor(private http: HttpClient) { }
  upload(data: any) {
    return this.http.post<ServerResponseModel>(environment.baseurl + '/copilot/upload', { Content: data }, this.setHeader())
  }
  setHeader() {
    return { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("id_token") as string } };
  }

  search(path: string): Observable<any> {
    return this.http.get<ServerResponseModel>(environment.baseurl + '/copilot/query' + path, this.setHeader())
  }
  getByID(id: string): Observable<any> {
    return this.http.get<ServerResponseModel>(environment.baseurl + '/copilot/get/' + id)
  }
  delete(id: string): Observable<any> {
    return this.http.post<ServerResponseModel>(environment.baseurl + '/copilot/delete', { id }, this.setHeader())
  }
  rate(rating: string, id: string): Observable<any> {
    return this.http.post<ServerResponseModel>(environment.baseurl + '/copilot/rating', { id, rating }, this.setHeader())
  }
}
