import { Component, OnInit } from '@angular/core';
import { SupervisorPDV } from '../../../../../../models/planificacion-horarios/supervisorPDV';
import { AsignarTurnosService } from '../../../../../../services/entel-retail/planificacion-horarios/asignar-turnos.service';
import { UsuarioSupervisor } from '../../../../../../models/planificacion-horarios/usuarioSupervisor';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsignarHorariosService } from '../../../../../../services/entel-retail/planificacion-horarios/asignar-horarios.service';
import {
  DiasSemana,
  RangoSemana,
} from '../../../../../../models/planificacion-horarios/rangoSemana';
import { PromotorPDVResponse } from '../../../../../../models/planificacion-horarios/promotorPDVResponse';
import { TurnosAsignadosPDVRequest } from '../../../../../../models/planificacion-horarios/turnosAsignadosPDVRequest';
import { HorarioPlanificadoRequest } from '../../../../../../models/planificacion-horarios/horarioPlanificadoRequest';
import { HorarioPlanificadoPromotorRequest } from '../../../../../../models/planificacion-horarios/horarioPlanificadoPromotorRequest';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { lastValueFrom } from 'rxjs';
import { Supervisor } from '../../../../../../models/planificacion-horarios/supervisor';
import { Jefe } from '../../../../../../models/planificacion-horarios/jefe';

@Component({
  selector: 'app-asignacion-horarios-pdv',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './asignacion-horarios-pdv.component.html',
  styleUrl: './asignacion-horarios-pdv.component.css',
})
export class AsignacionHorariosPDVComponent implements OnInit {
  usuarioSupervisor: UsuarioSupervisor = new UsuarioSupervisor();
  listSupervisorPDV: SupervisorPDV[] = [];
  listRangoSemana: RangoSemana[] = [];
  diasSemana: RangoSemana = new RangoSemana();
  supervisorPDV: SupervisorPDV = new SupervisorPDV();
  turnosAsignadosPDVRequest: TurnosAsignadosPDVRequest =
    new TurnosAsignadosPDVRequest();

  listDiasSemana: DiasSemana[] = []; // Cabeceras superiores
  promotorList: PromotorPDVResponse[] = [];
  listTurnosSupervisorPDVHorarios: any[] = [];
  listHorario: any[][] = [];
  columnas: number = 0;
  filas: number = 0;
  datosHorarioPlanificado: any[] = [];
  pdvFiltro: number = 0;
  rangoFiltro: string = '';
  horarioPlanificadoPromotorRequestArray: HorarioPlanificadoPromotorRequest[] =
    [];
  horarioPlanificadoPromotorRequest: HorarioPlanificadoPromotorRequest =
    new HorarioPlanificadoPromotorRequest();

  mostrarElemento: boolean = false;

  coincidencias: boolean[][] = [];

  listSupervisor: Supervisor[] = [];
  listJefe: Jefe[] = [];
  perfil: string = "";
  verTurnos: boolean = false;

  constructor(
    private asignarTurnosService: AsignarTurnosService,
    private asignarHorariosService: AsignarHorariosService
  ) {
    this.usuarioSupervisor.usuario = localStorage.getItem('user');
    localStorage.setItem('idpdv', '');
    localStorage.setItem('puntoventa', '');
    this.perfil = (localStorage.getItem('perfil') || '');
  }

  toggleVisibilidad() {
    this.mostrarElemento = true;
  }

  exportexcel() {
    const usuarioSuper: UsuarioSupervisor = new UsuarioSupervisor();
    if (this.perfil === 'ADMIN' || this.perfil === 'JV') {
      const dnisupervisor = localStorage.getItem('dnisupervisor');
      usuarioSuper.usuario = dnisupervisor || '';
    } else {
      usuarioSuper.usuario = this.usuarioSupervisor.usuario!;
    }

    let promiseSemanaActual = lastValueFrom(
      this.asignarHorariosService.ReportGetSemanaActual(usuarioSuper)
    );
    let promiseSemanaAnterior = lastValueFrom(
      this.asignarHorariosService.ReportGetSemanaAnterior(usuarioSuper)
    );

    Promise.all([promiseSemanaActual, promiseSemanaAnterior])
      .then((values: any[]) => {
        console.log('listReportGetSemanaActual', values[0]);
        console.log('listReportGetSemanaAnterior', values[1]);

        const data1 = values[0];
        const data2 = values[1];

        const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data1);
        const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data2);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        /** Añadir las hojas de cálculo al libro de trabajo **/
        XLSX.utils.book_append_sheet(wb, ws1, 'Semana Actual');
        XLSX.utils.book_append_sheet(wb, ws2, 'Semana Anterior');

        let fileName = `HorarioPlanificado_${usuarioSuper.usuario}.xlsx`;

        /** Guardar en un archivo **/
        XLSX.writeFile(wb, fileName);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  ReportGetSemanaActual() { }

  ReportGetSemanaAnterior() { }

  ngOnInit(): void {
    //this.getSupervisorPDV();
    this.getRangoSemana();

    //Obtener fecha Hoy para inicializar la lista de dias
    const fechaHoy = new Date();
    this.rangoFiltro =
      fechaHoy.getFullYear().toString() +
      '-' +
      (fechaHoy.getMonth() + 1).toString() +
      '-' +
      fechaHoy.getDate().toString();
    console.log(this.rangoFiltro);
    this.diasSemana.lunes = this.rangoFiltro;
    this.diasSemana.domingo = this.rangoFiltro;
    this.getDiasSemana();
    console.log('vacoppop', this.listRangoSemana);

    //PERMISOS

    switch (this.perfil) {
      case 'ADMIN':
        this.getJefes();
        this.verTurnos = true;
        break;
      case 'JV':
        this.getSupervisores();
        this.verTurnos = true;
        break;
      case 'SG':
        this.getSupervisorPDV();
        break;
      default:
        break;
    }
  }

  filtrar() {
    this.toggleVisibilidad();
    console.log('pdvFiltro', this.pdvFiltro);
    console.log('rangoFiltro', this.rangoFiltro);

    if (this.pdvFiltro === 0) {
      console.log('Seleccione PDV');
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'warning',
        title: '<b>Seleccione PDV</b>',
        showCloseButton: true,
        text: 'Debe seleccionar Punto de Venta!',
        //background: "#F7F7F9",
        //color: "#fff",
      });
      return; // Detener la ejecución de la función
    }

    if (this.rangoFiltro.indexOf(',') === -1) {
      console.log('Seleccione Rango');
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: 'warning',
        title: '<b>Seleccione Rango</b>',
        showCloseButton: true,
        text: 'Debe seleccionar Rango Semanal!',
        //background: "#F7F7F9",
        //color: "#fff",
      });
      return; // Detener la ejecución de la función
    }

    this.datosHorarioPlanificado = [];
    console.log('datosHorarioPlanificado1:', this.datosHorarioPlanificado);

    const puntoventa = this.listSupervisorPDV.find(
      (item) => item.idpuntoventarol === Number(this.pdvFiltro)
    )?.puntoventa;
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
  }

  getSupervisorPDV() {
    //if (this.usuarioSupervisor.usuario !== null) {}
    const usuarioSuper: UsuarioSupervisor = new UsuarioSupervisor();
    if (this.perfil === 'ADMIN' || this.perfil === 'JV') {
      const dnisupervisor = localStorage.getItem('dnisupervisor');
      usuarioSuper.usuario = dnisupervisor || '';
    } else {
      usuarioSuper.usuario = this.usuarioSupervisor.usuario!;
    }

    this.listSupervisorPDV = [];
    this.asignarTurnosService
      .getSupervisorPDV(usuarioSuper)
      .subscribe((res) => {
        console.log(res);
        this.listSupervisorPDV = res;
      });

  }

  getRangoSemana() {
    this.asignarHorariosService.getRangoSemana().subscribe((res) => {
      this.listRangoSemana = res;
    });
  }

  getDiasSemana() {
    this.asignarHorariosService
      .getDiasSemana(this.diasSemana)
      .subscribe((res) => {
        console.log(res);
        this.listDiasSemana = res;
      });
  }

  getPromotorSupervisorPDV() {
    if (this.perfil === 'ADMIN' || this.perfil === 'JV') {
      const dnisupervisor = localStorage.getItem('dnisupervisor');
      this.supervisorPDV.dnisupervisor = dnisupervisor || '';
    } else {
      this.supervisorPDV.dnisupervisor = this.usuarioSupervisor.usuario!;
    }
    this.supervisorPDV.idpuntoventarol = Number(localStorage.getItem('idpdv')!);

    const fechasSeparadas = this.rangoFiltro.split(',');
    const fechaInicio = fechasSeparadas[0];
    const fechaFin = fechasSeparadas[1];

    this.supervisorPDV.fechainicio = fechaInicio;
    this.supervisorPDV.fechafin = fechaFin;

    console.log('this.supervisorPDV', this.supervisorPDV);

    this.asignarHorariosService
      .getPromotorSupervisorPDV(this.supervisorPDV)
      .subscribe((res) => {
        this.promotorList = res;
        console.log(this.promotorList);
        this.datosHorarioPlanificado = [];
        this.listHorario = [];

        for (let i = 0; i < this.promotorList.length; i++) {
          const innerArray = [];
          for (let j = 0; j < this.listDiasSemana.length; j++) {
            innerArray.push({
              horario: '', // Valor inicial del select
              fila: i, // Coordenada de fila
              columna: j, // Coordenada de columna
              activarcbo: 0, // si el campo debe estar deshabilitado
              estado: 0,
              variable: false
            });
          }
          this.listHorario.push(innerArray);
        }

        this.coincidencias = [];
        for (let i = 0; i < this.promotorList.length; i++) {
          this.coincidencias[i] = [];
          for (let j = 0; j < this.listDiasSemana.length; j++) {
            this.coincidencias[i][j] = false; // Inicialmente, todas las opciones están ocultas
          }
        }

        //Obtener Horario Planificado
        this.getHorarioPlanificado();
      });
  }

  getTurnosSupervisorPDVHorarios() {
    const idpdv = localStorage.getItem('idpdv');
    if (idpdv !== null) {
      if (this.perfil === 'ADMIN' || this.perfil === 'JV') {
        const dnisupervisor = localStorage.getItem('dnisupervisor');
        this.turnosAsignadosPDVRequest.usuario = dnisupervisor || '';
      } else {
        this.turnosAsignadosPDVRequest.usuario = this.usuarioSupervisor.usuario!;
      }
      this.turnosAsignadosPDVRequest.idpdv = Number(idpdv);
      console.log(this.turnosAsignadosPDVRequest);

      this.asignarHorariosService
        .getTurnosSupervisorPDVHorarios(this.turnosAsignadosPDVRequest)
        .subscribe((res) => {
          console.log(res);
          this.listTurnosSupervisorPDVHorarios = res;
        });
    }
  }

  guardarHorarios() {
    const usuarioSuper: UsuarioSupervisor = new UsuarioSupervisor();
    if (this.perfil === 'ADMIN' || this.perfil === 'JV') {
      const dnisupervisor = localStorage.getItem('dnisupervisor');
      usuarioSuper.usuario = dnisupervisor || '';
    } else {
      usuarioSuper.usuario = this.usuarioSupervisor.usuario!;
    }

    Swal.fire({
      title: 'Esta seguro que desea guardar?',
      text: "Se guardará los cambios realizados en el horario planificado y no podrá deshacerlos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const arregloFinal: any[] = []; // Arreglo para almacenar todos los objetos

        // Iterar sobre los promotores
        this.promotorList.forEach((promotor, indexPromotor) => {
          // Iterar sobre los días de la semana
          const promotorPorDia: any[] = [];
          this.listDiasSemana.forEach((dia, indexDia) => {
            // Obtener el horario del promotor para el día actual
            const horario = this.listHorario[indexPromotor][indexDia];
            console.log(
              'como bota?',
              this.listHorario[indexPromotor][indexDia]
            );

            // Crear un objeto para el horario actual
            const objetoHorario = {
              dnipromotor: promotor.dnipromotor || '',
              dnisupervisor: usuarioSuper.usuario,
              nombrepromotor: promotor.nombrepromotor || '',
              apellidopaternopromotor: promotor.apellidopaternopromotor || '',
              apellidomaternopromotor: promotor.apellidomaternopromotor || '',
              idpdv: Number(localStorage.getItem('idpdv')) || 0,
              puntoventa: localStorage.getItem('puntoventa') || '',
              fecha: dia.fecha || '',
              horario: horario.horario.replace(/\s/g, '') || '00:00-00:00',
              descripcion: horario.horario.split(',')[0] || '',
              horarioentrada: horario.horario.split(',')[1] || '',
              horariosalida: horario.horario.split(',')[2] || '',
              usuario_creacion: this.usuarioSupervisor.usuario || '',
              activarcbo: 1,
              estado: 1
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
        Swal.fire({
          html: '<div style="text-align:center;"><img src="https://i.imgur.com/7c4Iqrl.gif" style="max-width: 100%; height: auto; width:350px" /> </br> <p>Guardando Datos...</p></div>',
          timerProgressBar: true,
          backdrop: `
        rgba(0,0,123,0.4)
        left top
        no-repeat
      `,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            // Clear the timer if the Swal is closed
            clearInterval(timerInterval);
          },
          allowOutsideClick: false,
        });

        let timerInterval: any;

        this.asignarHorariosService
          .postHorarioPlanificado(arrayRequest)
          .subscribe((res) => {
            console.log(res);
            if (res.mensaje === 'OK') {
              // Close the Swal when the response is received
              Swal.close();

              // Handle your logic after receiving the response
              this.getHorarioPlanificado();
              // let data:any=this.getHorarioPlanificado();
              // console.log('dataaa para cerrar swal',data)
              console.log('Arreglo final:', 'entro?');
            } else {
              Swal.close();
              console.log('Error: Los datos no se han guardado');
              const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
              });
              Toast.fire({
                icon: 'error',
                title: 'Los datos no se han guardado',
              });
            }
          });
      }
    });
  }

  getHorarioPlanificado() {
    this.horarioPlanificadoPromotorRequestArray = [];

    console.log('rangoFiltro:', this.rangoFiltro);

    const fechasSeparadas = this.rangoFiltro.split(',');

    const fechaInicio = fechasSeparadas[0];
    const fechaFin = fechasSeparadas[1];

    console.log('fechaInicio:', fechaInicio);
    console.log('fechaFin:', fechaFin);
    this.promotorList.forEach((promotor, i) => {
      this.horarioPlanificadoPromotorRequest = {
        inicio: fechaInicio,
        fin: fechaFin,
        idpdv: Number(localStorage.getItem('idpdv')),
        dnipromotor: promotor.dnipromotor,
      };
      console.log('listDiasSemana:', this.listDiasSemana);
      console.log(
        'horarioPlanificadoPromotorRequest1:',
        this.horarioPlanificadoPromotorRequest
      );
      this.horarioPlanificadoPromotorRequestArray?.push(
        this.horarioPlanificadoPromotorRequest
      );
      this.horarioPlanificadoPromotorRequest = {};
      console.log(
        'horarioPlanificadoPromotorRequest2:',
        this.horarioPlanificadoPromotorRequest
      );
    });

    let timerInterval: any;

    Swal.fire({
      html: '<div style="text-align:center;"><img src="https://i.imgur.com/7c4Iqrl.gif" style="max-width: 100%; height: auto; width:350px" /> </br> <p>Cargando Datos...</p></div>',
      timerProgressBar: true,
      backdrop: `
    rgba(0,0,123,0.4)
    left top
    no-repeat
  `,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
      allowOutsideClick: false, // Evita que se cierre haciendo clic fuera de la alerta
    });

    setTimeout(() => {
      this.asignarHorariosService
        .getHorarioPlanificado(this.horarioPlanificadoPromotorRequestArray)
        .subscribe(
          (res) => {
            if (res !== null) {
              // Verifica si la respuesta no es nula
              // this.datosHorarioPlanificado = [];

              this.datosHorarioPlanificado = res;

              if (
                this.datosHorarioPlanificado &&
                this.datosHorarioPlanificado.length > 0
              ) {
                this.datosHorarioPlanificado.forEach((horarioPlanificado) => {
                  const fechaIndex = this.listDiasSemana.findIndex(
                    (dia) => dia.fecha === horarioPlanificado.fecha
                  );
                  const promotorIndex = this.promotorList.findIndex(
                    (promotor) =>
                      promotor.dnipromotor === horarioPlanificado.dnipromotor
                  );
                  // console.log('fechaIndex:', fechaIndex);
                  // console.log('promotorIndex:', promotorIndex);
                  if (fechaIndex !== -1 && promotorIndex !== -1) {
                    const horario = `${horarioPlanificado.descripcion || ''},${horarioPlanificado.horarioentrada || ''
                      },${horarioPlanificado.horariosalida || ''}`;
                    const rhorario = horario === ',,' ? '' : horario;
                    this.listHorario[promotorIndex][fechaIndex].horario =
                      rhorario;

                    const activarcbo = horarioPlanificado.activarcbo
                    console.log('activadocbo', activarcbo);

                    const ractivarcbo = activarcbo === undefined ? 0 : activarcbo;
                    this.listHorario[promotorIndex][fechaIndex].activarcbo =
                      ractivarcbo

                    const restado = horarioPlanificado.estado
                    this.listHorario[promotorIndex][fechaIndex].estado =
                      restado

                    // this.listHorario[promotorIndex][fechaIndex].variable =
                    //   true

                    // const horario = `${horarioPlanificado.descripcion || ''},${horarioPlanificado.horarioentrada || ''},${horarioPlanificado.horariosalida || ''}`;
                    // const rhorario = horario === ',,' ? '' : horario;
                    // this.listHorario[promotorIndex][fechaIndex].horario = rhorario;

                    // // Mantén la obtención del valor original de activarcbo.
                    // const activarcbo = horarioPlanificado.activarcbo;
                    // console.log('activadocbo', activarcbo);

                    // // Aquí ajustas ractivarcbo basándote en si rhorario es vacío.
                    // // Si rhorario es '', entonces ractivarcbo debe ser 1, independientemente del valor de activarcbo.
                    // // Si no, usas la lógica original para determinar el valor de ractivarcbo.
                    // const ractivarcbo = rhorario === '' ? 1 : (activarcbo === undefined ? 0 : activarcbo);

                    // this.listHorario[promotorIndex][fechaIndex].activarcbo = ractivarcbo;

                    if(this.listHorario[promotorIndex][fechaIndex].estado==2 && this.listHorario[promotorIndex][fechaIndex].activarcbo==2){
                      this.listHorario[promotorIndex][fechaIndex].variable=1;
                    }

                  }

                  // // Suponiendo que this.listHorario es tu matriz bidimensional
                  // this.listHorario.forEach(fila => {
                  //   fila.forEach(elemento => {
                  //     if (elemento.horario === "" && elemento.variable) {
                  //       elemento.activarcbo = 1;
                  //     }
                  //   });
                  // });

                  this.listHorario.forEach(fila => {
                    fila.forEach(elemento => {
                      if (elemento.estado === 0 && elemento.actirvarcbo === 0) {
                        elemento.variable = 1;
                      }
                    });
                  });

                  //cuando el horario ya esta guardado pero no figura en la lista de turnos. Manda booleans
                  for (let i = 0; i < this.listHorario.length; i++) {
                    this.coincidencias[i] = [];
                    for (let j = 0; j < this.listHorario[i].length; j++) {
                      const horarioActual = this.listHorario[i][j].horario;
                      const partesHorario = horarioActual.split(',');
                      const coincidencia = partesHorario.some(
                        (part: any) => part === ''
                      );
                      this.coincidencias[i][j] = coincidencia;
                    }
                  }
                });
                console.log('listHorario:', this.listHorario);
                console.log(
                  'datosHorarioPlanificado2:',
                  this.datosHorarioPlanificado
                );
                console.log('coincidencias', this.coincidencias);
              } else {

                for (let i = 0; i < this.listHorario.length; i++) {
                  this.coincidencias[i] = [];
                  for (let j = 0; j < this.listHorario[i].length; j++) {
                    const horarioActual = this.listHorario[i][j].horario;
                    this.listHorario[i][j].variable = false;
                    const partesHorario = horarioActual.split(',');
                    const coincidencia = partesHorario.some(
                      (part: any) => part === ''
                    );
                    this.coincidencias[i][j] = coincidencia;
                  }
                }
                console.log('No hay datos disponibles.');
              }
            } else {
              console.log('La respuesta es nula.');
            }
            // Cerrar la alerta después de 2 segundos
            setTimeout(() => {
              Swal.close();
            }, 2000);
          },
          (error) => {
            console.error('Error al obtener los datos:', error);
            // Cerrar la alerta en caso de error
            setTimeout(() => {
              Swal.close();
            }, 2000);
          }
        );
    }, 2000);
  }

  horarioNoExisteEnLista(horario: string): boolean {
    return !this.listTurnosSupervisorPDVHorarios.some(
      (item) => item.descripcion === horario
    );
  }

  ///*************PERMISOS*************/

  getJefes() {
    this.asignarTurnosService.getJefes().subscribe(res => {
      console.log('jefes', res)
      if (res != null) {
        this.listJefe = res;
      }
    })
  }

  getSupervisores() {
    let dnijefe: string = "";

    if (this.perfil === 'ADMIN') {
      dnijefe = (localStorage.getItem('dnijefe') || '');
    } else if (this.perfil === 'JV') {
      dnijefe = this.usuarioSupervisor.usuario!;
    }

    this.asignarTurnosService.getSupervisores(dnijefe).subscribe(res => {
      console.log('supervisores', res)
      if (res != null) {
        this.listSupervisor = res;
      }
    })
  }

  ongetJefe(event: any) {
    const dnijefe = (event.target as HTMLSelectElement)?.value;
    localStorage.setItem('dnijefe', dnijefe)
    this.listSupervisor = [];
    this.listSupervisorPDV = [];
    this.datosHorarioPlanificado = [];
    this.promotorList = [];
    this.verTurnos = true;
    this.getSupervisores();
  }

  ongetSupervisor(event: any) {
    const dnisupervisor = (event.target as HTMLSelectElement)?.value;
    localStorage.setItem('dnisupervisor', dnisupervisor);
    this.datosHorarioPlanificado = [];
    this.promotorList = [];
    this.verTurnos = false;
    this.pdvFiltro = 0;
    this.getSupervisorPDV();

  }

}
