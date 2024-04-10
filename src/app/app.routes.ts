import { Routes } from '@angular/router';
import { NotFoundComponent } from './intranet/shared/not-found/not-found.component';
import { UnauthorizedComponent } from './intranet/shared/unauthorized/unauthorized.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: ''
    },
    {
        path: '', //
        loadChildren: () => import('./intranet/components/start-main/start-main.routes').then(m => m.routes)
    },
    {
        path: 'auth',//INTRANET
        loadChildren: () => import('./intranet/components/authentication/authentication.routes').then(m => m.routes)
    },
    {
        path: 'main',//PRINCIPAL DE INTRANET
        loadChildren: () => import('./intranet/components/ROM/main/main.routes').then(m => m.routes)
    },
    {
        path: 'public/Rom',//PRINCIPAL DE INTRANET
        loadChildren: () => import('./public/components/ROM/rom.routes').then(m => m.routes)
    },
    {
        path: 'unauthorized', component: UnauthorizedComponent,
    },
    {
        path: '**', component: NotFoundComponent,
    },

];
