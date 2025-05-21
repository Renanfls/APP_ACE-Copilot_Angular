import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Observable, of, Subscription, tap, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user.interface';

const API_URL = `${environment.apiUrl}/auth`;

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private token: string | null = null;
  private currentUser: User | null = null;
  private statusCheckInterval: Subscription | null = null;
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private userId: number = 0; // Assuming a default value, actual implementation needed

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
        
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(this.currentUser);
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
      currentValue: this.isAuthenticatedSubject.value
    });
    
    this.isAdminSubject.next(isAdmin);
    
    console.log('=== Status de admin após atualização ===', {
      newValue: isAdmin
    });
  }

  ngOnDestroy() {
    this.stopStatusCheck();
  }

  private startStatusCheck() {
    // Verifica o status a cada 30 segundos
    this.statusCheckInterval = interval(30000).subscribe(() => {
      if (this.isAuthenticatedSubject.value && !this.isAdmin()) {
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

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro na operação.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erro: ${error.error.message}`;
      console.error('Client error:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Backend retornou código ${error.status}, ` +
        `body:`, error.error
      );
      
      // Se o erro vier com uma mensagem do backend, usa ela
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        switch (error.status) {
          case 0:
            errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
            break;
          case 400:
            errorMessage = error.error?.message || 'Dados inválidos. Verifique as informações e tente novamente.';
            break;
          case 401:
            errorMessage = 'Sessão expirada ou inválida. Por favor, faça login novamente.';
            this.logout();
            break;
          case 403:
            errorMessage = 'Você não tem permissão para realizar esta operação.';
            break;
          case 404:
            errorMessage = 'Recurso não encontrado.';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflito de dados. Por favor, tente novamente.';
            break;
          case 422:
            errorMessage = error.error?.message || 'Dados inválidos fornecidos.';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
            break;
        }
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    companyCode: string;
    registration: string;
    password: string;
  }): Promise<void> {
    try {
      console.log('Enviando dados de registro:', {
        ...userData,
        password: '***'
      });

      const response = await this.http.post<{
        message: string;
        user: User;
        notificationSent: boolean;
      }>(`${API_URL}/register`, userData)
        .pipe(
          catchError((error) => {
            console.error('Erro na requisição de registro:', error);
            // Se o erro for 500 mas o usuário foi criado, não propaga o erro
            if (error.status === 500 && error.error?.message?.includes('notifyClients')) {
              console.warn('Erro de notificação WebSocket, mas usuário foi criado');
              return of({
                message: 'Registro realizado com sucesso!',
                user: error.error.user,
                notificationSent: false
              });
            }
            return this.handleError(error);
          })
        )
        .toPromise();
      
      if (!response) {
        throw new Error('Resposta inválida do servidor');
      }

      console.log('Registro realizado com sucesso:', response);

      // Atualiza os dados do usuário em memória
      this.currentUser = response.user;
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redireciona para a página de aguardando aprovação
      await this.router.navigate(['/awaiting-approval'], { replaceUrl: true });
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(companyCode: string, registration: string, password: string): Promise<boolean> {
    console.log('=== Iniciando login ===', { companyCode, registration, passwordLength: password.length });

    try {
      const response = await this.http.post<LoginResponse>(`${API_URL}/login`, {
        companyCode,
        registration,
        password
      }).pipe(
        catchError(this.handleError)
      ).toPromise();

      if (response && response.token && response.user) {
        console.log('=== Login bem-sucedido ===');
        
        // Salva o token e usuário
        this.token = response.token;
        this.currentUser = response.user;
        
        // Persiste os dados na localStorage
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        
        // Atualiza os subjects
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(this.currentUser);
        
        // Inicia verificação periódica de status
        this.startStatusCheck();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      this.logout(false);
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
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    
    if (redirect) {
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated(): Observable<boolean> {
    // Verifica se há token e usuário no localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    // Se não houver token ou usuário, retorna false
    if (!token || !user) {
      this.isAuthenticatedSubject.next(false);
      return this.isAuthenticatedSubject.asObservable();
    }
    
    // Se o subject já estiver com valor true, mantém
    if (this.isAuthenticatedSubject.value) {
      return this.isAuthenticatedSubject.asObservable();
    }
    
    // Se houver token e usuário mas o subject estiver false, atualiza para true
    this.isAuthenticatedSubject.next(true);
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return this.token;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.isAdmin || false;
  }

  getPendingUsers(): Observable<User[]> {
    console.log('=== Buscando usuários ===');
    
    if (!this.token) {
      console.error('Token não encontrado');
      return throwError(() => new Error('Token não encontrado. Por favor, faça login novamente.'));
    }

    if (!this.isAdmin()) {
      console.error('Usuário não é admin');
      return throwError(() => new Error('Você não tem permissão para ver esta página.'));
    }

    console.log('Token:', this.token.substring(0, 10) + '...');
    console.log('URL:', `${API_URL}/pending-users`);

    return this.http.get<User[]>(`${API_URL}/pending-users`, {
      headers: new HttpHeaders()
        .set('Authorization', `Bearer ${this.token}`)
        .set('Content-Type', 'application/json')
    }).pipe(
      tap(users => {
        console.log('Usuários recebidos:', users?.length || 0);
        if (users?.length > 0) {
          console.log('Primeiro usuário:', {
            id: users[0].id,
            status: users[0].status,
            isAdmin: users[0].isAdmin
          });
        }
      }),
      catchError(error => {
        console.error('Erro ao buscar usuários:', error);
        return this.handleError(error);
      })
    );
  }

  approveUser(userId: string): Observable<User> {
    console.log('=== Aprovando usuário ===', { userId });
    
    if (!this.token) {
      console.error('Token não encontrado');
      return throwError(() => new Error('Token não encontrado. Por favor, faça login novamente.'));
    }

    if (!this.isAdmin()) {
      console.error('Usuário não é admin');
      return throwError(() => new Error('Você não tem permissão para realizar esta ação.'));
    }

    console.log('Token:', this.token.substring(0, 10) + '...');
    console.log('URL:', `${API_URL}/users/${userId}/status`);

    return this.http.patch<User>(`${API_URL}/users/${userId}/status`, 
      { status: 'approved' },
      {
        headers: new HttpHeaders()
          .set('Authorization', `Bearer ${this.token}`)
          .set('Content-Type', 'application/json')
      }
    ).pipe(
      tap(response => {
        console.log('Resposta do servidor:', response);
      }),
      catchError(error => {
        console.error('Erro ao aprovar usuário:', error);
        return this.handleError(error);
      })
    );
  }

  rejectUser(userId: string): Observable<User> {
    console.log('=== Rejeitando usuário ===', { userId });
    
    if (!this.token) {
      console.error('Token não encontrado');
      return throwError(() => new Error('Token não encontrado. Por favor, faça login novamente.'));
    }

    if (!this.isAdmin()) {
      console.error('Usuário não é admin');
      return throwError(() => new Error('Você não tem permissão para realizar esta ação.'));
    }

    console.log('Token:', this.token.substring(0, 10) + '...');
    console.log('URL:', `${API_URL}/users/${userId}/status`);

    return this.http.patch<User>(`${API_URL}/users/${userId}/status`, 
      { status: 'rejected' },
      {
        headers: new HttpHeaders()
          .set('Authorization', `Bearer ${this.token}`)
          .set('Content-Type', 'application/json')
      }
    ).pipe(
      tap(response => {
        console.log('Resposta do servidor:', response);
      }),
      catchError(error => {
        console.error('Erro ao rejeitar usuário:', error);
        return this.handleError(error);
      })
    );
  }

  blockUser(userId: string): Observable<User> {
    console.log('=== Bloqueando usuário ===', { userId });
    if (!this.token) {
      console.error('Token não encontrado');
      return throwError(() => new Error('Token não encontrado. Por favor, faça login novamente.'));
    }

    return this.http.patch<User>(`${API_URL}/users/${userId}/status`, { status: 'blocked' }, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.token}`)
    }).pipe(
      retry(1),
      catchError((error) => {
        console.error('Erro ao bloquear usuário:', error);
        return this.handleError(error);
      })
    );
  }

  unblockUser(userId: string): Observable<User> {
    console.log('=== Desbloqueando usuário ===', { userId });
    if (!this.token) {
      console.error('Token não encontrado');
      return throwError(() => new Error('Token não encontrado. Por favor, faça login novamente.'));
    }

    return this.http.patch<User>(`${API_URL}/users/${userId}/status`, { status: 'approved' }, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.token}`)
    }).pipe(
      retry(1),
      catchError((error) => {
        console.error('Erro ao desbloquear usuário:', error);
        return this.handleError(error);
      })
    );
  }

  async checkRegistrationStatus(): Promise<'pending' | 'approved' | 'rejected' | 'blocked'> {
    try {
      // Verifica se tem token
      if (!this.token) {
        console.error('Token não encontrado');
        throw new Error('Token não encontrado');
      }

      console.log('Verificando status com token:', this.token.substring(0, 10) + '...');

      const response = await this.http.get<User>(`${API_URL}/me`, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${this.token}`)
      }).toPromise();
      
      if (!response) {
        console.error('Resposta vazia ao verificar status');
        throw new Error('Resposta vazia ao verificar status');
      }

      console.log('Status atual do usuário:', response.status);
      
      // Atualiza os dados em memória
      this.currentUser = response;
      localStorage.setItem('user', JSON.stringify(response));
      return response.status;
    } catch (error: any) {
      console.error('Error checking registration status:', error);
      
      // Se o token estiver inválido, propaga o erro
      if (error.status === 401) {
        throw new Error('Token inválido');
      }
      
      throw error;
    }
  }

  async updateUserAccess(): Promise<void> {
    try {
      // Verifica se tem token
      if (!this.token) {
        console.error('Token não encontrado');
        throw new Error('Token não encontrado');
      }

      console.log('Atualizando dados do usuário...');
      
      const response = await this.http.get<User>(`${API_URL}/me`, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${this.token}`)
      }).toPromise();
      
      if (!response) {
        console.error('Resposta vazia ao atualizar dados do usuário');
        throw new Error('Resposta vazia ao atualizar dados do usuário');
      }

      console.log('Dados do usuário atualizados:', {
        id: response.id,
        status: response.status,
        isAdmin: response.isAdmin
      });
      
      // Atualiza os dados em memória e no localStorage
      this.currentUser = response;
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      
      // Atualiza o status de admin
      this.updateAdminStatus();
      
      // Se o usuário não estiver mais aprovado, faz logout
      if (response.status !== 'approved') {
        console.log('Usuário não está mais aprovado, fazendo logout...');
        this.logout(true);
        return;
      }
    } catch (error: any) {
      console.error('Error updating user access:', error);
      
      // Se o token estiver inválido, faz logout
      if (error.status === 401) {
        console.log('Token inválido, fazendo logout...');
        this.logout(true);
      }
      
      throw error;
    }
  }

  // Método público para observar mudanças na autenticação
  onAuthStateChanged(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  onAdminStateChanged(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return this.token !== null && this.currentUser !== null;
  }

  getUserId(): number {
    return this.userId;
  }
}