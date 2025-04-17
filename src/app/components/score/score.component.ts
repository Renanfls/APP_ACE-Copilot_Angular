import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matArrowDownward,
  matArrowBackIos,
  matArrowForwardIos,
  matArrowUpward,
  matHelp,
  matWorkspacePremium,
} from '@ng-icons/material-icons/baseline';
import { CardTurnoComponent } from '../card-turno.component';
import { GaugeComponent } from '../gauge/gauge.component';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent,
    GaugeComponent,
    CardTurnoComponent,
  ],
  templateUrl: './score.component.html',
  styleUrl: './score.component.css',
  viewProviders: [
    provideIcons({
      matArrowBackIos,
      matArrowForwardIos,
      matArrowDownward,
      matHelp,
      matWorkspacePremium,
      matArrowUpward,
    }),
  ],
})
export class ScoreComponent implements OnInit {
  currentIndex = 0;
  currentTranslate = 0;
  itemWidth = 0;
  itemsPerView = 1;
  totalItems = 4; // Total de cards no carousel

  ngOnInit() {
    this.updateLayout();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateLayout();
  }

  updateLayout() {
    const viewportWidth = window.innerWidth;
    
    if (viewportWidth >= 1024) { // lg
      this.itemsPerView = 4;
    } else if (viewportWidth >= 768) { // md
      this.itemsPerView = 3;
    } else if (viewportWidth >= 640) { // sm
      this.itemsPerView = 2;
    } else {
      this.itemsPerView = 1;
    }
    
    // Encontre o container do carousel e calcule a largura do item
    const container = document.querySelector('.carousel-container');
    if (container) {
      const containerWidth = container.clientWidth;
      this.itemWidth = containerWidth / this.itemsPerView;
      
      // Ajustar a posição atual para não ficar com espaço vazio à direita
      const maxIndex = Math.max(0, this.totalItems - this.itemsPerView);
      if (this.currentIndex > maxIndex) {
        this.currentIndex = maxIndex;
      }
      
      this.updateCarousel();
    }
  }

  updateCarousel() {
    this.currentTranslate = this.currentIndex * this.itemWidth;
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  nextSlide() {
    const maxIndex = Math.max(0, this.totalItems - this.itemsPerView);
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }
}
