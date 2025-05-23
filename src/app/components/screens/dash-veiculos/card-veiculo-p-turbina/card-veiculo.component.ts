import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarouselStateService } from 'src/app/services/carousel-state.service';
import { ComponentRegistryService } from 'src/app/services/component-registry.service';
import { FooterDashVeiculosComponent } from '../footer/footer.component';
import { HeaderDashVeiculosComponent } from '../header/header.component';
import { LoadingScreenComponent } from '../loading-screen/loading-screen.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-card-veiculo-p-turbina',
  standalone: true, 
  imports: [CommonModule, FormsModule, ModalComponent, HeaderDashVeiculosComponent, FooterDashVeiculosComponent, LoadingScreenComponent],
  templateUrl: './card-veiculo.component.html',
  styleUrls: ['./card-veiculo.component.css'],
  animations: [
    trigger('slideUpDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class CardVeiculoPTurbinaComponent implements OnInit, OnDestroy {
  veiculos: any[] = [];
  selectedVehicle: any = null;
  isHelpDialogOpen = false;
  originalData: any = null;
  originalVehicleState: any = null;
  isLoading = true;
  
  showComments = false;
  newComment = '';
  showOilChangeForm = false;
  lastOilChangeDate = '';
  showOilChangeRecords = false;

  currentSlide = 0;
  vehicleGroups: any[][] = [];
  itemsPerSlide = 90;
  autoSlideInterval: any;
  slideTimeoutDuration = 10000;
  private lastSlideShown = false;

  private readonly icones = [
    'assets/device_thermostat.svg',
    'assets/shutter_speed_minus.svg',
    'assets/compress.svg',
    'assets/do_not_step.svg',
    'assets/air.svg',
    'assets/speed.svg'
  ];

  constructor(
    private http: HttpClient, 
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
    private carouselStateService: CarouselStateService,
    private componentRegistry: ComponentRegistryService
  ) {}

  ngOnInit() {
    console.log('🔄 Initializing turbine pressure component');
    this.componentRegistry.registerComponent(this);
    this.loadVehicles();
  }

  ngOnDestroy() {
    console.log('🔄 Destroying turbine pressure component');
    this.componentRegistry.unregisterComponent(this);
    this.stopAutoSlide();
  }

  getColorPriority(color: string): number {
    switch (color) {
      case '#6224AE': return 1; // Roxo - Muito Alto
      case '#AE2724': return 2; // Vermelho - Alto
      case '#F56B15': return 3; // Laranja - Médio
      case '#387E38': return 4; // Verde - OK
      case '#242427': return 5; // Inativo
      default: return 6;
    }
  }

  getAttributePriority(veiculo: any): number {
    if (!veiculo.atributos || veiculo.atributos.length === 0) return 6;
    // Considera apenas o atributo de pressão da turbina (índice 2)
    return this.getColorPriority(veiculo.atributos[2].cor);
  }

  loadVehicles() {
    console.log('🔄 Starting to load vehicle data');
    this.isLoading = true;
    
    setTimeout(() => {
      this.http.get<any>('assets/mocks/veiculos_mock.json').subscribe({
        next: (data) => {
          console.log('✅ Data received from server:', data);
          // Armazenar os dados originais
          this.originalData = JSON.parse(JSON.stringify(data));
          
          // Processar os dados para exibição
          this.veiculos = data.veiculos.map((v: any) => ({
            ...v,
            atributos: v.cores.map((cor: string, index: number) => ({
              cor,
              icone: this.icones[index] || ''
            })),
            comentarios: v.comentarios || [],
            odoAtual: v.odoAtual || 0,
            ultimaTrocaOleo: v.ultimaTrocaOleo || null,
            odoNaUltimaTroca: v.odoNaUltimaTroca || 0,
            trocasOleo: v.trocasOleo || []
          }));
          
          console.log('✅ Processed vehicles:', this.veiculos.length);
          
          // Assegurar que todas as cores estejam no formato esperado
          this.veiculos.forEach(veiculo => {
            veiculo.atributos.forEach((atributo: any, index: number) => {
              atributo.cor = this.getClosestColorMatch(atributo.cor);
            });
            
            this.calcularodoDesdeUltimaTroca(veiculo);
          });

          // Ordenar veículos por prioridade de pressão da turbina
          console.log('Ordenando veículos por prioridade de pressão da turbina...');
          this.veiculos.sort((a, b) => {
            const priorityA = this.getAttributePriority(a);
            const priorityB = this.getAttributePriority(b);
            console.log('Vehicle A:', a.id, 'Priority:', priorityA, 'Color:', a.atributos[2].cor);
            console.log('Vehicle B:', b.id, 'Priority:', priorityB, 'Color:', b.atributos[2].cor);
            return priorityA - priorityB;
          });
          console.log('Veículos ordenados:', this.veiculos.map(v => ({
            id: v.id,
            priority: this.getAttributePriority(v),
            color: v.atributos[2].cor
          })));

          // Inicializar o carrossel
          this.initializeCarousel();
          
          // Aguardar 10 segundos antes de esconder o loading
          setTimeout(() => {
            this.isLoading = false;
            this.startAutoSlide();
            this.cdRef.detectChanges();
          }, 10000);
        },
        error: (err) => {
          console.error('❌ Erro ao carregar o JSON:', err);
          this.isLoading = false;
          this.cdRef.detectChanges();
        }
      });
    }, 0);
  }

  private stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  private getClosestColorMatch(currentColor: string): string {
    // Se a cor já for uma das nossas opções, retorne-a
    const allColors = this.getAllAttributeColors();
    if (allColors.includes(currentColor)) {
      return currentColor;
    }
    
    // Caso contrário, encontre a cor padrão mais próxima (aqui usamos o primeiro item)
    return allColors[0];
  }

  private calcularodoDesdeUltimaTroca(veiculo: any) {
    if (veiculo.odoAtual && veiculo.odoNaUltimaTroca) {
      veiculo.odoDesdeUltimaTroca = veiculo.odoAtual - veiculo.odoNaUltimaTroca;
    } else {
      veiculo.odoDesdeUltimaTroca = veiculo.odoAtual || 0;
    }
    
    // Verificar se precisa de troca de óleo (odo > 10.000)
    veiculo.precisaTrocaOleo = veiculo.odoDesdeUltimaTroca >= 10000;
  }

  private initializeCarousel() {
    console.log('Initializing carousel with vehicles:', this.veiculos.length);
    this.vehicleGroups = [];
    for (let i = 0; i < this.veiculos.length; i += this.itemsPerSlide) {
      const group = this.veiculos.slice(i, Math.min(i + this.itemsPerSlide, this.veiculos.length));
      while (group.length < this.itemsPerSlide) {
        group.push(null);
      }
      this.vehicleGroups.push(group);
    }
    console.log('Created vehicle groups:', this.vehicleGroups.length);
  }

  private startAutoSlide() {
    console.log('🎠 Starting auto slide for turbine pressure component');
    this.lastSlideShown = false;
    this.autoSlideInterval = setInterval(() => {
      if (this.currentSlide === this.vehicleGroups.length - 1) {
        console.log('🎠 Last slide reached in turbine pressure component');
        this.lastSlideShown = true;
        this.stopAutoSlide();
        this.carouselStateService.notifyCarouselComplete();
      } else {
        this.nextSlide();
      }
    }, this.slideTimeoutDuration);
  }

  private getAllAttributeColors(): string[] {
    // Utilizamos as cores definidas no método getColorOptions
    return this.getColorOptions().map((option: { value: string }) => option.value);
  }

  getColorOptions() {
    return [
      { label: 'Inativo', value: '#242427' },
      { label: 'Verde', value: '#387E38' },
      { label: 'Laranja', value: '#F56B15' },
      { label: 'Vermelho', value: '#AE2724' },
      { label: 'Roxo', value: '#6224AE' }
    ];
  }

  nextSlide() {
    if (this.currentSlide < this.vehicleGroups.length - 1) {
      this.currentSlide++;
      this.resetAutoSlideTimer();
    }
  }

  private resetAutoSlideTimer() {
    if (!this.lastSlideShown) {
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  }

  openHelpDialog(veiculo: any) {
    // Stop the auto-slide when modal is opened
    this.stopAutoSlide();

    // Criar uma cópia profunda para edição e para restaurar depois se necessário
    this.selectedVehicle = JSON.parse(JSON.stringify(veiculo));
    this.originalVehicleState = JSON.parse(JSON.stringify(veiculo));
    
    // Garantir que todas as cores correspondam às opções disponíveis
    this.selectedVehicle.atributos.forEach((atributo: any) => {
      atributo.cor = this.getClosestColorMatch(atributo.cor);
    });
    
    // Garantir que arrays existam para evitar erros
    if (!this.selectedVehicle.comentarios) {
      this.selectedVehicle.comentarios = [];
    }
    if (!this.selectedVehicle.trocasOleo) {
      this.selectedVehicle.trocasOleo = [];
    }
    
    this.isHelpDialogOpen = true;
    this.renderer.addClass(document.body, 'overflow-hidden');
    
    // Reseta os estados dos painéis
    this.showComments = false;
    this.showOilChangeRecords = false;
    this.showOilChangeForm = false;
    
    // Limpar campos de texto
    this.newComment = '';
    
    // Foco no modal para acessibilidade
    setTimeout(() => {
      const closeButton = document.querySelector('#modal-close-button');
      if (closeButton) {
        (closeButton as HTMLElement).focus();
      }
    }, 100);
  }

  closeHelpDialog() {
    this.isHelpDialogOpen = false;
    this.renderer.removeClass(document.body, 'overflow-hidden');
    this.selectedVehicle = null;
    this.originalVehicleState = null;
    this.showComments = false;
    this.showOilChangeForm = false;
    this.showOilChangeRecords = false;
    this.newComment = '';

    // Resume the auto-slide when modal is closed
    this.startAutoSlide();
  }
} 