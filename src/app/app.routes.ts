import { Route } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/screens/home/home.component';
import { ScoreComponent } from './components/screens/score/score.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
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
