// header-dsveiculos.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Subscription, filter, interval } from 'rxjs';
import { CarouselStateService } from 'src/app/services/carousel-state.service';
import { ComponentRegistryService } from 'src/app/services/component-registry.service';
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
  private carouselSubscription: Subscription | undefined;
  private waitingForCarousel = true;
  private currentRouteIndex = 0;
  private isTransitioning = false;
  private carouselCompleted = false;
  private transitionTimeoutId: any = null;
  private loadingTimeoutId: any = null;

  // Array de rotas disponíveis para rotação
  private routes = [
    '/dsbcarros',
    '/dsb-carros-temp',
    '/dsb-carros-torque',
    '/dsb-carros-turbina',
    '/dsb-carros-pedal',
    '/dsb-carros-ar-comprimido',
    '/dsb-carros-velocidade'
  ];

  // Mapeamento de títulos para rotas
  private routeTitles: { [key: string]: string } = {
    '/dsbcarros': 'Home',
    '/dsb-carros-temp': 'Temperatura',
    '/dsb-carros-torque': 'Torque',
    '/dsb-carros-turbina': 'Pressão Turbina',
    '/dsb-carros-pedal': 'Pedal',
    '/dsb-carros-ar-comprimido': 'Ar Comprimido',
    '/dsb-carros-velocidade': 'Máx. Velocidade'
  };

  // Sequência forçada de rotas
  private readonly routeSequence = [
    '/dsbcarros',              // home
    '/dsb-carros-temp',        // temperatura
    '/dsb-carros-torque',      // torque
    '/dsb-carros-turbina',     // turbina
    '/dsb-carros-pedal',       // pedal
    '/dsb-carros-ar-comprimido', // ar comprimido
    '/dsb-carros-velocidade'   // velocidade
  ];

  constructor(
    private router: Router,
    private carouselStateService: CarouselStateService,
    private componentRegistry: ComponentRegistryService
  ) {
    // Se a rota inicial não for a home, redireciona para home
    const currentPath = window.location.pathname;
    if (currentPath !== '/dsbcarros' && !currentPath.includes('dsb-carros')) {
      this.router.navigate(['/dsbcarros']);
    }
  }

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
        const index = this.routeSequence.indexOf(this.currentUrl);
        if (index !== -1) {
          this.currentRouteIndex = index;
        }

        // Não reseta os estados aqui, eles serão resetados após a transição completa
        // Apenas limpa os timeouts pendentes
        if (this.transitionTimeoutId) {
          clearTimeout(this.transitionTimeoutId);
        }
        if (this.loadingTimeoutId) {
          clearTimeout(this.loadingTimeoutId);
        }

        // Inicia o carrossel do componente atual
        const currentComponent = this.getCurrentComponent();
        if (currentComponent) {
          console.log('🔄 Starting carousel for current component');
          currentComponent.startAutoSlide();
        }

        // Se estiver na rota home, aguarda o carrossel completar
        if (this.currentUrl === '/dsbcarros') {
          console.log('🏠 On home route, waiting for carousel completion');
          this.waitingForCarousel = true;
          this.carouselCompleted = false;
        }
      });

    // Define o título inicial com base na URL atual
    this.currentUrl = this.router.url;
    this.updateTitle(this.router.url);

    // Inicia o relógio que atualiza a cada segundo
    this.clockSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });

    // Inscreve-se no serviço de estado do carrossel
    this.carouselSubscription = this.carouselStateService.carouselComplete$.subscribe(() => {
      console.log('🎠 Carousel completion signal received:', {
        isTransitioning: this.isTransitioning,
        waitingForCarousel: this.waitingForCarousel,
        carouselCompleted: this.carouselCompleted,
        currentUrl: this.currentUrl
      });

      if (!this.isTransitioning && this.waitingForCarousel) {
        console.log('🎠 Carousel completed on route:', this.currentUrl);
        this.carouselCompleted = true;
        this.rotateToNextRoute();
      }
    });

    // Se a rota inicial não for a home, redireciona para home
    if (this.currentUrl !== '/dsbcarros') {
      console.log('🏠 Redirecting to home route');
      this.router.navigate(['/dsbcarros']);
    } else {
      // Se já estiver na home, aguarda o carrossel completar
      console.log('🏠 Already on home route, waiting for carousel completion');
      this.waitingForCarousel = true;
      this.carouselCompleted = false;
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
    }
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
    }
    if (this.transitionTimeoutId) {
      clearTimeout(this.transitionTimeoutId);
    }
    if (this.loadingTimeoutId) {
      clearTimeout(this.loadingTimeoutId);
    }
  }

  private updateTitle(url: string) {
    this.pageTitle = this.routeTitles[url] || 'DashBus';
  }

  // Método para obter a próxima rota na sequência
  private getNextRoute(): string {
    const currentIndex = this.routeSequence.indexOf(this.currentUrl);
    if (currentIndex === -1) {
      console.log('⚠️ Current route not found in sequence, returning to home');
      return '/dsbcarros';
    }
    
    // Se estiver na última rota, volta para a primeira
    const nextIndex = (currentIndex + 1) % this.routeSequence.length;
    const nextRoute = this.routeSequence[nextIndex];
    console.log(`🔄 Next route will be: ${nextRoute} (index: ${nextIndex})`);
    return nextRoute;
  }

  // Método para rotacionar para a próxima rota
  private rotateToNextRoute() {
    if (this.isTransitioning) {
      console.log('⛔ Transition blocked: Already in transition', {
        currentUrl: this.currentUrl,
        isTransitioning: this.isTransitioning,
        carouselCompleted: this.carouselCompleted
      });
      return;
    }

    if (!this.carouselCompleted) {
      console.log('⛔ Transition blocked: Carousel not completed', {
        currentUrl: this.currentUrl,
        isTransitioning: this.isTransitioning,
        carouselCompleted: this.carouselCompleted
      });
      return;
    }
    
    this.isTransitioning = true;
    this.waitingForCarousel = false;

    // Obtém a próxima rota da sequência
    const nextRoute = this.getNextRoute();
    console.log('🔄 Initiating transition to:', nextRoute);

    // Mostra a tela de carregamento antes da navegação
    this.nextPageTitle = this.routeTitles[nextRoute];
    this.showLoading = true;

    // Limpa qualquer timeout pendente
    if (this.transitionTimeoutId) {
      clearTimeout(this.transitionTimeoutId);
    }
    if (this.loadingTimeoutId) {
      clearTimeout(this.loadingTimeoutId);
    }

    // Navega após um timeout para dar tempo da tela de carregamento aparecer
    this.transitionTimeoutId = setTimeout(() => {
      console.log('⏳ Starting navigation to:', nextRoute);
      
      this.router.navigate([nextRoute])
        .then(() => {
          console.log('✅ Navigation successful to:', nextRoute);
          
          // Esconde a tela de carregamento e reseta os estados após a navegação
          this.loadingTimeoutId = setTimeout(() => {
            console.log('🏁 Transition complete, resetting states for next cycle');
            this.showLoading = false;
            this.isTransitioning = false;
            this.waitingForCarousel = true;
            this.carouselCompleted = false;

            // Se a nova rota for a home, aguarda o carrossel completar
            if (nextRoute === '/dsbcarros') {
              console.log('🏠 Transitioned to home route, waiting for carousel completion');
              this.waitingForCarousel = true;
              this.carouselCompleted = false;
            }
          }, 2000);
        })
        .catch((error) => {
          console.error('❌ Navigation failed:', error);
          // Em caso de erro na navegação, reseta os estados
          this.showLoading = false;
          this.isTransitioning = false;
          this.waitingForCarousel = true;
          this.carouselCompleted = false;
        });
    }, 1000);
  }

  // Método auxiliar para obter o componente atual
  private getCurrentComponent(): any {
    return this.componentRegistry.getCurrentComponent();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
