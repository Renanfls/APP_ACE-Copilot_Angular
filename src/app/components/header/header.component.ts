import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matClose,
  matDarkMode,
  matLightMode,
  matMoreVert,
  matNotificationsNone,
  matPerson,
} from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HlmButtonDirective, NgIconComponent, CommonModule, RouterModule],
  viewProviders: [
    provideIcons({
      matNotificationsNone,
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
      <div class="flex items-center text-white">
        <button
          hlmBtn
          variant="ghost"
          class="rounded-full md:h-14 relative"
          [ngClass]="{
            'bg-sidebar': isDarkMode(),
            'bg-[#242427]': !isDarkMode()
          }"
        >
          <span
            class="font-bold text-xs bg-red-500 px-2 md:px-3 py-1 rounded-full absolute me-16 md:mt-4 lg:mt-0"
            >2</span
          >
          <ng-icon name="matNotificationsNone" class="text-2xl" />
        </button>
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
          <button hlmBtn variant="ghost" class="p-2" (click)="toggleDarkMode()">
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
    `,
  ],
})
export class HeaderComponent implements OnInit {
  private document = inject(DOCUMENT);

  isSidebarOpen = signal(false);
  isDarkMode = signal(false);

  ngOnInit() {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      this.enableDarkMode();
    } else if (savedMode === 'false') {
      this.disableDarkMode();
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      if (prefersDark) {
        this.enableDarkMode();
      }
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleSidebar() {
    this.isSidebarOpen.update((value) => !value);

    // Prevent scrolling when sidebar is open
    if (this.isSidebarOpen()) {
      this.document.body.classList.add('overflow-hidden');
    } else {
      this.document.body.classList.remove('overflow-hidden');
    }
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
    this.document.body.classList.remove('overflow-hidden');
  }

  toggleDarkMode() {
    if (this.isDarkMode()) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode() {
    this.isDarkMode.set(true);
    this.document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  }

  disableDarkMode() {
    this.isDarkMode.set(false);
    this.document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    this.closeSidebar();
  }

  @HostListener('window:resize')
  handleResize() {
    if (window.innerWidth > 1024 && this.isSidebarOpen()) {
      this.closeSidebar();
    }
  }
}
