import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { delay, retryWhen, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface WebSocketMessage {
  type: 'USER_REGISTERED' | 'USER_STATUS_CHANGED';
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any> | null = null;
  private wsUrl = `${environment.wsUrl}/notifications`;
  private reconnectInterval: any;
  private userUpdates = new Subject<WebSocketMessage>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  constructor(private authService: AuthService) {
    // Reconectar quando o token mudar
    this.authService.onAuthStateChanged().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.connect();
      } else {
        this.disconnect();
      }
    });
  }

  public connect(): void {
    if (this.isConnecting || (this.socket$ && !this.socket$.closed)) {
      console.log('WebSocket: Já está conectado ou conectando');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.error('WebSocket: Tentativa de conexão sem token');
      return;
    }

    this.isConnecting = true;
    console.log('WebSocket: Iniciando conexão...');

    try {
      const wsUrlWithToken = `${this.wsUrl}?token=${token}`;
      this.socket$ = webSocket({
        url: wsUrlWithToken,
        openObserver: {
          next: () => {
            console.log('WebSocket: Conexão estabelecida');
            this.reconnectAttempts = 0;
            this.isConnecting = false;
            if (this.reconnectInterval) {
              clearInterval(this.reconnectInterval);
              this.reconnectInterval = null;
            }
          }
        },
        closeObserver: {
          next: () => {
            console.log('WebSocket: Conexão fechada');
            this.socket$ = null;
            this.reconnect();
          }
        }
      });

      this.socket$.pipe(
        retryWhen(errors => 
          errors.pipe(
            tap(err => console.error('WebSocket erro:', err)),
            delay(1000)
          )
        )
      ).subscribe({
        next: (message) => {
          console.log('WebSocket: Mensagem recebida:', message);
          if (this.isValidMessage(message)) {
            this.userUpdates.next(message);
          } else {
            console.warn('WebSocket: Mensagem inválida recebida:', message);
          }
        },
        error: (error) => {
          console.error('WebSocket: Erro na conexão:', error);
          this.isConnecting = false;
          this.reconnect();
        },
        complete: () => {
          console.log('WebSocket: Conexão finalizada');
          this.isConnecting = false;
          this.reconnect();
        }
      });
    } catch (error) {
      console.error('WebSocket: Erro ao criar conexão:', error);
      this.isConnecting = false;
      this.reconnect();
    }
  }

  private isValidMessage(message: any): message is WebSocketMessage {
    return message && 
           typeof message === 'object' && 
           (message.type === 'USER_REGISTERED' || message.type === 'USER_STATUS_CHANGED') &&
           message.data !== undefined;
  }

  private reconnect(): void {
    if (this.reconnectInterval || this.isConnecting) {
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('WebSocket: Número máximo de tentativas de reconexão atingido');
      return;
    }

    this.reconnectAttempts++;
    console.log(`WebSocket: Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    this.reconnectInterval = setInterval(() => {
      if (!this.authService.isLoggedIn()) {
        console.log('WebSocket: Usuário não está logado, cancelando reconexão');
        this.clearReconnectInterval();
        return;
      }

      console.log('WebSocket: Tentando reconectar...');
      this.connect();
    }, Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000)); // Exponential backoff, max 30s
  }

  private clearReconnectInterval(): void {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  public getUserUpdates(): Observable<WebSocketMessage> {
    return this.userUpdates.asObservable();
  }

  public disconnect(): void {
    console.log('WebSocket: Desconectando...');
    this.clearReconnectInterval();
    
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }
} 