import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
    matAdd,
    matCategory,
    matCheckCircle,
    matClose,
    matError,
    matLocalOffer,
    matLock,
    matLockOpen,
    matSave,
    matShoppingCart,
    matStarRate,
    matStyle,
} from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ALL_AVATARS, Avatar, AvatarType, FREE_AVATARS, UserAvatar } from '../../interfaces/avatar.interface';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-avatar-selector',
  standalone: true,
  imports: [CommonModule, NgIconComponent, HlmButtonDirective],
  viewProviders: [provideIcons({ 
    matClose, 
    matLock,
    matLockOpen,
    matShoppingCart,
    matLocalOffer,
    matCategory,
    matStyle,
    matStarRate,
    matCheckCircle,
    matError,
    matAdd,
    matSave
  })],
  template: `
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" *ngIf="isOpen">
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
      </div>

      <div class="bg-white dark:bg-[#141416] rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-700">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-3xl font-bold dark:text-white flex items-center gap-2">
                {{ isAdmin ? 'Gerenciar Avatares' : 'Escolha seu Avatar' }}
              </h2>
              <div class="mt-2 flex items-center gap-2">
                <ng-icon name="matLocalOffer" class="text-amber-400" />
                <p class="text-amber-400 text-sm font-medium">
                  Cupons disponíveis: {{ availableCoupons }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <!-- Admin Actions -->
              <div *ngIf="isAdmin" class="flex items-center gap-2">
                <button 
                  hlmBtn 
                  variant="destructive"
                  class="px-4 py-2 rounded-lg flex items-center gap-2"
                  (click)="resetProfile()"
                >
                  <ng-icon name="matRefresh" />
                  Resetar Perfil
                </button>
                <button 
                  hlmBtn 
                  class="px-4 py-2 bg-amber-400 text-black hover:bg-amber-500 rounded-lg flex items-center gap-2"
                  (click)="addCoupons()"
                >
                  <ng-icon name="matAdd" />
                  Adicionar Cupons
                </button>
              </div>
              <button 
                hlmBtn 
                variant="ghost" 
                class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                (click)="close()"
              >
                <ng-icon name="matClose" class="text-xl text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <!-- Admin Stats -->
          <div *ngIf="isAdmin" class="mt-4 grid grid-cols-3 gap-4">
            <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Total de Avatares</p>
              <p class="text-2xl font-bold text-amber-400">{{ filteredAvatars.length }}</p>
            </div>
            <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Avatares Disponíveis</p>
              <p class="text-2xl font-bold text-green-500">{{ getAvailableAvatarsCount() }}</p>
            </div>
            <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">Avatares Bloqueados</p>
              <p class="text-2xl font-bold text-red-500">{{ getLockedAvatarsCount() }}</p>
            </div>
          </div>

          <!-- User Filters -->
          <div class="mt-6 space-y-4" *ngIf="!isAdmin">
            <!-- Categories -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <ng-icon name="matCategory" />
                Categorias
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  hlmBtn
                  [variant]="selectedCategory === 'all' ? 'default' : 'ghost'"
                  class="rounded-full px-4 py-2 text-sm"
                  [class.bg-amber-400]="selectedCategory === 'all'"
                  (click)="selectCategory('all')"
                >
                  {{ getCategoryLabel('all') }}
                </button>
                <button
                  *ngFor="let cat of categories"
                  hlmBtn
                  [variant]="selectedCategory === cat ? 'default' : 'ghost'"
                  class="rounded-full px-4 py-2 text-sm"
                  [class.bg-amber-400]="selectedCategory === cat"
                  (click)="selectCategory(cat)"
                >
                  {{ getCategoryLabel(cat) }}
                </button>
              </div>
            </div>

            <!-- Types -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <ng-icon name="matStyle" />
                Tipos
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  hlmBtn
                  [variant]="selectedType === 'all' ? 'default' : 'ghost'"
                  class="rounded-full px-4 py-2 text-sm"
                  [class.bg-amber-400]="selectedType === 'all'"
                  (click)="selectType('all')"
                >
                  {{ getTypeLabel('all') }}
                </button>
                <button
                  *ngFor="let type of types"
                  hlmBtn
                  [variant]="selectedType === type ? 'default' : 'ghost'"
                  class="rounded-full px-4 py-2 text-sm"
                  [class.bg-amber-400]="selectedType === type"
                  (click)="selectType(type)"
                >
                  {{ getTypeLabel(type) }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Avatar Grid - Scrollable -->
        <div class="p-6 overflow-y-auto flex-grow">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div
              *ngFor="let avatar of filteredAvatars"
              class="relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 bg-gray-100 dark:bg-gray-800 border-2"
              [class.border-amber-400]="selectedAvatar?.id === avatar.id"
              [class.border-transparent]="selectedAvatar?.id !== avatar.id"
              [class.opacity-75]="!isAdmin && !isAvatarAvailable(avatar.id)"
              (click)="onAvatarClick(avatar)"
            >
              <div class="aspect-square w-full p-4 flex items-center justify-center">
                <img
                  [src]="avatar.image"
                  [alt]="'Avatar ' + avatar.id"
                  class="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                >
              </div>
              
              <!-- Overlay for unavailable avatars (only for normal users) -->
              <div
                *ngIf="!isAdmin && !isAvatarAvailable(avatar.id)"
                class="absolute inset-0 bg-[#1d1d1d] bg-opacity-70 flex items-center justify-center backdrop-blur-sm"
              >
                <div class="text-center p-2">
                  <ng-icon
                    [name]="avatar.price ? 'matShoppingCart' : 'matLock'"
                    class="text-amber-400 text-2xl mb-1"
                  />
                  <p class="text-amber-400 text-sm font-medium flex items-center justify-center gap-1" *ngIf="avatar.price">
                    <ng-icon name="matLocalOffer" class="text-base" />
                    {{ avatar.price }}
                  </p>
                </div>
              </div>

              <!-- Type indicator -->
              <div class="absolute top-2 right-2">
                <ng-container [ngSwitch]="avatar.type">
                  <span *ngSwitchCase="'premium'" class="text-amber-400 text-lg">★</span>
                  <span *ngSwitchCase="'custom'" class="text-amber-400 text-lg">⚡</span>
                </ng-container>
              </div>

              <!-- Category indicator -->
              <div class="absolute bottom-2 left-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ getCategoryLabel(avatar.category) }}
              </div>

              <!-- Admin overlay with stats -->
              <div
                *ngIf="isAdmin"
                class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs"
              >
                <div class="flex justify-between">
                  <span>ID: {{ avatar.id }}</span>
                  <span>{{ avatar.price ? avatar.price + ' cupons' : 'Grátis' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons - Fixed at bottom -->
        <div class="p-6 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#141416]/80 backdrop-blur-sm">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400" *ngIf="hasUnsavedChanges">
              <span class="text-sm">Você tem alterações não salvas</span>
            </div>
            <div class="flex items-center gap-4">
              <button
                hlmBtn
                variant="ghost"
                class="px-6 py-2 rounded-full"
                (click)="close()"
              >
                Cancelar
              </button>
              <!-- Normal user actions -->
              <ng-container *ngIf="!isAdmin">
                <button
                  *ngIf="selectedAvatar && !isAvatarAvailable(selectedAvatar.id)"
                  hlmBtn
                  class="px-6 py-2 bg-amber-400 text-black hover:bg-amber-500 rounded-full flex items-center gap-2"
                  [disabled]="!canPurchaseSelected()"
                  (click)="purchaseSelected()"
                >
                  <ng-icon name="matShoppingCart" />
                  Comprar ({{ selectedAvatar.price }} cupons)
                </button>
                <button
                  *ngIf="selectedAvatar && isAvatarAvailable(selectedAvatar.id)"
                  hlmBtn
                  class="px-6 py-2 bg-amber-400 text-black hover:bg-amber-500 rounded-full flex items-center gap-2"
                  (click)="saveChanges()"
                >
                  <ng-icon name="matSave" />
                  Salvar Alterações
                </button>
              </ng-container>
              <!-- Admin actions -->
              <ng-container *ngIf="isAdmin">
                <button
                  *ngIf="selectedAvatar"
                  hlmBtn
                  class="px-6 py-2 bg-amber-400 text-black hover:bg-amber-500 rounded-full flex items-center gap-2"
                  (click)="toggleAvatarAvailability()"
                >
                  <ng-icon [name]="isAvatarAvailable(selectedAvatar.id) ? 'matLock' : 'matLockOpen'" />
                  {{ isAvatarAvailable(selectedAvatar.id) ? 'Bloquear' : 'Desbloquear' }}
                </button>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .avatar-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
    }

    img {
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    }

    /* Estilização da scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background-color: rgba(156, 163, 175, 0.5);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: rgba(156, 163, 175, 0.7);
    }

    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }

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
export class AvatarSelectorComponent implements OnInit {
  @Input() isOpen = false;
  @Input() isAdmin = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() avatarSelected = new EventEmitter<Avatar>();

  availableCoupons = 0;
  selectedAvatar: Avatar | null = null;
  currentAvatar: UserAvatar | null = null;
  hasUnsavedChanges = false;
  notification: { type: 'success' | 'error'; message: string } | null = null;
  categories: Array<'male' | 'female' | 'neutral'> = ['male', 'female', 'neutral'];
  selectedCategory: 'male' | 'female' | 'neutral' | 'all' = 'all';
  types: AvatarType[] = ['free', 'premium', 'custom'];
  selectedType: AvatarType | 'all' = 'all';

  constructor(private avatarService: AvatarService) {}

  ngOnInit() {
    this.avatarService.getAvailableCoupons().subscribe(coupons => {
      this.availableCoupons = coupons;
    });

    // Carregar o avatar atual
    this.avatarService.getSelectedAvatar().subscribe(avatar => {
      this.currentAvatar = avatar;
      if (avatar && !this.selectedAvatar) {
        this.selectedAvatar = avatar;
      }
    });
  }

  get filteredAvatars(): Avatar[] {
    return ALL_AVATARS.filter(avatar => {
      const categoryMatch = this.selectedCategory === 'all' || avatar.category === this.selectedCategory;
      const typeMatch = this.selectedType === 'all' || avatar.type === this.selectedType;
      return categoryMatch && typeMatch;
    });
  }

  getCategoryLabel(category: string): string {
    const labels = {
      all: 'Todos',
      male: 'Masculino',
      female: 'Feminino',
      neutral: 'Neutro'
    };
    return labels[category as keyof typeof labels];
  }

  getTypeLabel(type: string): string {
    const labels = {
      all: 'Todos',
      free: 'Gratuitos',
      premium: 'Premium',
      custom: 'Exclusivos'
    };
    return labels[type as keyof typeof labels];
  }

  selectCategory(category: 'male' | 'female' | 'neutral' | 'all') {
    this.selectedCategory = category;
  }

  selectType(type: AvatarType | 'all') {
    this.selectedType = type;
  }

  onAvatarClick(avatar: Avatar) {
    this.selectedAvatar = avatar;
    this.hasUnsavedChanges = this.currentAvatar?.id !== avatar.id;
  }

  isAvatarAvailable(avatarId: string): boolean {
    // Free avatars are always available
    if (FREE_AVATARS.some(avatar => avatar.id === avatarId)) {
      return true;
    }
    
    // For non-admin users, check if avatar is available through the service
    if (!this.isAdmin) {
      return this.avatarService.isAvatarAvailable(avatarId);
    }
    
    // Admins can access all avatars
    return true;
  }

  canPurchaseSelected(): boolean {
    if (!this.selectedAvatar || !this.selectedAvatar.price) return false;
    return this.availableCoupons >= this.selectedAvatar.price;
  }

  showNotification(type: 'success' | 'error', message: string): void {
    this.notification = { type, message };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  saveChanges(): void {
    if (this.selectedAvatar && this.isAvatarAvailable(this.selectedAvatar.id)) {
      if (this.avatarService.selectAvatar(this.selectedAvatar.id)) {
        this.avatarSelected.emit(this.selectedAvatar);
        
        const avatarType = this.getTypeLabel(this.selectedAvatar.type).toLowerCase();
        this.showNotification('success', `Avatar ${avatarType} salvo com sucesso!`);
        
        this.hasUnsavedChanges = false;
        this.close();
      }
    }
  }

  purchaseSelected(): void {
    if (!this.selectedAvatar) return;
    
    if (this.avatarService.purchaseAvatar(this.selectedAvatar.id)) {
      const avatarType = this.getTypeLabel(this.selectedAvatar.type).toLowerCase();
      this.showNotification('success', `Avatar ${avatarType} comprado com sucesso! Selecione-o e salve para utilizá-lo.`);
      this.hasUnsavedChanges = true;
    } else {
      this.showNotification('error', 'Não foi possível comprar o avatar. Verifique se você tem cupons suficientes.');
    }
  }

  close(): void {
    if (this.hasUnsavedChanges) {
      if (confirm('Você tem alterações não salvas. Deseja realmente sair sem salvar?')) {
        this.closeModal.emit();
        this.resetState();
      }
    } else {
      this.closeModal.emit();
      this.resetState();
    }
  }

  resetState(): void {
    this.selectedAvatar = this.currentAvatar;
    this.selectedCategory = 'all';
    this.selectedType = 'all';
    this.hasUnsavedChanges = false;
  }

  resetProfile(): void {
    if (confirm('Tem certeza que deseja resetar seu perfil? Todos os avatares premium e exclusivos serão removidos.')) {
      this.avatarService.resetUserProfile();
      this.showNotification('success', 'Perfil resetado com sucesso!');
      this.close();
    }
  }

  getAvailableAvatarsCount(): number {
    return this.filteredAvatars.filter(avatar => this.isAvatarAvailable(avatar.id)).length;
  }

  getLockedAvatarsCount(): number {
    return this.filteredAvatars.filter(avatar => !this.isAvatarAvailable(avatar.id)).length;
  }

  addCoupons(): void {
    const amount = prompt('Quantidade de cupons a adicionar:');
    if (amount && !isNaN(Number(amount))) {
      const numAmount = Number(amount);
      if (numAmount > 0) {
        this.avatarService.addCoupons(numAmount);
        this.showNotification('success', `${amount} cupons adicionados com sucesso!`);
      } else {
        this.showNotification('error', 'A quantidade deve ser maior que zero');
      }
    }
  }

  toggleAvatarAvailability(): void {
    if (!this.selectedAvatar) return;
    
    const isAvailable = this.isAvatarAvailable(this.selectedAvatar.id);
    if (isAvailable) {
      this.avatarService.lockAvatar(this.selectedAvatar.id);
      this.showNotification('success', 'Avatar bloqueado com sucesso!');
    } else {
      this.avatarService.unlockAvatar(this.selectedAvatar.id);
      this.showNotification('success', 'Avatar desbloqueado com sucesso!');
    }
  }
} 