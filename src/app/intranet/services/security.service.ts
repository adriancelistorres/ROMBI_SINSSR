import { Injectable } from '@angular/core';
//import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

interface TokenResponse {
  token: string;
  expirationDate: Date;
  // Puedes agregar más propiedades según sea necesario
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    //private cookieService : CookieService
  ) { }

  // getToken(): string{
  //   return 'TOKEN'
  // }

  // getToken(): Observable<string> {
  //   // En este ejemplo, estoy usando un valor estático como token, 
  //   // pero podrías modificarlo para obtener el token de la cookie o de alguna otra fuente asincrónica.
  //   const token = 'TOKEN';
  //   return new Observable<string>(observer => {
  //     observer.next(token);
  //     observer.complete();
  //   });
  // }

  authentication(): Observable<TokenResponse> {
    // En este ejemplo, estoy usando un valor estático como token y una fecha de expiración, 
    // pero podrías modificarlo para obtener el token de la cookie o de alguna otra fuente asincrónica.
    const token = 'TOKEN';
    const expirationDate = new Date(); // Puedes establecer la fecha de expiración real
  
    const tokenResponse: TokenResponse = {
      token,
      expirationDate,
      // Agrega más propiedades según sea necesario
    };
  
    return new Observable<TokenResponse>(observer => {
      observer.next(tokenResponse);
      observer.complete();
    });
  }

  // logIn(): string{
  //   let token = 'TOKEN';

  //   return token;
  // }
}
