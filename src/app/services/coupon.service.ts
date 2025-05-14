import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CouponStats {
  total: number;
  available: number;
  used: number;
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private couponStats = new BehaviorSubject<CouponStats>({
    total: 0,
    available: 0,
    used: 0
  });

  constructor() {
    this.loadCouponStats();
  }

  private loadCouponStats() {
    const savedStats = localStorage.getItem('couponStats');
    if (savedStats) {
      this.couponStats.next(JSON.parse(savedStats));
    } else {
      // Valores iniciais
      const initialStats: CouponStats = {
        total: 15,
        available: 10,
        used: 5
      };
      this.couponStats.next(initialStats);
      this.saveCouponStats();
    }
  }

  private saveCouponStats() {
    localStorage.setItem('couponStats', JSON.stringify(this.couponStats.value));
  }

  getCouponStats(): Observable<CouponStats> {
    return this.couponStats.asObservable();
  }

  getAvailableCoupons(): Observable<number> {
    return new Observable<number>(observer => {
      this.couponStats.subscribe(stats => {
        observer.next(stats.available);
      });
    });
  }

  addCoupons(amount: number) {
    const currentStats = this.couponStats.value;
    const newStats = {
      ...currentStats,
      total: currentStats.total + amount,
      available: currentStats.available + amount
    };
    this.couponStats.next(newStats);
    this.saveCouponStats();
  }

  useCoupons(amount: number): boolean {
    const currentStats = this.couponStats.value;
    if (currentStats.available < amount) {
      return false;
    }

    const newStats = {
      ...currentStats,
      available: currentStats.available - amount,
      used: currentStats.used + amount
    };
    this.couponStats.next(newStats);
    this.saveCouponStats();
    return true;
  }

  // Método para recompensar tarefas diárias
  rewardDailyTasks(amount: number = 1) {
    this.addCoupons(amount);
  }
} 