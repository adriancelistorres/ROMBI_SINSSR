import { Component } from '@angular/core';
import { PermissionRequest } from '../../../../models/Auth/permissionsRequest';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  listMenu: any[]=[]

  permissionRequest: PermissionRequest = new PermissionRequest();

  constructor(
    private authService: AuthService
  ) {
    const menu = localStorage.getItem('menu');
    if (menu !== null) {
      localStorage.removeItem('menu');
    }
    this.getObjectPermissions();
  }

  getObjectPermissions() {
    const codempresa = localStorage.getItem('codempresa')
    const codpais = localStorage.getItem('codpais')
    const codnegocio = localStorage.getItem('codnegocio')
    const codcuenta = localStorage.getItem('codcuenta')
    const user = localStorage.getItem('user')
    if (codempresa !== null && codpais !== null
      && codnegocio !== null && codcuenta !== null
      && user !== null) {
      this.permissionRequest.codempresa = codempresa;
      this.permissionRequest.codpais = codpais;
      this.permissionRequest.codnegocio = codnegocio;
      this.permissionRequest.codcuenta = codcuenta;
      this.permissionRequest.user = user;
      this.authService.getPermissions(this.permissionRequest).subscribe(res => {
        console.log(res);
        localStorage.setItem('menu', JSON.stringify(res));
        const menu = localStorage.getItem('menu');
        if (menu !== null) {
          console.log(JSON.parse(menu));
          this.listMenu=JSON.parse(menu)
        }
      })
    }
  }

  // filtrar(data:any[]){
  //   let modulosfiltro=[];
  //   data.forEach(modulo=>{
  //     const mods={
  //       nombre:modulo.nombremodulo,
  //       submodulos:modulo.submodules

  //     }
  //   })
  // }


}
