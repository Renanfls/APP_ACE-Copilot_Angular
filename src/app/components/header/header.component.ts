import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matClose,
  matDarkMode,
  matLightMode,
  matMoreVert,
  matNotificationsActive,
  matNotificationsNone,
  matPerson,
} from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';
import { ThemeService } from '../../services/theme.service';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HlmButtonDirective, NgIconComponent, CommonModule, RouterModule],
  viewProviders: [
    provideIcons({
      matNotificationsNone,
      matNotificationsActive,
      matDarkMode,
      matLightMode,
      matClose,
      matPerson,
      matMoreVert
    }),
  ],
  template: `
    <header
      class="w-full py-8 pe-8 md:px-20 flex items-center justify-between fixed z-50"
      [ngClass]="{ 'bg-[#141416]': isDarkMode(), 'bg-white': !isDarkMode() }"
    >
      <button hlmBtn variant="ghost" class="p-4 py-3" (click)="toggleSidebar()">
        <ng-icon name="matMoreVert" class="text-4xl h-6 md:rotate-90" />
      </button>
      <button
        hlmBtn
        variant="ghost"
        routerLink="/home"
        (click)="scrollToTop()"
        class="p-0"
      >
        <img
          class="h-10"
          src="assets/Logo_AceCopilot 1.png"
          alt="Logo da ACE Copilot"
        />
      </button>
      <div class="flex items-center text-white gap-4">
        <div class="relative">
          <button
            hlmBtn
            variant="ghost"
            class="rounded-full md:h-14 relative"
            [ngClass]="{
              'bg-sidebar': isDarkMode(),
              'bg-[#242427]': !isDarkMode(),
              'opacity-50': !areNotificationsEnabled
            }"
            (click)="toggleNotifications()"
          >
            <span
              *ngIf="unreadNotifications > 0 && areNotificationsEnabled"
              class="font-bold text-xs bg-red-500 px-2 md:px-3 py-1 rounded-full absolute -top-2 -right-2"
              >{{ unreadNotifications }}</span
            >
            <ng-icon
              [name]="areNotificationsEnabled ? (unreadNotifications > 0 ? 'matNotificationsActive' : 'matNotificationsNone') : 'matNotificationsNone'"
              class="text-2xl"
              [class.text-amber-400]="unreadNotifications > 0 && areNotificationsEnabled"
            />
          </button>

          <!-- Notifications Dropdown -->
          <div
            *ngIf="showNotifications && areNotificationsEnabled"
            class="absolute right-0 mt-2 w-80 bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden z-50"
            (clickOutside)="closeNotifications()"
          >
            <div class="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 class="text-lg font-semibold">Notificações</h3>
              <button
                hlmBtn
                variant="ghost"
                class="text-xs text-amber-400 hover:text-amber-500"
                (click)="markAllAsRead()"
              >
                Marcar todas como lidas
              </button>
            </div>
            <div class="max-h-96 overflow-y-auto">
              <div *ngIf="notifications.length === 0" class="p-4 text-center text-gray-400">
                Nenhuma notificação
              </div>
              <div
                *ngFor="let notification of notifications"
                class="p-4 border-b border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer"
                [class.opacity-60]="notification.read"
                (click)="handleNotificationClick(notification)"
              >
                <div class="flex items-start gap-3">
                  <div
                    class="w-2 h-2 rounded-full mt-2"
                    [ngClass]="{
                      'bg-amber-400': notification.type === 'warning',
                      'bg-red-500': notification.type === 'error',
                      'bg-blue-500': notification.type === 'info'
                    }"
                  ></div>
                  <div class="flex-1">
                    <h4 class="font-medium" [class.text-amber-400]="!notification.read">
                      {{ notification.title }}
                    </h4>
                    <p class="text-sm text-gray-400 mt-1">{{ notification.message }}</p>
                    <span class="text-xs text-gray-500 mt-2 block">
                      {{ notification.timestamp | date:'dd/MM/yyyy HH:mm' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-3 bg-[#242427] text-center">
              <button
                hlmBtn
                variant="ghost"
                class="text-sm text-amber-400 hover:text-amber-500"
                routerLink="/notifications"
                (click)="closeNotifications()"
              >
                Ver todas as notificações
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar Overlay -->
    <div
      *ngIf="isSidebarOpen()"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
      (click)="closeSidebar()"
      (keydown.escape)="closeSidebar()"
      tabindex="0"
      role="button"
      aria-label="Close sidebar"
    ></div>

    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 md:w-80 transform transition-transform duration-300 ease-in-out"
      [ngClass]="{
        'translate-x-0': isSidebarOpen(),
        '-translate-x-full': !isSidebarOpen(),
        'bg-[#141416] text-white': isDarkMode(),
        'bg-white text-gray-900': !isDarkMode()
      }"
    >
      <div
        class="flex justify-between items-center p-4 border-b"
        [ngClass]="{
          'border-gray-700': isDarkMode(),
          'border-gray-200': !isDarkMode()
        }"
      >
        <div class="flex items-center space-x-4">
          <div class="relative">
            <ng-icon name="matPerson" style="font-size: 24px;" />
            <span
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2"
              [ngClass]="{
                'border-gray-900': isDarkMode(),
                'border-white': !isDarkMode()
              }"
            ></span>
          </div>
          <div>
            <p class="font-medium">Anabelle</p>
            <p class="text-sm opacity-70">Fase: Ouro</p>
          </div>
        </div>
        <button hlmBtn variant="ghost" class="p-2" (click)="closeSidebar()">
          <ng-icon name="matClose" class="text-xl" />
        </button>
      </div>

      <div class="p-4 flex flex-col justify-between">
        <nav class="space-y-2">
          <a
            routerLink="/home"
            (click)="scrollToTop(); closeSidebar()"
            class="block p-3 rounded-lg transition-colors"
            [ngClass]="{
              'hover:bg-gray-800': isDarkMode(),
              'hover:bg-gray-100': !isDarkMode()
            }"
          >
            Home
          </a>
          <a
            routerLink="/as-no-ace"
            (click)="scrollToTop(); closeSidebar()"
            class="block p-3 rounded-lg transition-colors"
            [ngClass]="{
              'hover:bg-gray-800': isDarkMode(),
              'hover:bg-gray-100': !isDarkMode()
            }"
          >
            Game
          </a>
          <a
            routerLink="/profile"
            (click)="scrollToTop(); closeSidebar()"
            class="block p-3 rounded-lg transition-colors"
            [ngClass]="{
              'hover:bg-gray-800': isDarkMode(),
              'hover:bg-gray-100': !isDarkMode()
            }"
          >
            Perfil
          </a>
          <a
            routerLink="/logout"
            (click)="scrollToTop(); closeSidebar()"
            class="block p-3 rounded-lg transition-colors"
            [ngClass]="{
              'hover:bg-gray-800': isDarkMode(),
              'hover:bg-gray-100': !isDarkMode()
            }"
          >
            Sair
          </a>
        </nav>
        <div
          class="flex items-center justify-between p-2 mb-4 rounded-lg"
          [ngClass]="{
            'bg-gray-800': isDarkMode(),
            'bg-gray-100': !isDarkMode()
          }"
        >
          <span>Tema</span>
          <button 
            hlmBtn 
            variant="ghost" 
            class="p-2" 
            (click)="toggleDarkMode()"
            [ngClass]="{
              'text-amber-400': isDarkMode(),
              'text-gray-900': !isDarkMode()
            }"
          >
            <ng-icon
              [name]="isDarkMode() ? 'matLightMode' : 'matDarkMode'"
              class="text-xl"
            />
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .notifications-dropdown {
        max-height: calc(100vh - 200px);
      }
    `,
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private document = inject(DOCUMENT);
  private router = inject(Router);
  private routerSubscription: Subscription | undefined;

  isSidebarOpen = signal(false);
  isDarkMode;
  showNotifications = false;
  notifications: Notification[] = [
    {
      id: 1,
      title: 'Alerta de Velocidade',
      message: 'Veículo 51540 ultrapassou o limite de velocidade',
      type: 'warning',
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      title: 'Manutenção Preventiva',
      message: 'Agendamento de manutenção para o veículo 51542',
      type: 'info',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    }
  ];

  constructor(
    private themeService: ThemeService,
    private notificationService: NotificationService
  ) {
    this.isDarkMode = this.themeService.isDarkMode;
  }

  get areNotificationsEnabled(): boolean {
    return this.notificationService.isNotificationsEnabled();
  }

  get unreadNotifications(): number {
    return this.areNotificationsEnabled 
      ? this.notifications.filter(n => !n.read).length 
      : 0;
  }

  ngOnInit() {
    // Subscribe to router events to close sidebar on navigation
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeSidebar();
      this.closeNotifications();
      this.scrollToTop();
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleNotifications() {
    if (this.areNotificationsEnabled) {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.closeSidebar();
      }
    }
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }

  handleNotificationClick(notification: Notification) {
    notification.read = true;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Força o scroll para o topo mesmo que a navegação seja na mesma rota
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  toggleSidebar() {
    this.isSidebarOpen.update(value => !value);
    if (this.isSidebarOpen()) {
      this.closeNotifications();
      this.document.body.classList.add('overflow-hidden');
    } else {
      this.document.body.classList.remove('overflow-hidden');
    }
  }

  closeSidebar() {
    if (this.isSidebarOpen()) {
      this.isSidebarOpen.set(false);
      this.document.body.classList.remove('overflow-hidden');
    }
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    this.closeSidebar();
    this.closeNotifications();
  }

  @HostListener('window:resize')
  handleResize() {
    if (window.innerWidth > 1024) {
      this.closeSidebar();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notifications-dropdown') && !target.closest('button')) {
      this.closeNotifications();
    }
  }
}
