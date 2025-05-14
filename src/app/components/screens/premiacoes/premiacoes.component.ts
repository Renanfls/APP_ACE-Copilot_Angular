import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matConfirmationNumberRound, matStarRound } from '@ng-icons/material-icons/round';
import { CouponService } from '../../../services/coupon.service';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';

interface Premio {
  nome: string;
  imagem: string;
  cupons: number;
}

interface Fase {
  nome: string;
  cor: string;
  bgColor: string;
  premios: Premio[];
}

@Component({
  selector: 'app-premiacoes',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    NgIconComponent
  ],
  providers: [
    provideIcons({ matConfirmationNumberRound, matStarRound })
  ],
  template: `
    <app-header />
    
    <div class="flex-1 md:container py-28">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl md:text-4xl font-bold mb-8">Premiações</h1>
        
        <div class="space-y-8">
          <div *ngFor="let fase of fases" class="rounded-2xl overflow-hidden">
            <!-- Cabeçalho da Fase -->
            <div [class]="'p-4 ' + fase.bgColor">
              <div class="flex items-center gap-3">
                <ng-icon name="matStarRound" [class]="'text-2xl ' + fase.cor"></ng-icon>
                <h2 class="text-xl md:text-2xl font-bold">Fase {{ fase.nome }}</h2>
              </div>
            </div>
            
            <!-- Grid de Prêmios -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-[#1e1e1e]">
              <div *ngFor="let premio of fase.premios" class="bg-[#2a2a2a] rounded-xl p-4 flex flex-col">
                <div [class.blur-sm]="!isAvailable(premio.cupons)" [class.bg-[#1d1d1d]]="!isAvailable(premio.cupons)" class="relative">
                  <img [src]="premio.imagem" [alt]="premio.nome" class="w-full h-48 object-contain mb-4">
                  <div *ngIf="!isAvailable(premio.cupons)" class="absolute inset-0 flex items-center justify-center">
                    <span class="text-amber-400 font-semibold text-lg">{{ premio.cupons }} cupons</span>
                  </div>
                </div>
                <h3 class="text-lg font-semibold mb-2">{{ premio.nome }}</h3>
                <div class="flex items-center gap-2 mt-auto">
                  <ng-icon name="matConfirmationNumberRound" class="text-amber-400"></ng-icon>
                  <span class="text-amber-400 font-semibold">{{ premio.cupons }} cupons</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <app-footer />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `]
})
export class PremiacoesComponent implements OnInit {
  availableCoupons = 0;

  fases: Fase[] = [
    {
      nome: 'Bronze',
      cor: 'text-orange-700',
      bgColor: 'bg-orange-950',
      premios: [
        {
          nome: 'Smart TV 43"',
          imagem: '/assets/premios/tv-43.jpeg',
          cupons: 50
        },
        {
          nome: 'Airfryer 4L',
          imagem: '/assets/premios/airfryer.jpeg',
          cupons: 30
        },
        {
          nome: 'Fone Bluetooth',
          imagem: '/assets/premios/fone.jpeg',
          cupons: 20
        }
      ]
    },
    {
      nome: 'Prata',
      cor: 'text-gray-400',
      bgColor: 'bg-gray-800',
      premios: [
        {
          nome: 'Smart TV 50"',
          imagem: '/assets/premios/tv-50.jpeg',
          cupons: 80
        },
        {
          nome: 'Smartphone',
          imagem: '/assets/premios/smartphone.jpeg',
          cupons: 60
        },
        {
          nome: 'Notebook',
          imagem: '/assets/premios/notebook.jpeg',
          cupons: 100
        }
      ]
    },
    {
      nome: 'Ouro',
      cor: 'text-yellow-500',
      bgColor: 'bg-yellow-950',
      premios: [
        {
          nome: 'Smart TV 65"',
          imagem: '/assets/premios/tv-65.jpeg',
          cupons: 120
        },
        {
          nome: 'iPhone',
          imagem: '/assets/premios/iphone.jpeg',
          cupons: 150
        },
        {
          nome: 'Playstation 5',
          imagem: '/assets/premios/ps5.jpeg',
          cupons: 100
        }
      ]
    },
    {
      nome: 'Ouro C',
      cor: 'text-yellow-400',
      bgColor: 'bg-yellow-900',
      premios: [
        {
          nome: 'Smart TV 75"',
          imagem: '/assets/premios/tv-75.jpeg',
          cupons: 200
        },
        {
          nome: 'MacBook Pro',
          imagem: '/assets/premios/macbook.jpeg',
          cupons: 180
        },
        {
          nome: 'iPad Pro',
          imagem: '/assets/premios/ipad.jpeg',
          cupons: 150
        }
      ]
    }
  ];

  constructor(private couponService: CouponService) {}

  ngOnInit() {
    this.couponService.getAvailableCoupons().subscribe(coupons => {
      this.availableCoupons = coupons;
    });
  }

  isAvailable(requiredCoupons: number): boolean {
    return this.availableCoupons >= requiredCoupons;
  }

  resgatar(premio: Premio) {
    if (this.couponService.useCoupons(premio.cupons)) {
      alert(`Parabéns! Você resgatou ${premio.nome}`);
    } else {
      alert('Cupons insuficientes para resgatar este prêmio.');
    }
  }
} 