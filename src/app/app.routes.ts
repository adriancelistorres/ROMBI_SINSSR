import { Routes } from '@angular/router';
import { NotFoundComponent } from './intranet/shared/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth'
    },
    // {
    //     path: '', //INICIO
    //     loadChildren: () => import('./intranet/modules/starts/starts.module').then(m => m.StartsModule)
    // },
    {
        path: 'auth',//INTRANET
        loadChildren: () => import('./intranet/components/authentication/authentication.routes').then(m => m.routes)
    },
    {
        path: 'main',//PRINCIPAL DE INTRANET
        loadChildren: () => import('./intranet/components/main/main.routes').then(m => m.routes)
    },
    {
        path: '**', component: NotFoundComponent,
    },

];
