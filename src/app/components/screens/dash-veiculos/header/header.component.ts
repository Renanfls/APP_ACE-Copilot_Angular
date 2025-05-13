// header-dsveiculos.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Subscription, filter, interval } from 'rxjs';
import { LoadingScreenComponent } from '../loading-screen/loading-screen.component';

@Component({
  selector: 'app-header-dsveiculos',
  standalone: true,
  imports: [
    HlmButtonDirective,
    CommonModule,
    RouterModule,
    LoadingScreenComponent,
  ],
  template: `
    <app-loading-screen
      [showLoading]="showLoading"
      [nextPageTitle]="nextPageTitle"
    ></app-loading-screen>
    <header
      class="w-full p-10 md:px-20 flex items-center justify-between fixed z-50"
      style="background-color: #141416;"
    >
      <div class="flex items-center">
        <img
          class="h-12"
          src="assets/Logo_AceCopilot 1.png"
          alt="Logo da ACE Copilot"
        />
        <h1 class="text-3xl 2xl:text-4xl ms-3 font-semibold text-white">
          DashBus - <span class="text-amber-400">{{ pageTitle }}</span>
        </h1>
      </div>

      <!-- Relógio centralizado -->
      <div
        class="absolute left-1/2 transform -translate-x-1/2 text-white font-bold text-center my-3"
      >
        <small style="font-size: 1.25rem; line-height: .25;">{{
          currentTime | date : 'dd/MM/yyyy'
        }}</small>
        <div style="font-size: 4.5rem; line-height: 1;">
          {{ currentTime | date : 'HH:mm:ss' }}
        </div>
      </div>

      <div class="flex items-center justify-between text-white">
        <button
          routerLink="/dsbcarros"
          (click)="scrollToTop()"
          style="background-color: transparent;"
          class="flex flex-col justify-center items-center h-14 focus:outline-none"
          [ngClass]="{
            'opacity-100': currentUrl === '/dsbcarros',
            'opacity-25': currentUrl !== '/dsbcarros'
          }"
        >
          <img class="h-6 md:h-8" src="assets/home.svg" alt="Icone Home" />
          <small class="text-lg mt-2 md:mt-3">Home</small>
        </button>
        <button
          hlmBtn
          variant="ghost"
          routerLink="/dsb-carros-temp"
          (click)="scrollToTop()"
          style="background-color: transparent;"
          class="flex flex-col justify-center items-center h-14"
          [ngClass]="{
            'opacity-100': currentUrl === '/dsb-carros-temp',
            'opacity-25': currentUrl !== '/dsb-carros-temp'
          }"
        >
          <img
            class="w-6 h-6 md:h-8"
            src="assets/device_thermostat.svg"
            alt="Icone Temperatura"
          />
          <small class="text-lg mt-2 md:mt-3">Temperatura</small>
        </button>
        <button
          hlmBtn
          variant="ghost"
          routerLink="/dsb-carros-torque"
          (click)="scrollToTop()"
          style="background-color: transparent;"
          class="flex flex-col justify-center items-center h-14"
          [ngClass]="{
            'opacity-100': currentUrl === '/dsb-carros-torque',
            'opacity-25': currentUrl !== '/dsb-carros-torque'
          }"
        >
          <img
            class="w-8 h-6 md:h-8"
            src="assets/shutter_speed_minus.svg"
            alt="Icone Torque"
          />
          <small class="text-lg mt-2 md:mt-3">Torque</small>
        </button>
        <button
          hlmBtn
          variant="ghost"
          routerLink="/dsb-carros-turbina"
          (click)="scrollToTop()"
          style="background-color: transparent;"
          class="flex flex-col justify-center items-center h-14"
          [ngClass]="{
            'opacity-100': currentUrl === '/dsb-carros-turbina',
            'opacity-25': currentUrl !== '/dsb-carros-turbina'
          }"
        >
          <img
            class="w-6 h-6 md:h-8"
            src="assets/compress.svg"
            alt="Icone Pressão turbina"
          />
          <small class="text-lg mt-2 md:mt-3">P.Turbina</small>
        </button>
        <button
          hlmBtn
          variant="ghost"
          routerLink="/dsb-carros-pedal"
          (click)="scrollToTop()"
          style="background-color: transparent;"
          class="flex flex-col justify-center items-center h-14"
          [ngClass]="{
            'opacity-100': currentUrl === '/dsb-carros-pedal',
            'opacity-25': currentUrl !== '/dsb-carros-pedal'
          }"
        >
          <img
            class="w-8 h-6 md:h-8"
            src="assets/do_not_step.svg"
            alt="Icone Pedal"
          />
          <small class="text-lg mt-2 md:mt-3">Pedal</small>
        </button>
        <button
          hlmBtn
          variant="ghost"
          routerLink="/dsb-carros-ar-comprimido"
          (click)="scrollToTop()"
          style="background-color: transparent;"
          class="flex flex-col justify-center items-center h-14"
          [ngClass]="{
            'opacity-100': currentUrl === '/dsb-carros-ar-comprimido',
            'opacity-25': currentUrl !== '/dsb-carros-ar-comprimido'
          }"
        >
          <img
            class="w-8 h-6 md:h-8"
            src="assets/air.svg"
            alt="Icone Ar Comprimido"
          />
          <small class="text-lg mt-2 md:mt-3">Ar Comp.</small>
        </button>
        <button
          hlmBtn
          variant="ghost"
          routerLink="/dsb-carros-velocidade"
          (click)="scrollToTop()"
          style="background-color: transparent;"
          class="flex flex-col justify-center items-center h-14"
          [ngClass]="{
            'opacity-100': currentUrl === '/dsb-carros-velocidade',
            'opacity-25': currentUrl !== '/dsb-carros-velocidade'
          }"
        >
          <img
            class="w-8 h-6 md:h-8"
            src="assets/speed.svg"
            alt="Icone Max. Velocidade"
          />
          <small class="text-lg mt-2 md:mt-3">Velocidade</small>
        </button>
      </div>
    </header>
  `,
})
export class HeaderDashVeiculosComponent implements OnInit, OnDestroy {
  pageTitle = 'DashBus';
  currentTime = new Date();
  currentUrl = '';
  showLoading = false;
  nextPageTitle = '';

  private routerSubscription: Subscription | undefined;
  private clockSubscription: Subscription | undefined;
  private urlRotationSubscription: Subscription | undefined;

  // Array de rotas disponíveis para rotação
  private routes = [
    '/dsbcarros',
    '/dsb-carros-temp',
    '/dsb-carros-torque',
    '/dsb-carros-turbina',
    '/dsb-carros-pedal',
    '/dsb-carros-ar-comprimido',
    '/dsb-carros-velocidade',
  ];

  // Mapeamento de títulos para rotas
  private routeTitles: { [key: string]: string } = {
    '/dsbcarros': 'Home',
    '/dsb-carros-temp': 'Temperatura',
    '/dsb-carros-torque': 'Torque',
    '/dsb-carros-turbina': 'Pressão Turbina',
    '/dsb-carros-pedal': 'Pedal',
    '/dsb-carros-ar-comprimido': 'Ar Comprimido',
    '/dsb-carros-velocidade': 'Máx. Velocidade',
  };

  private currentRouteIndex = 0;

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
        // Atualiza o título com base na URL atual
        this.currentUrl = event.urlAfterRedirects;
        this.updateTitle(event.urlAfterRedirects);

        // Atualiza o índice atual com base na URL
        const index = this.routes.indexOf(this.currentUrl);
        if (index !== -1) {
          this.currentRouteIndex = index;
        }
      });

    // Define o título inicial com base na URL atual
    this.currentUrl = this.router.url;
    this.updateTitle(this.router.url);

    // Inicia o relógio que atualiza a cada segundo
    this.clockSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });

    // Inicia o intervalo para alternar entre as URLs a cada 2 minutos
    this.urlRotationSubscription = interval(120000).subscribe(() => {
      this.rotateToNextRoute();
    });
  }

  ngOnDestroy() {
    // Cancela as inscrições ao destruir o componente
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }

    if (this.urlRotationSubscription) {
      this.urlRotationSubscription.unsubscribe();
    }
  }

  // Método para rotacionar para a próxima rota
  rotateToNextRoute() {
    // Calcula o próximo índice
    const nextIndex = (this.currentRouteIndex + 1) % this.routes.length;
    const nextRoute = this.routes[nextIndex];

    // Mostra a tela de carregamento antes da navegação
    this.nextPageTitle = this.routeTitles[nextRoute];
    this.showLoading = true;

    // Navega após um timeout para dar tempo da tela de carregamento aparecer
    setTimeout(() => {
      this.router.navigate([nextRoute]);

      // Esconde a tela de carregamento após a navegação
      setTimeout(() => {
        this.showLoading = false;
      }, 1000); // Mantém a tela de carregamento por 1 segundo após a navegação
    }, 2000); // Mostra a tela de carregamento por 2 segundos antes da navegação

    this.currentRouteIndex = nextIndex;
  }

  updateTitle(url: string) {
    this.pageTitle = this.routeTitles[url] || 'Home';
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
