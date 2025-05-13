import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    this.loadThemePreference();
  }

  private loadThemePreference() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      this.enableDarkMode();
    } else if (savedMode === 'false') {
      this.disableDarkMode();
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        this.enableDarkMode();
      }
    }
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
    document.documentElement.classList.add('dark');
    localStorage.setItem('darkMode', 'true');
  }

  disableDarkMode() {
    this.isDarkMode.set(false);
    document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', 'false');
  }
} 