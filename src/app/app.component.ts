import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarouselStateService } from './services/carousel-state.service';
import { ThemeService } from './services/theme.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app-ace-copilot';
  private carouselSubscription: Subscription | undefined;

  // Define the route sequence
  private readonly routeSequence = [
    '/dsbcarros',              // 1. Home
    '/dsb-carros-temp',        // 2. Temperatura
    '/dsb-carros-torque',      // 3. Torque
    '/dsb-carros-turbina',     // 4. Turbina
    '/dsb-carros-pedal',       // 5. Pedal
    '/dsb-carros-ar-comprimido', // 6. Ar Comprimido
    '/dsb-carros-velocidade'   // 7. Velocidade
  ];

  constructor(
    private themeService: ThemeService,
    private carouselStateService: CarouselStateService,
    private router: Router
  ) {
    console.log('🚀 AppComponent constructor called');
  }

  ngOnInit() {
    console.log('🚀 AppComponent ngOnInit called');
    // Theme service will handle the initial theme setup in its constructor
    
    // Subscribe to carousel completion
    this.carouselSubscription = this.carouselStateService.carouselComplete$.subscribe(() => {
      console.log('🎯 Carousel completed event received');
      // Get current route index
      const currentRoute = this.router.url;
      console.log('📍 Current route:', currentRoute);
      const currentIndex = this.routeSequence.indexOf(currentRoute);
      console.log('📍 Current index:', currentIndex);
      
      // Calculate next route index (loop back to start if at the end)
      const nextIndex = (currentIndex + 1) % this.routeSequence.length;
      console.log('📍 Next index:', nextIndex);
      console.log('📍 Next route:', this.routeSequence[nextIndex]);
      
      // Navigate to next route
      this.router.navigate([this.routeSequence[nextIndex]]).then(() => {
        console.log('✅ Navigation completed to:', this.routeSequence[nextIndex]);
      }).catch(error => {
        console.error('❌ Navigation failed:', error);
      });
    });
  }

  ngOnDestroy() {
    console.log('🚀 AppComponent ngOnDestroy called');
    if (this.carouselSubscription) {
      this.carouselSubscription.unsubscribe();
      console.log('✅ Carousel subscription unsubscribed');
    }
  }
}
