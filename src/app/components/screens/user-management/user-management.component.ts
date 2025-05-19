import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
    matBlock,
    matBusiness,
    matCheckCircle,
    matClose,
    matEmail,
    matPerson,
    matPhone,
    matWork
} from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { PhonePipe } from '../../../pipes/phone.pipe';
import { AuthService } from '../../../services/auth.service';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyCode: string;
  registration: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  createdAt: Date;
  isAdmin: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, 
    NgIconComponent, 
    HlmButtonDirective,
    HeaderComponent,
    FooterComponent,
    PhonePipe
  ],
  viewProviders: [
    provideIcons({ 
      matCheckCircle, 
      matClose, 
      matPerson, 
      matPhone, 
      matEmail, 
      matBusiness, 
      matWork,
      matBlock
    })
  ],
  template: `
    <div class="min-h-screen bg-white dark:bg-[#09090B]">
      <app-header />
      
      <div class="container mx-auto py-28">
        <!-- Main Content -->
        <div class="bg-white dark:bg-[#141416] rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-8 dark:text-white">Gerenciamento de Usuários</h2>

          <!-- Tabs -->
          <div class="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav class="flex space-x-8">
              <button
                *ngFor="let tab of tabs"
                (click)="currentTab = tab.value; loadUsers()"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                [class.border-amber-500]="currentTab === tab.value"
                [class.text-amber-500]="currentTab === tab.value"
                [class.border-transparent]="currentTab !== tab.value"
                [class.text-gray-500]="currentTab !== tab.value"
              >
                {{ tab.label }}
                <span class="ml-2 py-0.5 px-2 rounded-full text-xs"
                      [class.bg-amber-100]="currentTab === tab.value"
                      [class.text-amber-600]="currentTab === tab.value"
                      [class.bg-gray-100]="currentTab !== tab.value"
                      [class.text-gray-600]="currentTab !== tab.value"
                >
                  {{ getUsersByStatus(tab.value).length }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
            <p class="mt-2 text-gray-500">Carregando usuários...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error" class="text-center py-8 text-red-500">
            {{ error }}
          </div>

          <!-- Notification -->
          <div 
            *ngIf="notification"
            class="fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 text-sm animate-fade-in"
            [class.bg-green-500]="notification.type === 'success'"
            [class.bg-red-500]="notification.type === 'error'"
            [class.text-white]="true"
          >
            <ng-icon 
              [name]="notification.type === 'success' ? 'matCheckCircle' : 'matError'"
              class="text-xl"
            />
            {{ notification.message }}
            <button
              (click)="dismissNotification()"
              class="ml-2 text-white hover:text-gray-200 focus:outline-none"
            >
              <ng-icon name="matClose" class="text-xl"/>
            </button>
          </div>

          <!-- User List -->
          <div *ngIf="!isLoading && !error" class="space-y-6">
            <div *ngFor="let user of getUsersByStatus(currentTab)"
                 class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <!-- User Info -->
              <div class="flex-grow space-y-2">
                <div class="flex items-center gap-2">
                  <ng-icon name="matPerson" class="text-amber-400"/>
                  <h3 class="font-medium dark:text-white">{{ user.name }}</h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center gap-2">
                    <ng-icon name="matEmail" class="text-gray-400"/>
                    {{ user.email }}
                  </div>
                  <div class="flex items-center gap-2">
                    <ng-icon name="matPhone" class="text-gray-400"/>
                    {{ user.phone | phone }}
                  </div>
                  <div class="flex items-center gap-2">
                    <ng-icon name="matBusiness" class="text-gray-400"/>
                    Empresa: {{ user.companyCode }}
                  </div>
                  <div class="flex items-center gap-2">
                    <ng-icon name="matWork" class="text-gray-400"/>
                    Matrícula: {{ user.registration }}
                  </div>
                </div>
                <div class="text-xs text-gray-400">
                  Solicitado em: {{ user.createdAt | date:'dd/MM/yyyy HH:mm' }}
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 self-end md:self-center">
                <button
                  *ngIf="currentTab === 'pending'"
                  hlmBtn
                  variant="default"
                  class="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  (click)="approveUser(user)"
                >
                  <ng-icon name="matCheckCircle"/>
                  Aprovar
                </button>
                <button
                  *ngIf="currentTab === 'pending'"
                  hlmBtn
                  variant="destructive"
                  class="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  (click)="rejectUser(user)"
                >
                  <ng-icon name="matClose"/>
                  Rejeitar
                </button>
                <button
                  *ngIf="currentTab === 'approved'"
                  hlmBtn
                  variant="destructive"
                  class="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  (click)="blockUser(user)"
                >
                  <ng-icon name="matBlock"/>
                  Bloquear
                </button>
                <button
                  *ngIf="currentTab === 'blocked'"
                  hlmBtn
                  variant="default"
                  class="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  (click)="unblockUser(user)"
                >
                  <ng-icon name="matCheckCircle"/>
                  Desbloquear
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="getUsersByStatus(currentTab).length === 0"
                 class="text-center py-12 text-gray-500 dark:text-gray-400">
              <p class="text-lg">Nenhum usuário {{ getEmptyStateText() }}</p>
            </div>
          </div>
        </div>
      </div>

      <app-footer />
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(-1rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
  `]
})
export class UserManagementComponent implements OnInit, OnDestroy {
  tabs = [
    { label: 'Pendentes', value: 'pending' as const },
    { label: 'Aprovados', value: 'approved' as const },
    { label: 'Rejeitados', value: 'rejected' as const },
    { label: 'Bloqueados', value: 'blocked' as const }
  ];
  currentTab: 'pending' | 'approved' | 'rejected' | 'blocked' = 'pending';
  users: PendingUser[] = [];
  isLoading = false;
  error: string | null = null;
  notification: { type: 'success' | 'error'; message: string } | null = null;
  private refreshInterval: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
    // Atualizar a lista a cada 30 segundos
    this.refreshInterval = setInterval(() => {
      this.loadUsers();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadUsers() {
    console.log('=== Iniciando carregamento de usuários ===');
    console.log('Tab atual:', this.currentTab);
    
    this.isLoading = true;
    this.error = null;
    
    if (!this.authService.isLoggedIn()) {
      console.error('Usuário não está logado');
      this.error = 'Sessão expirada. Por favor, faça login novamente.';
      this.isLoading = false;
      return;
    }

    if (!this.authService.isAdmin()) {
      console.error('Usuário não é admin');
      this.error = 'Você não tem permissão para acessar esta página.';
      this.isLoading = false;
      return;
    }
    
    this.authService.getPendingUsers().subscribe({
      next: (users) => {
        console.log(`Recebidos ${users.length} usuários`);
        this.users = users;
        this.isLoading = false;

        // Log detalhado dos usuários por status
        const usersByStatus = {
          pending: this.getUsersByStatus('pending').length,
          approved: this.getUsersByStatus('approved').length,
          rejected: this.getUsersByStatus('rejected').length,
          blocked: this.getUsersByStatus('blocked').length
        };
        console.log('Usuários por status:', usersByStatus);
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        
        if (error.status === 401 || error.status === 403 || error.message?.includes('permissão')) {
          this.error = 'Sessão expirada ou sem permissão. Por favor, faça login novamente.';
          setTimeout(() => window.location.href = '/login', 2000);
        } else if (error.status === 404) {
          this.error = 'Não foi possível encontrar a lista de usuários.';
        } else if (error.status === 0) {
          this.error = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else {
          this.error = 'Erro ao carregar usuários. Por favor, tente novamente.';
        }
        
        this.isLoading = false;
      }
    });
  }

  getUsersByStatus(status: 'pending' | 'approved' | 'rejected' | 'blocked'): PendingUser[] {
    return this.users.filter(user => user.status === status);
  }

  getEmptyStateText(): string {
    switch (this.currentTab) {
      case 'pending':
        return 'pendente';
      case 'approved':
        return 'aprovado';
      case 'rejected':
        return 'rejeitado';
      case 'blocked':
        return 'bloqueado';
      default:
        return '';
    }
  }

  private showNotification(type: 'success' | 'error', message: string) {
    console.log('Mostrando notificação:', { type, message });
    this.notification = { type, message };
  }

  async approveUser(user: PendingUser) {
    console.log('=== Iniciando aprovação de usuário ===', {
      userId: user.id,
      name: user.name,
      status: user.status
    });

    try {
      if (!this.authService.isAdmin()) {
        throw new Error('Você não tem permissão para realizar esta ação.');
      }

      const token = this.authService.getToken();
      if (!token) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

      await this.authService.approveUser(user.id).toPromise();
      console.log('Usuário aprovado com sucesso');
      
      this.showNotification('success', 'Usuário aprovado com sucesso!');
      await this.loadUsers();
    } catch (error: any) {
      console.error('Erro ao aprovar usuário:', error);
      
      let errorMessage = 'Erro ao aprovar usuário. ';
      if (error.status === 401 || error.status === 403) {
        errorMessage += 'Você não tem permissão ou sua sessão expirou.';
      } else if (error.status === 404) {
        errorMessage += 'Usuário não encontrado.';
      } else if (error.status === 0) {
        errorMessage += 'Não foi possível conectar ao servidor.';
      } else {
        errorMessage += error.message || 'Por favor, tente novamente.';
      }
      
      this.showNotification('error', errorMessage);
    }
  }

  async rejectUser(user: PendingUser) {
    console.log('=== Iniciando rejeição de usuário ===', {
      userId: user.id,
      name: user.name,
      status: user.status
    });

    try {
      if (!this.authService.isAdmin()) {
        throw new Error('Você não tem permissão para realizar esta ação.');
      }

      const token = this.authService.getToken();
      if (!token) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

      await this.authService.rejectUser(user.id).toPromise();
      console.log('Usuário rejeitado com sucesso');
      
      this.showNotification('success', 'Usuário rejeitado com sucesso!');
      await this.loadUsers();
    } catch (error: any) {
      console.error('Erro ao rejeitar usuário:', error);
      
      let errorMessage = 'Erro ao rejeitar usuário. ';
      if (error.status === 401 || error.status === 403) {
        errorMessage += 'Você não tem permissão ou sua sessão expirou.';
      } else if (error.status === 404) {
        errorMessage += 'Usuário não encontrado.';
      } else if (error.status === 0) {
        errorMessage += 'Não foi possível conectar ao servidor.';
      } else {
        errorMessage += error.message || 'Por favor, tente novamente.';
      }
      
      this.showNotification('error', errorMessage);
    }
  }

  async blockUser(user: PendingUser) {
    try {
      await this.authService.blockUser(user.id).toPromise();
      this.showNotification('success', 'Usuário bloqueado com sucesso!');
      await this.loadUsers();
    } catch (error: any) {
      console.error('Erro ao bloquear usuário:', error);
      this.showNotification('error', 'Erro ao bloquear usuário. Por favor, tente novamente.');
    }
  }

  async unblockUser(user: PendingUser) {
    try {
      await this.authService.unblockUser(user.id).toPromise();
      this.showNotification('success', 'Usuário desbloqueado com sucesso!');
      await this.loadUsers();
    } catch (error: any) {
      console.error('Erro ao desbloquear usuário:', error);
      this.showNotification('error', 'Erro ao desbloquear usuário. Por favor, tente novamente.');
    }
  }

  dismissNotification() {
    this.notification = null;
  }
} 