import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainStartComponent } from './main-layout/main-start/main-start.component';
import { authGuard } from '../../../../core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'start',
            },
            {
                path: 'start',
                component: MainStartComponent,
            },
            {
                path: 'EntelRetail',
                loadChildren: () =>
                    import('./../entel-retail/entel-retail.routes').then((m) => m.routes),
            },
            {
                path: 'Seguridad',
                loadChildren: () =>
                    import('./../seguridad/seguridad.routes').then((m) => m.routes),
            },
        ],
    },
];
