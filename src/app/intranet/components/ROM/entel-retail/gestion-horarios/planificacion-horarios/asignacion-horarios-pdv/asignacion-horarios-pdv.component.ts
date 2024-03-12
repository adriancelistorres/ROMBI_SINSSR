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
import Swal from 'sweetalert2';

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
  pdvFiltro: number = 0;
  rangoFiltro: string = "";

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
    this.rangoFiltro = fechaHoy.getFullYear().toString() + '-' + (fechaHoy.getMonth() + 1).toString() + '-' + fechaHoy.getDate().toString();
    console.log(this.rangoFiltro);
    this.diasSemana.lunes = this.rangoFiltro;
    this.diasSemana.domingo = this.rangoFiltro;
    this.getDiasSemana();
    console.log('vacoppop',this.listRangoSemana);
  }

  filtrar() {
    //this.datosHorarioPlanificado = [];
    console.log('QUESESTO:', this.datosHorarioPlanificado);
    let timerInterval:any;
    Swal.fire({
      html: '<div style="text-align:center;"><img src="https://i.imgur.com/7c4Iqrl.gif" style="max-width: 100%; height: auto; width:350px" /> </br> <p>Cargando Datos...</p></div>',
      timer: 1200,
      timerProgressBar: true,
        backdrop: `
        rgba(0,0,123,0.4)
        left top
        no-repeat
      `,
      didOpen: () => {
        Swal.showLoading();
        const timer:any = Swal.getPopup()?.querySelector("b");
        timerInterval = setInterval(() => {
          if (timer) {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
   
    const puntoventa = this.listSupervisorPDV.find(item => item.idpuntoventarol === Number(this.pdvFiltro))?.puntoventa;
    localStorage.setItem('idpdv', String(this.pdvFiltro));
    localStorage.setItem('puntoventa', puntoventa!);

    console.log('Rango seleccionado:', this.rangoFiltro);
    const [fechaInicio, fechaFin] = this.rangoFiltro.split(',');
    console.log([fechaInicio, fechaFin]);
    this.diasSemana.lunes = fechaInicio;
    this.diasSemana.domingo = fechaFin;
    console.log(this.diasSemana);

    this.getDiasSemana();
    this.getPromotorSupervisorPDV();
    this.getTurnosSupervisorPDVHorarios();

    //this.listHorario = [];
    //this.datosHorarioPlanificado = [];

    this.getHorarioPlanificado()
    // this.pdvFiltro=0;
    // this.rangoFiltro="";

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

  getRangoSemana() {
    this.asignarHorariosService.getRangoSemana().subscribe(res => {
      this.listRangoSemana = res;
    })
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
      this.listHorario = [];
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
    let timerInterval:any;
    Swal.fire({
      title: "Cargando datos...",
      html: "I will close in <b></b> milliseconds.",
      timer: 900,
      timerProgressBar: true,
        backdrop: `
        rgba(0,0,123,0.4)
        url("https://i.gifer.com/PYh.gif")
        left top
        no-repeat
      `,
      didOpen: () => {
        Swal.showLoading();
        const timer:any = Swal.getPopup()?.querySelector("b");
        timerInterval = setInterval(() => {
          if (timer) {
            timer.textContent = `${Swal.getTimerLeft()}`;
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      this.getHorarioPlanificado();
      console.log('Arreglo final:', 'entro?');
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  }

  getHorarioPlanificado() {
    this.datosHorarioPlanificado = [];

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
            let rhorario = horario;
            if(rhorario === ',,'){
              rhorario = "";
            }
            this.listHorario[promotorIndex][fechaIndex].horario = rhorario;
          }
        });
        console.log('listHorario:',this.listHorario)
        console.log('datosHorarioPlanificado:',this.datosHorarioPlanificado)
      } else {
        this.limpiarListHorario();
        console.log('No hay datos disponibles.'); // Imprimir en la consola si no hay datos
      }
    }, error => {
      console.error('Error al obtener los datos:', error); // Manejar cualquier error de la llamada al servicio
    });

  }

  limpiarListHorario() {
    for (let i = 0; i < this.listHorario.length; i++) {
      for (let j = 0; j < this.listHorario[i].length; j++) {
        this.listHorario[i][j] = { horario: "" };
      }
    }
  }

}
