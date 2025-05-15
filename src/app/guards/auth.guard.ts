import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const path = route.routeConfig?.path || '';
    const publicRoutes = ['login', 'register'];

    // Permitir acesso a rotas públicas
    if (publicRoutes.includes(path)) {
      return true;
    }

    // Se não estiver logado, redireciona para login
    if (!this.authService.isLoggedIn()) {
      await this.router.navigate(['/login']);
      return false;
    }

    // Se for admin, permite acesso a qualquer rota
    if (this.authService.isAdmin()) {
      return true;
    }

    const user = this.authService.getCurrentUser();

    // Se for usuário pendente, só permite acesso à página de aguardando aprovação
    if (user?.status === 'pending') {
      if (path === 'awaiting-approval') {
        return true;
      }
      await this.router.navigate(['/awaiting-approval']);
      return false;
    }

    // Se for usuário aprovado, permite acesso
    if (user?.status === 'approved') {
      return true;
    }

    // Para qualquer outro caso, redireciona para login
    await this.router.navigate(['/login']);
    return false;
  }
} 