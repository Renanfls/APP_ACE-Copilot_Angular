import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuficientesLinhaComponent } from './insuficientes-linha.component';

describe('InsuficientesLinhaComponent', () => {
  let component: InsuficientesLinhaComponent;
  let fixture: ComponentFixture<InsuficientesLinhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuficientesLinhaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuficientesLinhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
