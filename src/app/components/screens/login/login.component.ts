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
                type="number"
                formControlName="companyCode"
                class="block w-full pl-11 pr-3 py-2 border border-gray-300 rounded-full dark:border-gray-600 shadow-sm dark:bg-zinc-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                [class.border-red-500]="loginForm.get('companyCode')?.invalid && loginForm.get('companyCode')?.touched"
                placeholder="Digite o código da empresa"
                min="0"
                oninput="this.value = this.value.replace(/[^0-9]/g, '')"
              >
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
                type="number"
                formControlName="registration"
                class="block w-full pl-11 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm dark:bg-zinc-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                [class.border-red-500]="loginForm.get('registration')?.invalid && loginForm.get('registration')?.touched"
                placeholder="Digite sua matrícula"
                min="0"
                oninput="this.value = this.value.replace(/[^0-9]/g, '')"
              >
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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Verificar se já está autenticado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { companyCode, registration, password } = this.loginForm.value;
      const success = await this.authService.login(companyCode, registration, password);

      if (success) {
        this.router.navigate(['/dashboard']);
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