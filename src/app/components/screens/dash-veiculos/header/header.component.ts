// header-dsveiculos.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Subscription, interval } from 'rxjs';
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
      class="w-full p-10 flex items-center justify-between fixed z-50"
      style="background-color: #141416;"
    >
      <div class="flex items-center">
        <img
          class="h-12"
          src="assets/Logo_AceCopilot_branco.png"
          alt="Logo da ACE Copilot"
        />
        <h1 class="text-3xl 2xl:text-4xl ms-8 font-bold text-white">
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
  private carouselSubscription: Subscription | null = null;
  private waitingForCarousel = false;
  private carouselCompleted = false;
  private isTransitioning = false;
  private transitionTimeoutId: any = null;
  private loadingTimeoutId: any = null;
  private checkInterval: any = null;

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
  private readonly routeTitles: { [key: string]: string } = {
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
    '/dsbcarros',
    '/dsb-carros-temp',
    '/dsb-carros-torque',
    '/dsb-carros-turbina',
    '/dsb-carros-pedal',
    '/dsb-carros-ar-comprimido',
    '/dsb-carros-velocidade'
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
    console.log('🔄 Header component initialized');
    this.setupCarouselSubscription();
    
    // Inscrever-se nos eventos de navegação
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('🔄 Navigation event:', event);
        this.handleNavigation(event);
      }
    });

    // Define o título inicial com base na URL atual
    this.currentUrl = this.router.url;
    this.updateTitle(this.router.url);

    // Inicia o relógio que atualiza a cada segundo
    this.clockSubscription = interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
  }

  ngOnDestroy() {
    console.log('🔄 Header component destroyed');
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
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  private updateTitle(url: string) {
    const title = this.routeTitles[url] || 'DashBus';
    this.pageTitle = title;
    console.log('📝 Updated page title:', title);
  }

  private setupCarouselSubscription() {
    console.log('🔄 Setting up carousel subscription');
    this.carouselSubscription = this.carouselStateService.carouselComplete$.subscribe(() => {
      console.log('🎠 Carousel completion received in header');
      this.rotateToNextRoute();
    });
  }

  private rotateToNextRoute() {
    if (this.isTransitioning) {
      console.log('⏳ Already transitioning, skipping navigation');
      return;
    }

    console.log('🔄 Starting route rotation');
    this.isTransitioning = true;

    const currentUrl = this.router.url;
    const currentIndex = this.routeSequence.indexOf(currentUrl);
    const nextIndex = (currentIndex + 1) % this.routeSequence.length;
    const nextRoute = this.routeSequence[nextIndex];

    console.log('🔄 Current route:', currentUrl);
    console.log('🔄 Next route:', nextRoute);
    console.log('🔄 Next page title:', this.routeTitles[nextRoute]);

    // Mostrar tela de loading imediatamente
    this.nextPageTitle = this.routeTitles[nextRoute];
    this.showLoading = true;

    // Clear any existing intervals
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Aguardar um momento para garantir que a tela de loading seja exibida
    setTimeout(() => {
      console.log('🔄 Navigating to:', nextRoute);
      this.router.navigate([nextRoute]).then(success => {
        console.log('🔄 Navigation result:', success);
        this.isTransitioning = false;
      });
    }, 5000); // 5 segundos
  }

  // Método auxiliar para obter o componente atual
  private getCurrentComponent(): any {
    return this.componentRegistry.getCurrentComponent();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Força o scroll para o topo mesmo que a navegação seja na mesma rota
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }

  getCurrentRouteTitle(): string {
    const currentUrl = this.router.url;
    return this.routeTitles[currentUrl] || 'Dashboard';
  }

  // Adicionar método para gerenciar eventos de navegação
  private handleNavigation(event: NavigationEnd) {
    console.log('🔄 Navigation event received:', event.url);
    this.currentUrl = event.url;
    this.updateTitle(event.url);
    
    // Show loading screen on navigation
    this.showLoading = true;
    this.nextPageTitle = this.routeTitles[event.url] || '';
    
    // Clear any existing intervals
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    
    // Wait for carousel to be ready
    this.waitForCarouselInitialization();
  }

  private waitForCarouselInitialization() {
    // Get the current component instance
    const currentComponent = this.componentRegistry.getCurrentComponent();
    
    if (!currentComponent) {
      console.log('❌ No component registered, hiding loading screen');
      setTimeout(() => {
        this.showLoading = false;
      }, 5000); // 5 segundos
      return;
    }

    // Check if the component has vehicles loaded
    if (currentComponent.veiculos && currentComponent.veiculos.length > 0) {
      console.log('✅ Vehicles already loaded, waiting minimum display time');
      setTimeout(() => {
        this.showLoading = false;
      }, 5000); // 5 segundos
    } else {
      // Wait for vehicles to be loaded
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds (50 * 100ms)
      
      this.checkInterval = setInterval(() => {
        attempts++;
        const component = this.componentRegistry.getCurrentComponent();
        
        if (component?.veiculos && component.veiculos.length > 0) {
          console.log('✅ Vehicles loaded after ' + attempts + ' attempts, ensuring minimum display time');
          clearInterval(this.checkInterval);
          setTimeout(() => {
            this.showLoading = false;
          }, 5000); // 5 segundos
        } else if (attempts >= maxAttempts) {
          console.log('⚠️ Loading timeout reached after ' + attempts + ' attempts, ensuring minimum display time');
          clearInterval(this.checkInterval);
          setTimeout(() => {
            this.showLoading = false;
          }, 5000); // 5 segundos
        }
      }, 100); // Check every 100ms
    }
  }
}
