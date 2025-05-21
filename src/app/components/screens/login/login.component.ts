import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matBusiness, matLock, matPerson } from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent, HlmButtonDirective, RouterModule],
  viewProviders: [
    provideIcons({ matPerson, matLock, matBusiness })
  ],
  template: `
    <div class="min-h-screen relative flex items-center justify-center p-4">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="/assets/Background-login.png" 
          alt="Background" 
          class="w-full h-full object-cover"
        >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40 dark:bg-black/40"></div>
      </div>

      <div class="max-w-md w-full p-8 z-10">
        <!-- Logo e Título -->
        <div class="text-center">
          <img class="mx-auto w-auto" src="/assets/Logo_.png" alt="Ace Copilot Logo">
        </div>

        <!-- Formulário de Login -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-4 space-y-6">
          <!-- Campo de Código da Empresa -->
          <div>
            <label for="companyCode" class="pl-4 block text-sm font-medium text-white">
              Código da Empresa
            </label>
            <div class="mt-2 relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ng-icon name="matBusiness" class="h-5 w-5 text-gray-400"/>
              </div>
              <input
                id="companyCode"
                type="text"
                formControlName="companyCode"
                class="block w-full pl-11 pr-3 py-2 border border-gray-300 rounded-full dark:border-gray-600 shadow-sm dark:bg-zinc-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                [class.border-red-500]="loginForm.get('companyCode')?.invalid && loginForm.get('companyCode')?.touched"
                placeholder="Digite o código da empresa"
                (keypress)="onlyNumbers($event)"
                maxlength="4"
              >
            </div>
            <div *ngIf="loginForm.get('companyCode')?.invalid && loginForm.get('companyCode')?.touched" 
                 class="mt-1 text-sm text-red-500 pl-4">
              <span *ngIf="loginForm.get('companyCode')?.errors?.['required']">Código da empresa é obrigatório</span>
              <span *ngIf="loginForm.get('companyCode')?.errors?.['pattern']">Código deve ter 4 dígitos</span>
            </div>
          </div>

          <!-- Campo de Matrícula -->
          <div>
            <label for="registration" class="pl-4 block text-sm font-medium text-white">
              Matrícula
            </label>
            <div class="mt-2 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ng-icon name="matPerson" class="h-5 w-5 text-gray-400"/>
              </div>
              <input
                id="registration"
                type="text"
                formControlName="registration"
                class="block w-full pl-11 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm dark:bg-zinc-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                [class.border-red-500]="loginForm.get('registration')?.invalid && loginForm.get('registration')?.touched"
                placeholder="Digite sua matrícula"
                (keypress)="onlyNumbers($event)"
                maxlength="6"
              >
            </div>
            <div *ngIf="loginForm.get('registration')?.invalid && loginForm.get('registration')?.touched" 
                 class="mt-1 text-sm text-red-500 pl-4">
              <span *ngIf="loginForm.get('registration')?.errors?.['required']">Matrícula é obrigatória</span>
              <span *ngIf="loginForm.get('registration')?.errors?.['pattern']">Matrícula deve ter 6 dígitos</span>
            </div>
          </div>

          <!-- Campo de Senha -->
          <div>
            <label for="password" class="pl-4 block text-sm font-medium text-white">
              Senha
            </label>
            <div class="mt-2 relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ng-icon name="matLock" class="h-5 w-5 text-gray-400"/>
              </div>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="block w-full pl-11 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm dark:bg-zinc-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                placeholder="Digite sua senha"
              >
            </div>
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                 class="mt-1 text-sm text-red-500 pl-4">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Senha é obrigatória</span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Senha deve ter no mínimo 6 caracteres</span>
            </div>
          </div>

          <!-- Lembrar-me e Esqueci a senha -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                formControlName="rememberMe"
                class="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
              >
              <label for="remember_me" class="ml-2 block text-sm text-white cursor-pointer">
                Lembrar-me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-amber-400 hover:text-amber-300">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <!-- Mensagem de Erro -->
          <div *ngIf="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
          </div>

          <!-- Botão de Login -->
          <div>
            <button
              hlmBtn
              type="submit"
              [disabled]="!loginForm.valid || isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-amber-400 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">Entrar</span>
              <div *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </div>
            </button>
          </div>
        </form>

        <!-- Link para Registro -->
        <div class="text-center mt-4">
          <p class="text-sm text-white">
            Não tem uma conta?
            <a routerLink="/register" class="font-medium text-amber-400 hover:text-amber-300">
              Cadastrar
            </a>
          </p>
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

    /* Remove as setas do input number */
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
      -webkit-appearance: none; 
      margin: 0; 
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      companyCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      registration: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Verificar se já está autenticado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const formData = this.loginForm.value;
      
      // Garante que o código da empresa tenha 4 dígitos com zeros à esquerda
      const companyCode = formData.companyCode.padStart(4, '0');
      
      // Garante que a matrícula tenha 6 dígitos com zeros à esquerda
      const registration = formData.registration.padStart(6, '0');

      const success = await this.authService.login(companyCode, registration, formData.password);

      if (success) {
        // Get current user
        const currentUser = this.authService.getCurrentUserValue();
        
        if (!currentUser) {
          this.errorMessage = 'Erro ao obter dados do usuário';
          return;
        }

        // Redirect based on user status
        switch (currentUser.status) {
          case 'approved':
            await this.router.navigate(['/home']);
            break;
          case 'pending':
            await this.router.navigate(['/awaiting-approval']);
            break;
          case 'rejected':
          case 'blocked':
            this.errorMessage = 'Sua conta foi ' + (currentUser.status === 'rejected' ? 'rejeitada' : 'bloqueada');
            await this.authService.logout(false);
            break;
          default:
            this.errorMessage = 'Status de usuário inválido';
            break;
        }
      } else {
        this.errorMessage = 'Código da empresa, matrícula ou senha inválidos';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao fazer login';
    } finally {
      this.isLoading = false;
    }
  }
} 