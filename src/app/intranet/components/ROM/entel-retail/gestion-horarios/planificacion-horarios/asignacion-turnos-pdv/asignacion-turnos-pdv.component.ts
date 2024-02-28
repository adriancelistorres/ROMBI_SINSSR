import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
export class AsignacionTurnosPDVComponent {

  turnForm: UntypedFormGroup;

  HEmin!: string;
  HEmax!: string;

  constructor(
    private fb: UntypedFormBuilder
  ) {
    this.turnForm = this.createFormTurn();
  }

  createFormTurn(): UntypedFormGroup {
    return this.fb.group({
      description: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      hentry: new FormControl('08:00', Validators.compose([
        Validators.required,
      ])),
      // aperturaMin: ['08:00'],
      // aperturaMax: ['15:00'],
      hexit: new FormControl('22:00', Validators.compose([
        Validators.required
      ])),
      // salidaMin: ['21:00'],
      // salidaMax: ['22:00']
    });
  }

  formatTime(event: any, controlName: string) {
    const input = event.target;
    const value = input.value.split(':');
    if (value.length > 1) {
      input.value = `${value[0]}:00`;
    }

    // Validar el rango de horas
    //const selectedTime = new Date();
    // const [hours, minutes] = value.split(':');
    // console.log([hours, minutes]);

    //selectedTime.setHours(Number(hours), Number(minutes));

    //console.log(selectedTime);

    // if (controlName === 'hentry') {
    //   if (Number(hours) <= 7 || Number(hours) >= 15) {
    //     const formattedValue = '08:00';
    //     console.log(formattedValue);

    //     // Establecer el valor en el input
    //     input.value = formattedValue;

    //     // Actualizar el valor en el formulario
    //     this.turnForm.get(controlName)?.setValue(formattedValue);
    //   }
    // } else if (controlName === 'hexit') {
    //   if (Number(hours) <= 21 || Number(hours) >= 22) {
    //     const formattedValue = '22:00';
    //     console.log(formattedValue);

    //     // Establecer el valor en el input
    //     input.value = formattedValue;

    //     // Actualizar el valor en el formulario
    //     this.turnForm.get(controlName)?.setValue(formattedValue);
    //   }
    // }
    // if (controlName === 'hentry') {
    //   const minTime = new Date();
    //   minTime.setHours(8, 0); // 08:00
    //   const maxTime = new Date();
    //   maxTime.setHours(12, 0); // 12:00
    //   if (selectedTime < minTime || selectedTime > maxTime) {
    //     selectedTime.setHours(8, 0);
    //   }
    // } else if (controlName === 'hexit') {
    //   const minTime = new Date();
    //   minTime.setHours(12, 0); // 12:00
    //   const maxTime = new Date();
    //   maxTime.setHours(22, 0); // 22:00
    //   if (selectedTime < minTime || selectedTime > maxTime) {
    //     selectedTime.setHours(22, 0);
    //   }
    // }
    // Formatear el valor a una cadena con el formato correcto "HH:mm"
    //const formattedValue = selectedTime.toTimeString().substring(0, 5);

    //CONCATENAR
  }

  getTurnForm() {
    console.log(this.turnForm.getRawValue());

    let hentry = Number(this.turnForm.getRawValue().hentry.split(':')[0]);
    let hexit = Number(this.turnForm.getRawValue().hexit.split(':')[0]);

    if(hentry<7 || hentry>16){
      console.log('El Horario de Entrada debe ser entre las 7 y las 15 hrs: ', hentry);
      Swal.fire({
        title: 'Error!',
        text: 'El Horario de Entrada debe ser entre las 7 y las 15 hrs',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

    if(hexit<21 || hexit>22){
      console.log('El Horario de salida debe ser entre las 21 y las 22 hrs', hexit);
      Swal.fire({
        title: 'Error!',
        text: 'El Horario de salida debe ser entre las 21 y las 22 hrs',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
      return;
    }

  }

  deleteRow() {

  }

  editRow() {
    console.log("Edit Row");
  }
}
