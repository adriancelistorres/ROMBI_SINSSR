import { Component, OnInit } from '@angular/core';
import { SupervisorPDV } from '../../../../../../models/planificacion-horarios/supervisorPDV';
import { AsignarTurnosService } from '../../../../../../services/entel-retail/planificacion-horarios/asignar-turnos.service';
import { UsuarioSupervisor } from '../../../../../../models/planificacion-horarios/usuarioSupervisor';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-asignacion-horarios-pdv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
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

  constructor(
    private asignarTurnosService: AsignarTurnosService,
  ){
    this.usuarioSupervisor.usuario = localStorage.getItem('user')
    localStorage.removeItem('idpdv');
    localStorage.removeItem('puntoventa');
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
