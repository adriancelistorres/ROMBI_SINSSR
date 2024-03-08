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
import { HorarioPlanificadoRequest } from '../../../../../../models/planificacion-horarios/horarioPlanificadoRequest';
import { HorarioPlanificadoPromotorRequest } from '../../../../../../models/planificacion-horarios/horarioPlanificadoPromotorRequest';

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

  listDiasSemana: DiasSemana[] = [];  // Cabeceras superiores
  promotorList: PromotorPDVResponse[] = [];
  listTurnosSupervisorPDVHorarios: any[] = [];
  listHorario: any[][] = []
  columnas: number = 0;
  filas: number = 0;
  datosHorarioPlanificado: any[] = [];

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
      this.listDiasSemana = res;
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
        for (let j = 0; j < this.listDiasSemana.length; j++) {
          innerArray.push({
            horario: "", // Valor inicial del select
            fila: i, // Coordenada de fila
            columna: j // Coordenada de columna
          });
        }
        this.listHorario.push(innerArray);
      }

      //Obtener Horario Planificado
      this.getHorarioPlanificado();

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
      this.listDiasSemana.forEach((dia, indexDia) => {
        // Obtener el horario del promotor para el día actual
        const horario = this.listHorario[indexPromotor][indexDia];

        // Crear un objeto para el horario actual
        const objetoHorario = {
          dnipromotor: promotor.dnipromotor || "",
          nombrepromotor: promotor.nombrepromotor || "",
          apellidopaternopromotor: promotor.apellidopaternopromotor || "",
          apellidomaternopromotor: promotor.apellidomaternopromotor || "",
          idpdv: Number(localStorage.getItem('idpdv')) || 0,
          puntoventa: localStorage.getItem('puntoventa') || "",
          fecha: dia.fecha || "",
          horario: horario.horario.replace(/\s/g, '') || '00:00-00:00',
          descripcion: horario.horario.split(',')[0] || "",
          horarioentrada: horario.horario.split(',')[1] || "",
          horariosalida: horario.horario.split(',')[2] || "",
          usuario_creacion: this.usuarioSupervisor.usuario || ""
        };

        // Agregar el objeto al arreglo de promotorPorDia
        promotorPorDia.push(objetoHorario);
      });

      // Agregar el arreglo de promotorPorDia al arregloFinal
      arregloFinal.push(promotorPorDia);
    });

    // Mostrar en consola el arreglo final
    console.log('Arreglo final:', arregloFinal);
    let arrayRequest: HorarioPlanificadoRequest[] = arregloFinal;

    console.log(arrayRequest);

    this.asignarHorariosService.postHorarioPlanificado(arrayRequest).subscribe(res => {

      console.log(res);

    })
  }

  getHorarioPlanificado() {
    let horarioPlanificadoPromotorRequestArray: HorarioPlanificadoPromotorRequest[] = [];
  
    this.promotorList.forEach((promotor, i) => {
      let horarioPlanificadoPromotorRequest: HorarioPlanificadoPromotorRequest = {
        inicio: this.listDiasSemana[0].fecha,
        fin: this.listDiasSemana[6].fecha,
        idpdv: Number(localStorage.getItem('idpdv')),
        dnipromotor: promotor.dnipromotor
      };
      horarioPlanificadoPromotorRequestArray.push(horarioPlanificadoPromotorRequest);
    });
  
    this.asignarHorariosService.getHorarioPlanificado(horarioPlanificadoPromotorRequestArray).subscribe(res => {
      this.datosHorarioPlanificado = res;
      // Verificar si hay datos
      if (this.datosHorarioPlanificado && this.datosHorarioPlanificado.length > 0) {
        // Iterar sobre los datos obtenidos y establecer los valores seleccionados en listHorario
        this.datosHorarioPlanificado.forEach((horarioPlanificado) => {
          const fechaIndex = this.listDiasSemana.findIndex((dia) => dia.fecha === horarioPlanificado.fecha);
          const promotorIndex = this.promotorList.findIndex((promotor) => promotor.dnipromotor === horarioPlanificado.dnipromotor);
          if (fechaIndex !== -1 && promotorIndex !== -1) {
            const horario = `${horarioPlanificado.descripcion},${horarioPlanificado.horarioentrada},${horarioPlanificado.horariosalida}`;
            this.listHorario[promotorIndex][fechaIndex].horario = horario;
          }
        });
      } else {
        console.log('No hay datos disponibles.'); // Imprimir en la consola si no hay datos
      }
    }, error => {
      console.error('Error al obtener los datos:', error); // Manejar cualquier error de la llamada al servicio
    });
    
  }
  
  

}
