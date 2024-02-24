import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { MainLayoutComponent } from '../main/main-layout/main-layout.component';
import { MainStartComponent } from '../main/main-layout/main-start/main-start.component';
import { StartComponent } from './layout/start/start.component';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: StartComponent
      },
      
    ]
  }
];
