import { Component } from '@angular/core';
import { PermissionRequest } from '../../../../models/Auth/permissionsRequest';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  modulos: any[] = [];

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

        localStorage.setItem('menu', JSON.stringify(res));

        const menuDataFromLocalStorage = localStorage.getItem('menu');

        if (menuDataFromLocalStorage !== null) {
          const dataFromLocalStorage: any = JSON.parse(menuDataFromLocalStorage);

          console.log('dataFromLocalStorage', dataFromLocalStorage);

          this.filtrarYOrganizarModulos(dataFromLocalStorage)
          this.modulos = this.filtrarYOrganizarModulos(dataFromLocalStorage);

          console.log('this.modulos', this.modulos);

        } else {
          console.error('El valor de "menu" en el LocalStorage es nulo.');
        }

      })
    }
  }

  filtrarYOrganizarModulos(data: any[]): any[] {
    let modulosFiltrados: any[] = [];
    data.forEach(modulo => {

      const mod: any = {
        nombre: modulo.nombremodulo,
        submodulos: modulo.submodules
          .filter((submodulo: any) => submodulo.idsubmodulo !== 0) // Filtrar submódulos con idsubmodulo diferente de 0
          .map((submodulo: any) => {
            const submod: any = {
              nombre: submodulo.nombresubmodulo,
              ruta: submodulo.rutasubmodulo,
              items: submodulo.items
                .filter((item: any) => item.iditemmodulo !== 0) // Filtrar items de módulo con iditemmodulo diferente de 0
                .map((item: any) => {
                  return {
                    nombre: item.nombreitemmodulo,
                    ruta: item.rutaitemmodulo
                  };
                })
            };
            return submod;
          })
      };
      modulosFiltrados.push(mod);
    });
    return modulosFiltrados;
  }

}
