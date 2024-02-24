import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { StartComponent } from './start/start.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, StartComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
