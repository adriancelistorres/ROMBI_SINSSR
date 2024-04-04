import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AccesosService } from '../../../../../services/rom/seguridad/accesos/accesos.service';
import { Acceso, AccesosRequest } from '../../../../../models/rom/seguridad/acceso';
import Swal from 'sweetalert2';
import { SegUsuario } from '../../../../../models/rom/seguridad/segusuario';
import { Perfil } from '../../../../../models/rom/seguridad/perfil';

@Component({
  selector: 'app-accesos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './accesos.component.html',
  styleUrl: './accesos.component.css'
})
export class AccesosComponent implements OnInit {
  accessForm: UntypedFormGroup;
  accesosList: Acceso[] = [];
  filteredAccesosList: any[] = []; // Lista filtrada para mostrar
  searchTerm: string = ''; // Término de búsqueda vinculado al input
  acceso: AccesosRequest = new AccesosRequest();
  usuario: string | null;
  nombres: string = "";
  segUsuario: SegUsuario = new SegUsuario();
  perfilesList: Perfil[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private accesosServices: AccesosService
  ) {
    this.usuario = localStorage.getItem('user');
    this.accessForm = this.createFormAccess();
  }

  ngOnInit(): void {
    this.getAccesos();
    this.getPerfiles();
  }

  createFormAccess(): UntypedFormGroup {
    return this.fb.group({
      usuario: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nombres: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      perfil: new FormControl("", Validators.compose([
        Validators.required,
      ])),
    });
  }

  getAccessForm() {
    console.log(this.accessForm.getRawValue());
    this.acceso.dni = this.accessForm.getRawValue().usuario
    this.acceso.idperfil = Number(this.accessForm.getRawValue().perfil)
    this.acceso.usuario_creacion = this.usuario!;
    this.accesosServices.postAccesos(this.acceso).subscribe(res => {
      //console.log('postaccesos res:', res);
      if (res.mensaje === 'OK') {
        Swal.fire({
          title: 'Listo!',
          text: 'Registro guardado 🥳',
          icon: 'success',
          confirmButtonText: 'Ok',
          customClass: {
            confirmButton: 'swalBtnColor'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAccesos();
            this.limpiarFormulario();
          }
        });
      } else {
        console.log(res);
      }
    })
  }

  getAccesos() {
    this.accesosList = [];
    this.filteredAccesosList = [];
    this.accesosServices.getAccesos().subscribe(res => {
      console.log('GETACCESOS', res)
      if (res !== null) {
        this.accesosList = res;
        this.filteredAccesosList = res;
      }
    })
  }

  search() {
    if (!this.searchTerm.trim()) {
      // Si el término de búsqueda está vacío, no filtre.
      this.filteredAccesosList = this.accesosList;
    } else {
      this.filteredAccesosList = this.accesosList.filter((item: any) =>
        item.nombrecompleto.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.dni.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.perfil.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getNombres() {
    const usuario = this.accessForm.get('usuario')?.value; // Obtener el valor del campo de usuario
    if (usuario) {
      this.accesosServices.getSegUsuario(usuario).subscribe(res => {
        console.log('getsegusuario', res);
        if (res.nombrecompleto !== null) {
          this.segUsuario = res;
          this.nombres = this.segUsuario.nombrecompleto || ''; // Establecer los nombres y apellidos en el campo correspondiente
          this.accessForm.patchValue({ nombres: this.nombres }); // Actualizar el valor en el formulario
        } else {
          Swal.fire({
            icon: "error",
            title: "Usuario No Encontrado",
            text: "No se encontró ningún registro con ese usuario"
          });
        }
      });
    }
  }
  
  getPerfiles(){
    this.accesosServices.getPerfiles().subscribe(res=>{
      if(res !== null) {
        this.perfilesList = res;
      }
    })
  }

  limpiarFormulario() {
    // Restablecer el formulario a su estado inicial
    this.accessForm.reset({
      usuario: '',
      nombres: '',
      perfil: ""
    }, { emitEvent: false, onlySelf: true });

    this.acceso = new AccesosRequest();
  }

  editRow(item: any) {
    
  }

  deleteRow() {

  }
}
