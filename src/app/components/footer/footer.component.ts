import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matHome } from '@ng-icons/material-icons/baseline';

@Component({
  selector: 'app-footer',
  standalone: true,
  viewProviders: [provideIcons({ matHome })],
  imports: [NgIconComponent],
  template: `
    <footer class="container py-3 mt-44 flex items-center justify-evenly z-50 relative">
      <div class="py-6 flex items-center justify-evenly w-full fixed bottom-0" style="background-color: #141416;">
        <button hlmBtn variant="default" class="flex flex-col justify-center items-center rounded-full h-14 focus:opacity-100 opacity-25">
          <img class="h-6 md:h-8" src="assets/home.png" alt="Icone Home">
          <small class="text-sm font-bold mt-3">Home</small>
        </button>
        <button hlmBtn variant="default" class="flex flex-col justify-center items-center rounded-full h-14 focus:opacity-100 opacity-25">
          <img class="h-6 md:h-8" src="assets/Cartas.png" alt="Icone Home">  
          <small class="text-sm font-bold mt-3">Ás no ACE</small>
        </button>
        <button hlmBtn variant="default" class="flex flex-col justify-center items-center rounded-full h-14 focus:opacity-100 opacity-25">
          <img class="h-6 md:h-8" src="assets/play.png" alt="Icone Home"> 
          <small class="text-sm font-bold mt-3">Treinamento</small>
        </button>
        <button hlmBtn variant="default" class="flex flex-col justify-center items-center rounded-full h-14 focus:opacity-100 opacity-25">
          <img class="h-6 md:h-8" src="assets/Medalha.png" alt="Icone Home"> 
          <small class="text-sm font-bold mt-3">Ranking</small>
        </button>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
