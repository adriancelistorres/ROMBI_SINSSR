import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioSupervisor } from '../../../models/planificacion-horarios/usuarioSupervisor';
import { TurnosSupervisor } from '../../../models/planificacion-horarios/turnosSupervisor';
import { TurnosSupervisorDelRequest } from '../../../models/planificacion-horarios/turnosSupervisorDelRequest';
import { TurnosDisponiblesPDVRequest } from '../../../models/planificacion-horarios/turnosDisponiblesPDVRequest';

@Injectable({
  providedIn: 'root'
})
export class AsignarTurnosService {

  private readonly apiUrl = environment.endpointIntranet;

  constructor(
    private http: HttpClient
  ) { }
  
  //CRUD TURNOS
  getTurnosSupervisor(usuarioSupervisor: UsuarioSupervisor): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/GetTurnosSupervisor`, usuarioSupervisor);
  }

  postTurnosSupervisor(turnosSupervisor: TurnosSupervisor): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/PostTurnosSupervisor`, turnosSupervisor);
  }

  putTurnosSupervisor(turnosSupervisor: TurnosSupervisor): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/PutTurnosSupervisor`, turnosSupervisor);
  }

  deleteTurnosSupervisor(turnosSupervisorDelRequest: TurnosSupervisorDelRequest): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/DeleteTurnosSupervisor`, turnosSupervisorDelRequest);
  }

  //ASIGNACION DE TURNOS
  getSupervisorPDV(usuarioSupervisor: UsuarioSupervisor): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/GetSupervisorPDV`, usuarioSupervisor);
  }

  getTurnosDisponiblePDV(turnosDisponiblesPDVRequest: TurnosDisponiblesPDVRequest): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}PlanificacionHorarios/GetTurnosDisponiblePDV`, turnosDisponiblesPDVRequest);
  }
}
