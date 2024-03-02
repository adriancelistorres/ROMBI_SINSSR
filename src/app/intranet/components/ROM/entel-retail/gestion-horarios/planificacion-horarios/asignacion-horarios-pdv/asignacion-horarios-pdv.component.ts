import { Component, OnInit } from '@angular/core';
import { SupervisorPDV } from '../../../../../../models/planificacion-horarios/supervisorPDV';
import { AsignarTurnosService } from '../../../../../../services/entel-retail/planificacion-horarios/asignar-turnos.service';
import { UsuarioSupervisor } from '../../../../../../models/planificacion-horarios/usuarioSupervisor';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-asignacion-horarios-pdv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],

  templateUrl: './asignacion-horarios-pdv.component.html',
  styleUrl: './asignacion-horarios-pdv.component.css'
})
export class AsignacionHorariosPDVComponent implements OnInit{

  usuarioSupervisor: UsuarioSupervisor = new UsuarioSupervisor();
  listSupervisorPDV: SupervisorPDV[] = [];
  
  headers: string[] = ['Header 1', 'Header 2', 'Header 3', 'Header 2', 'Header 3', 'Header 2', 'Header 3']; // Cabeceras superiores
  rows: any[] = [ // Datos de las filas
    { header: 'Row 1', options: [
        { items: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] },
        { items: [{ label: 'Option A', value: 'optionA' }, { label: 'Option B', value: 'optionB' }] },
        { items: [{ label: 'Option X', value: 'optionX' }, { label: 'Option Y', value: 'optionY' }] },
        { items: [{ label: 'Option X', value: 'optionX' }, { label: 'Option Y', value: 'optionY' }] },
        { items: [{ label: 'Option X', value: 'optionX' }, { label: 'Option Y', value: 'optionY' }] },
        { items: [{ label: 'Option X', value: 'optionX' }, { label: 'Option Y', value: 'optionY' }] },
        { items: [{ label: 'Option X', value: 'optionX' }, { label: 'Option Y', value: 'optionY' }] }
      ],
      selectedOptions: ['option1', 'optionA', 'optionX', 'optionX', 'optionX', 'optionX', 'optionX']
    },
    { header: 'Row 2', options: [
        { items: [{ label: 'Option 3', value: 'option3' }, { label: 'Option 4', value: 'option4' }] },
        { items: [{ label: 'Option C', value: 'optionC' }, { label: 'Option D', value: 'optionD' }] },
        { items: [{ label: 'Option Z', value: 'optionZ' }, { label: 'Option W', value: 'optionW' }] },
        { items: [{ label: 'Option C', value: 'optionC' }, { label: 'Option D', value: 'optionD' }] },
        { items: [{ label: 'Option Z', value: 'optionZ' }, { label: 'Option W', value: 'optionW' }] },
        { items: [{ label: 'Option C', value: 'optionC' }, { label: 'Option D', value: 'optionD' }] },
        { items: [{ label: 'Option Z', value: 'optionZ' }, { label: 'Option W', value: 'optionW' }] }
      ],
      selectedOptions: ['option3', 'optionC', 'optionZ', 'optionZ', 'optionZ', 'optionZ', 'optionZ']
    },
    { header: 'Row 3', options: [
        { items: [{ label: 'Option 5', value: 'option5' }, { label: 'Option 6', value: 'option6' }] },
        { items: [{ label: 'Option E', value: 'optionE' }, { label: 'Option F', value: 'optionF' }] },
        { items: [{ label: 'Option M', value: 'optionM' }, { label: 'Option N', value: 'optionN' }] },
        { items: [{ label: 'Option E', value: 'optionE' }, { label: 'Option F', value: 'optionF' }] },
        { items: [{ label: 'Option M', value: 'optionM' }, { label: 'Option N', value: 'optionN' }] },
        { items: [{ label: 'Option E', value: 'optionE' }, { label: 'Option F', value: 'optionF' }] },
        { items: [{ label: 'Option M', value: 'optionM' }, { label: 'Option N', value: 'optionN' }] }
      ],
      selectedOptions: ['option5', 'optionE', 'optionM', 'optionM', 'optionM', 'optionM', 'optionM']
    },
    // Puedes agregar más filas si es necesario
  ];
  selectedStartDate!: Date;
  selectedEndDate!: Date;
  constructor(
    private asignarTurnosService: AsignarTurnosService,private _adapter: DateAdapter<any>
  ){
    this.usuarioSupervisor.usuario = localStorage.getItem('user')
    localStorage.removeItem('idpdv');
    localStorage.removeItem('puntoventa');
    this._adapter.setLocale('en'); // Cambia 'en' por tu idioma preferido
  }
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const selectedDate = event.value;
      this.selectedStartDate = this.getFirstDayOfWeek(selectedDate);
      this.selectedEndDate = this.getLastDayOfWeek(this.selectedStartDate); // Configurar automáticamente el domingo de la semana
    }
  }
  
  
  getFirstDayOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay(); // 0: Domingo, 1: Lunes, ..., 6: Sábado
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 1 ? 0 : (dayOfWeek === 0 ? -6 : 1)); // Asegura que el inicio de la semana sea el lunes
    return new Date(date.setDate(diff));
  }
  
  getLastDayOfWeek(date: Date): Date {
    const lastDayOfWeek = new Date(date);
    const dayOfWeek = date.getDay();
    const diff = 7 - dayOfWeek + 1; // Asegura que el fin de la semana sea el domingo
    lastDayOfWeek.setDate(date.getDate() + diff);
    return lastDayOfWeek;
  }
  
  
  
  ngOnInit(): void {
    this.getSupervisorPDV();
  }

  getSupervisorPDV() {
    if (this.usuarioSupervisor.usuario !== null) {
      this.listSupervisorPDV = [];
      this.asignarTurnosService.getSupervisorPDV(this.usuarioSupervisor).subscribe(res => {
        console.log(res);
        this.listSupervisorPDV = res;
      })
    }
  }

  ongetPDV(event:any){
    const idpdv = (event.target as HTMLSelectElement)?.value;
    const puntoventa = this.listSupervisorPDV.find(item => item.idpuntoventarol === Number(idpdv))?.puntoventa;

    localStorage.setItem('idpdv', idpdv);
    localStorage.setItem('puntoventa', puntoventa!);
  }
}
