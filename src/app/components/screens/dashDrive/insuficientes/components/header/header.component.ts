import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matNotificationsNone } from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HlmButtonDirective, NgIconComponent, CommonModule, RouterModule],
  viewProviders: [provideIcons({ matNotificationsNone })],
  template: `
    <header
      class="w-full py-4 px-8 md:px-20 flex items-center justify-between fixed z-50"
      style="background-color: #141416;"
    >
      <div class="flex items-center">
        <img
          class="h-7"
          src="assets/Logo_AceCopilot 1.png"
          alt="Logo da ACE Copilot"
        />
        <h1 class="text-1xl 2xl:text-2xl ms-3 font-semibold text-white">
          DashDrive
        </h1>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
