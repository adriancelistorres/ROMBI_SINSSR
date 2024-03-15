import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css',
})
export class StartComponent {

  empresaROM:string = '08';
  empresaTAWA:string = '02';
  empresaLIMTEK:string = '09';

  constructor(private router: Router, private authService: AuthService
    ) {
    localStorage.clear();
  }

  loginRombiROM() {
    this.authService.getCompany().subscribe({
      next: (response) => {
        console.log('Respuesta del servicio:', response);

        // Verificar si la respuesta contiene el id de empresa '08'
        const empresaEncontrada = response.find((empresa:any) => empresa.empresaid === this.empresaROM);

        if (empresaEncontrada) {
          console.log('Empresa ROM encontrada:', empresaEncontrada.empresaid);
          localStorage.setItem('codempresa', empresaEncontrada.empresaid);
          // Navegar a la ruta 'auth'
          this.router.navigate(['auth']);
        } else {
          console.log('Empresa ROM no encontrada en la respuesta.');
          // Manejar el caso en el que el id de empresa '08' no se encuentra en la respuesta
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos del usuario:', error);
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "<b>Se produjo un Error Interno</b>",
          showCloseButton: true,
          text: "Error en el Servidor!"
        });

      },
    });
  }

  loginRombiTAWA() {
    this.authService.getCompany().subscribe({
      next: (response) => {
        console.log('Respuesta del servicio:', response);

        // Verificar si la respuesta contiene el id de empresa '08'
        const empresaEncontrada = response.find((empresa:any) => empresa.empresaid === this.empresaTAWA);

        if (empresaEncontrada) {
          console.log('Empresa TAWA encontrada:', empresaEncontrada.empresaid);
          localStorage.setItem('codempresa', empresaEncontrada.empresaid);
          // Navegar a la ruta 'auth'
          this.router.navigate(['auth']);
        } else {
          console.log('Empresa TAWA no encontrada en la respuesta.');
          const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "error",
            title: "<b>Se produjo un Error Interno</b>",
            showCloseButton: true,
            text: "Error en el Servidor!"
          });

          // Manejar el caso en el que el id de empresa '08' no se encuentra en la respuesta
        }
      },
      error: (error) => {
        console.error('Error al obtener los datos del usuario:', error);
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "<b>Se produjo un Error Interno</b>",
          showCloseButton: true,
          text: "Error en el Servidor!"
        });

      },
    });
  }

  loginRombiLIMTEK() {
    this.authService.getCompany().subscribe({
      next: (response) => {
        console.log('Respuesta del servicio:', response);

        // Verificar si la respuesta contiene el id de empresa '08'
        const empresaEncontrada = response.find((empresa:any) => empresa.empresaid === this.empresaLIMTEK);

        if (empresaEncontrada) {
          console.log('Empresa Limtek encontrada:', empresaEncontrada.empresaid);
          localStorage.setItem('codempresa', empresaEncontrada.empresaid);
          // Navegar a la ruta 'auth'
          this.router.navigate(['auth']);
        } else {
          console.log('Empresa Limtek no encontrada en la respuesta.');
          // Manejar el caso en el que el id de empresa '08' no se encuentra en la respuesta
        }
      },
      error: (error) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "<b>Se produjo un Error Interno</b>",
          showCloseButton: true,
          text: "Error en el Servidor!"
        });

        console.error('Error al obtener los datos del usuario:', error);
      },
    });
  }



}
