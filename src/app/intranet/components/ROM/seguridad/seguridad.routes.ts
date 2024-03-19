import { Routes } from "@angular/router";
import { SeguridadComponent } from "./seguridad.component";
import { authGuard } from "../../../../core/guards/auth.guard";

export const routes: Routes = [
    {       
        path: 'CreacionPermisos',
        component: SeguridadComponent,
        canActivate: [authGuard]
    },
];