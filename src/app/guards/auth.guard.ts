import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          console.log('=== AuthGuard: Usuário não autenticado ===');
          this.router.navigate(['/login']);
          return of(false);
        }

        const currentUser = this.authService.getCurrentUserValue();
        if (!currentUser) {
          console.log('=== AuthGuard: Usuário não encontrado ===');
          this.router.navigate(['/login']);
          return of(false);
        }

        if (currentUser.status !== 'approved') {
          console.log('=== AuthGuard: Usuário não aprovado ===', { status: currentUser.status });
          this.router.navigate(['/awaiting-approval']);
          return of(false);
        }

        console.log('=== AuthGuard: Acesso permitido ===');
        return of(true);
      })
    );
  }
} 