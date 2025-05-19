import { Routes } from '@angular/router';
import { AwaitingApprovalComponent } from './components/screens/awaiting-approval/awaiting-approval.component';
import { CardVeiculoArComponent } from './components/screens/dash-veiculos/card-veiculo-ar-comprimido/card-veiculo.component';
import { CardVeiculoPedalComponent } from './components/screens/dash-veiculos/card-veiculo-pedal/card-veiculo.component';
import { CardVeiculoTemperaturaComponent } from './components/screens/dash-veiculos/card-veiculo-temperatura/card-veiculo.component';
import { CardVeiculoTorqueComponent } from './components/screens/dash-veiculos/card-veiculo-torque/card-veiculo.component';
import { CardVeiculoTurbinaComponent } from './components/screens/dash-veiculos/card-veiculo-turbina/card-veiculo.component';
import { CardVeiculoVelocidadeComponent } from './components/screens/dash-veiculos/card-veiculo-velocidade/card-veiculo.component';
import { DashVeiculosComponent } from './components/screens/dash-veiculos/dash-veiculos.component';
import { DashDriveComponent } from './components/screens/dashDrive/dash-drive.component';
import { GameComponent } from './components/screens/game/game.component';
import { PremiacoesComponent } from './components/screens/premiacoes/premiacoes.component';
import { QuizComponent } from './components/screens/quiz/quiz.component';
import { ScoreComponent } from './components/screens/score/score.component';
import { TreinamentoOnlineComponent } from './components/screens/treinamento/treinamento.component';
import { UserManagementComponent } from './components/screens/user-management/user-management.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/screens/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/screens/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'user-management',
    component: UserManagementComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./components/screens/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/screens/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'awaiting-approval',
    component: AwaitingApprovalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dash-drive',
    component: DashDriveComponent,
  },
  {
    path: 'dsbcarros',
    component: DashVeiculosComponent,
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
    path: 'pontuacao-ace',
    component: ScoreComponent,
  },
  {
    path: 'as-no-ace',
    component: GameComponent,
  },
  {
    path: 'premiacoes',
    component: PremiacoesComponent,
  },
  {
    path: 'ranking-empresa',
    component: GameComponent,
  },
  {
    path: 'ranking-geral',
    component: GameComponent,
  },
  {
    path: 'game-dia',
    component: GameComponent,
  },
  {
    path: 'treinamento-online',
    component: TreinamentoOnlineComponent,
  },
  {
    path: 'quiz',
    component: QuizComponent,
  }
];
