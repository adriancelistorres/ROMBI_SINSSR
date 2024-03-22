import { Routes } from "@angular/router";
import { SeguridadComponent } from "./seguridad.component";
import { authGuard } from "../../../../core/guards/auth.guard";
import { routesGuard } from "../../../../core/guards/routes.guard";

export const routes: Routes = [
    {       
        path: 'CreacionPermisos',
        component: SeguridadComponent,
        canActivate: [authGuard,routesGuard]
    },
];