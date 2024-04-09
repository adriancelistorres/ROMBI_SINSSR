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
  filteredAccesosList: Acceso[] = []; // Lista filtrada para mostrar
  searchTerm: string = ''; // Término de búsqueda vinculado al input
  acceso: AccesosRequest = new AccesosRequest();
  usuario: string | null;
  nombres: string = "";
  segUsuario: SegUsuario = new SegUsuario();
  perfilesList: Perfil[] = [];
  hours: string[] = ['07:00', '08:00', '09:00', '10:00',
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

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

  enableEditing(item: any) {
    this.filteredAccesosList.forEach(t => {
      if (t !== item) {
        t.editing = false; // Desactiva la edición de todos los demás turnos
      }
    });
    item.editing = true; // Activa la edición del turno seleccionado

  }

  
  saveChanges(item: any) {
    item.editing = false;
    console.log('ITEM', item.idacceso);
    console.log('ITEM', item.idperfiles);
    item.usuario_creacion = this.usuario!;

    // Aquí puedes implementar la lógica para guardar los cambios en tu base de datos o donde sea necesario
    console.log('ITEM', item);
    this.accesosServices.postAccesos(item).subscribe(res => {
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
    this.acceso.idperfiles = Number(this.accessForm.getRawValue().perfil)
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
        console.log('accesosList', this.accesosList);
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
  cancelEditing(item: any) {
    item.editing = false;
    // Puedes restaurar los valores originales del turno si fuera necesario
  }
  deleteAcceso(item: any) {
    console.log('ITEM', item.idacceso);
    console.log('dni', item.dni);

    item.editing = false;
    this.deleteRow(item); // Llama al método deleteRow() con los parámetros correspondientes

    // Puedes restaurar los valores originales del turno si fuera necesario
  }

  deleteRow(item: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer y también se borraran los turnos asignados en el apartado: ASIGNACIÓN DE TURNOS POR PDV',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // // Aquí puedes llamar a la función para eliminar el registro
        item.usuario_modificacion = this.usuario!;
        this.accesosServices.deleteAccesos(item).subscribe(res => {
          console.log('DELETE', res);
          if (res.mensaje === 'OK') {
            this.confirmarEliminacion();
            this.getAccesos()

          }
        })
      } else if (result.dismiss) {
        console.log('CANCELADO');
      }
    });
  }
  confirmarEliminacion() {
    // this.getAccesos()
    console.log('ELIMINADO');
    setTimeout(() => {
      // Aquí va tu lógica para eliminar el registro
      // Una vez que el registro ha sido eliminado, muestra un alert de confirmación
      Swal.fire(
        'Eliminado!',
        'El registro ha sido eliminado exitosamente.',
        'success'
      );
    }, 1000);
  }

  downloadExcel() {
    const url = 'assets/documents/excel/formato_accesos.xlsx'; // Ruta al archivo Excel en la carpeta assets
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'formato_accesos.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
