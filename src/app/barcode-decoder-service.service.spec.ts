import { TestBed } from '@angular/core/testing';

import { BarcodeDecoderServiceService } from './barcode-decoder-service.service';

describe('BarcodeDecoderServiceService', () => {
  let service: BarcodeDecoderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarcodeDecoderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
