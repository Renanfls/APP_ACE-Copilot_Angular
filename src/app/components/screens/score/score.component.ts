import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
    matArrowBackIos,
    matArrowDownward,
    matArrowForwardIos,
    matArrowUpward,
    matCalendarMonth,
    matWorkHistory,
    matWorkspacePremium,
} from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { StatisticComponent } from '../../statistic/statistic.component';
import { CardTurnoComponent } from '../../turno/card-turno.component';

interface Turno {
  kmlAnterior: number;
  kmlAtual: number;
  giro: number;
  freio: number;
  pedal: number;
  placa: string;
  linha: string;
  turno: string;
  data: string;
}

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent,
    CardTurnoComponent,
    StatisticComponent,
    HlmButtonDirective,
    HeaderComponent,
    FooterComponent,
    FormsModule
  ],
  templateUrl: './score.component.html',
  styleUrl: './score.component.css',
  viewProviders: [
    provideIcons({
      matArrowBackIos,
      matArrowForwardIos,
      matArrowDownward,
      matWorkspacePremium,
      matArrowUpward,
      matCalendarMonth,
      matWorkHistory
    }),
  ],
})
export class ScoreComponent implements OnInit, AfterViewInit {
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;
  
  currentIndex = 0;
  itemWidth = 280;
  gapWidth = 12;
  totalItems = 5;
  private scrollTimeout: any;
  private isScrolling = false;
  currentDate = this.formatDate(new Date());
  selectedDate = new Date().toISOString().split('T')[0];
  maxDate = new Date().toISOString().split('T')[0];
  isDarkMode = document.documentElement.classList.contains('dark');
  
  // Array com todos os turnos
  allTurnos: Turno[] = [
    {
      kmlAnterior: 2.51,
      kmlAtual: 2.08,
      giro: 3,
      freio: 7,
      pedal: 10,
      placa: '51540',
      linha: '624',
      turno: 'Intervalo',
      data: '08/04'
    },
    {
      kmlAnterior: 2.51,
      kmlAtual: 2.4,
      giro: 2,
      freio: 7,
      pedal: 4,
      placa: '51540',
      linha: '624',
      turno: 'Manhã',
      data: '08/04'
    },
    {
      kmlAnterior: 2.51,
      kmlAtual: 3.01,
      giro: 2,
      freio: 10,
      pedal: 4,
      placa: '51540',
      linha: '624',
      turno: 'Madrugada',
      data: '08/04'
    },
    {
      kmlAnterior: 2.51,
      kmlAtual: 2.96,
      giro: 0,
      freio: 2,
      pedal: 4,
      placa: '51540',
      linha: '624',
      turno: 'Intervalo',
      data: '07/04'
    },
    {
      kmlAnterior: 2.51,
      kmlAtual: 2.51,
      giro: 2,
      freio: 8,
      pedal: 3,
      placa: '51540',
      linha: '624',
      turno: 'Manhã',
      data: '07/04'
    }
  ];

  // Array filtrado que será exibido
  filteredTurnos: Turno[] = [];

  constructor(private cdr: ChangeDetectorRef) {
    // Listen for dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.isDarkMode = document.documentElement.classList.contains('dark');
          this.cdr.detectChanges();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnInit() {
    this.updateLayout();
    this.filterTurnosByDate(this.currentDate);
  }

  ngAfterViewInit() {
    if (this.carouselContainer) {
      const container = this.carouselContainer.nativeElement;
      container.addEventListener('scroll', () => {
        if (!this.isScrolling) {
          this.handleScroll();
        }
      }, { passive: true });
    }
  }

  private handleScroll() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      if (this.carouselContainer) {
        const container = this.carouselContainer.nativeElement;
        const scrollLeft = container.scrollLeft;
        this.currentIndex = Math.round(scrollLeft / (this.itemWidth + this.gapWidth));
        this.cdr.detectChanges();
      }
    }, 50);
  }

  private updateLayout() {
    if (this.carouselContainer) {
      const container = this.carouselContainer.nativeElement;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft > maxScroll) {
        container.scrollLeft = maxScroll;
      }
    }
  }

  get canScrollPrev(): boolean {
    if (!this.carouselContainer) return false;
    return this.carouselContainer.nativeElement.scrollLeft > 0;
  }

  get canScrollNext(): boolean {
    if (!this.carouselContainer) return false;
    const container = this.carouselContainer.nativeElement;
    const maxScroll = container.scrollWidth - container.clientWidth;
    return container.scrollLeft < maxScroll - 1;
  }

  prevSlide() {
    if (this.carouselContainer && this.canScrollPrev) {
      this.isScrolling = true;
      const container = this.carouselContainer.nativeElement;
      const currentScroll = container.scrollLeft;
      const targetScroll = Math.max(0, currentScroll - (this.itemWidth + this.gapWidth));
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

      this.currentIndex = Math.floor(targetScroll / (this.itemWidth + this.gapWidth));
      
      setTimeout(() => {
        this.isScrolling = false;
        this.cdr.detectChanges();
      }, 500);
    }
  }

  nextSlide() {
    if (this.carouselContainer && this.canScrollNext) {
      this.isScrolling = true;
      const container = this.carouselContainer.nativeElement;
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const targetScroll = Math.min(maxScroll, currentScroll + (this.itemWidth + this.gapWidth));
      
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });

      this.currentIndex = Math.floor(targetScroll / (this.itemWidth + this.gapWidth));
      
      setTimeout(() => {
        this.isScrolling = false;
        this.cdr.detectChanges();
      }, 500);
    }
  }

  // Método para filtrar turnos pela data
  filterTurnosByDate(date: string) {
    this.currentDate = date;
    this.filteredTurnos = this.allTurnos.filter(turno => turno.data === date);
    this.totalItems = this.filteredTurnos.length;
    this.cdr.detectChanges();
  }

  // Verifica se pode navegar para o dia anterior (limite de 5 dias)
  canNavigatePrevious(): boolean {
    const [currentDay, currentMonth] = this.currentDate.split('/').map(Number);
    const today = new Date();
    const currentDate = new Date(2024, currentMonth - 1, currentDay);
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);

    return currentDate > fiveDaysAgo;
  }

  // Verifica se pode navegar para o próximo dia (até hoje)
  canNavigateNext(): boolean {
    const [currentDay, currentMonth] = this.currentDate.split('/').map(Number);
    const currentDate = new Date(2024, currentMonth - 1, currentDay);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove o horário para comparar apenas as datas

    return currentDate < today;
  }

  // Verifica se pode navegar para o dia seguinte (não permite datas futuras)
  canNavigateForward(): boolean {
    const [currentDay, currentMonth] = this.currentDate.split('/').map(Number);
    const today = new Date();
    const todayFormatted = this.formatDate(today);
    const [todayDay, todayMonth] = todayFormatted.split('/').map(Number);

    // Se o mês atual for maior que o mês de hoje, não pode avançar
    if (currentMonth > todayMonth) return false;
    
    // Se estiver no mesmo mês, verifica o dia
    if (currentMonth === todayMonth) {
      return currentDay < todayDay;
    }

    return true;
  }

  // Formata a data para o padrão dd/MM
  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }

  // Navega para o dia anterior
  nextDate() {
    const [day, month] = this.currentDate.split('/').map(Number);
    const currentDateObj = new Date(2024, month - 1, day);
    currentDateObj.setDate(currentDateObj.getDate() - 1);
    const newDate = this.formatDate(currentDateObj);
    this.filterTurnosByDate(newDate);
  }

  // Navega para o dia seguinte (se não for data futura)
  previousDate() {
    if (this.canNavigateForward()) {
      const [day, month] = this.currentDate.split('/').map(Number);
      const currentDateObj = new Date(2024, month - 1, day);
      currentDateObj.setDate(currentDateObj.getDate() + 1);
      const newDate = this.formatDate(currentDateObj);
      this.filterTurnosByDate(newDate);
    }
  }

  onDateSelected(event: any) {
    const date = new Date(event.target.value);
    // Ajusta para o fuso horário local
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    this.selectedDate = event.target.value;
    this.currentDate = this.formatDate(date);
    this.filterTurnosByDate(this.currentDate);
  }
}
