import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { DataService } from '../../../../services/Data/data.service';
import { BusinessUserRequest } from '../../../../models/Auth/businessUserRequest';
import { BusinessUserResponse } from '../../../../models/Auth/businessUserResponse';
import { BusinessAccountUserRequest } from '../../../../models/Auth/businessAccountUserRequest';
import { BusinessAccountUserResponse } from '../../../../models/Auth/businessAccountUserResponse';

@Component({
  selector: 'app-login-three',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-three.component.html',
  styleUrl: './login-three.component.css'
})
export class LoginThreeComponent {
  loginForm: UntypedFormGroup;
  listBusiness: BusinessUserResponse[] = [];
  listAccount: BusinessAccountUserResponse[] = [];
  businessUserRequest: BusinessUserRequest = new BusinessUserRequest();
  businessAccountUserRequest: BusinessAccountUserRequest = new BusinessAccountUserRequest();

  constructor(
    private router: Router,
    //private cookieService: CookieService,
    private authService: AuthService,
    private dataService: DataService,
    //private securityService: SecurityService,
    private fb: UntypedFormBuilder
  ) {
    this.loginForm = this.createFormLogin();
  }

  ngOnInit(): void {
    //this.formLogin();
    this.getBusiness();
  }

  createFormLogin(): UntypedFormGroup {
    return this.fb.group({
      business: new FormControl("", Validators.compose([
        Validators.required,
      ])),
      businessAccount: new FormControl("", Validators.compose([
        Validators.required,
      ]))
    });
  }

  getLogin() {
    console.log(this.loginForm.getRawValue());
    localStorage.setItem('codnegocio', this.loginForm.getRawValue().business);
    localStorage.setItem('codcuenta', this.loginForm.getRawValue().businessAccount);
    this.router.navigate(['main']);
    // this.securityService.authentication().subscribe(res => {
    //   console.log(res.token);
    //   console.log(res.expirationDate);
    //   //this.cookieService.set('token', res.token);
    //   this.router.navigate(['/auth/loginThree']);
    // })

  }

  getBusiness() {

    const codempresa = localStorage.getItem('codempresa')
    const user = localStorage.getItem('user')
    if (codempresa !== null && user !== null) {
      this.businessUserRequest.codempresa = codempresa;
      this.businessUserRequest.user = user;
    }

    console.log(this.businessUserRequest);

    this.authService.getBusiness(this.businessUserRequest).subscribe(res => {
      this.listBusiness = res;
      console.log(this.listBusiness);

    })
  }

  ongetBusinessAccount(event: any) {

    const idnegocio = (event.target as HTMLSelectElement)?.value;

    console.log(idnegocio);
    

    if (idnegocio !== null) {
      const codempresa = localStorage.getItem('codempresa')
      const user = localStorage.getItem('user')
      if (codempresa !== null && user !== null) {
        this.businessAccountUserRequest.codempresa = codempresa;
        this.businessAccountUserRequest.codnegocio = idnegocio;
        this.businessAccountUserRequest.user = user;
      }

      this.authService.getBusinessAccount(this.businessAccountUserRequest).subscribe(res=>{
        this.listAccount = res;
        console.log(this.listAccount);
      })
    }
  }

}
