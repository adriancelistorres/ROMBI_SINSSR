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
  promotorList: PromotorPDVResponse[] = [];
  listTurnosSupervisorPDVHorarios: any[] = [];
  listHorario: any[][] = []
  columnas: number=0;
  filas: number=0;

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
  // rows: any[] = [
  //   {
  //     header: 'Row 2',
  //     options: [
  //       { items: [{ label: 'Option 3', value: 'option3' }, { label: 'Option 4', value: 'option4' }] },
  //       { items: [{ label: 'Option C', value: 'optionC' }, { label: 'Option D', value: 'optionD' }] },
  //       { items: [{ label: 'Option Z', value: 'optionZ' }, { label: 'Option W', value: 'optionW' }] },
  //       { items: [{ label: 'Option C', value: 'optionC' }, { label: 'Option D', value: 'optionD' }] },
  //       { items: [{ label: 'Option Z', value: 'optionZ' }, { label: 'Option W', value: 'optionW' }] },
  //       { items: [{ label: 'Option C', value: 'optionC' }, { label: 'Option D', value: 'optionD' }] },
  //       { items: [{ label: 'Option Z', value: 'optionZ' }, { label: 'Option W', value: 'optionW' }] }
  //     ],
  //     selectedOptions: ['option3', 'optionC', 'optionZ', 'optionZ', 'optionZ', 'optionZ', 'optionZ']
  //   },
  //   {
  //     header: 'Row 3',
  //     options: [
  //       { items: [{ label: 'Option 5', value: 'option5' }, { label: 'Option 6', value: 'option6' }] },
  //       { items: [{ label: 'Option E', value: 'optionE' }, { label: 'Option F', value: 'optionF' }] },
  //       { items: [{ label: 'Option M', value: 'optionM' }, { label: 'Option N', value: 'optionN' }] },
  //       { items: [{ label: 'Option E', value: 'optionE' }, { label: 'Option F', value: 'optionF' }] },
  //       { items: [{ label: 'Option M', value: 'optionM' }, { label: 'Option N', value: 'optionN' }] },
  //       { items: [{ label: 'Option E', value: 'optionE' }, { label: 'Option F', value: 'optionF' }] },
  //       { items: [{ label: 'Option M', value: 'optionM' }, { label: 'Option N', value: 'optionN' }] }
  //     ],
  //     selectedOptions: ['option5', 'optionE', 'optionM', 'optionM', 'optionM', 'optionM', 'optionM']
  //   },
  //   //Puedes agregar más filas si es necesario
  // ];

  constructor(
    private asignarTurnosService: AsignarTurnosService,
    private asignarHorariosService: AsignarHorariosService
  ) {
    this.usuarioSupervisor.usuario = localStorage.getItem('user')
    localStorage.setItem('idpdv', '');
    localStorage.setItem('puntoventa', '');
  }


  ngOnInit(): void {

    //para que la dimension horizontal listhorario sea 7, como 7 dias
    // for (let i = 0; i < 7; i++) {
    //   this.listHorario.push([]);
    // }

    this.getSupervisorPDV();
    this.getRangoSemana();

    //Obtener fecha Hoy para inicializar la lista de dias
    const fechaHoy = new Date();
    const Hoy: string = fechaHoy.getFullYear().toString() + '-' + (fechaHoy.getMonth() + 1).toString() + '-' + fechaHoy.getDate().toString();
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
    this.getTurnosSupervisorPDVHorarios();

    // Reinicializar listHorario manteniendo su estructura bidimensional
    this.listHorario = [];

  }

  getRangoSemana() {
    this.asignarHorariosService.getRangoSemana().subscribe(res => {
      this.listRangoSemana = res;
    })
  }

  ongetRangoSemana(event: any) {
    const rangoSeleccionado = event.target.value; // Obtener el valor seleccionado
    console.log('Rango seleccionado:', rangoSeleccionado);
    const [fechaInicio, fechaFin] = rangoSeleccionado.split(',');
    console.log([fechaInicio, fechaFin]);
    this.diasSemana.lunes = fechaInicio;
    this.diasSemana.domingo = fechaFin;
    this.getDiasSemana();
  }

  getDiasSemana() {
    this.asignarHorariosService.getDiasSemana(this.diasSemana).subscribe(res => {
      console.log(res);
      this.headers = res;
    })
  }

  getPromotorSupervisorPDV() {
    this.supervisorPDV.usuario = this.usuarioSupervisor.usuario!;
    this.supervisorPDV.idpuntoventarol = Number(localStorage.getItem('idpdv')!);
    this.asignarHorariosService.getPromotorSupervisorPDV(this.supervisorPDV).subscribe(res => {
      this.promotorList = res;
      console.log(this.promotorList);

      for (let i = 0; i < this.promotorList.length; i++) {
        const innerArray = [];
        for (let j = 0; j < this.headers.length; j++) {
          innerArray.push({
            horario: "", // Valor inicial del select
            fila: i, // Coordenada de fila
            columna: j // Coordenada de columna
          });
        }
        this.listHorario.push(innerArray);
      }
    })
  }

  getTurnosSupervisorPDVHorarios() {
    const idpdv = localStorage.getItem('idpdv');
    if (idpdv !== null) {
      this.turnosAsignadosPDVRequest.usuario = this.usuarioSupervisor.usuario!;
      this.turnosAsignadosPDVRequest.idpdv = Number(idpdv);
      console.log(this.turnosAsignadosPDVRequest);

      this.asignarHorariosService.getTurnosSupervisorPDVHorarios(this.turnosAsignadosPDVRequest).subscribe(res => {
        console.log(res);
        this.listTurnosSupervisorPDVHorarios = res;
      })
    }
  }

  guardarHorarios() {
    const arregloFinal: any[] = []; // Arreglo para almacenar todos los objetos
  
    // Iterar sobre los promotores
    this.promotorList.forEach((promotor, indexPromotor) => {
      // Iterar sobre los días de la semana
      const promotorPorDia: any[] = [];
      this.headers.forEach((dia, indexDia) => {
        // Obtener el horario del promotor para el día actual
        const horario = this.listHorario[indexPromotor][indexDia];
  
        // Crear un objeto para el horario actual
        const objetoHorario = {
          dnipromotor: promotor.dnipromotor,
          nombrepromotor: promotor.nombrepromotor,
          apellidopaternopromotor: promotor.apellidopaternopromotor,
          apellidomaternopromotor: promotor.apellidomaternopromotor,
          fecha: dia.fecha,
          horario: horario.horario.replace(/\s/g, '') || '00:00-00:00',
          descripcion: horario.horario.split(',')[0] || "",
          horarioentrada: horario.horario.split(',')[1] || "",
          horariosalida: horario.horario.split(',')[2] || ""
        };
  
        // Agregar el objeto al arreglo de promotorPorDia
        promotorPorDia.push(objetoHorario);
      });
  
      // Agregar el arreglo de promotorPorDia al arregloFinal
      arregloFinal.push(promotorPorDia);
    });
  
    // Mostrar en consola el arreglo final
    console.log('Arreglo final:', arregloFinal);
  }
}
