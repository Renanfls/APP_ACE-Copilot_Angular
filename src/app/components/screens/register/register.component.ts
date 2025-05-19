import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matBusiness, matEmail, matLock, matPerson, matPhone, matWork } from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent, HlmButtonDirective],
  viewProviders: [
    provideIcons({ matPerson, matLock, matBusiness, matPhone, matEmail, matWork })
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
          <h2 class="mt-4 text-2xl font-bold text-white">Solicitar Acesso</h2>
        </div>

        <!-- Formulário de Registro -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <!-- Nome -->
          <div>
            <label for="name" class="pl-4 block text-sm font-medium text-white">
              Nome
            </label>
            <div class="mt-2 relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ng-icon name="matPerson" class="h-5 w-5 text-gray-400"/>
              </div>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="block w-full pl-11 pr-3 py-2 border border-gray-300 rounded-full dark:border-gray-600 shadow-sm dark:bg-zinc-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                [class.border-red-500]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
                placeholder="Digite seu nome completo"
              >
            </div>
            <div *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched" 
                 class="mt-1 text-sm text-red-500 pl-4">
              <span *ngIf="registerForm.get('name')?.errors?.['required']">Nome é obrigatório</span>
              <span *ngIf="registerForm.get('name')?.errors?.['minlength']">Nome deve ter no mínimo 3 caracteres</span>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="pl-4 block text-sm font-medium text-white">
              Email
            </label>
            <div class="mt-2 relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ng-icon name="matEmail" class="h-5 w-5 text-gray-400"/>
              </div>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="block w-full pl-11 pr-3 py-2 border border-gray-300 rounded-full dark:border-gray-600 shadow-sm dark:bg-zinc-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                placeholder="Digite seu email"
              >
            </div>
            <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" 
                 class="mt-1 text-sm text-red-500 pl-4">
              <span *ngIf="registerForm.get('email')?.errors?.['required']">Email é obrigatório</span>
              <span *ngIf="registerForm.get('email')?.errors?.['email']">Email inválido</span>
            </div>
          </div>

          <!-- Telefone -->
          <div>
            <label for="phone" class="pl-4 block text-sm font-medium text-white">
              Telefone
            </label>
            <div class="mt-2 relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ng-icon name="matPhone" class="h-5 w-5 text-gray-400"/>
              </div>
              <input
                id="phone"
                type="tel"
                formControlName="phone"
                class="block w-full pl-11 pr-3 py-2 border border-gray-300 rounded-full dark:border-gray-600 shadow-sm dark:bg-zinc-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                [class.border-red-500]="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched"
                placeholder="(00) 00000-0000"
              >
            </div>
            <div *ngIf="registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched" 
                 class="mt-1 text-sm text-red-500 pl-4">
              <span *ngIf="registerForm.get('phone')?.errors?.['required']">Telefone é obrigatório</span>
              <span *ngIf="registerForm.get('phone')?.errors?.['pattern']">Formato inválido. Use (99) 99999-9999</span>
            </div>
          </div>

          <!-- Código da Empresa -->
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
                [class.border-red-500]="registerForm.get('companyCode')?.invalid && registerForm.get('companyCode')?.touched"
                placeholder="Digite o código da empresa"
                (keypress)="onlyNumbers($event)"
                min="0"
              >
            </div>
            <div *ngIf="registerForm.get('companyCode')?.invalid && registerForm.get('companyCode')?.touched" 
                 class="mt-1 text-sm text-red-500 pl-4">
              <span *ngIf="registerForm.get('companyCode')?.errors?.['required']">Código da empresa é obrigatório</span>
              <span *ngIf="registerForm.get('companyCode')?.errors?.['minlength']">Código deve ter no mínimo 4 dígitos</span>
            </div>
          </div>

          <!-- Matrícula -->
          <div>
            <label for="registration" class="pl-4 block text-sm font-medium text-white">
              Matrícula
            </label>
            <div class="mt-2 relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ng-icon name="matWork" class="h-5 w-5 text-gray-400"/>
              </div>
              <input
                id="registration"
                type="number"
                formControlName="registration"
                class="block w-full pl-11 pr-3 py-2 border border-gray-300 rounded-full dark:border-gray-600 shadow-sm dark:bg-zinc-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                [class.border-red-500]="registerForm.get('registration')?.invalid && registerForm.get('registration')?.touched"
                placeholder="Digite sua matrícula"
                (keypress)="onlyNumbers($event)"
                min="0"
              >
            </div>
            <div *ngIf="registerForm.get('registration')?.invalid && registerForm.get('registration')?.touched" 
                 class="mt-1 text-sm text-red-500 pl-4">
              <span *ngIf="registerForm.get('registration')?.errors?.['required']">Matrícula é obrigatória</span>
              <span *ngIf="registerForm.get('registration')?.errors?.['minlength']">Matrícula deve ter no mínimo 6 dígitos</span>
              <span *ngIf="registerForm.get('registration')?.errors?.['pattern']">Matrícula deve conter apenas números</span>
            </div>
          </div>

          <!-- Senha -->
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
                class="block w-full pl-11 pr-3 py-2 border border-gray-300 rounded-full dark:border-gray-600 shadow-sm dark:bg-zinc-800 dark:text-white focus:ring-amber-500 focus:border-amber-500"
                [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                placeholder="Digite sua senha"
              >
            </div>
            <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" 
                 class="mt-1 text-sm text-red-500 pl-4">
              <span *ngIf="registerForm.get('password')?.errors?.['required']">Senha é obrigatória</span>
              <span *ngIf="registerForm.get('password')?.errors?.['minlength']">Senha deve ter no mínimo 6 caracteres</span>
            </div>
          </div>

          <!-- Mensagem de Erro -->
          <div *ngIf="registerError" class="text-red-500 text-sm text-center">
            {{ registerError }}
          </div>

          <!-- Botão de Registro -->
          <div>
            <button
              hlmBtn
              type="submit"
              [disabled]="!registerForm.valid || isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-amber-400 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">Solicitar Acesso</span>
              <div *ngIf="isLoading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </div>
            </button>
          </div>
        </form>

        <!-- Link para Login -->
        <div class="text-center mt-4">
          <p class="text-sm text-white">
            Já tem uma conta?
            <a routerLink="/login" class="font-medium text-amber-400 hover:text-amber-300">
              Faça login
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  registerError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      companyCode: ['', [Validators.required, Validators.minLength(4)]],
      registration: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^[0-9]*$')
      ]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Adiciona listener para formatar o telefone
    this.registerForm.get('phone')?.valueChanges.subscribe(value => {
      if (value) {
        const numbers = value.replace(/\D/g, '');
        let formatted = numbers;
        if (numbers.length >= 2) {
          formatted = `(${numbers.substring(0, 2)}`;
          if (numbers.length > 2) {
            formatted += `) ${numbers.substring(2, 7)}`;
            if (numbers.length > 7) {
              formatted += `-${numbers.substring(7, 11)}`;
            }
          }
        }
        if (formatted !== value) {
          this.registerForm.patchValue({ phone: formatted }, { emitEvent: false });
        }
      }
    });
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  formatCompanyCode(value: string): string {
    return value.padStart(4, '0');
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerError = null;

      try {
        const formData = this.registerForm.value;
        
        // Formata o código da empresa
        formData.companyCode = formData.companyCode.toString().padStart(4, '0');
        
        // Remove formatação do telefone
        formData.phone = formData.phone.replace(/\D/g, '');

        // Formata a matrícula para garantir que seja uma string com pelo menos 6 dígitos
        formData.registration = formData.registration.toString().padStart(6, '0');

        // Validações adicionais
        if (formData.registration.length < 6) {
          throw new Error('A matrícula deve ter no mínimo 6 dígitos');
        }

        if (formData.companyCode.length < 4) {
          throw new Error('O código da empresa deve ter no mínimo 4 dígitos');
        }

        if (!/^\d+$/.test(formData.registration)) {
          throw new Error('A matrícula deve conter apenas números');
        }

        if (!/^\d+$/.test(formData.companyCode)) {
          throw new Error('O código da empresa deve conter apenas números');
        }

        if (formData.phone.length < 10 || formData.phone.length > 11) {
          throw new Error('Telefone inválido. Use o formato (99) 99999-9999');
        }

        console.log('Enviando dados de registro:', {
          ...formData,
          password: '***'
        });

        // Tenta registrar o usuário
        await this.authService.register(formData);
        
        // Se chegou aqui, o registro foi bem-sucedido
        // Redireciona para a página de aguardando aprovação
        await this.router.navigate(['/awaiting-approval'], { replaceUrl: true });
      } catch (error: any) {
        console.error('Erro no registro:', error);
        
        // Trata diferentes tipos de erros
        if (error.error?.message) {
          this.registerError = error.error.message;
        } else if (error.message) {
          this.registerError = error.message;
        } else {
          this.registerError = 'Erro ao enviar solicitação. Tente novamente.';
        }

        // Trata erros específicos
        if (this.registerError) {
          if (this.registerError.includes('Email já cadastrado')) {
            this.registerForm.patchValue({ email: '' });
            const emailControl = this.registerForm.get('email');
            if (emailControl) {
              emailControl.markAsTouched();
              emailControl.setErrors({ 'emailExists': true });
            }
          } else if (this.registerError.includes('Matrícula já cadastrada')) {
            this.registerForm.patchValue({ registration: '' });
            const registrationControl = this.registerForm.get('registration');
            if (registrationControl) {
              registrationControl.markAsTouched();
              registrationControl.setErrors({ 'registrationExists': true });
            }
          }
        }
      } finally {
        this.isLoading = false;
      }
    } else {
      // Mostra mensagens de erro específicas
      let errorMessage = '';
      const controls = this.registerForm.controls;
      
      if (controls['name'].errors?.['required']) errorMessage = 'Nome é obrigatório';
      else if (controls['name'].errors?.['minlength']) errorMessage = 'Nome deve ter no mínimo 3 caracteres';
      else if (controls['email'].errors?.['required']) errorMessage = 'Email é obrigatório';
      else if (controls['email'].errors?.['email']) errorMessage = 'Email inválido';
      else if (controls['email'].errors?.['emailExists']) errorMessage = 'Email já cadastrado';
      else if (controls['phone'].errors?.['required']) errorMessage = 'Telefone é obrigatório';
      else if (controls['companyCode'].errors?.['required']) errorMessage = 'Código da empresa é obrigatório';
      else if (controls['companyCode'].errors?.['minlength']) errorMessage = 'Código da empresa deve ter no mínimo 4 dígitos';
      else if (controls['registration'].errors?.['required']) errorMessage = 'Matrícula é obrigatória';
      else if (controls['registration'].errors?.['minlength']) errorMessage = 'Matrícula deve ter no mínimo 6 dígitos';
      else if (controls['registration'].errors?.['pattern']) errorMessage = 'Matrícula deve conter apenas números';
      else if (controls['registration'].errors?.['registrationExists']) errorMessage = 'Matrícula já cadastrada';
      else if (controls['password'].errors?.['required']) errorMessage = 'Senha é obrigatória';
      else if (controls['password'].errors?.['minlength']) errorMessage = 'Senha deve ter no mínimo 6 caracteres';
      
      this.registerError = errorMessage || 'Por favor, preencha todos os campos corretamente';
    }
  }
} 