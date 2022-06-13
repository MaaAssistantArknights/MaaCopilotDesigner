import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'

import * as moment from "moment";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {

  }

  login(email: string, password: string) {
    // return this.http.post(environment.baseurl + '/user/login', { email: 'super@prts.plus', password: 'TPDLEMPUWNQZUFIL' })
    return this.http.post(environment.baseurl + '/user/login', { email, password })
      .toPromise().then(res => this.setSession(res));
  }

  private setSession(authResult: any) {    
    const expiresAt = moment(authResult.data.valid_before)
    localStorage.setItem('id_token', authResult.data.token);
    localStorage.setItem('username', authResult.data.user_name);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    this.http.get(environment.baseurl + '/user/info/me', { headers: { 'Authorization': 'Bearer ' + authResult.data.token } }).toPromise().then(userResponse => {
      localStorage.setItem('role', (userResponse as any).data.role);
    })
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
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
    return moment(expiresAt);
  }
  isRole(permission: string) {
    return localStorage.getItem("role") == permission;
  }
}
