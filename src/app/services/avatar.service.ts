import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ALL_AVATARS, FREE_AVATARS, UserAvatar } from '../interfaces/avatar.interface';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private availableCoupons = new BehaviorSubject<number>(0);
  private userAvatars = new BehaviorSubject<UserAvatar[]>([]);
  private selectedAvatar = new BehaviorSubject<UserAvatar | null>(null);
  private lockedAvatars = new Set<string>();

  constructor() {
    // Initialize from localStorage
    const savedCoupons = localStorage.getItem('availableCoupons');
    if (savedCoupons) {
      this.availableCoupons.next(Number(savedCoupons));
    }

    // Initialize user avatars with free avatars
    this.initializeUserAvatars();
  }

  private initializeUserAvatars(): void {
    // Get saved avatars from localStorage
    const savedAvatars = localStorage.getItem('userAvatars');
    let userAvatars: UserAvatar[] = [];
    
    if (savedAvatars) {
      userAvatars = JSON.parse(savedAvatars);
    }

    // Add free avatars if they're not already in the user's collection
    const freeAvatars = FREE_AVATARS.map(avatar => ({
      ...avatar,
      purchasedAt: new Date()
    }));

    // Filter out any duplicates
    const existingFreeAvatarIds = new Set(userAvatars.map(a => a.id));
    const missingFreeAvatars = freeAvatars.filter(a => !existingFreeAvatarIds.has(a.id));
    
    // Combine existing avatars with missing free ones
    const allAvatars = [...userAvatars, ...missingFreeAvatars];
    this.userAvatars.next(allAvatars);
    localStorage.setItem('userAvatars', JSON.stringify(allAvatars));

    // Initialize selected avatar
    const selectedAvatarId = localStorage.getItem('selectedAvatarId');
    if (selectedAvatarId) {
      const avatar = allAvatars.find(a => a.id === selectedAvatarId);
      if (avatar) {
        this.selectedAvatar.next(avatar);
      } else if (allAvatars.length > 0) {
        // If selected avatar not found, default to first free avatar
        this.selectedAvatar.next(allAvatars[0]);
        localStorage.setItem('selectedAvatarId', allAvatars[0].id);
      }
    } else if (allAvatars.length > 0) {
      // If no avatar selected, default to first free avatar
      this.selectedAvatar.next(allAvatars[0]);
      localStorage.setItem('selectedAvatarId', allAvatars[0].id);
    }

    // Load locked avatars
    const lockedAvatarsStr = localStorage.getItem('lockedAvatars');
    if (lockedAvatarsStr) {
      const lockedAvatarsArray = JSON.parse(lockedAvatarsStr);
      this.lockedAvatars = new Set(lockedAvatarsArray);
    }
  }

  // Getters como Observables
  getUserAvatars(): Observable<UserAvatar[]> {
    return this.userAvatars.asObservable();
  }

  getSelectedAvatar(): Observable<UserAvatar | null> {
    return this.selectedAvatar.asObservable();
  }

  getAvailableCoupons(): Observable<number> {
    return this.availableCoupons.asObservable();
  }

  // Método para resetar o perfil do usuário
  resetUserProfile(): void {
    // Reset to default free avatars
    const defaultAvatars = FREE_AVATARS.map(avatar => ({
      ...avatar,
      purchasedAt: new Date()
    }));
    
    this.userAvatars.next(defaultAvatars);
    this.selectedAvatar.next(defaultAvatars[0]);
    localStorage.setItem('userAvatars', JSON.stringify(defaultAvatars));
    localStorage.setItem('selectedAvatarId', defaultAvatars[0].id);

    // Reset coupons
    this.availableCoupons.next(0);
    localStorage.setItem('availableCoupons', '0');
  }

  // Verificar se um avatar está disponível para o usuário
  isAvatarAvailable(avatarId: string): boolean {
    // Free avatars are always available
    if (FREE_AVATARS.some(avatar => avatar.id === avatarId)) {
      return true;
    }
    
    // Admin-locked avatars are not available
    if (this.lockedAvatars.has(avatarId)) {
      return false;
    }
    
    // Check if user owns the avatar
    return this.userAvatars.value.some(avatar => avatar.id === avatarId);
  }

  // Selecionar um avatar
  selectAvatar(avatarId: string): boolean {
    const avatar = this.userAvatars.value.find(a => a.id === avatarId);
    if (avatar) {
      this.selectedAvatar.next(avatar);
      localStorage.setItem('selectedAvatarId', avatarId);
      return true;
    }
    return false;
  }

  // Comprar um avatar
  purchaseAvatar(avatarId: string): boolean {
    // Check if avatar is already owned
    const avatar = this.userAvatars.value.find(a => a.id === avatarId);
    if (avatar) {
      return false; // Already owned
    }

    // Free avatars don't need to be purchased
    if (FREE_AVATARS.some(a => a.id === avatarId)) {
      const freeAvatar = FREE_AVATARS.find(a => a.id === avatarId)!;
      const newUserAvatar: UserAvatar = {
        ...freeAvatar,
        purchasedAt: new Date()
      };
      const newUserAvatars = [...this.userAvatars.value, newUserAvatar];
      this.userAvatars.next(newUserAvatars);
      localStorage.setItem('userAvatars', JSON.stringify(newUserAvatars));
      return true;
    }

    // Check if avatar exists and has a price
    const avatarToPurchase = ALL_AVATARS.find(a => a.id === avatarId);
    if (!avatarToPurchase || !avatarToPurchase.price) {
      return false;
    }

    // Check if user has enough coupons
    if (this.availableCoupons.value < avatarToPurchase.price) {
      return false;
    }

    // Deduct coupons and add avatar to user's collection
    this.availableCoupons.next(this.availableCoupons.value - avatarToPurchase.price);
    localStorage.setItem('availableCoupons', this.availableCoupons.value.toString());

    const newUserAvatar: UserAvatar = {
      ...avatarToPurchase,
      purchasedAt: new Date()
    };

    const newUserAvatars = [...this.userAvatars.value, newUserAvatar];
    this.userAvatars.next(newUserAvatars);
    localStorage.setItem('userAvatars', JSON.stringify(newUserAvatars));

    return true;
  }

  // Adicionar cupons
  addCoupons(amount: number): void {
    if (amount > 0) {
      this.availableCoupons.next(this.availableCoupons.value + amount);
      localStorage.setItem('availableCoupons', this.availableCoupons.value.toString());
    }
  }

  // Bloquear/Desbloquear avatares (apenas admin)
  lockAvatar(avatarId: string): void {
    // Não permite bloquear avatares gratuitos
    if (FREE_AVATARS.some(avatar => avatar.id === avatarId)) {
      return;
    }
    this.lockedAvatars.add(avatarId);
    localStorage.setItem('lockedAvatars', JSON.stringify(Array.from(this.lockedAvatars)));
  }

  unlockAvatar(avatarId: string): void {
    this.lockedAvatars.delete(avatarId);
    localStorage.setItem('lockedAvatars', JSON.stringify(Array.from(this.lockedAvatars)));
  }
} 