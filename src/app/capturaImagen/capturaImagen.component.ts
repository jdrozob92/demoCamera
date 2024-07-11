import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BarcodeFormat, DecodeHintType, BrowserMultiFormatReader } from '@zxing/library';


@Component({
  selector: 'app-capturaImagen',
  templateUrl: './capturaImagen.component.html',
  styleUrls: ['./capturaImagen.component.css']
})
export class CapturaImagenComponent  implements OnInit, OnDestroy {
  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  formats: BarcodeFormat[] = [BarcodeFormat.PDF_417];
  decodedData: string = '';
  availableDevices: MediaDeviceInfo[] = [];
  selectedDevice!: MediaDeviceInfo;

  private codeReader: BrowserMultiFormatReader;
  private stream!: MediaStream | null;

  constructor() {
    this.codeReader = new BrowserMultiFormatReader();
  }

  ngOnInit(): void {
    this.codeReader.listVideoInputDevices().then((devices: MediaDeviceInfo[]) => {
      this.availableDevices = devices;
      if (devices.length > 0) {
        this.selectedDevice = devices[0];
      }
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  startCamera(): void {
    const videoElement = this.video.nativeElement;

    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: 'environment'
      }
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.stream = stream;
        videoElement.srcObject = stream;
        videoElement.play();
      })
      .catch((err) => {
        console.error('Error accessing camera: ', err);
      });
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      this.stream = null;
    }
  }

  captureImage(): void {
    const canvasElement = this.canvas.nativeElement;
    const videoElement = this.video.nativeElement;
    const context = canvasElement.getContext('2d');

    if (context && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
      this.convertCanvasToImageAndScan(canvasElement);
    } else {
      console.error('Video element dimensions are zero.');
    }
  }

  convertCanvasToImageAndScan(canvas: HTMLCanvasElement): void {
    const imageElement = new Image();
    imageElement.onload = () => {
      this.scanImage(imageElement);
    };
    imageElement.src = canvas.toDataURL(); // Convertir el lienzo en datos URL y asignarlo como fuente de la imagen
  }

  scanImage(image: HTMLImageElement): void {
    const hints = new Map<DecodeHintType, any>();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, this.formats);

    this.codeReader.decodeFromImageElement(image)
      .then((result: { getText: () => string }) => {
        this.decodedData = result.getText();
        console.log('Decoded Data:', this.decodedData);
      })
      .catch((err: any) => {
        console.error('Error decoding barcode: ', err);
      });
  }
}
