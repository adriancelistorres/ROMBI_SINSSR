import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Country } from '../../../../models/Auth/country';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { DataService } from '../../../../services/Data/data.service';
import { PermissionRequest } from '../../../../models/Auth/permissionsRequest';
import { LoginMainRequest } from '../../../../models/Auth/loginMainRequest';
import { SecurityService } from '../../../../services/security.service';
//import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-two',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //HttpClientModule
  ],
  templateUrl: './login-two.component.html',
  styleUrl: './login-two.component.css'
})
export class LoginTwoComponent implements OnInit {
  loginForm: UntypedFormGroup;
  showPassword: boolean = false;
  listCountry: Country[] = [];

  constructor(
    private router: Router,
    //private cookieService: CookieService,
    private authService: AuthService,
    private dataService: DataService,
    private securityService: SecurityService,
    private fb: UntypedFormBuilder
  ){
    this.loginForm = this.createFormLogin();
  }

  ngOnInit(): void {
    //this.formLogin();
    this.getCountry();
  }

  createFormLogin(): UntypedFormGroup{
    return this.fb.group({
      country: new FormControl("", Validators.compose([
        Validators.required,
      ])),
      username: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  getLogin(){
    console.log(this.loginForm.getRawValue());
    
    localStorage.setItem('codempresa', "08");
    localStorage.setItem('codpais', this.loginForm.getRawValue().country);
    localStorage.setItem('user', this.loginForm.getRawValue().username);

    //console.log(localStorage.getItem('codempresa'));
    //console.log(localStorage.getItem('user'));

    const permissionRequest:LoginMainRequest = {
      codempresa: '08',
      codpais: this.loginForm.getRawValue().country,
      user: this.loginForm.getRawValue().username,
      password: this.loginForm.getRawValue().password

    };
    
    this.securityService.authenticate(permissionRequest).subscribe(
      (response) => {
          // Manejar la respuesta del servicio de permisos aquí
          console.log(response); // Aquí puedes ver la respuesta del servicio
          if (response.resultado === "ACCESO CONCEDIDO") {
              localStorage.setItem('token', response.token);
              // Si el acceso es concedido, redirige a la página de autenticación tres
              this.router.navigate(['/auth/loginThree']);
          } else {
              // Si el acceso es denegado, maneja el caso apropiado aquí
              console.log('Acceso denegado');
          }
      },
      (error) => {
          // Manejar errores de la solicitud HTTP aquí
          console.error('Error al obtener los permisos:', error);
      })
    // this.securityService.authentication().subscribe(res => {
    //   console.log(res.token);
    //   console.log(res.expirationDate);
    //   //this.cookieService.set('token', res.token);
    //   this.router.navigate(['/auth/loginThree']);
    // })
    
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getCountry(){
    this.authService.getCountry().subscribe((res) => {
      //console.log(res);
      this.listCountry = res;
      console.log(this.listCountry);
    });
  }

}
