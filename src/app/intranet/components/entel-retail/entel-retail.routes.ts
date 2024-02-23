import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/main'
            },
            {
                path: 'GestionHorarios',
                loadChildren: () => import('./gestion-horarios/gestion-horarios.routes').then(m => m.routes)
            }
        ]

    },
    // {
    //     path: 'Seguridad'
    // },
    // {
    //     path: 'ManageCloud'
    // }
]
