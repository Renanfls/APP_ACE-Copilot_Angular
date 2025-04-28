// loading-screen.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="showLoading" 
      class="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-[100]"
      style="background-color: #141416;"
    >
      <img
        class="h-3/12 w-3/12"
        src="assets/Logo_.png"
        alt="Logo da ACE Copilot"
      />
      <h2 class="text-4xl mt-2 font-bold text-white">Carregando...</h2>
      <h3 class="text-4xl mt-4 pe-4 font-bold text-amber-400">{{ nextPageTitle }}</h3>
    </div>
  `
})
export class LoadingScreenComponent {
  @Input() showLoading = false;
  @Input() nextPageTitle = '';
}