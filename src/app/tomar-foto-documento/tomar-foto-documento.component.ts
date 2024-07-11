import { Component, OnInit, ViewChild } from '@angular/core';
import { WebcamImage, WebcamComponent, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { BarcodeDecoderService } from '../barcode-decoder-service.service'; // Asegúrate de importar tu servicio correctamente

@Component({
  selector: 'app-tomar-foto-documento',
  templateUrl: './tomar-foto-documento.component.html',
  styleUrl: './tomar-foto-documento.component.css'
})

export class TomarFotoDocumentoComponent
implements OnInit {
  @ViewChild(WebcamComponent) webcam!: WebcamComponent;
  trigger$ = new Subject<void>();
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public barcodeData: string | null = null;

  constructor(private barcodeDecoder: BarcodeDecoderService) {} // Inyecta el servicio

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger$.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('Received webcam image', webcamImage.imageAsBase64);
    this.barcodeDecoder.decodeBarcodeFromBase64(webcamImage.imageAsBase64)
      .then(barcodeData => {
        this.barcodeData = barcodeData; // Actualiza la variable para mostrarla en la plantilla
        if (!barcodeData) {
          console.log('No se pudo decodificar ningún código de barras.');
        }
      });
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger$.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {
      width: { max: 256 },
      height: { max: 192 },
      frameRate: { min: 30 }
    }; // No establecemos restricciones iniciales
  
    // Intentamos obtener la cámara trasera (suele tener mejor calidad)
    result.facingMode = 'environment';
  
    // Solicitamos la máxima resolución posible (puede variar según el dispositivo)
    result.width = { max: 256 };
    result.height = { max: 192 };
    result.frameRate = { min: 30 };
  
    return result;
  }
  
}
