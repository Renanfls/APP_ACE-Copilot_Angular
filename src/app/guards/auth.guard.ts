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

    try {
      // Verifica o status atual do usuário no banco de dados
      const currentStatus = await this.authService.checkRegistrationStatus();
      const user = this.authService.getCurrentUser();

      // Se for admin, permite acesso a qualquer rota
      if (user?.isAdmin) {
        return true;
      }

      // Se for usuário pendente, só permite acesso à página de aguardando aprovação
      if (currentStatus === 'pending') {
        if (path === 'awaiting-approval') {
          return true;
        }
        // Redireciona para a tela de aguardando aprovação
        console.log('Usuário pendente, redirecionando para awaiting-approval');
        await this.router.navigate(['/awaiting-approval'], { replaceUrl: true });
        return false;
      }

      // Se for usuário aprovado, permite acesso
      if (currentStatus === 'approved') {
        return true;
      }

      // Se for rejeitado ou bloqueado, faz logout e redireciona para login
      await this.authService.logout(true);
      return false;
    } catch (error) {
      console.error('Erro ao verificar status do usuário:', error);
      await this.authService.logout(true);
      return false;
    }
  }
} 