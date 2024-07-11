import { Injectable } from '@angular/core';
import { BarcodeFormat, DecodeHintType, BrowserMultiFormatReader, Result } from '@zxing/library';

@Injectable({
  providedIn: 'root'
})
export class BarcodeDecoderService {

  constructor() { }

  async decodeBarcodeFromBase64(base64Image: string): Promise<string | null> {
    const hints = new Map();
    hints.set(DecodeHintType.TRY_HARDER, true); // Opcional: Intenta decodificar códigos difíciles
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.PDF_417]); // Ajusta los formatos según tus necesidades

    const reader = new BrowserMultiFormatReader(hints);

    try {
      const result: Result = await reader.decodeFromImage(base64Image);
      return result.getText();
    } catch (error) {
      console.error('Error al decodificar el código de barras:', error);
      return null;
    }
  }
}
