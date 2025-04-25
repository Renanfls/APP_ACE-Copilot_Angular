// dash-veiculos.components.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardVeiculoComponent } from './card-veiculo/card-veiculo.component';
import { CardVeiculoTemperaturaComponent } from './card-veiculo-temperatura/card-veiculo.component';
import { CardVeiculoTorqueComponent } from './card-veiculo-torque/card-veiculo.component';
import { CardVeiculoTurbinaComponent } from './card-veiculo-turbina/card-veiculo.component';
import { CardVeiculoVelocidadeComponent } from './card-veiculo-velocidade/card-veiculo.component';
import { CardVeiculoPedalComponent } from './card-veiculo-pedal/card-veiculo.component';
import { CardVeiculoArComponent } from './card-veiculo-ar-comprimido/card-veiculo.component';
import { FooterDashVeiculosComponent } from './footer/footer.component';
import { HeaderDashVeiculosComponent } from './header/header.component';


@Component({
  selector: 'app-dash-veiculos',
  standalone: true, // Add standalone: true
  imports: [
    HeaderDashVeiculosComponent,
    FooterDashVeiculosComponent,
    CardVeiculoComponent,
    CommonModule,
    CardVeiculoTemperaturaComponent,
    CardVeiculoTorqueComponent,
    CardVeiculoTurbinaComponent,
    CardVeiculoPedalComponent,
    CardVeiculoArComponent,
    CardVeiculoVelocidadeComponent,
  ],
  templateUrl: './dash-veiculos.component.html',
  styleUrl: './dash-veiculos.component.css',
})
export class DashVeiculosComponent {}
