import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BusinessUserRequest } from '../../models/Auth/businessUserRequest';
import { BusinessAccountUserRequest } from '../../models/Auth/businessAccountUserRequest';
import { PermissionRequest } from '../../models/Auth/permissionsRequest';
import { LoginMainRequest } from '../../models/Auth/loginMainRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private readonly apiUrl = 'https://localhost:7169/api/'
  private readonly apiUrl = environment.endpointIntranet;
  
  constructor(
    private http: HttpClient
  ) { }


  getCompany(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}Company`);
    
  }
  getCountry(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}Country`);
  }

  getUserData(user: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}AuthLogin/GetUserData`, {user} );
  }
  
  
  getBusiness(businessUserRequest: BusinessUserRequest): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}AuthLogin/GetBusinessUser`, businessUserRequest);
  }

  getBusinessAccount(businessAccountUserRequest: BusinessAccountUserRequest): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}AuthLogin/GetBusinessAccountUser`, businessAccountUserRequest);
  }

  getPermissions(permissionRequest: PermissionRequest): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}AuthLogin/GetPermissions`, permissionRequest);
  }

}
