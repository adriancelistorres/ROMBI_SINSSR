import { Routes } from "@angular/router";
import { AccesosComponent } from "./accesos/accesos.component";

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/main'
    },
    {
        path: 'Accesos',
        component: AccesosComponent
    }
];