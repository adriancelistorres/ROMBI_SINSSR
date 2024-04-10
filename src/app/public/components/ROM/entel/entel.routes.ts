import { Routes } from '@angular/router';
import { FirmaBundleComponent } from './firma-bundle/firma-bundle.component';

export const routes: Routes = [
    {
        path:'',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/'
            },
            {
                path: 'FirmaBundle',
                component: FirmaBundleComponent
            }
        ]
    }
]