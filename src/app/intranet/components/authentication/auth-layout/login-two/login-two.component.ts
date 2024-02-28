import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Country } from '../../../../models/Auth/country';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { LoginMainRequest } from '../../../../models/Auth/loginMainRequest';
import { SecurityService } from '../../../../services/auth/security.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-two',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login-two.component.html',
  styleUrl: './login-two.component.css'
})
export class LoginTwoComponent implements OnInit {
  loginForm: UntypedFormGroup;
  showPassword: boolean = false;
  listCountry: Country[] = [];
  loginMainRequest: LoginMainRequest = new LoginMainRequest();

  constructor(
    private router: Router,
    private authService: AuthService,
    private securityService: SecurityService,
    private fb: UntypedFormBuilder,
    private toastr: ToastrService
  ){
    this.loginForm = this.createFormLogin();
  }

  ngOnInit(): void {
    this.getCountry();
    localStorage.removeItem('codpais');
    localStorage.removeItem('user');
    localStorage.removeItem('token');

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
    
    localStorage.setItem('codpais', this.loginForm.getRawValue().country);
    localStorage.setItem('user', this.loginForm.getRawValue().username);

    //console.log(localStorage.getItem('codempresa'));
    //console.log(localStorage.getItem('user'));
    let codempresa:any = localStorage.getItem('codempresa');
    this.loginMainRequest.codempresa=codempresa;
    this.loginMainRequest.codpais=this.loginForm.getRawValue().country;
    this.loginMainRequest.user=this.loginForm.getRawValue().username;
    this.loginMainRequest.password=this.loginForm.getRawValue().password;

    // const loginMainRequest:LoginMainRequest = {
    //   codempresa: '08',
    //   codpais: this.loginForm.getRawValue().country,
    //   user: this.loginForm.getRawValue().username,
    //   password: this.loginForm.getRawValue().password
    // };
    
    this.securityService.authenticate(this.loginMainRequest).subscribe(
      (response) => {
          // Manejar la respuesta del servicio de permisos aquí
          console.log(response); // Aquí puedes ver la respuesta del servicio
          if (response.resultado === "ACCESO CONCEDIDO") {
              localStorage.setItem('token', response.token);
              // Si el acceso es concedido, redirige a la página de autenticación tres
              this.router.navigate(['/auth/loginThree']);
          } else {
            this.toastr.error('Se produjo un error durante la autenticación.', 'ERROR DE DATOS', {
            });
              // Si el acceso es denegado, maneja el caso apropiado aquí  
              console.log('Acceso denegado');
          }
      },
      (error) => {
          // Manejar errores de la solicitud HTTP aquí
          this.toastr.error('Se produjo un error durante la autenticación.');

          console.error('Error al obtener los permisos:', error);
      })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getCountry(){
    this.authService.getCountry().subscribe((res) => {
      this.listCountry = res;
      console.log(this.listCountry);
    });
  }

}
