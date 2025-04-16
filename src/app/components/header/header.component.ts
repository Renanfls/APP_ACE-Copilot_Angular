import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matNotificationsNone } from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HlmButtonDirective,
    NgIconComponent,
    CommonModule,
  ],
  viewProviders: [provideIcons({ matNotificationsNone })],
  template: `
    <header class="container pt-24 pb-12 flex items-center justify-between">
      <a href="#">
        <img class="h-8" src="assets/Group 54.png" alt="Icone Menu">
      </a>
      <img class="h-12 ms-10
      " src="assets/Logo_AceCopilot 1.png" alt="Logo da ACE Copilot">
      <div class="flex items-center text-white">
        <a href="#">
          <span class="font-bold bg-red-500 px-3 py-1 rounded-full absolute mt-3">08</span>
          <button hlmBtn variant="default" class="rounded-full h-14 ms-8" style="background-color: #242427;">
            <ng-icon name="matNotificationsNone" style="font-size: 24px;" />
          </button>
        </a>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
