import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardVeiculoComponent } from './card-veiculo.component';

describe('CardVeiculoComponent', () => {
  let component: CardVeiculoComponent;
  let fixture: ComponentFixture<CardVeiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardVeiculoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardVeiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
