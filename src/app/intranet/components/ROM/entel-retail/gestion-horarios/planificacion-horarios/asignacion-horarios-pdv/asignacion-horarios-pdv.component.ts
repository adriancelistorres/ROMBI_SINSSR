import { Component, OnInit } from '@angular/core';
import { SupervisorPDV } from '../../../../../../models/planificacion-horarios/supervisorPDV';
import { AsignarTurnosService } from '../../../../../../services/entel-retail/planificacion-horarios/asignar-turnos.service';
import { UsuarioSupervisor } from '../../../../../../models/planificacion-horarios/usuarioSupervisor';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsignarHorariosService } from '../../../../../../services/entel-retail/planificacion-horarios/asignar-horarios.service';
import { DiasSemana, RangoSemana } from '../../../../../../models/planificacion-horarios/rangoSemana';
import { PromotorPDVResponse } from '../../../../../../models/planificacion-horarios/promotorPDVResponse';
import { TurnosAsignadosPDVRequest } from '../../../../../../models/planificacion-horarios/turnosAsignadosPDVRequest';
import { TurnosAsignadosSupervisor } from '../../../../../../models/planificacion-horarios/turnosSupervisor';

// Define una interfaz para el formato de datos del encabezado
interface Encabezado {
  dnipromotor: string;
  nombrepromotor: string;
  apellidopaternopromotor: string;
  apellidomaternopromotor: string;
}

// Define una interfaz para el formato de datos de los horarios
interface Horario {
  idturnos: string;
  horarioentrada: string;
  horariosalida: string;
}

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
export class AsignacionHorariosPDVComponent implements OnInit {

  usuarioSupervisor: UsuarioSupervisor = new UsuarioSupervisor();
  listSupervisorPDV: SupervisorPDV[] = [];
  listRangoSemana: RangoSemana[] = [];
  diasSemana: RangoSemana = new RangoSemana();
  supervisorPDV: SupervisorPDV = new SupervisorPDV();
  turnosAsignadosPDVRequest: TurnosAsignadosPDVRequest = new TurnosAsignadosPDVRequest();

  headers: DiasSemana[] = [];  // Cabeceras superiores
  promotorList: PromotorPDVResponse [] = [];
  listTurnosAsignadosPDV: TurnosAsignadosSupervisor[] = [];
  listHorarios: any[] = []

  // rows: any[] = [{
  //   header: [] = []
  // }];

  // rows: any[] = [ // Datos de las filas
  //   {
  //     header: '',
  //     options: [
  //       { items: [] }
  //     ],
  //     selectedOptions: []
  //   },
  //];
    rows: any[] = [
    {
      header: 'Row 2', 
      options: [
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
    {
      header: 'Row 3', 
      options: [
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
    //Puedes agregar más filas si es necesario
  ];

  constructor(
    private asignarTurnosService: AsignarTurnosService,
    private asignarHorariosService: AsignarHorariosService
  ) {
    this.usuarioSupervisor.usuario = localStorage.getItem('user')
    localStorage.setItem('idpdv', '');
    localStorage.setItem('puntoventa', '');
  }

  ngOnInit(): void {
    this.getSupervisorPDV();
    this.getRangoSemana();
    const fechaHoy = new Date();
    //console.log(fechaHoy.getDate().toString(), (fechaHoy.getMonth()+1).toString(), fechaHoy.getFullYear().toString());
    const Hoy:string = fechaHoy.getFullYear().toString() + '-' + (fechaHoy.getMonth()+1).toString() + '-' + fechaHoy.getDate().toString();
    console.log(Hoy);
    this.diasSemana.lunes = Hoy;
    this.diasSemana.domingo = Hoy;
    this.getDiasSemana();
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

  ongetPDV(event: any) {
    const idpdv = (event.target as HTMLSelectElement)?.value;
    const puntoventa = this.listSupervisorPDV.find(item => item.idpuntoventarol === Number(idpdv))?.puntoventa;

    localStorage.setItem('idpdv', idpdv);
    localStorage.setItem('puntoventa', puntoventa!);
    this.getPromotorSupervisorPDV();
    this.getTurnosAsignadosPDV();
  }

  getRangoSemana() {
    this.asignarHorariosService.getRangoSemana().subscribe(res => {
      this.listRangoSemana = res;
    })
  }

  ongetRangoSemana(event: any) {
    const rangoSeleccionado = event.target.value; // Obtener el valor seleccionado
    console.log('Rango seleccionado:', rangoSeleccionado);
    const [fechaInicio,fechaFin] = rangoSeleccionado.split(',');
    console.log([fechaInicio,fechaFin]);
    this.diasSemana.lunes = fechaInicio;
    this.diasSemana.domingo = fechaFin;
    this.getDiasSemana();
  }

  getDiasSemana() {
    // this.diasSemana.lunes = '2024-03-04';
    // this.diasSemana.domingo = '2024-03-10';
    this.asignarHorariosService.getDiasSemana(this.diasSemana).subscribe(res => {
      console.log(res);
      this.headers = res;
    })
  }

  getPromotorSupervisorPDV(){
    this.supervisorPDV.usuario = this.usuarioSupervisor.usuario!;
    this.supervisorPDV.idpuntoventarol = Number(localStorage.getItem('idpdv')!);
    this.asignarHorariosService.getPromotorSupervisorPDV(this.supervisorPDV).subscribe(res=>{
      this.promotorList = res;
      console.log(this.promotorList);
    })
  }

  getTurnosAsignadosPDV() {
    const idpdv = localStorage.getItem('idpdv');
    if (idpdv !== null) {
      this.turnosAsignadosPDVRequest.usuario = this.usuarioSupervisor.usuario!;
      this.turnosAsignadosPDVRequest.idpdv = Number(idpdv);
      console.log(this.turnosAsignadosPDVRequest);
      
      this.asignarTurnosService.getTurnosAsignadosPDV(this.turnosAsignadosPDVRequest).subscribe(res => {
        console.log(res);
        this.listTurnosAsignadosPDV = res;
      })
    }
  }

  // getPromotorSupervisorPDV() {
  //   this.supervisorPDV.usuario = this.usuarioSupervisor.usuario!;
  //   this.supervisorPDV.idpuntoventarol = Number(localStorage.getItem('idpdv')!);
    
  //   this.asignarHorariosService.getPromotorSupervisorPDV(this.supervisorPDV).subscribe((encabezados: Encabezado[]) => {
  //     console.log(encabezados);
      
  //     encabezados.forEach((encabezado, index) => {
  //       this.asignarTurnosService.getTurnosSupervisor(this.usuarioSupervisor).subscribe((horarios: Horario[]) => {
  //         console.log(horarios);
          
  //         if (horarios.length > 0) { // Verificar si hay datos de horarios
  //           const row = {
  //             header: encabezado.nombrepromotor + ' ' + encabezado.apellidopaternopromotor,
  //             options: horarios.map(horario => ({
  //               items: [{ label: horario.horarioentrada + ' - ' + horario.horariosalida, value: horario.idturnos }]
  //             })),
  //             selectedOptions: horarios.map(horario => horario.idturnos) // Puedes ajustar esto según tus necesidades
  //           };
  //           this.rows.push(row);
  //           console.log(this.rows);
  //         }
  //       });
  //     });
  //   });
  // }
  
}
