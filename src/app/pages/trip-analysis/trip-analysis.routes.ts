import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

export const TRIP_ANALYSIS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./trip-filter/trip-filter.component').then(m => m.TripFilterComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'results',
        loadComponent: () => import('./trip-results/trip-results.component').then(m => m.TripResultsComponent),
        canActivate: [AuthGuard]
    }
]; 