import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ALL_AVATARS, FREE_AVATARS, UserAvatar } from '../interfaces/avatar.interface';
import { CouponService } from './coupon.service';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private userAvatars = new BehaviorSubject<UserAvatar[]>([]);
  private selectedAvatar = new BehaviorSubject<UserAvatar | null>(null);

  constructor(private couponService: CouponService) {
    this.loadSavedState();
  }

  // Carregar estado salvo
  private loadSavedState(): void {
    // Carregar avatares do usuário
    const savedAvatars = localStorage.getItem('userAvatars');
    if (savedAvatars) {
      const parsedAvatars = JSON.parse(savedAvatars);
      // Garantir que todos os avatares gratuitos estejam disponíveis
      const freeAvatars = FREE_AVATARS.filter(avatar => 
        !parsedAvatars.some((userAvatar: UserAvatar) => userAvatar.id === avatar.id)
      ).map(avatar => ({
        ...avatar,
        purchasedAt: new Date()
      }));
      
      // Remover avatares premium e custom que não foram comprados
      const validAvatars = parsedAvatars.filter((avatar: UserAvatar) => {
        const isAvatar = ALL_AVATARS.find(a => a.id === avatar.id);
        return isAvatar && (isAvatar.type === 'free' || avatar.purchasedAt);
      });
      
      this.userAvatars.next([...validAvatars, ...freeAvatars]);
    } else {
      // Inicializar apenas com avatares gratuitos
      const freeAvatars = FREE_AVATARS.map(avatar => ({
        ...avatar,
        purchasedAt: new Date()
      }));
      this.userAvatars.next(freeAvatars);
      this.saveUserAvatars();
    }

    // Carregar avatar selecionado
    const savedSelectedAvatar = localStorage.getItem('selectedAvatar');
    if (savedSelectedAvatar) {
      const selectedAvatar = JSON.parse(savedSelectedAvatar);
      // Verificar se o avatar selecionado ainda está disponível
      if (this.isAvatarAvailable(selectedAvatar.id)) {
        this.selectedAvatar.next(selectedAvatar);
      } else if (this.userAvatars.value.length > 0) {
        // Se não estiver disponível, selecionar o primeiro avatar gratuito
        this.selectedAvatar.next(this.userAvatars.value[0]);
        this.saveSelectedAvatar();
      }
    } else if (this.userAvatars.value.length > 0) {
      this.selectedAvatar.next(this.userAvatars.value[0]);
      this.saveSelectedAvatar();
    }
  }

  // Getters como Observables
  getUserAvatars(): Observable<UserAvatar[]> {
    return this.userAvatars.asObservable();
  }

  getAvailableCoupons(): Observable<number> {
    return this.couponService.getAvailableCoupons();
  }

  getSelectedAvatar(): Observable<UserAvatar | null> {
    return this.selectedAvatar.asObservable();
  }

  // Método para resetar o perfil do usuário
  resetUserProfile(): void {
    // Remover todos os dados salvos
    localStorage.removeItem('userAvatars');
    localStorage.removeItem('selectedAvatar');

    // Inicializar apenas com avatares gratuitos
    const freeAvatars = FREE_AVATARS.map(avatar => ({
      ...avatar,
      purchasedAt: new Date()
    }));

    // Atualizar os avatares do usuário
    this.userAvatars.next(freeAvatars);
    
    // Selecionar o primeiro avatar gratuito
    if (freeAvatars.length > 0) {
      this.selectedAvatar.next(freeAvatars[0]);
    } else {
      this.selectedAvatar.next(null);
    }

    // Salvar o novo estado
    this.saveUserAvatars();
    this.saveSelectedAvatar();
  }

  // Métodos para manipular avatares
  purchaseAvatar(avatarId: string): boolean {
    const avatar = ALL_AVATARS.find(a => a.id === avatarId);
    if (!avatar || !avatar.price) return false;

    if (!this.couponService.useCoupons(avatar.price)) return false;

    const newUserAvatar: UserAvatar = {
      ...avatar,
      purchasedAt: new Date()
    };

    const currentAvatars = this.userAvatars.value;
    this.userAvatars.next([...currentAvatars, newUserAvatar]);
    this.saveUserAvatars();

    return true;
  }

  selectAvatar(avatarId: string): boolean {
    const avatar = this.userAvatars.value.find(a => a.id === avatarId);
    if (!avatar) return false;

    this.selectedAvatar.next(avatar);
    this.saveSelectedAvatar();
    return true;
  }

  // Verificar se um avatar está disponível para o usuário
  isAvatarAvailable(avatarId: string): boolean {
    return this.userAvatars.value.some(avatar => avatar.id === avatarId);
  }

  // Obter preço de um avatar
  getAvatarPrice(avatarId: string): number | null {
    const avatar = ALL_AVATARS.find(a => a.id === avatarId);
    return avatar?.price || null;
  }

  private saveUserAvatars(): void {
    localStorage.setItem('userAvatars', JSON.stringify(this.userAvatars.value));
  }

  private saveSelectedAvatar(): void {
    localStorage.setItem('selectedAvatar', JSON.stringify(this.selectedAvatar.value));
  }
} 