import { Component, OnDestroy, OnInit } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { matHome } from '@ng-icons/material-icons/baseline';
import { Event, NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-dsveiculos',
  standalone: true,
  viewProviders: [provideIcons({ matHome })],
  imports: [RouterModule, CommonModule],
  template: `
    <footer class="container py-3 flex items-center justify-evenly z-40 relative text-xs md:text-sm font-bold">
      <div *ngIf="showLegend" class="py-6 flex items-center justify-center gap-16 w-full fixed bottom-0" style="background-color: #141416;">
        <div *ngFor="let item of legendItems" class="flex items-center gap-3">
          <span class="w-10 h-4 rounded-full" [style.background-color]="item.color"></span>
          <small class="text-2xl">{{ item.label }}</small>
        </div>
      </div>
    </footer>
  `,
})
export class FooterDashVeiculosComponent implements OnInit, OnDestroy {
  pageTitle = 'DashBus';
  showLegend = false;
  legendItems: { color: string; label: string }[] = [];
  url = '';
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    // Configura a inscrição para eventos de navegação
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event: Event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.url = event.urlAfterRedirects;
        // Atualiza o título e a legenda com base na URL atual
        this.updateTitle(this.url);
        this.updateLegend(this.url);
      });

    // Define o título e a legenda iniciais com base na URL atual
    this.url = this.router.url;
    this.updateTitle(this.url);
    this.updateLegend(this.url);
  }

  ngOnDestroy() {
    // Cancela a inscrição ao destruir o componente
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  updateTitle(url: string) {
    if (url.includes('/dsb-carros-temp')) {
      this.pageTitle = 'Temperatura';
    } else if (url.includes('/dsb-carros-torque')) {
      this.pageTitle = 'Torque';
    } else if (url.includes('/dsb-carros-turbina')) {
      this.pageTitle = 'Pressão Turbina';
    } else if (url.includes('/dsb-carros-pedal')) {
      this.pageTitle = 'Pedal';
    } else if (url.includes('/dsb-carros-ar-comprimido')) {
      this.pageTitle = 'Ar Comprimido';
    } else if (url.includes('/dsb-carros-velocidade')) {
      this.pageTitle = 'Máx. Velocidade';
    } else {
      this.pageTitle = 'Home';
    }
  }

  updateLegend(url: string) {
    this.showLegend = false;
    this.legendItems = [];

    if (url.includes('/dsb-carros')) {
      this.showLegend = true;
      this.legendItems = [
        { color: '#B9B9B9', label: 'Inativo' },
        { color: '#387E38', label: 'OK' },
        { color: '#F56B15', label: 'Médio' },
        { color: '#AE2724', label: 'Alto' },
        { color: '#6224AE', label: 'Muito Alto' }
      ];
    } else if (url.includes('/dsbcarros')) {
      this.showLegend = true;
      this.legendItems = [
        { color: '#B9B9B9', label: 'Inativo' },
        { color: 'white', label: 'OK' },
        { color: '#FF9858', label: 'Oficina' },
        { color: '#E25652', label: 'Sem Comunicar' }
      ];
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}