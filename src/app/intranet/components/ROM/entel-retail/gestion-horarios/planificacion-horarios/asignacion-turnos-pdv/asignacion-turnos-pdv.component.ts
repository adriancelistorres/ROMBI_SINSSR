import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AsignarTurnosService } from '../../../../../../services/entel-retail/planificacion-horarios/asignar-turnos.service';
import { UsuarioSupervisor } from '../../../../../../models/planificacion-horarios/usuarioSupervisor';
import { TurnosAsignadosSupervisor, TurnosSupervisor } from '../../../../../../models/planificacion-horarios/turnosSupervisor';
import { TurnosSupervisorDelRequest } from '../../../../../../models/planificacion-horarios/turnosSupervisorDelRequest';
import { SupervisorPDV } from '../../../../../../models/planificacion-horarios/supervisorPDV';
import { TurnosDisponiblesPDVRequest } from '../../../../../../models/planificacion-horarios/turnosDisponiblesPDVRequest';
import { TurnosAsignadosPDVRequest } from '../../../../../../models/planificacion-horarios/turnosAsignadosPDVRequest';
import { TurnosAsignadosPDVpostRequest } from '../../../../../../models/planificacion-horarios/turnosAsignadosPDVpostRequest';

@Component({
  selector: 'app-asignacion-turnos-pdv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './asignacion-turnos-pdv.component.html',
  styleUrl: './asignacion-turnos-pdv.component.css'
})
export class AsignacionTurnosPDVComponent implements OnInit {
  turnForm: UntypedFormGroup;
  usuarioSupervisor: UsuarioSupervisor = new UsuarioSupervisor();
  listTurnosSupervisor: TurnosSupervisor[] = [];
  turnosSupervisor: TurnosSupervisor = new TurnosSupervisor();
  turnosSupervisorDelRequest: TurnosSupervisorDelRequest = new TurnosSupervisorDelRequest();
  listSupervisorPDV: SupervisorPDV[] = [];
  turnosDisponiblesPDVRequest: TurnosDisponiblesPDVRequest = new TurnosDisponiblesPDVRequest();
  listTurnosDisponiblesPDV: TurnosSupervisor[] = [];
  turnosAsignadosPDVRequest: TurnosAsignadosPDVRequest = new TurnosAsignadosPDVRequest();
  listTurnosAsignadosPDV: TurnosAsignadosSupervisor[] = [];
  supervisorPDV: SupervisorPDV[] = [];
  listTurnosAsignadosPDVpostRequest: TurnosAsignadosPDVpostRequest[] = [];
  hours: string[] = ['07:00', '08:00', '09:00', '10:00',
    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  constructor(
    private fb: UntypedFormBuilder,
    private asignarTurnosService: AsignarTurnosService
  ) {
    this.turnForm = this.createFormTurn();
    this.usuarioSupervisor.usuario = localStorage.getItem('user')
    localStorage.setItem('idpdv', '');
    localStorage.setItem('puntoventa', '');


  }

  ngOnInit(): void {
    // Suscribe a los cambios en los campos hentry y hexit
    this.turnForm.get('hentry')?.valueChanges.subscribe(() => {
      this.actualizarDescripcion();
    });

    this.turnForm.get('hexit')?.valueChanges.subscribe(() => {
      this.actualizarDescripcion();
    });

    //Obtener lista de turnos
    this.getTurnosSupervisor();

    //** ASIGNAR TURNOS */
    //Obtener PDV por Supervisor
    this.getSupervisorPDV();
  }

  enableEditing(turno: any) {
    this.listTurnosSupervisor.forEach(t => {
      if (t !== turno) {
        t.editing = false; // Desactiva la edición de todos los demás turnos
      }
    });
    turno.editing = true; // Activa la edición del turno seleccionado

  }

  saveChanges(turno: any) {
    turno.editing = false;
    // Aquí puedes implementar la lógica para guardar los cambios en tu base de datos o donde sea necesario
    this.asignarTurnosService.putTurnosSupervisor(turno).subscribe(res => {
      console.log(res);
      if (res.mensaje === 'OK') {
        Swal.fire({
          title: 'Listo!',
          text: 'Esta acción también impactará los turnos asignados en el apartado: ASIGNACIÓN DE TURNOS POR PDV',
          icon: 'success',
          confirmButtonText: 'Ok',
          customClass: {
            confirmButton: 'swalBtnColor'
          }
          
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('ACTUALIZADO');
            this.getTurnosSupervisor();
            this.limpiarFormulario();
            
          }
        });
        this.closeModal()

      }
      if (res.mensaje === 'Ya existe un turno con el mismo horario para este usuario') {
        Swal.fire({
          title: 'Error!',
          text: 'Ya existe un turno con el mismo horario para este usuario',
          icon: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            confirmButton: 'swalBtnColor'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('ERROR');
            this.getTurnosSupervisor();
            this.limpiarFormulario();
          }
        });
      }
    })
  }


  cancelEditing(turno: any) {
    turno.editing = false;
    // Puedes restaurar los valores originales del turno si fuera necesario
  }
  deleteTurno(turno: any) {
    turno.editing = false;
    this.deleteRow(turno.idturnos, turno.usuario); // Llama al método deleteRow() con los parámetros correspondientes

    // Puedes restaurar los valores originales del turno si fuera necesario
  }

  
  createFormTurn(): UntypedFormGroup {
    return this.fb.group({
      description: new FormControl({ value: '00:00 - 00:00', disabled: true }, Validators.compose([
        Validators.required,
      ])),
      hentry: new FormControl("", Validators.compose([
        Validators.required,
      ])),
      hexit: new FormControl("", Validators.compose([
        Validators.required
      ])),
    });
  }

  limpiarFormulario() {
    // Restablecer el formulario a su estado inicial
    this.turnForm.reset({
      description: { value: '00:00 - 00:00', disabled: true },
      hentry: "",
      hexit: ""
    }, { emitEvent: false, onlySelf: true });

    this.turnosSupervisor = new TurnosSupervisor();
    this.turnosSupervisor.editing = false;
    console.log('limpiarFormulario', this.turnosSupervisor.editing);
  }

  formatTime() {
    this.listTurnosSupervisor.forEach(t => {
      t.editing = false;
    });

  
  }

  actualizarDescripcion() {

    let hentry = '00:00'
    let hexit = '00:00'

    hentry = this.turnForm.get('hentry')?.value;
    hexit = this.turnForm.get('hexit')?.value;



    // Concatenar hora de entrada con hora de salida
    const description = `${hentry} - ${hexit}`;
    // Actualizar el valor de description en el formulario
    this.turnForm.patchValue({
      description: description
    });
  }

  getTurnosSupervisor() {
    if (this.usuarioSupervisor.usuario !== null) {
      this.asignarTurnosService.getTurnosSupervisor(this.usuarioSupervisor).subscribe(res => {
        console.log(res);
        if (res !== null) {
          // Inicializar un array para almacenar los elementos filtrados
          const filteredTurnos: any = [];
          // Recorrer cada elemento de res
          res.forEach((turno: any) => {
            // Si el estado es 1, agregar el turno al array de elementos filtrados
            if (turno.estado === 1) {
              filteredTurnos.push(turno);
            }
          });
          // Invertir el orden del array de elementos filtrados
          this.listTurnosSupervisor = filteredTurnos.reverse();
        } else {
          console.log('No hay horarios creados');
        }

      })
    }
  }

  getTurnForm() {
    console.log(this.turnForm.getRawValue());

    let hentry = Number(this.turnForm.getRawValue().hentry.split(':')[0]);
    let hexit = Number(this.turnForm.getRawValue().hexit.split(':')[0]);

    if (hentry < 7 || hentry > 16) {
      console.log('El Horario de Entrada debe ser entre las 7 y las 15 hrs: ', hentry);
      Swal.fire({
        title: 'Error!',
        text: 'El Horario de Entrada debe ser entre las 7 y las 15 hrs',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if (hexit > 22) {
      console.log('El Horario de salida debe ser entre las 21 y las 22 hrs', hexit);
      Swal.fire({
        title: 'Error!',
        text: 'El Horario de salida debe ser entre las 21 y las 22 hrs',
        icon: 'error',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'swalBtnColor'
        }
      })
      return;
    }

    if (hentry == hexit) {
      console.log('El horario de entrada no puede ser igual al horario de salida', hexit);
      Swal.fire({
        title: 'Error!',
        text: 'El horario de entrada no puede ser igual al horario de salida',
        icon: 'error',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'swalBtnColor'
        }
      })
      return;
    }

    if (hentry > hexit){
      Swal.fire({
        title: 'Error!',
        text: 'El horario de entrada no puede ser mayor al horario de salida',
        icon: 'error',
        confirmButtonText: 'Ok',
        customClass: {
          confirmButton: 'swalBtnColor'
        }
      })
      return;
    }

    this.turnosSupervisor.usuario = this.usuarioSupervisor.usuario;
    this.turnosSupervisor.horarioentrada = this.turnForm.getRawValue().hentry;
    this.turnosSupervisor.horariosalida = this.turnForm.getRawValue().hexit;
    this.turnosSupervisor.descripcion = this.turnForm.getRawValue().description;

    if (this.turnosSupervisor.idturnos === 0) {

      this.turnosSupervisor.idtipoturno = 1;

      this.asignarTurnosService.postTurnosSupervisor(this.turnosSupervisor).subscribe(res => {
        console.log('POST', res);
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
              this.getTurnosSupervisor();
              this.limpiarFormulario();
              this.turnosSupervisor = new TurnosSupervisor();
            }
          });
        } else{
          Swal.fire({
            title: 'Error',
            text: 'Ya existe un turno con el mismo horario para este usuario',
            icon: 'error',
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swalBtnColor'
            }
          })
        }
      })
    }
    
  }

  confirmarEliminacion() {
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

  editRow(turno: TurnosSupervisor) {
    console.log(turno);

    this.turnosSupervisor = new TurnosSupervisor();

    this.limpiarFormulario();

    this.turnForm.patchValue({
      hentry: turno.horarioentrada,
      hexit: turno.horariosalida
    });

    this.turnosSupervisor.idturnos = turno.idturnos;

    (async () => {
      const { value: email } = await Swal.fire({
        title: "Input email address",
        input: "email",
        inputLabel: "Your email address",
        inputPlaceholder: "Enter your email address"
      });
      if (email) {
        Swal.fire(`Entered email: ${email}`);
      }
    })()
  }

  deleteRow(idturno: number, usuario: string) {
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
        // Aquí puedes llamar a la función para eliminar el registro
        this.turnosSupervisorDelRequest.idturnos = idturno;
        this.turnosSupervisorDelRequest.usuario = usuario;
        this.asignarTurnosService.deleteTurnosSupervisor(this.turnosSupervisorDelRequest).subscribe(res => {
          console.log('DELETE', res);
          if (res.mensaje === 'OK') {
            this.confirmarEliminacion();
            this.getTurnosSupervisor();
          }
        })
      } else if (result.dismiss) {
        console.log('CANCELADO');
        this.turnosSupervisorDelRequest = new TurnosSupervisorDelRequest();
      }
    });
  }

  closeModal(){
    this.getTurnosDisponiblesPDV();
    this.getTurnosAsignadosPDV();
  }

  ///*************ASIGNACION DE TURNOS*************/

  getSupervisorPDV() {
    if (this.usuarioSupervisor.usuario !== null) {
      this.listSupervisorPDV = [];
      this.asignarTurnosService.getSupervisorPDV(this.usuarioSupervisor).subscribe(res => {
        console.log(res);
        this.listSupervisorPDV = res;
      })
    }
  }

  ongetPDV(event: any) {
    const idpdv = (event.target as HTMLSelectElement)?.value;
    const puntoventa = this.listSupervisorPDV.find(item => item.idpuntoventarol === Number(idpdv))?.puntoventa;

    localStorage.setItem('idpdv', idpdv);
    localStorage.setItem('puntoventa', puntoventa!);

    this.getTurnosDisponiblesPDV();
    this.getTurnosAsignadosPDV();
  }

  getTurnosDisponiblesPDV() {
    const idpdv = localStorage.getItem('idpdv');
    if (idpdv !== null) {
      this.turnosDisponiblesPDVRequest.usuario = this.usuarioSupervisor.usuario!;
      this.turnosDisponiblesPDVRequest.idpdv = Number(idpdv);
      this.asignarTurnosService.getTurnosDisponiblePDV(this.turnosDisponiblesPDVRequest).subscribe(res => {
        console.log(res)
        this.listTurnosDisponiblesPDV = res;
      })
    }
  }

  getTurnosAsignadosPDV() {
    const idpdv = localStorage.getItem('idpdv');
    if (idpdv !== null) {

      this.turnosAsignadosPDVRequest.usuario = this.usuarioSupervisor.usuario!;
      this.turnosAsignadosPDVRequest.idpdv = Number(idpdv);
      this.asignarTurnosService.getTurnosAsignadosPDV(this.turnosAsignadosPDVRequest).subscribe(res => {
        console.log(res)
        this.listTurnosAsignadosPDV = res;
      })
    }
  }

  asignarTurnos(idTabla: string) {
    this.listTurnosAsignadosPDVpostRequest = []

    const table = document.getElementById(idTabla);
    if (!table) {
      console.error('No se encontró la tabla con el ID proporcionado.');
      return;
    }

    const rows = table.querySelectorAll('tr');
    const data: any[] = [];

    const idpdv = localStorage.getItem('idpdv')
    const puntoventa = localStorage.getItem('puntoventa')

    rows.forEach((row: any) => {
      const rowData: any = {};
      const cells = row.querySelectorAll('td');

      if (cells.length > 0 && cells[4].querySelector('input').checked === true) {
        rowData['usuario'] = this.usuarioSupervisor.usuario;
        rowData['idpdv'] = idpdv;
        rowData['puntoventa'] = puntoventa;
        rowData['idturnos'] = cells[0].innerText;
        //rowData['checkbox'] = cells[4].querySelector('input').checked; //PARA VER SI MANDA SOLO TRUE
        data.push(rowData);
      }
    });

    const jsonDataForma = JSON.stringify(data);
    this.listTurnosAsignadosPDVpostRequest = JSON.parse(jsonDataForma);
    console.log(this.listTurnosAsignadosPDVpostRequest);

    this.asignarTurnosService.postTurnosPDV(this.listTurnosAsignadosPDVpostRequest).subscribe(res => {
      console.log(res);
      this.getTurnosDisponiblesPDV();
      this.getTurnosAsignadosPDV();
    })
  }

  deleteRowAsignados(idpdvturno: number) {
    const pdvTurno = {
      idpdvturno: idpdvturno
    }
    this.asignarTurnosService.deleteTurnosPDV(pdvTurno).subscribe(res => {
      console.log(res);
      this.getTurnosDisponiblesPDV();
      this.getTurnosAsignadosPDV();
    })
  }
}
