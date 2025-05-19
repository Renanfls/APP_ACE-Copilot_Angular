import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matLogout, matRefresh } from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-awaiting-approval',
  standalone: true,
  imports: [CommonModule, NgIconComponent, HlmButtonDirective],
  viewProviders: [
    provideIcons({ matLogout, matRefresh })
  ],
  template: `
    <div class="min-h-screen relative flex items-center justify-center p-4 bg-[#1D1D1D]">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="/assets/Background-login.png" 
          alt="Background" 
          class="w-full h-full object-cover"
        >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/60"></div>
      </div>

      <div class="max-w-lg w-full space-y-8 p-8 rounded-xl text-center z-10">
        <!-- Imagem de Liberação -->
        <div class="flex justify-center">
          <img 
            src="/assets/liberacao-acesso.png" 
            alt="Liberação de Acesso" 
            class="w-64 h-64 object-contain"
          >
        </div>

        <!-- Mensagem Principal -->
        <div>
          <h2 class="text-2xl font-bold text-white">
            {{ message }}
          </h2>
          <p class="mt-4 text-gray-400 text-lg">
            {{ subMessage }}
          </p>
        </div>

        <!-- Botões -->
        <div class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <!-- Botão de Atualizar -->
          <button
            hlmBtn
            (click)="checkAccess()"
            [disabled]="isChecking"
            class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <ng-icon 
              name="matRefresh" 
              class="h-5 w-5 mr-2"
              [class.animate-spin]="isChecking"
            />
            {{ isChecking ? 'Verificando...' : 'Atualizar' }}
          </button>

          <!-- Botão de Logout -->
          <button
            hlmBtn
            (click)="logout()"
            class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-[#1D1D1D] rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 bg-[#1D1D1D]"
          >
            <ng-icon name="matLogout" class="h-5 w-5 mr-2"/>
            Sair
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    button {
      transition: all 0.2s ease-in-out;
    }

    button:active {
      transform: scale(0.98);
    }
  `]
})
export class AwaitingApprovalComponent implements OnInit {
  isChecking = false;
  message = 'Aguardando Liberação';
  subMessage = 'Seu cadastro está em análise. Por favor, aguarde a liberação do administrador.';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkInitialStatus();
  }

  private async checkInitialStatus() {
    const currentUser = this.authService.getCurrentUser();
    
    // Se não estiver logado, redireciona para login
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Redirecionar para home se for admin
    if (this.authService.isAdmin()) {
      this.router.navigate(['/home']);
      return;
    }

    // Define a mensagem padrão
    this.message = 'Aguardando Liberação';
    this.subMessage = 'Seu cadastro está em análise. Por favor, aguarde a liberação do administrador.';

    try {
      // Verificar status atual
      const status = await this.authService.checkRegistrationStatus();
      
      // Redirecionar se necessário
      if (status === 'approved') {
        console.log('Usuário aprovado, redirecionando para home...');
        this.message = 'Cadastro Aprovado!';
        this.subMessage = 'Seu cadastro foi aprovado. Redirecionando...';
        
        // Força atualização do usuário antes de redirecionar
        await this.authService.updateUserAccess();
        
        // Redireciona após um breve delay
        setTimeout(() => {
          this.router.navigate(['/home'], { replaceUrl: true });
        }, 1500);
      } else if (status === 'rejected' || status === 'blocked') {
        this.message = status === 'rejected' ? 'Cadastro Rejeitado' : 'Acesso Bloqueado';
        this.subMessage = 'Você será redirecionado em alguns instantes...';
        setTimeout(() => {
          this.authService.logout();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erro ao verificar status inicial:', error);
      // Em caso de erro, mantém a mensagem padrão
    }
  }

  async checkAccess() {
    if (this.isChecking) {
      console.log('Já está verificando status, ignorando chamada...');
      return;
    }
    
    console.log('=== Iniciando verificação de status ===');
    this.isChecking = true;
    
    try {
      // Verifica se tem usuário logado
      const currentUser = this.authService.getCurrentUser();
      const token = this.authService.getToken();

      if (!currentUser || !token) {
        console.log('Usuário não está logado, redirecionando para login...');
        this.authService.logout();
        return;
      }

      console.log('Verificando status com token:', token.substring(0, 10) + '...');
      
      this.message = 'Verificando Status';
      this.subMessage = 'Aguarde enquanto verificamos seu status...';

      // Verifica o status atual
      console.log('Chamando checkRegistrationStatus...');
      const status = await this.authService.checkRegistrationStatus();
      console.log('Status retornado:', status);

      if (status === 'approved') {
        console.log('=== Usuário APROVADO, iniciando redirecionamento ===');
        this.message = 'Cadastro Aprovado!';
        this.subMessage = 'Seu cadastro foi aprovado. Redirecionando...';
        
        // Força atualização do usuário antes de redirecionar
        await this.authService.updateUserAccess();
        
        // Redireciona após um breve delay
        setTimeout(() => {
          this.router.navigate(['/home'], { replaceUrl: true });
        }, 1500);
      } else if (status === 'rejected') {
        console.log('=== Usuário REJEITADO ===');
        this.message = 'Cadastro Rejeitado';
        this.subMessage = 'Seu cadastro foi rejeitado pelo administrador.';
        setTimeout(() => this.authService.logout(), 2000);
      } else if (status === 'blocked') {
        console.log('=== Usuário BLOQUEADO ===');
        this.message = 'Acesso Bloqueado';
        this.subMessage = 'Seu acesso foi bloqueado pelo administrador.';
        setTimeout(() => this.authService.logout(), 2000);
      } else {
        console.log('=== Usuário ainda PENDENTE ===');
        this.message = 'Aguardando Liberação';
        this.subMessage = 'Seu cadastro está em análise. Por favor, aguarde a liberação do administrador.';
      }
    } catch (error: unknown) {
      console.error('=== ERRO ao verificar status ===', error);
      
      // Se for erro de token, faz logout
      if (error instanceof Error && error.message.includes('Token')) {
        console.log('Erro de token, redirecionando para login...');
        this.authService.logout();
        return;
      }
      
      this.message = 'Aguardando Liberação';
      this.subMessage = 'Seu cadastro está em análise. Por favor, aguarde a liberação do administrador.';
    } finally {
      console.log('=== Finalizando verificação de status ===');
      setTimeout(() => {
        this.isChecking = false;
      }, 500);
    }
  }

  logout() {
    this.authService.logout();
  }
} 