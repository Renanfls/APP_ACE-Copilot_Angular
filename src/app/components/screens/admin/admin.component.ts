import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../../services/auth.service';
import { WebSocketService } from '../../../services/websocket.service';

interface ActionState {
  userId: string;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-zinc-900 py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Gerenciamento de Usuários
          </h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm" [class]="getStatusClass()">
              {{ getStatusText() }}
            </span>
            <button
              (click)="loadPendingUsers()"
              [disabled]="isLoading"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Atualizando...' : 'Atualizar Lista' }}</span>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
          <strong class="font-bold">Erro! </strong>
          <span class="block sm:inline">{{ errorMessage }}</span>
          <button 
            (click)="dismissError()"
            class="absolute top-0 right-0 px-4 py-3"
          >
            <span class="sr-only">Fechar</span>
            <svg class="h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Fechar</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>

        <!-- Success Message -->
        <div *ngIf="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded relative" role="alert">
          <span class="block sm:inline">{{ successMessage }}</span>
          <button 
            (click)="dismissSuccess()"
            class="absolute top-0 right-0 px-4 py-3"
          >
            <span class="sr-only">Fechar</span>
            <svg class="h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Fechar</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>

        <!-- Users Table -->
        <div class="bg-white dark:bg-zinc-800 shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-zinc-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Empresa
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr *ngFor="let user of pendingUsers" class="hover:bg-gray-50 dark:hover:bg-zinc-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ user.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ user.companyCode }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(user.status)">
                    {{ getStatusText(user.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <div *ngIf="getActionState(user.id) as state">
                    <div *ngIf="state.loading" class="flex items-center">
                      <svg class="animate-spin h-4 w-4 text-amber-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span class="text-amber-500">Processando...</span>
                    </div>
                    <div *ngIf="state.error" class="text-red-500 text-xs">
                      {{ state.error }}
                    </div>
                    <div *ngIf="!state.loading && !state.error">
                      <button
                        *ngIf="user.status === 'pending'"
                        (click)="confirmAction('aprovar', user)"
                        class="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-2"
                      >
                        Aprovar
                      </button>
                      <button
                        *ngIf="user.status === 'pending'"
                        (click)="confirmAction('rejeitar', user)"
                        class="text-red-600 hover:text-red-900 dark:hover:text-red-400 mr-2"
                      >
                        Rejeitar
                      </button>
                      <button
                        *ngIf="user.status === 'approved' && !user.isAdmin"
                        (click)="confirmAction('bloquear', user)"
                        class="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400"
                      >
                        Bloquear
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr *ngIf="pendingUsers.length === 0 && !isLoading" class="hover:bg-gray-50 dark:hover:bg-zinc-700">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Nenhum usuário encontrado
                </td>
              </tr>
              <tr *ngIf="isLoading && pendingUsers.length === 0" class="hover:bg-gray-50 dark:hover:bg-zinc-700">
                <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  <div class="flex justify-center items-center">
                    <svg class="animate-spin h-5 w-5 text-amber-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Carregando usuários...
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit, OnDestroy {
  pendingUsers: User[] = [];
  private wsSubscription: Subscription | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private actionStates = new Map<string, ActionState>();

  constructor(
    private authService: AuthService,
    private wsService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPendingUsers();
    this.setupWebSocket();
  }

  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.wsService.disconnect();
  }

  private setupWebSocket() {
    this.wsService.connect();
    this.wsSubscription = this.wsService.getUserUpdates().subscribe({
      next: (message) => {
        if (message.type === 'USER_REGISTERED' || message.type === 'USER_STATUS_CHANGED') {
          console.log('Recebida atualização de usuários:', message);
          this.loadPendingUsers();
          
          if (message.type === 'USER_STATUS_CHANGED') {
            this.showSuccessMessage('Status do usuário atualizado com sucesso');
          }
        }
      },
      error: (error) => {
        console.error('Erro na conexão WebSocket:', error);
        this.showErrorMessage('Erro na conexão em tempo real. Algumas atualizações podem estar atrasadas.');
      }
    });
  }

  async loadPendingUsers() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    try {
      console.log('Iniciando busca de usuários...');
      this.pendingUsers = await this.authService.getPendingUsers().toPromise();
      console.log('Usuários carregados:', this.pendingUsers);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      if (error.message.includes('401')) {
        this.router.navigate(['/login']);
        return;
      }
      this.showErrorMessage(error.message || 'Erro ao carregar usuários. Por favor, tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  getStatusClass(status?: string): string {
    if (!status) {
      // Para o status geral no cabeçalho
      if (this.isLoading) return 'text-amber-500';
      if (this.errorMessage) return 'text-red-500';
      return 'text-green-500';
    }

    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ';
    switch (status) {
      case 'pending':
        return baseClasses + 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return baseClasses + 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return baseClasses + 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'blocked':
        return baseClasses + 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return baseClasses + 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status?: string): string {
    if (!status) {
      // Para o status geral no cabeçalho
      if (this.isLoading) return 'Atualizando...';
      if (this.errorMessage) return 'Erro ao carregar';
      return 'Dados atualizados';
    }

    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'blocked': return 'Bloqueado';
      default: return 'Desconhecido';
    }
  }

  getActionState(userId: string): ActionState {
    if (!this.actionStates.has(userId)) {
      this.actionStates.set(userId, { userId, loading: false, error: null });
    }
    return this.actionStates.get(userId)!;
  }

  private setActionState(userId: string, loading: boolean, error: string | null = null) {
    this.actionStates.set(userId, { userId, loading, error });
  }

  async confirmAction(action: 'aprovar' | 'rejeitar' | 'bloquear', user: User) {
    const actionText = {
      'aprovar': 'aprovar',
      'rejeitar': 'rejeitar',
      'bloquear': 'bloquear'
    }[action];

    if (confirm(`Tem certeza que deseja ${actionText} o usuário ${user.name}?`)) {
      switch (action) {
        case 'aprovar':
          await this.approveUser(user.id);
          break;
        case 'rejeitar':
          await this.rejectUser(user.id);
          break;
        case 'bloquear':
          await this.blockUser(user.id);
          break;
      }
    }
  }

  private showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => this.dismissSuccess(), 5000);
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.dismissError(), 8000);
  }

  dismissError() {
    this.errorMessage = '';
  }

  dismissSuccess() {
    this.successMessage = '';
  }

  async approveUser(userId: string) {
    this.setActionState(userId, true);
    try {
      await this.authService.approveUser(userId).toPromise();
      this.showSuccessMessage('Usuário aprovado com sucesso');
      await this.loadPendingUsers();
    } catch (error: any) {
      console.error('Erro ao aprovar usuário:', error);
      this.setActionState(userId, false, error.message);
    }
  }

  async rejectUser(userId: string) {
    this.setActionState(userId, true);
    try {
      await this.authService.rejectUser(userId).toPromise();
      this.showSuccessMessage('Usuário rejeitado com sucesso');
      await this.loadPendingUsers();
    } catch (error: any) {
      console.error('Erro ao rejeitar usuário:', error);
      this.setActionState(userId, false, error.message);
    }
  }

  async blockUser(userId: string) {
    this.setActionState(userId, true);
    try {
      await this.authService.blockUser(userId).toPromise();
      this.showSuccessMessage('Usuário bloqueado com sucesso');
      await this.loadPendingUsers();
    } catch (error: any) {
      console.error('Erro ao bloquear usuário:', error);
      this.setActionState(userId, false, error.message);
    }
  }
} 