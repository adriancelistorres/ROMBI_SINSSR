import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AngularSignaturePadModule, NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { CommonModule } from '@angular/common';
import { ValidacionBundlesService } from '../../../../services/ROM/entel/validacion-bundles/validacion-bundles.service';
import { ValidacionBundle } from '../../../../models/ROM/entel/validacion-bundles/validacionbundle';
import Swal from 'sweetalert2';

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
  validacionBundle: ValidacionBundle = new ValidacionBundle();
  intidventasprincipal: number = 0;

  firmaBase64: string = ''; // Variable para almacenar la firma en Base64

  @ViewChild('staticBackdrop') modal!: ElementRef;

  constructor(
    private fb: UntypedFormBuilder,
    private validacionBundles: ValidacionBundlesService
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

  // resizeSignaturePad() {
  //   const containerWidth: any = document.getElementById("sign_canvas")?.offsetWidth;
  //   // const newCanvasWidth = containerWidth * 1.1; // Aumenta el ancho en un 10%
  //   const newCanvasWidth = containerWidth; // Aumenta el ancho en un 10%

  //   this.signaturePad?.set('canvasWidth', newCanvasWidth);
  //   // this.signaturePad?.set('canvasHeight', newCanvasWidth * 0.5); // 1:2 ratio

  //   console.log('Resized canvas', newCanvasWidth);
  //   this.signaturePad?.clear();
  // }

  resizeSignaturePad() {
    const containerWidth = document.getElementById("sign_canvas")?.offsetWidth;
    const containerHeight = document.getElementById("sign_canvas")?.offsetHeight;

    if (containerWidth && containerHeight && this.signaturePad) {
      this.signaturePad.options = this.signaturePadOptions;
      console.log('Resized canvas', containerWidth, containerHeight);


      this.signaturePad?.set('canvasWidth', containerWidth);
        //this.signaturePad.clear();
      // if (Number(containerWidth) > 400) {

      // } else {
        
      // }
    }
  }

  verdimensiones() {
    const containerWidth = document.getElementById("sign_canvas")?.offsetWidth;
    const containerHeight = document.getElementById("sign_canvas")?.offsetHeight;

    if (containerWidth && containerHeight && this.signaturePad) {
      this.signaturePad.options = this.signaturePadOptions;
      console.log('Resized canvas', containerWidth, containerHeight);
      this.signaturePad?.set('canvasWidth', containerWidth);
      // this.signaturePadOptions.canvasWidth = containerWidth;
      // this.signaturePadOptions.canvasHeight = containerHeight;
      // this.signaturePad.clear();
    }
  }

  guardarFirma() {
    if (this.signaturePad) {
      const signatureBase64 = this.signaturePad.toDataURL(); // Obtener la firma en formato Base64
      console.log('Firma en Base64:', signatureBase64);
      this.firmaBase64 = '';
      this.firmaBase64 = signatureBase64; // Asignar la firma Base64 a la variable para mostrarla en la plantilla
    }
  }

  limpiarFirma() {
    this.signaturePad?.clear();
    this.firmaBase64 = ''; // Limpiar la variable de la firma Base64
  }

  createFormBundle(): UntypedFormGroup {
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
      celularcliente: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      firma: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  getBundleForm() {

  }

  getBundlesVentas() {
    const control = this.bundleForm.get('intidventasprincipal');

    if (control) {
      const id = control.value;
      this.validacionBundles.getBundlesVentas(id).subscribe(res => {
        if (res !== null) {
          this.validacionBundle = res;
          console.log('this.validacionBundle', this.validacionBundle);

          this.bundleForm.patchValue({
            nombrepromotor: res.nombrepromotor,
            dnicliente: res.strdnicliente,
            producto: res.strproductodesc,
            nombrebundle: res.descripcion,
          });
        }
      });
    } else {
      console.error('Debe ingresar el código de la venta!');
    }
  }

  firmar() {
    Swal.fire({
      title: "Do you want to save the changes?",
      html: `
      <signature-pad style="width: 100%; height: 200px;" #signature fxFlex="1 1 50%"
      (window:resize)="resizeSignaturePad()" class="signature" id="sign_canvas"
      fxFlexAlign.xs="center"></signature-pad>
      `,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }
}
