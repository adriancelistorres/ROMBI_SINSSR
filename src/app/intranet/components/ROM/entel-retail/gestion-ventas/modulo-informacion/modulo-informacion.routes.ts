import { Routes } from '@angular/router';
import { RevisionBundlesComponent } from './revision-bundles/revision-bundles.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/main'
    },
    {
        path: 'RevisionBundles',
        component: RevisionBundlesComponent
    }
]