import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSignaturePadModule, NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';

@Component({
  selector: 'app-firma-bundle',
  standalone: true,
  imports: [FormsModule,AngularSignaturePadModule  ],
  templateUrl: './firma-bundle.component.html',
  styleUrl: './firma-bundle.component.css'
})
export class FirmaBundleComponent  {
  
  @ViewChild('signature')signaturePad?: SignaturePadComponent;


   signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 1, 
    canvasWidth: 0,
    canvasHeight: 0,
    'backgroundColor': 'rgb(222, 224, 226)',

  };

  constructor() {
  }
  ngAfterViewInit() {
    // this.setCanvasWidth();

    // this.signaturePad is now available
    this.signaturePad?.set('minWidth', 1); // set szimek/signature_pad options at runtime
    this.signaturePad?.clear(); // invoke functions from szimek/signature_pad API
    this.resizeSignaturePad()
  }
  
  resizeSignaturePad() {
    const containerWidth:any = document.getElementById("sign_canvas")?.offsetWidth;
    // const newCanvasWidth = containerWidth * 1.1; // Aumenta el ancho en un 10%
    const newCanvasWidth = containerWidth ; // Aumenta el ancho en un 10%

    this.signaturePad?.set('canvasWidth', newCanvasWidth);
    // this.signaturePad?.set('canvasHeight', newCanvasWidth * 0.5); // 1:2 ratio

    console.log('Resized canvas', newCanvasWidth);
    this.signaturePad?.clear();
}
 
  
}
