import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matNotificationsNone } from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HlmButtonDirective,
    NgIconComponent,
    CommonModule,
    RouterModule
  ],
  viewProviders: [provideIcons({ matNotificationsNone })],
  template: `
    <header class="w-full py-8 px-8 md:px-20 flex items-center justify-between fixed z-50" style="background-color: #141416;">
      <button hlmBtn variant="ghost" class="p-4 py-3">
        <img class="h-6 md:rotate-90" src="assets/Menu.svg" alt="Icone Menu">
      </button>
      <button hlmBtn variant="ghost" routerLink="/home" (click)="scrollToTop()" class="p-0">
        <img class="h-10
        " src="assets/Logo_AceCopilot 1.png" alt="Logo da ACE Copilot">
      </button>
      <div class="flex items-center text-white">
        <button hlmBtn variant="default" class="rounded-full md:h-14 relative" style="background-color: #242427;">
          <span class="font-bold text-xs bg-red-500 px-2 md:px-3 py-1 rounded-full absolute me-16 md:mt-4 lg:mt-0">2</span>
          <ng-icon name="matNotificationsNone" style="font-size: 24px;" />
        </button>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}
