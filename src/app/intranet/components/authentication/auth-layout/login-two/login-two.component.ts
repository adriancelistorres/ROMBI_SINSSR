import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Country } from '../../../../models/Auth/country';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { DataService } from '../../../../services/Data/data.service';
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
    //private securityService: SecurityService,
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
    
    this.router.navigate(['/auth/loginThree']);
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
