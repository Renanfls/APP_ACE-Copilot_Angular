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
  subMessage = 'O acesso ao aplicativo será liberado por nossa equipe após seu treinamento.';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Verificar status inicial
    await this.checkInitialStatus();
  }

  private async checkInitialStatus() {
    // Redirecionar para home se for admin
    if (this.authService.isAdmin()) {
      this.router.navigate(['/home']);
      return;
    }

    // Verificar status atual
    const status = await this.authService.checkRegistrationStatus();
    this.updateMessageBasedOnStatus(status);

    // Redirecionar se necessário
    if (status === 'approved') {
      this.router.navigate(['/home']);
    } else if (status === 'rejected' || status === 'blocked') {
      this.authService.logout();
    }
  }

  private updateMessageBasedOnStatus(status: 'pending' | 'approved' | 'rejected' | 'blocked') {
    switch (status) {
      case 'pending':
        this.message = 'Aguardando Liberação';
        this.subMessage = 'O acesso ao aplicativo será liberado por nossa equipe após seu treinamento.';
        break;
      case 'rejected':
        this.message = 'Acesso Negado';
        this.subMessage = 'Sua solicitação de acesso foi negada.';
        break;
      case 'blocked':
        this.message = 'Acesso Bloqueado';
        this.subMessage = 'Sua conta está bloqueada. Entre em contato com o administrador.';
        break;
      case 'approved':
        this.message = 'Acesso Liberado';
        this.subMessage = 'Redirecionando para a página inicial...';
        break;
    }
  }

  async checkAccess() {
    if (this.isChecking) return;
    
    this.isChecking = true;
    this.message = 'Verificando Status';
    this.subMessage = 'Aguarde enquanto verificamos seu status...';
    
    try {
      const status = await this.authService.checkRegistrationStatus();
      console.log('Status atual:', status);
      
      this.updateMessageBasedOnStatus(status);
      
      if (status === 'approved') {
        // Atualiza o acesso do usuário
        await this.authService.updateUserAccess();
        // Redireciona para a home
        this.router.navigate(['/home']);
      } else if (status === 'rejected' || status === 'blocked') {
        // Aguarda 2 segundos para mostrar a mensagem antes de fazer logout
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.authService.logout();
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      this.message = 'Erro ao Verificar Status';
      this.subMessage = 'Ocorreu um erro ao verificar seu status. Tente novamente.';
    } finally {
      setTimeout(() => {
        this.isChecking = false;
      }, 500); // Mantém o spinner por meio segundo após a resposta para melhor feedback visual
    }
  }

  logout() {
    this.authService.logout();
  }
} 