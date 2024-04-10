import { Routes } from '@angular/router';
import { FirmaBundleComponent } from './firma-bundle/firma-bundle.component';

export const routes: Routes = [
    {
        path:'',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/public/Rom/main/Entel/FirmaBundle'
            },
            {
                path: 'FirmaBundle',
                component: FirmaBundleComponent
            }
        ]
    }
]