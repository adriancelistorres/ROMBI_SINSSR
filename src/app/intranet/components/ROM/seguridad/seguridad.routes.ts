import { Routes } from "@angular/router";
import { authGuard } from "../../../../core/guards/auth.guard";
import { routesGuard } from "../../../../core/guards/routes.guard";
import { NotFoundComponent } from "../../../shared/not-found/not-found.component";

export const routes: Routes = [
    // {       
    //     path: 'CreacionPermisos',
    //     component: SeguridadComponent,
    //     canActivate: [authGuard,routesGuard]
    // },
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/main'
            },
            {
                path: 'CreacionAccesos',
                loadChildren: () => import('./creacion-accesos/creacion-accesos.routes').then(m => m.routes)
            },
            {
                path: '**', component: NotFoundComponent,
            },
        ]

    }
];