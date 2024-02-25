import { StartComponent } from './start-layout/start/start.component';
import { StartLayoutComponent } from './start-layout/start-layout.component';
import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../main/main-layout/main-layout.component';
import { MainStartComponent } from '../main/main-layout/main-start/main-start.component';
import { NotFoundComponent } from '../../shared/not-found/not-found.component';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  {
    path: '',
    component: StartLayoutComponent,
    children: [
      {
        path: '',
        component: StartComponent
      },
      
      
    ]
  }
];
