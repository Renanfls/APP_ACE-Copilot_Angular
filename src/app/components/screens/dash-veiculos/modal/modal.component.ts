import { Component, OnInit, Renderer2, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {
  veiculos: any[] = [];
  selectedVehicle: any = null;
  isHelpDialogOpen = false;
  originalData: any = null; // Para armazenar os dados JSON originais
  originalVehicleState: any = null; // Para armazenar o estado original do veículo selecionado
  
  // Variáveis para o acordeão de comentários
  showComments = false;
  newComment = '';
  
  // Variáveis para troca de óleo
  showOilChangeForm = false;
  lastOilChangeDate = '';
  
  // Variáveis para o acordeão de registros de troca de óleo
  showOilChangeRecords = false;

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
    private cdRef: ChangeDetectorRef // Adicionar ChangeDetectorRef para forçar atualização da view
  ) {}

  ngOnInit() {
    console.log('CardVeiculoComponent initialized');
    this.loadVehicleData();
  }

  loadVehicleData() {
    this.http.get<any>('assets/mocks/veiculos_mock.json').subscribe({
      next: (data) => {
        console.log('Data loaded:', data);
        // Armazenar os dados originais
        this.originalData = JSON.parse(JSON.stringify(data));
        
        // Processar os dados para exibição
        this.veiculos = data.veiculos.map((v: any) => ({
          ...v,
          atributos: v.cores.map((cor: string, index: number) => ({
            cor,
            icone: this.icones[index] || ''
          })),
          // Inicializar comentários para cada veículo
          comentarios: v.comentarios || [],
          // Inicializar propriedades de troca de óleo, se não existirem
          odoAtual: v.odoAtual || 0,
          ultimaTrocaOleo: v.ultimaTrocaOleo || null,
          odoNaUltimaTroca: v.odoNaUltimaTroca || 0,
          // Inicializar array de registros de troca de óleo
          trocasOleo: v.trocasOleo || []
        }));
        
        // Assegurar que todas as cores estejam no formato esperado
        this.veiculos.forEach(veiculo => {
          veiculo.atributos.forEach((atributo: any, index: number) => {
            // Garantir que as cores correspondam às opções disponíveis
            atributo.cor = this.getClosestColorMatch(atributo.cor);
          });
          
          // Calcular odo desde a última troca de óleo
          this.calcularodoDesdeUltimaTroca(veiculo);
        });
      },
      error: (err) => {
        console.error('Erro ao carregar o JSON:', err);
      }
    });
  }

  // Calcular quilometragem desde a última troca de óleo
  calcularodoDesdeUltimaTroca(veiculo: any) {
    if (veiculo.odoAtual && veiculo.odoNaUltimaTroca) {
      veiculo.odoDesdeUltimaTroca = veiculo.odoAtual - veiculo.odoNaUltimaTroca;
    } else {
      veiculo.odoDesdeUltimaTroca = veiculo.odoAtual || 0;
    }
    
    // Verificar se precisa de troca de óleo (odo > 10.000)
    veiculo.precisaTrocaOleo = veiculo.odoDesdeUltimaTroca >= 10000;
  }

  // Registrar nova troca de óleo
  registrarTrocaOleo() {
    if (!this.selectedVehicle) return;
    
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Atualizar dados do veículo selecionado
    this.selectedVehicle.ultimaTrocaOleo = now.toLocaleDateString('pt-BR');
    this.selectedVehicle.odoNaUltimaTroca = this.selectedVehicle.odoAtual;
    this.selectedVehicle.odoDesdeUltimaTroca = 0;
    this.selectedVehicle.precisaTrocaOleo = false;
    
    // Certificar que o array de trocas de óleo existe
    if (!this.selectedVehicle.trocasOleo) {
      this.selectedVehicle.trocasOleo = [];
    }
    
    // Adicionar registro sobre a troca de óleo
    this.selectedVehicle.trocasOleo.unshift({
      author: 'Sistema',
      date: formattedDate,
      text: `Troca de óleo realizada com odômetro ${this.selectedVehicle.odoAtual}.`
    });
    
    // Fechar formulário de troca de óleo
    this.showOilChangeForm = false;
    
    // Mostrar o painel de registros de troca de óleo
    this.showOilChangeRecords = true;
    
    // Forçar atualização da view
    this.cdRef.detectChanges();
  }

  // Alternar exibição do formulário de troca de óleo
  toggleOilChangeForm() {
    this.showOilChangeForm = !this.showOilChangeForm;
  }
  
  // Alternar exibição do painel de registros de troca de óleo
  toggleOilChangeRecords() {
    this.showOilChangeRecords = !this.showOilChangeRecords;
    
    // Fechar o outro painel se estiver aberto
    if (this.showOilChangeRecords) {
      this.showComments = false;
      
      // Garantir que os registros de troca de óleo existam para evitar erros
      if (!this.selectedVehicle.trocasOleo) {
        this.selectedVehicle.trocasOleo = [];
      }
      
      // Forçar detecção de mudanças para exibir os registros imediatamente
      this.cdRef.detectChanges();
    }
  }

  // Verificar se deve mostrar alerta de troca de óleo
  shouldShowOilChangeAlert(veiculo: any): boolean {
    return veiculo.precisaTrocaOleo === true;
  }

  // Método para encontrar a cor mais próxima entre as disponíveis
  getClosestColorMatch(currentColor: string): string {
    // Se a cor já for uma das nossas opções, retorne-a
    const allColors = this.getAllAttributeColors();
    if (allColors.includes(currentColor)) {
      return currentColor;
    }
    
    // Caso contrário, encontre a cor padrão mais próxima (aqui usamos o primeiro item)
    return allColors[0];
  }

  getBackgroundColor(status: string): string {
    switch (status) {
      case 'OK': return 'white';
      case 'Oficina': return '#FF9858';
      case 'Sem Comunicar': return '#E25652';
      case 'Inativo': return '#B9B9B9';
      default: return 'white';
    }
  }

  getIconPath(index: number): string {
    return this.icones[index] || '';
  }

  // Método para obter o nome do atributo com base no índice
  getAttributeName(index: number): string {
    const attributeNames = [
      'Temperatura',
      'Torque',
      'Pressão Turbina',
      'Pedal',
      'Ar Comprimido',
      'Max. Velocidade'
    ];
    
    return attributeNames[index] || `Atributo ${index + 1}`;
  }

  // Método para obter as opções de cores com os novos nomes
  getColorOptions() {
    return [
      { label: 'Inativo', value: '#242427' },
      { label: 'Verde', value: '#387E38' },
      { label: 'Laranja', value: '#F56B15' },
      { label: 'Vermelho', value: '#AE2724' },
      { label: 'Roxo', value: '#6224AE' }
    ];
  }

  openHelpDialog(veiculo: any) {
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
  }

  // Método para alternar a exibição do acordeão de comentários
  toggleComments() {
    this.showComments = !this.showComments;
    
    // Fechar o outro painel se estiver aberto
    if (this.showComments) {
      this.showOilChangeRecords = false;
      
      // Forçar detecção de mudanças para exibir os comentários imediatamente
      this.cdRef.detectChanges();
    }
  }

  // Método para adicionar um novo comentário
  addComment() {
    if (this.newComment.trim() && this.selectedVehicle) {
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString('pt-BR')} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // Certifique-se de que o array de comentários existe
      if (!this.selectedVehicle.comentarios) {
        this.selectedVehicle.comentarios = [];
      }
      
      // Adicionar novo comentário
      this.selectedVehicle.comentarios.unshift({
        author: 'Usuário Atual',
        date: formattedDate,
        text: this.newComment.trim()
      });
      
      // Encontrar o veículo na lista original e atualizar também
      const vehicleIndex = this.veiculos.findIndex(v => v.id === this.selectedVehicle.id);
      if (vehicleIndex !== -1) {
        if (!this.veiculos[vehicleIndex].comentarios) {
          this.veiculos[vehicleIndex].comentarios = [];
        }
        // Atualizar comentários no veículo original
        this.veiculos[vehicleIndex].comentarios = [...this.selectedVehicle.comentarios];
      }
      
      this.newComment = '';
      
      // Forçar atualização da view
      this.cdRef.detectChanges();
    }
  }

  // Método para obter todas as cores únicas usadas em todos os atributos
  getAllAttributeColors(): string[] {
    // Utilizamos as cores definidas no método getColorOptions
    return this.getColorOptions().map(option => option.value);
  }

  // Função para atualizar a cor de um atributo (adaptada para funcionar com select e input color)
  updateAttributeColor(index: number, event: Event) {
    if (!this.selectedVehicle) return;
    
    // Corrigindo o tipo do event.target
    const inputElement = event.target as HTMLInputElement | HTMLSelectElement;
    const newColor = inputElement.value;
    
    // Atualizar a cor no objeto selectedVehicle
    this.selectedVehicle.atributos[index].cor = newColor;
  }

  // Método para cancelar as alterações
  cancelChanges() {
    // Fechar o modal sem aplicar alterações
    this.closeHelpDialog();
  }

  // Método para salvar as alterações
  saveChanges() {
    if (this.selectedVehicle) {
      // Encontrar o veículo na lista
      const vehicleIndex = this.veiculos.findIndex(v => v.id === this.selectedVehicle.id);
      if (vehicleIndex !== -1) {
        // Atualizar o veículo na lista
        // Precisamos preservar a referência, então atualizamos propriedade por propriedade
        this.veiculos[vehicleIndex].atributos.forEach((atributo: any, idx: number) => {
          if (idx < this.selectedVehicle.atributos.length) {
            atributo.cor = this.selectedVehicle.atributos[idx].cor;
          }
        });
        
        // Atualizar comentários
        this.veiculos[vehicleIndex].comentarios = [...this.selectedVehicle.comentarios];
        
        // Atualizar registros de troca de óleo
        this.veiculos[vehicleIndex].trocasOleo = [...(this.selectedVehicle.trocasOleo || [])];
        
        // Atualizar dados de troca de óleo
        this.veiculos[vehicleIndex].ultimaTrocaOleo = this.selectedVehicle.ultimaTrocaOleo;
        this.veiculos[vehicleIndex].odoNaUltimaTroca = this.selectedVehicle.odoNaUltimaTroca;
        this.veiculos[vehicleIndex].odoDesdeUltimaTroca = this.selectedVehicle.odoDesdeUltimaTroca;
        this.veiculos[vehicleIndex].precisaTrocaOleo = this.selectedVehicle.precisaTrocaOleo;
        
        // Atualizar também no originalData para salvar no JSON
        if (this.originalData && this.originalData.veiculos && 
            this.originalData.veiculos[vehicleIndex]) {
          
          // Atualizar cores
          if (this.originalData.veiculos[vehicleIndex].cores) {
            this.selectedVehicle.atributos.forEach((atributo: any, idx: number) => {
              if (idx < this.originalData.veiculos[vehicleIndex].cores.length) {
                this.originalData.veiculos[vehicleIndex].cores[idx] = atributo.cor;
              }
            });
          }
          
          // Atualizar comentários
          this.originalData.veiculos[vehicleIndex].comentarios = [...this.selectedVehicle.comentarios];
          
          // Atualizar registros de troca de óleo
          this.originalData.veiculos[vehicleIndex].trocasOleo = [...(this.selectedVehicle.trocasOleo || [])];
          
          // Atualizar dados de troca de óleo
          this.originalData.veiculos[vehicleIndex].ultimaTrocaOleo = this.selectedVehicle.ultimaTrocaOleo;
          this.originalData.veiculos[vehicleIndex].odoNaUltimaTroca = this.selectedVehicle.odoNaUltimaTroca;
        }
        
        // Recalcular odo desde última troca
        this.calcularodoDesdeUltimaTroca(this.veiculos[vehicleIndex]);
        
        // Salvar alterações no JSON
        this.saveChangesToJson();
      }
    }
    
    // Fechar o modal após salvar
    this.closeHelpDialog();
  }

  // Função para salvar as alterações no JSON
  saveChangesToJson() {
    console.log('Salvando alterações:', this.originalData);
    
    // Em uma aplicação real, você faria uma chamada HTTP POST/PUT aqui
    // para salvar as alterações no servidor
  }

  // Lidar com a tecla Escape para fechar o modal (acessibilidade adicional)
  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    if (this.isHelpDialogOpen) {
      this.closeHelpDialog();
    }
  }

  // Lidar com o trap de foco dentro do modal (acessibilidade adicional)
  @HostListener('document:keydown.tab', ['$event'])
  handleTabKey(event: KeyboardEvent) {
    if (!this.isHelpDialogOpen) return;
    
    const modal = document.querySelector('[role="dialog"]');
    if (!modal) return;
    
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  }
}
