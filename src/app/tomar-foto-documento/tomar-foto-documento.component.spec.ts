import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomarFotoDocumentoComponent } from './tomar-foto-documento.component';

describe('TomarFotoDocumentoComponent', () => {
  let component: TomarFotoDocumentoComponent;
  let fixture: ComponentFixture<TomarFotoDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TomarFotoDocumentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TomarFotoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
