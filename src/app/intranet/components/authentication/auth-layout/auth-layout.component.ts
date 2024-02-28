import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent implements OnInit{
  codeEmpresa: any; // Suponiendo que obtienes este valor del localStorage

  constructor() { }

  ngOnInit(): void {
    // Aquí obtienes el valor de codeEmpresa del localStorage
    this.codeEmpresa = localStorage.getItem('codempresa');
    console.log('empresita',this.codeEmpresa);
    
  }

  getImagePath(codeEmpresa: string): string {
    this.codeEmpresa = codeEmpresa;
    switch (codeEmpresa) {
      case '02':
        return 'assets/img/Tawa/logo_tawa.png';
      case '08':
        return 'assets/img/Rom/logo_rom.png';
      case '09':
        return 'assets/img/Limtek/logo_limtek.png';
      default:
        return ''; // Puedes proporcionar una ruta predeterminada si no se encuentra ninguna coincidencia
    }
  }
}
