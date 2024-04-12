import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidacionBundlesService {

  private readonly apiUrl = environment.endpointIntranet;
  httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

  constructor(
    private http: HttpClient
  ) { }

  getBundlesVentas(intIdVentasPrincipal: number): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}ValidacionBundles/GetBundlesVentas`, `"${intIdVentasPrincipal}"`, this.httpOptions);
  }

}
