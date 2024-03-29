import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RangoSemana } from '../../../models/planificacion-horarios/rangoSemana';
import { SupervisorPDV } from '../../../models/planificacion-horarios/supervisorPDV';
import { TurnosDisponiblesPDVRequest } from '../../../models/planificacion-horarios/turnosDisponiblesPDVRequest';
import { HorarioPlanificadoRequest } from '../../../models/planificacion-horarios/horarioPlanificadoRequest';
import { HorarioPlanificadoPromotorRequest } from '../../../models/planificacion-horarios/horarioPlanificadoPromotorRequest';
import { UsuarioSupervisor } from '../../../models/planificacion-horarios/usuarioSupervisor';

@Injectable({
  providedIn: 'root'
})
export class AsignarHorariosService {

  private readonly apiUrl = environment.endpointIntranet;

  constructor(
    private http: HttpClient
  ) { }

  getRangoSemana(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}PlanificacionHorarios/GetRangoSemana`);
  }

  
  getDiasSemana(diasSemana: RangoSemana): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/GetDiasSemana`,diasSemana);
  }

  getPromotorSupervisorPDV(supervisorPDV: SupervisorPDV): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/GetPromotorSupervisorPDV`,supervisorPDV);
  }
  
  getTurnosSupervisorPDVHorarios(SuperPDV: TurnosDisponiblesPDVRequest): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/GetTurnosSupervisorPDVHorarios`, SuperPDV);
  }

  //Guardar grilla de horario planificado
  postHorarioPlanificado(horarioPlanificadoRequest: HorarioPlanificadoRequest[]){
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/PostHorarioPlanificado`, horarioPlanificadoRequest);
  }

  getHorarioPlanificado(horarioPlanificadoPromotorRequest: HorarioPlanificadoPromotorRequest[]){
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/GetHorarioPlanificado`, horarioPlanificadoPromotorRequest);
  }

  //Exportar horarios
  ReportGetSemanaActual(usuario: UsuarioSupervisor): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/ReportGetSemanaActual`, usuario);
  }

  ReportGetSemanaAnterior(usuario: UsuarioSupervisor): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/ReportGetSemanaAnterior`, usuario);
  }
}
