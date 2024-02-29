import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AsignarTurnosService } from '../../../../../../services/entel-retail/planificacion-horarios/asignar-turnos.service';
import { UsuarioSupervisor } from '../../../../../../models/planificacion-horarios/usuarioSupervisor';
import { TurnosSupervisor } from '../../../../../../models/planificacion-horarios/turnosSupervisor';
import { TurnosSupervisorDelRequest } from '../../../../../../models/planificacion-horarios/turnosSupervisorDelRequest';

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

  constructor(
    private fb: UntypedFormBuilder,
    private asignarTurnos: AsignarTurnosService
  ) {
    this.turnForm = this.createFormTurn();
    this.usuarioSupervisor.usuario = localStorage.getItem('user')
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
  }

  createFormTurn(): UntypedFormGroup {
    return this.fb.group({
      description: new FormControl({ value: '', disabled: true }, Validators.compose([
        Validators.required,
      ])),
      hentry: new FormControl('00:00', Validators.compose([
        Validators.required,
      ])),
      hexit: new FormControl('00:00', Validators.compose([
        Validators.required
      ])),
    });
  }

  limpiarFormulario() {
    // Restablecer el formulario a su estado inicial
    this.turnForm.reset({
      description: { value: '', disabled: true },
      hentry: '00:00',
      hexit: '00:00'
    }, { emitEvent: false, onlySelf: true });

    this.turnosSupervisor = new TurnosSupervisor();
  }

  formatTime(event: any) {
    const input = event.target;
    const value = input.value.split(':');
    if (value.length > 1) {
      input.value = `${value[0]}:00`;
    }
  }

  actualizarDescripcion() {
    const hentry = this.turnForm.get('hentry')?.value;
    const hexit = this.turnForm.get('hexit')?.value;

    // Separar las horas y minutos de la hora de entrada
    let [hentryHour, hentryMinute] = hentry.split(':');
    // Separar las horas y minutos de la hora de salida
    let [hexitHour, hexitMinute] = hexit.split(':');

    //Si los minutos son diferentes de cero, formatear a '00'
    if (Number(hentryMinute) !== 0 || Number(hexitMinute) !== 0) {
      hentryMinute = '00';
      hexitMinute = '00';
    }
    // Concatenar las horas con minutos en cero
    const description = `${hentryHour}:${hentryMinute || '00'} - ${hexitHour}:${hexitMinute || '00'}`;

    // Actualizar el valor de description en el formulario
    this.turnForm.patchValue({
      description: description
    });
  }

  getTurnosSupervisor() {
    if (this.usuarioSupervisor.usuario !== null) {
      this.asignarTurnos.getTurnosSupervisor(this.usuarioSupervisor).subscribe(res => {
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

    this.turnosSupervisor.usuario = this.usuarioSupervisor.usuario;
    this.turnosSupervisor.horarioentrada = this.turnForm.getRawValue().hentry;
    this.turnosSupervisor.horariosalida = this.turnForm.getRawValue().hexit;
    this.turnosSupervisor.descripcion = this.turnForm.getRawValue().description;

    if (this.turnosSupervisor.idturnos === 0) {

      this.turnosSupervisor.idtipoturno = 1;

      this.asignarTurnos.postTurnosSupervisor(this.turnosSupervisor).subscribe(res => {
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
        }
      })
    } else if (this.turnosSupervisor.idturnos > 0) {
      this.asignarTurnos.putTurnosSupervisor(this.turnosSupervisor).subscribe(res => {
        console.log(res);
        if (res.mensaje === 'OK') {
          Swal.fire({
            title: 'Listo!',
            text: 'Registro actualizado 👍',
            icon: 'success',
            confirmButtonText: 'Ok',
            customClass: {
              confirmButton: 'swalBtnColor'
            }
          }).then((result) => {
            if (result.isConfirmed) {
              this.getTurnosSupervisor();
              this.limpiarFormulario();
            }
          });
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
  }

  deleteRow(idturno: number, usuario: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
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
        this.asignarTurnos.deleteTurnosSupervisor(this.turnosSupervisorDelRequest).subscribe(res => {
          console.log('DELETE',res);
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
}
