import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { matHome } from '@ng-icons/material-icons/baseline';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  viewProviders: [provideIcons({ matHome })],
  imports: [RouterModule,],
  template: `
    <footer class="container py-3 flex items-center justify-evenly z-40 relative text-xs md:text-sm font-bold">
      <div class="py-6 flex items-center justify-evenly w-full fixed bottom-0" style="background-color: #141416;">
        <button hlmBtn variant="ghost" routerLink="/home" (click)="scrollToTop()" class="flex flex-col justify-center items-center h-14 hover:opacity-100 focus:opacity-100 opacity-25">
          <img class="h-6 md:h-8" src="assets/home.svg" alt="Icone Home">
          <small class="mt-2 md:mt-3">Home</small>
        </button>
        <button hlmBtn variant="ghost" routerLink="/as-no-ace" (click)="scrollToTop()" class="flex flex-col justify-center items-center h-14 hover:opacity-100 focus:opacity-100 opacity-25">
          <img class="h-6 md:h-8" src="assets/Vector (1).svg" alt="Icone Home">  
          <small class="mt-2 md:mt-3">Ás no ACE</small>
        </button>
        <button hlmBtn variant="ghost" (click)="scrollToTop()" class="flex flex-col justify-center items-center h-14 focus:opacity-100 hover:opacity-100 opacity-25">
          <img class="h-6 md:h-8" src="assets/animated_images (1).svg" alt="Icone Home"> 
          <small class="mt-2 md:mt-3">Treinamento</small>
        </button>
        <button hlmBtn variant="ghost" (click)="scrollToTop()" class="flex flex-col justify-center items-center h-14 focus:opacity-100 hover:opacity-100 opacity-25">
          <img class="h-6 md:h-8" src="assets/Medalha.svg" alt="Icone Home"> 
          <small class="mt-2 md:mt-3">Ranking</small>
        </button>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}
