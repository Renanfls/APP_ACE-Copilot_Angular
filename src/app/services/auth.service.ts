import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface LoginCredentials {
  companyCode: string;
  registration: string;
  password: string;
}

export interface UserStatus {
  isApproved: boolean;
  registration: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ADMIN_CREDENTIALS = {
    companyCode: '123',
    registration: '000000',
    password: '1234'
  };

  constructor(private router: Router) {}

  login(credentials: LoginCredentials): Promise<boolean> {
    return new Promise((resolve) => {
      // Verificar se são as credenciais de admin
      if (
        credentials.companyCode === this.ADMIN_CREDENTIALS.companyCode &&
        credentials.registration === this.ADMIN_CREDENTIALS.registration &&
        credentials.password === this.ADMIN_CREDENTIALS.password
      ) {
        // Login como admin
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userStatus', 'approved');
        localStorage.setItem('registration', credentials.registration);
        this.router.navigate(['/home']);
        resolve(true);
        return;
      }

      // Se não for admin, verificar outras credenciais
      // Aqui você pode adicionar a lógica para outros tipos de usuário
      
      // Por enquanto, vamos apenas simular um delay
      setTimeout(() => {
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('registration', credentials.registration);
        
        // Verifica se o usuário já está aprovado
        const currentStatus = localStorage.getItem('userStatus');
        if (currentStatus === 'approved') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/awaiting-approval']);
        }
        
        resolve(true);
      }, 1000);
    });
  }

  logout(): void {
    // Clear all local storage items
    localStorage.clear();
    
    // Navigate to login page after a small delay to ensure cleanup is complete
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 100);
  }

  isAdmin(): boolean {
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    if (isAdmin) {
      // Ensure admin is always approved
      localStorage.setItem('userStatus', 'approved');
    }
    return isAdmin;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userRole');
  }

  // Verifica o status da matrícula
  checkRegistrationStatus(): Promise<UserStatus> {
    return new Promise((resolve) => {
      const registration = localStorage.getItem('registration');
      const currentStatus = localStorage.getItem('userStatus');
      
      // Simula uma chamada à API
      setTimeout(() => {
        // Se já estiver aprovado, mantém o status
        if (currentStatus === 'approved') {
          resolve({ isApproved: true, registration: registration || '' });
          return;
        }

        // Simula uma chance de 30% de aprovação
        const isApproved = Math.random() < 0.3;
        
        if (isApproved) {
          localStorage.setItem('userStatus', 'approved');
        }

        resolve({
          isApproved,
          registration: registration || ''
        });
      }, 1500);
    });
  }

  // Atualiza o acesso do usuário após aprovação
  updateUserAccess(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('userRole', 'approved_user');
        resolve();
      }, 1000);
    });
  }
} 