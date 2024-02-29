import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioSupervisor } from '../../../models/planificacion-horarios/usuarioSupervisor';
import { TurnosSupervisor } from '../../../models/planificacion-horarios/turnosSupervisor';
import { TurnosSupervisorDelRequest } from '../../../models/planificacion-horarios/turnosSupervisorDelRequest';

@Injectable({
  providedIn: 'root'
})
export class AsignarTurnosService {

  private readonly apiUrl = environment.endpointIntranet;

  constructor(
    private http: HttpClient
  ) { }
  
  //CRUD Turnos
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


}
