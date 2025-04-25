import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-header-dsveiculos',
  standalone: true,
  imports: [HlmButtonDirective, CommonModule, RouterModule],
  template: `
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
        <h1 class="text-4xl ms-3 font-semibold text-white">DashBus - <span class="text-amber-400">{{ pageTitle }}</span></h1>
      </div>
      <div
        class="flex items-center justify-between"
        style="background-color: #141416;"
      >
        <button
          hlmBtn
          variant="ghost"
          routerLink="/dsbcarros"
          (click)="scrollToTop()"
          class="flex flex-col justify-center items-center h-14 hover:opacity-100 focus:opacity-100 opacity-25"
        >
          <img class="h-6 md:h-8" src="assets/home.svg" alt="Icone Home" />
          <small class="text-lg mt-2 md:mt-3">Home</small>
        </button>
        <button
          hlmBtn
          variant="ghost"
          routerLink="/dsb-carros-temp"
          (click)="scrollToTop()"
          class="flex flex-col justify-center items-center h-14 hover:opacity-100 focus:opacity-100 opacity-25"
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
          class="flex flex-col justify-center items-center h-14 hover:opacity-100 focus:opacity-100 opacity-25"
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
          class="flex flex-col justify-center items-center h-14 focus:opacity-100 hover:opacity-100 opacity-25"
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
          class="flex flex-col justify-center items-center h-14 focus:opacity-100 hover:opacity-100 opacity-25"
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
          class="flex flex-col justify-center items-center h-14 focus:opacity-100 hover:opacity-100 opacity-25"
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
          class="flex flex-col justify-center items-center h-14 focus:opacity-100 hover:opacity-100 opacity-25"
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
        // Atualiza o título com base na URL atual
        this.updateTitle(event.urlAfterRedirects);
      });

    // Define o título inicial com base na URL atual
    this.updateTitle(this.router.url);
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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
