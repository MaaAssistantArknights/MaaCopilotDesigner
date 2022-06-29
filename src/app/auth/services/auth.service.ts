import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'

import * as moment from "moment";
import { ServerResponseModel } from 'src/app/copilot/models/service-response-model';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {

  }

  login(email: string, password: string) {
    return this.http.post(environment.baseurl + '/user/login', { email, password })
      .toPromise().then(res => this.setSession(res, email));
  }

  forgetPass(email: string) {
    return this.http.post<ServerResponseModel>(environment.baseurl + '/user/password/reset_request', { email })
  }

  private setSession(authResult: any, email: string) {
    if (authResult.data) {
      const expiresAt = moment(authResult.data.valid_before)
      localStorage.setItem('id_token', authResult.data.token);
      localStorage.setItem('username', authResult.data.user_info.user_name);
      localStorage.setItem('id', authResult.data.user_info.id);
      localStorage.setItem('email', email);
      localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
      localStorage.setItem('role', authResult.data.user_info.role);
    }
    return authResult;
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("email");

  }
  changePassword(original_password: string, new_password: string) {
    return this.http.post<ServerResponseModel>(environment.baseurl + '/user/update/password', { original_password, new_password }, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("id_token") as string } })
  }
  updateInfo(object: any) {
    return this.http.post<ServerResponseModel>(environment.baseurl + '/user/update/info', object, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("id_token") as string } })
  }
  createUser(object: any) {
    return this.http.post<ServerResponseModel>(environment.baseurl + '/user/create', object, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem("id_token") as string } })
  }
  registerUser(object: any) {
    return this.http.post<ServerResponseModel>(environment.baseurl + '/user/register', object)
  }
  public isLoggedIn() {
    return moment().isBefore(this.getExpiration()) && localStorage.getItem("username");
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at") as string;
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt)
  }
  isRole(permission: string) {
    return localStorage.getItem("role") == permission;
  }
  getRole() {
    return localStorage.getItem("role") as string;
  }
  getUserName() {
    return localStorage.getItem("username") as string;
  }
  getEmail() {
    return localStorage.getItem("email") as string;
  }
  setData(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}
