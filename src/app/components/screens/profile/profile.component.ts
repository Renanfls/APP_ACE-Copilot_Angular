import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
    matAdd,
    matArrowBack,
    matBadge,
    matBusiness,
    matEmail,
    matLocalOffer,
    matPerson,
    matPhone,
    matPhotoCamera,
    matRefresh,
    matSettings,
    matWork
} from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Subscription } from 'rxjs';
import { AvatarSelectorComponent } from '../../../components/avatar-selector/avatar-selector.component';
import { Avatar } from '../../../interfaces/avatar.interface';
import { User } from '../../../interfaces/user.interface';
import { PhonePipe } from '../../../pipes/phone.pipe';
import { AuthService } from '../../../services/auth.service';
import { CouponService, CouponStats } from '../../../services/coupon.service';
import { NotificationService } from '../../../services/notification.service';
import { ThemeService } from '../../../services/theme.service';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgIconComponent,
    HlmButtonDirective,
    HeaderComponent,
    FooterComponent,
    AvatarSelectorComponent,
    PhonePipe
  ],
  viewProviders: [
    provideIcons({
      matArrowBack,
      matPhotoCamera,
      matPerson,
      matBadge,
      matEmail,
      matPhone,
      matBusiness,
      matWork,
      matSettings,
      matRefresh,
      matAdd,
      matLocalOffer
    }),
  ],
  template: `
    <div class="min-h-screen bg-white dark:bg-[#09090B]">
      <app-header />
      
      <div class="container mx-auto py-28">
        <!-- Main Profile Card -->
        <div class="bg-white dark:bg-[#141416] overflow-hidden">
          <!-- Profile Header with Avatar -->
          <div class="relative p-8">
            <div class="flex flex-col md:flex-row items-center">
              <!-- Avatar Section -->
              <div class="relative mb-0 md:mr-8">
                <div class="profile-avatar w-40 h-40 rounded-full overflow-hidden border-4 border-amber-400 shadow-lg hover:scale-105 transition-transform">
                  <img [src]="user().avatar || 'assets/sem-avatar.png'"
                       [alt]="user().name"
                       class="w-full h-full object-cover">
                </div>
                <button hlmBtn
                        variant="ghost"
                        class="absolute bottom-2 right-2 bg-amber-400 hover:bg-amber-500 text-white rounded-full p-3 shadow-md transition-colors"
                        (click)="openAvatarSelector()">
                  <ng-icon name="matPhotoCamera" class="text-lg"/>
                </button>
              </div>

              <!-- User Info -->
              <div class="text-center md:text-left">
                <h2 class="text-2xl font-bold text-white">{{ user().name }}</h2>
                <div class="mt-2">
                  <span class="phase-badge inline-block px-4 py-1 rounded-full text-sm font-medium"
                        [ngClass]="{
                          'bg-amber-700 text-black': user().phase === 'Ouro C',
                          'bg-amber-400 text-black': user().phase === 'Ouro',
                          'bg-gray-400 text-white': user().phase === 'Prata',
                          'bg-orange-700 text-white': user().phase === 'Bronze',
                        }">
                    Fase: {{ user().phase }}
                  </span>
                </div>
                <div class="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                  <div class="flex items-center text-md dark:text-gray-400" *ngIf="user().phone">
                    <ng-icon name="matPhone" class="mr-2 text-amber-400"/>
                    {{ user().phone | phone }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="p-8">
            <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-8">
              <!-- Personal Information Section -->
              <div>
                <h3 class="text-xl font-semibold mb-6 pb-2 border-b border-gray-700 flex items-center">
                  <ng-icon name="matPerson" class="mr-3"/>
                  Informações Pessoais
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium dark:text-gray-300 mb-2">
                      Nome
                    </label>
                    <div class="relative">
                      <input type="text"
                             formControlName="name"
                             class="input-field w-full px-4 py-3 rounded-lg dark:bg-[#1a1a1a] dark:text-white border border-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all">
                      <div class="absolute right-3 top-3 text-gray-500">
                        <ng-icon name="matPerson"/>
                      </div>
                    </div>
                  </div>

                  <!-- Registration -->
                  <div>
                    <label class="block text-sm font-medium dark:text-gray-300 mb-2">
                      Matrícula
                    </label>
                    <div class="relative">
                      <input type="text"
                             formControlName="registration"
                             class="input-field w-full px-4 py-3 rounded-lg dark:bg-[#1a1a1a] dark:text-white border border-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-not-allowed opacity-75">
                      <div class="absolute right-3 top-3 text-gray-500">
                        <ng-icon name="matBadge"/>
                      </div>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-sm font-medium dark:text-gray-300 mb-2">
                      Telefone
                    </label>
                    <div class="relative">
                      <input type="tel"
                             formControlName="phone"
                             [value]="user().phone | phone"
                             class="input-field w-full px-4 py-3 rounded-lg dark:bg-[#1a1a1a] dark:text-white border border-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-not-allowed opacity-75">
                      <div class="absolute right-3 top-3 text-gray-500">
                        <ng-icon name="matPhone"/>
                      </div>
                    </div>
                  </div>

                  <!-- Company -->
                  <div>
                    <label class="block text-sm font-medium dark:text-gray-300 mb-2">
                      Empresa
                    </label>
                    <div class="relative">
                      <input type="text"
                             formControlName="company"
                             class="input-field w-full px-4 py-3 rounded-lg dark:bg-[#1a1a1a] dark:text-white border border-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-not-allowed opacity-75">
                      <div class="absolute right-3 top-3 text-gray-500">
                        <ng-icon name="matBusiness"/>
                      </div>
                    </div>
                  </div>

                  <!-- Role -->
                  <div>
                    <label class="block text-sm font-medium dark:text-gray-300 mb-2">
                      Cargo
                    </label>
                    <div class="relative">
                      <input type="text"
                             formControlName="role"
                             class="input-field w-full px-4 py-3 rounded-lg dark:bg-[#1a1a1a] dark:text-white border border-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all cursor-not-allowed opacity-75">
                      <div class="absolute right-3 top-3 text-gray-500">
                        <ng-icon name="matWork"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Preferences Section -->
              <div>
                <h3 class="text-xl font-semibold mb-6 pb-2 border-b border-gray-700 dark:text-amber-400 flex items-center">
                  <ng-icon name="matSettings" class="mr-3"/>
                  Preferências
                </h3>

                <div class="space-y-4">
                  <div class="flex items-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox"
                             formControlName="darkMode"
                             class="sr-only peer">
                      <div class="w-11 h-6 bg-[#1a1a1a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                      <span class="ml-3 text-sm font-medium dark:text-gray-300">Modo Escuro</span>
                    </label>
                  </div>

                  <div class="flex items-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox"
                             formControlName="notifications"
                             class="sr-only peer">
                      <div class="w-11 h-6 bg-[#1a1a1a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                      <span class="ml-3 text-sm font-medium dark:text-gray-300">Ativar Notificações</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Admin Section -->
              <div *ngIf="isAdmin()" class="border-t border-gray-700 mt-8 pt-8">
                <h3 class="text-xl font-semibold mb-6 pb-2 border-b border-gray-700 dark:text-amber-400 flex items-center">
                  <ng-icon name="matSettings" class="mr-3"/>
                  Administração ({{ authService.isAdmin() ? 'Admin' : 'Não Admin' }})
                </h3>

                <div class="space-y-6">
                  <!-- Coupon Management -->
                  <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                    <h4 class="text-lg font-medium mb-4 flex items-center gap-2">
                      <ng-icon name="matLocalOffer" class="text-amber-400"/>
                      Gerenciar Cupons
                    </h4>
                    
                    <div class="flex items-center gap-4 mb-4">
                      <div class="flex-1">
                        <label class="block text-sm font-medium dark:text-gray-300 mb-2">
                          Quantidade de Cupons
                        </label>
                        <input 
                          type="number" 
                          min="1"
                          [(ngModel)]="couponAmount"
                          class="w-full px-4 py-2 rounded-lg dark:bg-[#1a1a1a] dark:text-white border border-gray-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        >
                      </div>
                      <button
                        hlmBtn
                        class="bg-amber-400 hover:bg-amber-500 text-black font-medium py-3 px-6 rounded-lg shadow-md transition-all flex items-center gap-2 self-end"
                        (click)="addCoupons()"
                      >
                        <ng-icon name="matAdd"/>
                        Adicionar Cupons
                      </button>
                    </div>

                    <!-- Coupon Stats -->
                    <div class="grid grid-cols-3 gap-4 mt-6">
                      <div class="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg text-center">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Total</p>
                        <p class="text-2xl font-bold text-amber-400">{{ couponStats().total }}</p>
                      </div>
                      <div class="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg text-center">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Disponíveis</p>
                        <p class="text-2xl font-bold text-green-500">{{ couponStats().available }}</p>
                      </div>
                      <div class="bg-white dark:bg-[#1a1a1a] p-4 rounded-lg text-center">
                        <p class="text-sm text-gray-500 dark:text-gray-400">Utilizados</p>
                        <p class="text-2xl font-bold text-blue-500">{{ couponStats().used }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Reset Profile Button -->
                  <button 
                    hlmBtn
                    variant="destructive"
                    class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all flex items-center gap-2 justify-center"
                    (click)="resetProfile()"
                  >
                    <ng-icon name="matRefresh" />
                    Resetar Perfil
                  </button>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex justify-end pt-6">
                <button hlmBtn
                        type="submit"
                        [disabled]="!profileForm.valid || !profileForm.dirty"
                        class="save-btn bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-medium py-3 px-8 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <app-footer />
    </div>

    <!-- Avatar Selector Modal -->
    <app-avatar-selector
      [isOpen]="isAvatarSelectorOpen"
      [isAdmin]="authService.isAdmin()"
      (closeModal)="closeAvatarSelector()"
      (avatarSelected)="onAvatarSelected($event)"
    />
  `,
  styles: [`
    :host {
      display: block;
    }

    :host ::ng-deep {
      .bg-background {
        background-color: #09090B;
      }
    }

    .profile-avatar {
      transition: all 0.3s ease;
    }

    .profile-avatar:hover {
      transform: scale(1.05);
    }

    .phase-badge {
      transition: all 0.3s ease;
    }

    .phase-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .input-field:focus {
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
    }

    .save-btn {
      transition: all 0.3s ease;
    }

    .save-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-20px); }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out forwards;
    }

    .animate-fade-out {
      animation: fadeOut 0.3s ease-out forwards;
    }
  `],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  private originalThemeState: boolean = false;
  isAvatarSelectorOpen = false;
  couponAmount: number = 1;
  couponStats = signal<CouponStats>({
    total: 0,
    available: 0,
    used: 0
  });

  user = signal<User>({
    id: '',
    name: '',
    email: '',
    phone: '',
    companyCode: '',
    registration: '',
    status: 'pending',
    createdAt: new Date(),
    role: 'user',
    isAdmin: false,
    // Optional fields
    phase: '',
    avatar: '',
    company: '',
    preferences: {
      darkMode: true,
      notifications: true
    }
  });

  profileForm: FormGroup;
  currentUser: User | null = null;
  private userSubscription: Subscription | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private themeService: ThemeService,
    private notificationService: NotificationService,
    public authService: AuthService,
    private couponService: CouponService
  ) {
    this.originalThemeState = this.themeService.isDarkMode();
    
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      registration: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      company: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    });

    // Create effect to watch theme changes from sidebar
    effect(() => {
      const isDark = this.themeService.isDarkMode();
      // Only update form if it hasn't been modified by user
      if (!this.profileForm.dirty) {
        this.profileForm.patchValue({ darkMode: isDark }, { emitEvent: false });
        this.originalThemeState = isDark;
      }
    });

    // Subscribe to dark mode changes in the form
    this.profileForm.get('darkMode')?.valueChanges.subscribe(isDark => {
      if (isDark) {
        this.themeService.enableDarkMode();
      } else {
        this.themeService.disableDarkMode();
      }
    });

    // Subscribe to coupon stats
    this.couponService.getCouponStats().subscribe(stats => {
      this.couponStats.set(stats);
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.user.update(current => ({
          ...current,
          name: user.name,
          email: user.email,
          phone: user.phone,
          registration: user.registration,
          company: user.companyCode,
          role: 'Motorista', // Default role
          phase: 'Ouro', // Default phase
          isAdmin: user.isAdmin
        }));

        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          registration: user.registration,
          company: user.companyCode,
          darkMode: this.themeService.isDarkMode(),
          notifications: this.notificationService.isNotificationsEnabled(),
        });
      }
    });

    // Carregar avatar salvo
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      this.user.update(current => ({
        ...current,
        avatar: savedAvatar
      }));
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  openAvatarSelector(): void {
    this.isAvatarSelectorOpen = true;
  }

  closeAvatarSelector(): void {
    this.isAvatarSelectorOpen = false;
  }

  onAvatarSelected(avatar: Avatar): void {
    // Salvar o avatar no localStorage
    localStorage.setItem('userAvatar', avatar.image);
    
    // Atualizar o estado do usuário
    this.user.update(current => ({
      ...current,
      avatar: avatar.image
    }));
    
    this.showToast('Avatar atualizado com sucesso!', 'success');
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const formData = this.profileForm.value;
      
      // Validar senha se estiver alterando
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          this.errorMessage = 'As senhas não conferem';
          return;
        }
      }

      // Update theme state
      this.originalThemeState = formData.darkMode;

      // Update notifications based on form value
      if (formData.notifications) {
        this.notificationService.enableNotifications();
      } else {
        this.notificationService.disableNotifications();
      }

      this.user.update(current => ({
        ...current,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        registration: formData.registration,
        company: formData.company,
        role: formData.role,
        preferences: {
          darkMode: formData.darkMode,
          notifications: formData.notifications,
        },
      }));

      console.log('Profile updated:', this.user());
      this.profileForm.markAsPristine();
      this.successMessage = 'Perfil atualizado com sucesso!';
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao atualizar perfil';
    } finally {
      this.isLoading = false;
    }
  }

  // Add method to handle form cancellation or navigation away
  revertThemeChanges() {
    if (this.originalThemeState) {
      this.themeService.enableDarkMode();
    } else {
      this.themeService.disableDarkMode();
    }
    this.profileForm.patchValue({ darkMode: this.originalThemeState }, { emitEvent: false });
  }

  // Override canDeactivate to handle unsaved changes
  canDeactivate(): boolean {
    if (this.profileForm.dirty) {
      const confirmed = window.confirm('Você tem alterações não salvas. Deseja descartar as alterações?');
      if (confirmed) {
        this.revertThemeChanges();
      }
      return confirmed;
    }
    return true;
  }

  private showToast(message: string, type: 'success' | 'error') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } animate-fade-in-up`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  isAdmin(): boolean {
    const isAdmin = this.authService.isAdmin();
    console.log('isAdmin check:', isAdmin);
    return isAdmin;
  }

  resetProfile(): void {
    if (confirm('Tem certeza que deseja resetar este perfil? Esta ação não pode ser desfeita.')) {
      // Reset user data
      this.user.update(current => ({
        ...current,
        avatar: '',
        preferences: {
          darkMode: false,
          notifications: true
        }
      }));

      // Clear avatar from localStorage
      localStorage.removeItem('userAvatar');

      // Reset form
      this.profileForm.reset({
        name: this.user().name,
        email: this.user().email,
        phone: this.user().phone,
        registration: this.user().registration,
        company: this.user().company,
        role: this.user().role,
        darkMode: false,
        notifications: true
      });

      // Update theme
      this.themeService.disableDarkMode();
      this.originalThemeState = false;

      // Show success message
      this.showToast('Perfil resetado com sucesso!', 'success');
    }
  }

  addCoupons(): void {
    if (this.couponAmount < 1) {
      this.showToast('A quantidade deve ser maior que zero', 'error');
      return;
    }

    this.couponService.addCoupons(this.couponAmount);
    this.showToast(`${this.couponAmount} cupons adicionados com sucesso!`, 'success');
    this.couponAmount = 1; // Reset the input
  }
} 