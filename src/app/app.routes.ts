import { Route } from '@angular/router';
import { CardVeiculoArComponent } from './components/screens/dash-veiculos/card-veiculo-ar-comprimido/card-veiculo.component';
import { CardVeiculoPedalComponent } from './components/screens/dash-veiculos/card-veiculo-pedal/card-veiculo.component';
import { CardVeiculoTemperaturaComponent } from './components/screens/dash-veiculos/card-veiculo-temperatura/card-veiculo.component';
import { CardVeiculoTorqueComponent } from './components/screens/dash-veiculos/card-veiculo-torque/card-veiculo.component';
import { CardVeiculoTurbinaComponent } from './components/screens/dash-veiculos/card-veiculo-turbina/card-veiculo.component';
import { CardVeiculoVelocidadeComponent } from './components/screens/dash-veiculos/card-veiculo-velocidade/card-veiculo.component';
import { DashVeiculosComponent } from './components/screens/dash-veiculos/dash-veiculos.component';
import { DashDriveComponent } from './components/screens/dashDrive/dash-drive.component';
import { GameComponent } from './components/screens/game/game.component';
import { HomeComponent } from './components/screens/home/home.component';
import { ProfileComponent } from './components/screens/profile/profile.component';
import { ScoreComponent } from './components/screens/score/score.component';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dsbcarros',
    component: DashVeiculosComponent,
  },
  {
    path: 'dash-drive',
    component: DashDriveComponent,
  },
  {
    path: 'dsb-carros-temp',
    component: CardVeiculoTemperaturaComponent,
  },
  {
    path: 'dsb-carros-torque',
    component: CardVeiculoTorqueComponent,
  },
  {
    path: 'dsb-carros-turbina',
    component: CardVeiculoTurbinaComponent,
  },
  {
    path: 'dsb-carros-pedal',
    component: CardVeiculoPedalComponent,
  },
  {
    path: 'dsb-carros-ar-comprimido',
    component: CardVeiculoArComponent,
  },
  {
    path: 'dsb-carros-velocidade',
    component: CardVeiculoVelocidadeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'pontuacao-ace',
    component: ScoreComponent,
  },
  {
    path: 'as-no-ace',
    component: GameComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canDeactivate: [CanDeactivateGuard]
  },
];
