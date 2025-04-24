// dash-veiculos.components.ts
import { Component } from '@angular/core';
import { CardVeiculoComponent } from './card-veiculo/card-veiculo.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-veiculos',
  standalone: true, // Add standalone: true
  imports: [CardVeiculoComponent, CommonModule],
  templateUrl: './dash-veiculos.component.html',
  styleUrl: './dash-veiculos.component.css'
})
export class DashVeiculosComponent {
  
}