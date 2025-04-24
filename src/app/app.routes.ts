import { Route } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/screens/home/home.component';
import { ScoreComponent } from './components/screens/score/score.component';
import { DashVeiculosComponent } from './components/screens/dash-veiculos/dash-veiculos.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'dsbcarros',
    pathMatch: 'full',
  },
  {
    path: 'dsbcarros',
    component: DashVeiculosComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'score',
    component: ScoreComponent,
  },
  {
    path: 'as-no-ace',
    component: GameComponent,
  },
];
