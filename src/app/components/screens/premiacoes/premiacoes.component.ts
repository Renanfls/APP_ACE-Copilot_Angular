import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matConfirmationNumberRound, matStarRound } from '@ng-icons/material-icons/round';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';

interface Premio {
  nome: string;
  imagem: string;
  cupons: number;
  descricao: string;
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
                <img [src]="premio.imagem" [alt]="premio.nome" class="w-full h-48 object-contain mb-4">
                <h3 class="text-lg font-semibold mb-2">{{ premio.nome }}</h3>
                <p class="text-sm text-gray-400 flex-grow">{{ premio.descricao }}</p>
                <div class="flex items-center gap-2 mt-4">
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
export class PremiacoesComponent {
  fases: Fase[] = [
    {
      nome: 'Bronze',
      cor: 'text-orange-700',
      bgColor: 'bg-orange-950',
      premios: [
        {
          nome: 'Smart TV 43"',
          imagem: '/assets/premios/tv-43.webp',
          cupons: 50,
          descricao: 'Smart TV LED 43" Full HD com Wi-Fi integrado e múltiplos apps de streaming.'
        },
        {
          nome: 'Airfryer 4L',
          imagem: '/assets/premios/airfryer.webp',
          cupons: 30,
          descricao: 'Fritadeira elétrica sem óleo com painel digital e 8 programas pré-definidos.'
        },
        {
          nome: 'Fone Bluetooth',
          imagem: '/assets/premios/fone.webp',
          cupons: 20,
          descricao: 'Fone de ouvido sem fio com cancelamento de ruído e bateria de longa duração.'
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
          imagem: '/assets/premios/tv-50.webp',
          cupons: 80,
          descricao: 'Smart TV LED 50" 4K com HDR, Wi-Fi integrado e sistema operacional avançado.'
        },
        {
          nome: 'Smartphone',
          imagem: '/assets/premios/smartphone.webp',
          cupons: 60,
          descricao: 'Smartphone com câmera tripla, 128GB de armazenamento e 6GB de RAM.'
        },
        {
          nome: 'Notebook',
          imagem: '/assets/premios/notebook.webp',
          cupons: 100,
          descricao: 'Notebook com processador de última geração, SSD e tela Full HD.'
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
          imagem: '/assets/premios/tv-65.webp',
          cupons: 120,
          descricao: 'Smart TV QLED 65" 8K com processador AI, HDR Premium e design ultrafino.'
        },
        {
          nome: 'iPhone',
          imagem: '/assets/premios/iphone.webp',
          cupons: 150,
          descricao: 'iPhone última geração com câmera profissional e chip de alto desempenho.'
        },
        {
          nome: 'Playstation 5',
          imagem: '/assets/premios/ps5.webp',
          cupons: 100,
          descricao: 'Console de última geração com controle DualSense e SSD ultrarrápido.'
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
          imagem: '/assets/premios/tv-75.webp',
          cupons: 200,
          descricao: 'Smart TV Neo QLED 75" 8K com Mini LED, HDR 2000 e processador Neural Quantum.'
        },
        {
          nome: 'MacBook Pro',
          imagem: '/assets/premios/macbook.webp',
          cupons: 180,
          descricao: 'MacBook Pro com chip M2, 16GB RAM e 512GB SSD.'
        },
        {
          nome: 'iPad Pro',
          imagem: '/assets/premios/ipad.webp',
          cupons: 150,
          descricao: 'iPad Pro com chip M2, tela Liquid Retina XDR e Apple Pencil 2.'
        }
      ]
    }
  ];
} 