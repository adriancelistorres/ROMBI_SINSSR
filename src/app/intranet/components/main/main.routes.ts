import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainStartComponent } from './main-layout/main-start/main-start.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'start'
            },
            {
                path: 'start',
                component: MainStartComponent
            },
            // {
            //     path: 'entelretail',
            //     loadChildren: () => import('./entelretail/entel-retail.module').then(m => m.EntelRetailModule)
            // }
        ]
    },
]