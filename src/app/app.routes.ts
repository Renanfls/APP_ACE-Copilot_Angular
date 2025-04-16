import { Route } from '@angular/router';
import { ScoreComponent } from './components/score/score.component';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'score',
    pathMatch: 'full'
  },
  {
    path: 'score',
    component: ScoreComponent,
  }
];
