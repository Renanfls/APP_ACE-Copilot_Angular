import { Injectable } from '@angular/core';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, expiresInMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: expiresInMinutes * 60 * 1000
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.expiresIn;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  generateCacheKey(params: any): string {
    const orderedParams = Object.keys(params)
      .sort()
      .reduce((obj: any, key: string) => {
        obj[key] = params[key];
        return obj;
      }, {});
    return JSON.stringify(orderedParams);
  }
} 