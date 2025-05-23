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
      <div class="relative">
        <img
          class="h-72 w-72 animate-pulse-slow"
          src="assets/Logo_.png"
          alt="Logo da ACE Copilot"
        />
        <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32">
          <div class="w-full bg-gray-700 rounded-full h-1.5">
            <div class="bg-amber-400 h-1.5 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
      <h2 class="text-3xl mt-8 font-bold text-white animate-fade-in-up">Carregando...</h2>
      <h3 class="text-2xl mt-2 font-bold text-amber-400 animate-fade-in-up-delay">{{ nextPageTitle }}</h3>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in;
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.8s ease-out;
    }

    .animate-fade-in-up-delay {
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .animate-pulse-slow {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes fadeIn {
      from { 
        opacity: 0;
      }
      to { 
        opacity: 1;
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: .8;
        transform: scale(0.95);
      }
    }

    @keyframes loadingBar {
      0% {
        width: 0%;
        opacity: 1;
      }
      50% {
        width: 100%;
        opacity: 0.5;
      }
      100% {
        width: 0%;
        opacity: 1;
      }
    }

    .animate-loading-bar {
      animation: loadingBar 3.25s ease-in-out infinite;
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