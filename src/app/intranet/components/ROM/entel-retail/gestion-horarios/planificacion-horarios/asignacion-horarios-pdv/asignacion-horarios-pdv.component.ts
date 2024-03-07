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
    for (let i = 0; i < 7; i++) {
      this.listHorario.push([]);
    }

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

    // Limpiar las listas
    // this.promotorList = [];
    // this.listTurnosAsignadosPDV = [];

    this.getPromotorSupervisorPDV();
    this.getTurnosSupervisorPDVHorarios();

    // Reinicializar listHorario manteniendo su estructura bidimensional
    this.listHorario = [];

    for (let i = 0; i < this.headers.length; i++) {
      const innerArray = [];
      for (let j = 0; j < this.promotorList.length; j++) {
        innerArray.push(""); // Puedes inicializar con null o cualquier otro valor inicial
      }
      this.listHorario.push(innerArray);
    }

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

  guardarHorarios(idTabla: string) {
    const tabla = document.getElementById(idTabla);
    if (tabla) {
      const filas = tabla.getElementsByTagName('tr');
      for (let i = 1; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        const horariosPromotor = [];
        for (let j = 0; j < celdas.length; j++) {
          const select = celdas[j].getElementsByTagName('select')[0];
          const horarioSeleccionado = select.value;
          horariosPromotor.push(horarioSeleccionado);
        }
        console.log('Horarios del promotor ', i, ': ', horariosPromotor);
      }
      this.contarFilasColumnas(idTabla);
    }
  }

  // Suponiendo que esta función se llama cuando se hace clic en el botón de guardar
  guardar() {
  const arregloFinal: any[] = []; // Arreglo para almacenar todos los objetos

  // Iterar sobre los promotores
  this.promotorList.forEach((promotor, indexPromotor) => {
    // Iterar sobre los días y horarios
    this.listHorario.forEach((horarioPorDia, indexDia) => {
      const horarioPromotor = horarioPorDia[indexPromotor];

      // Crear un objeto para cada horario de cada día
      const objetoHorario = {
        dni: promotor.dnipromotor,
        nombre: promotor.nombrepromotor,
        fecha: this.headers[indexDia].fecha,
        horario: horarioPromotor
      };

      // Agregar el objeto al arreglo final
      arregloFinal.push(objetoHorario);
    });
  });

  // Mostrar en consola el arreglo final
  console.log('Arreglo final:', arregloFinal);
}

  
  

  contarFilasColumnas(idTabla: string) {
    const tabla = document.getElementById(idTabla);
    if (tabla) {
      const filas = tabla.getElementsByTagName('tr');
      const numRows = filas.length;

     

      let maxCols = 0;
      for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].getElementsByTagName('td');
        maxCols = Math.max(maxCols, celdas.length);
      }

      console.log('Número de filas:', numRows);
      console.log('Número máximo de columnas:', maxCols);
    }
  }
}
