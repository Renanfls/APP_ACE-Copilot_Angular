import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/screens/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/screens/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'awaiting-approval',
    loadComponent: () => import('./components/screens/awaiting-approval/awaiting-approval.component').then(m => m.AwaitingApprovalComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./components/screens/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-management',
    loadComponent: () => import('./components/screens/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/screens/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'analise-viagem',
    loadComponent: () => import('./pages/trip-analysis/trip-analysis.component').then(m => m.TripAnalysisComponent)
  },
  {
    path: 'dash-drive',
    loadComponent: () => import('./components/screens/dashDrive/dash-drive.component').then(m => m.DashDriveComponent),

  },
  {
    path: 'dsbcarros',
    loadComponent: () => import('./components/screens/dash-veiculos/dash-veiculos.component').then(m => m.DashVeiculosComponent),

  },
  {
    path: 'dsb-carros-temp',
    loadComponent: () => import('./components/screens/dash-veiculos/card-veiculo-temperatura/card-veiculo.component').then(m => m.CardVeiculoTemperaturaComponent),

  },
  {
    path: 'dsb-carros-torque',
    loadComponent: () => import('./components/screens/dash-veiculos/card-veiculo-torque/card-veiculo.component').then(m => m.CardVeiculoTorqueComponent),

  },
  {
    path: 'dsb-carros-turbina',
    loadComponent: () => import('./components/screens/dash-veiculos/card-veiculo-turbina/card-veiculo.component').then(m => m.CardVeiculoTurbinaComponent),

  },
  {
    path: 'dsb-carros-pedal',
    loadComponent: () => import('./components/screens/dash-veiculos/card-veiculo-pedal/card-veiculo.component').then(m => m.CardVeiculoPedalComponent),

  },
  {
    path: 'dsb-carros-ar-comprimido',
    loadComponent: () => import('./components/screens/dash-veiculos/card-veiculo-ar-comprimido/card-veiculo.component').then(m => m.CardVeiculoArComponent),

  },
  {
    path: 'dsb-carros-velocidade',
    loadComponent: () => import('./components/screens/dash-veiculos/card-veiculo-velocidade/card-veiculo.component').then(m => m.CardVeiculoVelocidadeComponent),

  },
  {
    path: 'pontuacao-ace',
    loadComponent: () => import('./components/screens/score/score.component').then(m => m.ScoreComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'as-no-ace',
    loadComponent: () => import('./components/screens/game/game.component').then(m => m.GameComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'premiacoes',
    loadComponent: () => import('./components/screens/premiacoes/premiacoes.component').then(m => m.PremiacoesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ranking-empresa',
    loadComponent: () => import('./components/screens/game/game.component').then(m => m.GameComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'ranking-geral',
    loadComponent: () => import('./components/screens/game/game.component').then(m => m.GameComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'game-dia',
    loadComponent: () => import('./components/screens/game/game.component').then(m => m.GameComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'treinamento-online',
    loadComponent: () => import('./components/screens/treinamento/treinamento.component').then(m => m.TreinamentoOnlineComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'quiz',
    loadComponent: () => import('./components/screens/quiz/quiz.component').then(m => m.QuizComponent),
    canActivate: [AuthGuard]
  },
  // Rota curinga - deve ser a última
  {
    path: '**',
    redirectTo: '/home'
  }
];
