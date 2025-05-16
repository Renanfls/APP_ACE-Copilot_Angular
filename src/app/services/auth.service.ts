import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Observable, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}/auth`;

export interface User {
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

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private token: string | null = null;
  private currentUser: User | null = null;
  private statusCheckInterval: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeService();
  }

  private async initializeService() {
    console.log('=== Inicializando AuthService ===');
    await this.restoreUserSession();
  }

  private async restoreUserSession(): Promise<void> {
    try {
      console.log('=== Tentando restaurar sessão ===');
      this.token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!this.token || !savedUser) {
        console.log('Nenhuma sessão encontrada');
        return;
      }

      const user = JSON.parse(savedUser) as User;
      this.currentUser = user;

      if (this.currentUser) {
        console.log('Dados do usuário restaurados:', {
          companyCode: this.currentUser.companyCode,
          registration: this.currentUser.registration
        });
        
        this.isAuthenticated.next(true);
        this.updateAdminStatus();
        this.startStatusCheck();
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
      this.logout();
    }
  }

  private updateAdminStatus(): void {
    if (!this.currentUser) {
      console.log('=== Atualizando status de admin: Nenhum usuário logado ===');
      this.isAdminSubject.next(false);
      return;
    }

    const isAdmin = this.currentUser.isAdmin === true;
    
    console.log('=== Atualizando status de admin ===', {
      isAdmin: isAdmin,
      currentValue: this.isAdminSubject.value
    });
    
    this.isAdminSubject.next(isAdmin);
    
    // Verificar se o estado foi atualizado corretamente
    console.log('=== Status de admin após atualização ===', {
      newValue: this.isAdminSubject.value
    });
  }

  ngOnDestroy() {
    this.stopStatusCheck();
  }

  private startStatusCheck() {
    // Verifica o status a cada 30 segundos
    this.statusCheckInterval = interval(30000).subscribe(() => {
      if (this.isAuthenticated.value && !this.isAdmin()) {
        this.checkRegistrationStatus().then((status: 'pending' | 'approved' | 'rejected' | 'blocked') => {
          const currentStatus = this.currentUser?.status;
          
          // Se o status mudou e não é mais aprovado, faz logout
          if (status !== currentStatus && status !== 'approved') {
            console.log('Status do usuário alterado:', status);
            this.logout();
          }
        }).catch((error: Error) => {
          console.error('Erro ao verificar status:', error);
        });
      }
    });
  }

  private stopStatusCheck() {
    if (this.statusCheckInterval) {
      this.statusCheckInterval.unsubscribe();
      this.statusCheckInterval = null;
    }
  }

  private async createAdminIfNotExists() {
    try {
      const response = await this.http.post<LoginResponse>(
        `${API_URL}/login`,
        {
          companyCode: '0123',
          registration: '000000',
          password: 'admin123'
        },
        { headers: new HttpHeaders().set('Content-Type', 'application/json') }
      ).toPromise();

      if (response && response.token) {
        console.log('Admin user exists');
      }
    } catch (error) {
      console.log('Admin não existe ou já está logado');
    }
  }

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    companyCode: string;
    registration: string;
    password: string;
  }): Promise<void> {
    return this.http.post(`${API_URL}/register`, userData).toPromise()
      .then((response: any) => {
        console.log('Registration successful:', response);
      })
      .catch(error => {
        console.error('Registration error:', error);
        throw new Error(error.error.message || 'Erro ao registrar usuário');
      });
  }

  async login(credentials: { 
    companyCode: string; 
    registration: string; 
    password: string 
  }): Promise<void> {
    console.log('=== Iniciando login ===', credentials);

    try {
      const response = await this.http.post<LoginResponse>(
        `${API_URL}/login`,
        credentials,
        { headers: new HttpHeaders().set('Content-Type', 'application/json') }
      ).toPromise();

      if (!response || !response.token || !response.user) {
        throw new Error('Resposta inválida do servidor');
      }

      // Limpa dados anteriores
      this.logout(false); // false para não redirecionar

      // Salva novos dados
      this.token = response.token;
      this.currentUser = response.user;
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      console.log('=== Login bem-sucedido ===', {
        companyCode: response.user.companyCode,
        registration: response.user.registration,
        status: response.user.status
      });

      // Atualiza estados
      this.isAuthenticated.next(true);
      
      // Atualiza status de admin e verifica
      this.updateAdminStatus();
      console.log('=== Verificação final do status de admin após login ===', {
        isAdmin: this.isAdmin(),
        currentUser: this.currentUser
      });
      
      this.startStatusCheck();
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  logout(redirect: boolean = true): void {
    console.log('=== Realizando logout ===');
    this.stopStatusCheck();
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticated.next(false);
    this.isAdminSubject.next(false);
    
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }

  getToken(): string | null {
    return this.token;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  getPendingUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/pending-users`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  approveUser(userId: string): Observable<User> {
    return this.http.patch<User>(`${API_URL}/users/${userId}/status`, { status: 'approved' }, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  rejectUser(userId: string): Observable<User> {
    return this.http.patch<User>(`${API_URL}/users/${userId}/status`, { status: 'rejected' }, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  blockUser(userId: string): Observable<User> {
    return this.http.patch<User>(`${API_URL}/users/${userId}/status`, { status: 'blocked' }, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  unblockUser(userId: string): Observable<User> {
    return this.http.patch<User>(`${API_URL}/users/${userId}/status`, { status: 'approved' }, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
  }

  async checkRegistrationStatus(): Promise<'pending' | 'approved' | 'rejected' | 'blocked'> {
    try {
      const response = await this.http.get<User>(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).toPromise();
      
      if (response) {
        // Update the cached user data
        this.currentUser = response;
        localStorage.setItem('user', JSON.stringify(response));
        return response.status;
      }
      return 'pending';
    } catch (error) {
      console.error('Error checking registration status:', error);
      throw new Error('Erro ao verificar status do registro');
    }
  }

  async updateUserAccess(): Promise<void> {
    try {
      const response = await this.http.get<User>(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).toPromise();
      
      if (response) {
        this.currentUser = response;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
      }
    } catch (error) {
      console.error('Error updating user access:', error);
      throw new Error('Erro ao atualizar acesso do usuário');
    }
  }

  // Método público para observar mudanças na autenticação
  onAuthStateChanged(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  onAdminStateChanged(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }
}