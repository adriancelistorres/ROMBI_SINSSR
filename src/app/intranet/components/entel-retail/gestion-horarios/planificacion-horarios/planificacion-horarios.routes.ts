import { Routes } from "@angular/router";
import { AsignacionTurnosPDVComponent } from "./asignacion-turnos-pdv/asignacion-turnos-pdv.component";

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/main'
    },
    {
        path:'AsignacionTurnosPDV',
        component: AsignacionTurnosPDVComponent
    },
    // {
    //     path:'AsignacionHorariosPDV'
    // }
]