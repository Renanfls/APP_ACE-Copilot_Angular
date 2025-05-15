import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const API_URL = `${environment.apiUrl}/auth`;

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyCode: string;
  registration: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  createdAt: Date;
}

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private token: string | null = null;
  private currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (this.token && user) {
      this.isAuthenticated.next(true);
      this.currentUser = JSON.parse(user);
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
    console.log('=== Iniciando processo de login ===');
    console.log('URL da API:', API_URL);
    console.log('Credenciais:', {
      companyCode: credentials.companyCode,
      registration: credentials.registration,
      password: '***'
    });
    console.log('Comprimentos:', {
      companyCode: credentials.companyCode.length,
      registration: credentials.registration.length,
      password: credentials.password.length
    });

    try {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      console.log('Headers da requisição:', headers.keys());

      console.log('Enviando requisição POST para:', `${API_URL}/login`);
      const response = await this.http.post<LoginResponse>(
        `${API_URL}/login`,
        credentials,
        { headers }
      ).pipe(
        tap(response => {
          console.log('=== Resposta do servidor ===');
          console.log('Status: Sucesso');
          console.log('Dados do usuário:', {
            name: response.user.name,
            registration: response.user.registration,
            companyCode: response.user.companyCode,
            status: response.user.status
          });
          console.log('Token recebido:', response.token ? 'Sim' : 'Não');
        })
      ).toPromise();

      if (response && response.token) {
        console.log('=== Atualizando estado da aplicação ===');
        this.token = response.token;
        this.currentUser = response.user;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.isAuthenticated.next(true);
        console.log('Login concluído com sucesso para:', response.user.name);
      } else {
        console.error('Resposta do servidor não contém token');
        throw new Error('Erro na autenticação');
      }
    } catch (error: any) {
      console.error('=== Erro no processo de login ===', error);
      if (error.error?.message) {
        throw new Error(error.error.message);
      }
      throw error;
    }
  }

  logout(): void {
    console.log('Realizando logout...');
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
    console.log('Logout concluído');
  }

  isLoggedIn(): boolean {
    const isLogged = this.isAuthenticated.value;
    console.log('Verificando status de login:', isLogged);
    return isLogged;
  }

  getToken(): string | null {
    return this.token;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    const isAdmin = this.currentUser?.companyCode === '0123' && this.currentUser?.registration === '000000';
    console.log('Verificando se é admin:', isAdmin);
    return isAdmin;
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

  async checkRegistrationStatus(): Promise<'pending' | 'approved' | 'rejected' | 'blocked'> {
    return this.currentUser?.status || 'pending';
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
} 