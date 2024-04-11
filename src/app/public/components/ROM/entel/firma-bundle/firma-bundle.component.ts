import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AngularSignaturePadModule, NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-firma-bundle',
  standalone: true,
  imports: [
    FormsModule,
    AngularSignaturePadModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './firma-bundle.component.html',
  styleUrl: './firma-bundle.component.css'
})
export class FirmaBundleComponent implements AfterViewInit {

  @ViewChild('signature') signaturePad?: SignaturePadComponent;

  signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 1,
    canvasWidth: 0,
    canvasHeight: 0,
    'backgroundColor': 'rgb(222, 224, 226)',
  };

  bundleForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder
  ) {
    this.bundleForm = this.createFormBundle();
  }

  ngAfterViewInit() {
    // this.setCanvasWidth();

    // this.signaturePad is now available
    this.signaturePad?.set('minWidth', 1); // set szimek/signature_pad options at runtime
    this.signaturePad?.clear(); // invoke functions from szimek/signature_pad API
    this.resizeSignaturePad()
  }

  resizeSignaturePad() {
    const containerWidth: any = document.getElementById("sign_canvas")?.offsetWidth;
    // const newCanvasWidth = containerWidth * 1.1; // Aumenta el ancho en un 10%
    const newCanvasWidth = containerWidth; // Aumenta el ancho en un 10%

    this.signaturePad?.set('canvasWidth', newCanvasWidth);
    // this.signaturePad?.set('canvasHeight', newCanvasWidth * 0.5); // 1:2 ratio

    console.log('Resized canvas', newCanvasWidth);
    this.signaturePad?.clear();
  }

  limpiarFirma(){
    this.signaturePad?.clear();
  }

  createFormBundle(): UntypedFormGroup{
    return this.fb.group({
      intidventasprincipal: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nombrepromotor: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      dnicliente: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      producto: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nombrebundle: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      firma: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  getBundleForm(){

  }
}
