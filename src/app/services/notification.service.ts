import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsEnabled = signal(true);

  constructor() {
    this.loadNotificationPreference();
  }

  private loadNotificationPreference() {
    const savedPreference = localStorage.getItem('notificationsEnabled');
    if (savedPreference === 'false') {
      this.notificationsEnabled.set(false);
    }
  }

  isNotificationsEnabled() {
    return this.notificationsEnabled();
  }

  enableNotifications() {
    this.notificationsEnabled.set(true);
    localStorage.setItem('notificationsEnabled', 'true');
  }

  disableNotifications() {
    this.notificationsEnabled.set(false);
    localStorage.setItem('notificationsEnabled', 'false');
  }

  toggleNotifications() {
    if (this.notificationsEnabled()) {
      this.disableNotifications();
    } else {
      this.enableNotifications();
    }
  }
} 