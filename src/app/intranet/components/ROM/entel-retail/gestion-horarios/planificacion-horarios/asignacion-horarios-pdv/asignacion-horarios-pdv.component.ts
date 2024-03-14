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
import * as XLSX from 'xlsx';

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
  horarioPlanificadoPromotorRequestArray: HorarioPlanificadoPromotorRequest[] = [];
  horarioPlanificadoPromotorRequest: HorarioPlanificadoPromotorRequest = new HorarioPlanificadoPromotorRequest();

  mostrarElemento: boolean = false;

  showOptions!: boolean[][];
  
  constructor(
    private asignarTurnosService: AsignarTurnosService,
    private asignarHorariosService: AsignarHorariosService
  ) {
    this.usuarioSupervisor.usuario = localStorage.getItem('user')
    localStorage.setItem('idpdv', '');
    localStorage.setItem('puntoventa', '');
  }

  toggleOptions(i: number, j: number) {
    // Puedes implementar la lógica para mostrar/ocultar las opciones según tu requerimiento
    // Por ejemplo, puedes usar un arreglo multidimensional para almacenar el estado de cada celda
    // Aquí se muestra un ejemplo de cómo podrías hacerlo
    this.showOptions[i][j] = !this.showOptions[i][j];
  }

  hideOptions(i: number, j: number) {
    console.log('debe entrar por el blur');
    //TODO: NO BORRES NUNCA EN TU VIDA SINO NO FUNCIONA EL COMBOBOX, SI PUEDES ARREGLA ESE COMBOBOX, SUERTE 
    setTimeout(() => {
        this.showOptions[i][j] = false;
    }, 100); // Ajusta el tiempo según sea necesario
  }

  selectOption(descripcion: string, horarioentrada: string, horariosalida: string, i: number, j: number) {
    this.listHorario[i][j].horario = descripcion + ',' + horarioentrada + ',' + horariosalida;
    // Aquí puedes ocultar las opciones si lo deseas
    this.showOptions[i][j] = false;
  }

  fileName = 'ExcelSheet.xlsx';
  exportexcel() {
    /** Arreglos de objetos **/
    const data1 = [
      { Nombre: 'Juan', Edad: 30, Ciudad: 'Buenos Aires' },
      { Nombre: 'María', Edad: 25, Ciudad: 'Madrid' },
      { Nombre: 'Pedro', Edad: 35, Ciudad: 'Lima' },
      { Nombre: 'Ana', Edad: 28, Ciudad: 'Ciudad de México' },
    ];

    const data2 = [
      { Producto: 'Laptop', Precio: 1200, Stock: 10 },
      { Producto: 'Teléfono', Precio: 800, Stock: 20 },
      { Producto: 'Tablet', Precio: 400, Stock: 15 },
    ];

    /** Convertir los arreglos de objetos en hojas de cálculo **/
    const ws1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data1);
    const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data2);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    /** Añadir las hojas de cálculo al libro de trabajo **/
    XLSX.utils.book_append_sheet(wb, ws1, 'Semana Actual');
    XLSX.utils.book_append_sheet(wb, ws2, 'Semana Anterior');

    /** Guardar en un archivo **/
    XLSX.writeFile(wb, this.fileName);
  }

  toggleVisibilidad() {
    this.mostrarElemento = true;
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
    console.log('vacoppop', this.listRangoSemana);
  }

  filtrar() {
    this.toggleVisibilidad()
    this.datosHorarioPlanificado = [];
    console.log('datosHorarioPlanificado1:', this.datosHorarioPlanificado);


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


    // let timerInterval: any;
    // Swal.fire({
    //   html: '<div style="text-align:center;"><img src="https://i.imgur.com/7c4Iqrl.gif" style="max-width: 100%; height: auto; width:350px" /> </br> <p>Cargando Datos...</p></div>',
    //   //timer: 1300,
    //   timerProgressBar: true,
    //   backdrop: `
    //     rgba(0,0,123,0.4)
    //     left top
    //     no-repeat
    //   `,
    //   didOpen: () => {
    //     Swal.showLoading();
    //     // const timer: any = Swal.getPopup()?.querySelector("b");
    //     // timerInterval = setInterval(() => {
    //     //   if (timer) {
    //     //     timer.textContent = `${Swal.getTimerLeft()}`;
    //     //   }
    //     // }, 100);
    //   },
    //   willClose: () => {
    //     clearInterval(timerInterval);
    //   }
    // })
    // .then((result) => {
    //   this.getHorarioPlanificado()
    //   /* Read more about handling dismissals below */
    //   if (result.dismiss === Swal.DismissReason.timer) {
    //     console.log("I was closed by the timer");
    //   }
    // });

    // this.pdvFiltro=0;
    // this.rangoFiltro="";
    //this.getHorarioPlanificado();

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
      this.datosHorarioPlanificado = [];
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

      this.showOptions = [];
      for (let i = 0; i < this.promotorList.length; i++) {
        this.showOptions[i] = [];
        for (let j = 0; j < this.listDiasSemana.length; j++) {
          this.showOptions[i][j] = false; // Inicialmente, todas las opciones están ocultas
        }
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
    this.toggleVisibilidad();
    const arregloFinal: any[] = []; // Arreglo para almacenar todos los objetos

    // Iterar sobre los promotores
    this.promotorList.forEach((promotor, indexPromotor) => {
      // Iterar sobre los días de la semana
      const promotorPorDia: any[] = [];
      this.listDiasSemana.forEach((dia, indexDia) => {
        // Obtener el horario del promotor para el día actual
        const horario = this.listHorario[indexPromotor][indexDia];
        console.log('como bota?', this.listHorario[indexPromotor][indexDia]);

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
      allowOutsideClick: false
    });

    let timerInterval: any;

    this.asignarHorariosService.postHorarioPlanificado(arrayRequest).subscribe(res => {
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
          position: "bottom-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Los datos no se han guardado"
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
        dnipromotor: promotor.dnipromotor
      };
      console.log('listDiasSemana:', this.listDiasSemana);
      console.log('horarioPlanificadoPromotorRequest1:', this.horarioPlanificadoPromotorRequest);
      this.horarioPlanificadoPromotorRequestArray?.push(this.horarioPlanificadoPromotorRequest);
      this.horarioPlanificadoPromotorRequest = {};
      console.log('horarioPlanificadoPromotorRequest2:', this.horarioPlanificadoPromotorRequest);
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
      allowOutsideClick: false // Evita que se cierre haciendo clic fuera de la alerta
    });

    setTimeout(() => {

      this.asignarHorariosService.getHorarioPlanificado(this.horarioPlanificadoPromotorRequestArray).subscribe(res => {


        if (res !== null) { // Verifica si la respuesta no es nula
          // this.datosHorarioPlanificado = [];

          this.datosHorarioPlanificado = res;

          if (this.datosHorarioPlanificado && this.datosHorarioPlanificado.length > 0) {
            this.datosHorarioPlanificado.forEach((horarioPlanificado) => {
              const fechaIndex = this.listDiasSemana.findIndex((dia) => dia.fecha === horarioPlanificado.fecha);
              const promotorIndex = this.promotorList.findIndex((promotor) => promotor.dnipromotor === horarioPlanificado.dnipromotor);
              console.log('fechaIndex:', fechaIndex);
              console.log('promotorIndex:', promotorIndex);
              if (fechaIndex !== -1 && promotorIndex !== -1) {
                const horario = `${horarioPlanificado.descripcion || ''},${horarioPlanificado.horarioentrada || ''},${horarioPlanificado.horariosalida || ''}`;
                const rhorario = horario === ',,' ? '' : horario;
                this.listHorario[promotorIndex][fechaIndex].horario = rhorario;
              }

            });
            console.log('listHorario:', this.listHorario)
            console.log('datosHorarioPlanificado2:', this.datosHorarioPlanificado)


          } else {
            console.log('No hay datos disponibles.');
          }
        } else {
          console.log('La respuesta es nula.');
        }
        // Cerrar la alerta después de 2 segundos
        setTimeout(() => {
          Swal.close();
        }, 2000);
      }, error => {
        console.error('Error al obtener los datos:', error);
        // Cerrar la alerta en caso de error
        setTimeout(() => {
          Swal.close();
        }, 2000);
      });
    }, 2000);


  }



}
