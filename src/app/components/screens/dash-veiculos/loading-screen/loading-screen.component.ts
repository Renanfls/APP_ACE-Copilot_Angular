// loading-screen.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      *ngIf="showLoading" 
      class="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center z-[9999] animate-fade-in"
      style="background-color: #141416;"
    >
      <img
        class="h-3/12 w-3/12 animate-pulse"
        src="assets/Logo_.png"
        alt="Logo da ACE Copilot"
      />
      <h2 class="text-4xl mt-2 font-bold text-white">Carregando...</h2>
      <h3 class="text-4xl mt-4 pe-4 font-bold text-amber-400">{{ nextPageTitle }}</h3>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class LoadingScreenComponent implements OnChanges {
  @Input() showLoading = false;
  @Input() nextPageTitle = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showLoading']) {
      console.log('🔄 Loading screen visibility changed:', this.showLoading);
    }
    if (changes['nextPageTitle']) {
      console.log('🔄 Next page title changed:', this.nextPageTitle);
    }
  }
}