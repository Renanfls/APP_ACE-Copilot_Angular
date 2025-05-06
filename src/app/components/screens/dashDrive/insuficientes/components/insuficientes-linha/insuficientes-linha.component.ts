import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis | ApexYAxis[];
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  fill: ApexFill;
  colors: string[];
  labels: string[];
  markers: ApexMarkers;
  stroke: ApexStroke;
};

interface InsuficentesData {
  linha: string;
  quantidade: number;
  percentual: number;
  motoristas?: string[];
}

interface IndicadorMotorista {
  nome: string;
  valor: string;
  tendencia: number;
  unidade: string;
}

@Component({
  selector: 'app-insuficientes-linha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgApexchartsModule],
  templateUrl: './insuficientes-linha.component.html',
  styleUrls: ['./insuficientes-linha.component.scss'],
})
export class InsuficentesLinhaComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent | undefined;

  public heatmapOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      height: 350,
      type: 'heatmap',
      toolbar: {
        show: true,
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const seriesIndex = config.seriesIndex;
          const dataPointIndex = config.dataPointIndex;
          
          if (seriesIndex !== undefined && dataPointIndex !== undefined) {
            this.onChartClick({ seriesIndex, dataPointIndex });
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        const seriesIndex = opts.seriesIndex;
        const dataPointIndex = opts.dataPointIndex;
        const itemIndex = seriesIndex * 5 + dataPointIndex;
        const dadosLinha = this.insuficientesData[itemIndex];

        if (!dadosLinha) return '';
        return `${dadosLinha.linha}\n${val.toFixed(0)}%`;
      },
      style: {
        colors: ['#000'],
        fontSize: '20px',
        fontWeight: 'bold',
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            { from: 0, to: 10, color: '#BBDEFB', name: 'Baixo' },
            { from: 10.1, to: 30, color: '#64B5F6', name: 'Médio' },
            { from: 30.1, to: 100, color: '#1565C0', name: 'Alto' },
          ],
        },
      },
    },
    xaxis: {
      type: 'category',
      categories: [],
      labels: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
  };

  public barChartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      height: 350,
      type: 'bar',
      toolbar: {
        show: true,
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (config.dataPointIndex !== undefined && config.dataPointIndex >= 0) {
            const dadosLinha = this.insuficientesData[config.dataPointIndex];
            if (dadosLinha) {
              this.selecionarLinha(dadosLinha.linha);
            }
          }
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '65%',
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#fff'],
      }
    },
    fill: {
      colors: ['#1565C0'],
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#64B5F6'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
      }
    },
    xaxis: {
      categories: [],
      title: { 
        text: 'Linhas',
        style: { 
          color: '#fff',
          fontSize: '14px' 
        }
      },
      labels: {
        style: {
          colors: '#fff'
        }
      }
    },
    yaxis: {
      title: { 
        text: 'Percentual',
        style: { 
          color: '#fff',
          fontSize: '14px' 
        }
      },
      labels: {
        formatter: (val: number) => `${val}%`,
        style: {
          colors: '#fff'
        }
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
      theme: 'dark'
    },
    legend: {
      position: 'top',
      labels: {
        colors: '#fff'
      }
    },
  };

  public pontuacaoChartOptions: Partial<ChartOptions> = {
    series: [0],
    chart: {
      height: 250,
      type: 'radialBar',
      background: 'transparent',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
        track: {
          background: '#2c2c2e',
        },
        dataLabels: {
          show: true,
          name: {
            show: true,
            fontSize: '16px',
            fontWeight: 600,
            offsetY: -10,
            color: '#fff'
          },
          value: {
            show: true,
            fontSize: '30px',
            fontWeight: 700,
            formatter: (val) => `${val}%`,
            color: '#fff'
          }
        }
      }
    },
    colors: ['#64B5F6'],
    labels: ['Taxa'],
  };

  public giroChartOptions: Partial<ChartOptions> = {
    chart: {
      type: 'area',
      height: 250,
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#64B5F6'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    tooltip: {
      theme: 'dark'
    },
    xaxis: {
      categories: [],
      labels: {
        style: { colors: '#fff' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#fff' }
      }
    },
    series: [
      {
        name: 'Giro do Motor',
        data: []
      }
    ],
    markers: {
      size: 5,
      colors: ["#1565C0"],
      strokeWidth: 0,
      hover: {
        size: 7
      }
    },
  };
  
  // Novo gráfico de consumo
  public consumoChartOptions: Partial<ChartOptions> = {
    chart: {
      type: 'line',
      height: 250,
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    series: [
      {
        name: 'Consumo (km/l)',
        data: []
      }
    ],
    colors: ['#4CAF50'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: [],
      labels: {
        style: { colors: '#fff' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#fff' },
        formatter: (val) => val.toFixed(2)
      }
    },
    markers: {
      size: 5,
      colors: ["#4CAF50"],
      strokeWidth: 0
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val.toFixed(2)} km/l`
      }
    }
  };

  // Novo gráfico de uso de freio
  public freioChartOptions: Partial<ChartOptions> = {
    chart: {
      type: 'bar',
      height: 250,
      background: 'transparent',
      toolbar: { show: false },
      stacked: true
    },
    series: [
      {
        name: 'Freio',
        data: []
      },
      {
        name: 'Pedal',
        data: []
      }
    ],
    colors: ['#FF9800', '#F44336'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 4
      }
    },
    xaxis: {
      categories: [],
      labels: {
        style: { colors: '#fff' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#fff' },
        formatter: (val) => `${val}%`
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val}%`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: '#fff'
      }
    }
  };

  filterForm: FormGroup;
  insuficientesData: InsuficentesData[] = [];
  filterOptions = {
    empresas: ['Empresa A', 'Empresa B', 'Empresa C'],
    garagens: ['Garagem 1', 'Garagem 2', 'Garagem 3'],
    tiposTurno: ['Manhã', 'Tarde', 'Noite'],
  };

  viewMode: 'heatmap' | 'barras' = 'heatmap';
  isLoading = false;
  
  linhaSelecionada: string | null = null;
  motoristasSelecionados: string[] = [];
  motoristaSelecionado: string | null = null;
  indicadoresMotorista: IndicadorMotorista[] = [];

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private renderer: Renderer2) {
    this.filterForm = this.fb.group({
      periodoInicio: [this.getDefaultStartDate()],
      periodoFim: [new Date()],
      empresa: [''],
      garagem: [''],
      tipoTurno: [''],
    });
  }

  ngOnInit(): void {
    this.carregarDadosMockados();

    // Recarregar dados quando os filtros mudarem
    this.filterForm.valueChanges.subscribe(() => {
      this.carregarDadosMockados();
    });
  }

  getDefaultStartDate(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }

  carregarDadosMockados(): void {
    this.isLoading = true;
    this.resetSelecoes();

    // Lista de nomes para motoristas fictícios
    const nomesMotoristasDisponiveis = [
      'João Silva',
      'Maria Oliveira',
      'Pedro Santos',
      'Ana Costa',
      'Carlos Ferreira',
      'Luiza Souza',
      'Roberto Almeida',
      'Juliana Lima',
      'Marcos Ribeiro',
      'Fernanda Gomes',
      'Ricardo Martins',
      'Paula Cardoso',
      'André Pereira',
      'Camila Rodrigues',
      'Bruno Carvalho',
    ];

    // Função para gerar lista aleatória de motoristas
    const gerarListaMotoristas = (quantidade: number): string[] => {
      if (quantidade === 0) return [];
      return [...nomesMotoristasDisponiveis]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(quantidade, nomesMotoristasDisponiveis.length));
    };

    // Simulando tempo de carregamento
    setTimeout(() => {
      // Dados fictícios mockados com lista de motoristas
      this.insuficientesData = [
        {
          linha: '117',
          quantidade: 6,
          percentual: 6,
          motoristas: gerarListaMotoristas(6),
        },
        { linha: '133', quantidade: 0, percentual: 0, motoristas: [] },
        { linha: '161', quantidade: 0, percentual: 0, motoristas: [] },
        {
          linha: '201',
          quantidade: 2,
          percentual: 20,
          motoristas: gerarListaMotoristas(2),
        },
        {
          linha: '202',
          quantidade: 2,
          percentual: 20,
          motoristas: gerarListaMotoristas(2),
        },
        {
          linha: '415',
          quantidade: 56,
          percentual: 56,
          motoristas: gerarListaMotoristas(10),
        },
        {
          linha: '426',
          quantidade: 33,
          percentual: 33,
          motoristas: gerarListaMotoristas(8),
        },
        {
          linha: '539',
          quantidade: 2,
          percentual: 20,
          motoristas: gerarListaMotoristas(2),
        },
        { linha: '585', quantidade: 0, percentual: 0, motoristas: [] },
        { linha: '626', quantidade: 0, percentual: 0, motoristas: [] },
        {
          linha: '700',
          quantidade: 12,
          percentual: 12,
          motoristas: gerarListaMotoristas(5),
        },
        {
          linha: '701',
          quantidade: 15,
          percentual: 15,
          motoristas: gerarListaMotoristas(6),
        },
      ];
      
      // Ordenar por número da linha
      this.insuficientesData.sort((a, b) => parseInt(a.linha) - parseInt(b.linha));
      
      // Carregar indicadores gerais de desempenho
      this.carregarIndicadoresGerais();
      
      this.updateCharts();
      this.isLoading = false;
    }, 500);
  }

  carregarIndicadoresGerais(): void {
    this.indicadoresMotorista = [
      {
        nome: 'Eficiência',
        valor: '82',
        tendencia: 1,
        unidade: '%'
      },
      {
        nome: 'KM/L',
        valor: '3.45',
        tendencia: -1,
        unidade: 'km/l'
      },
      {
        nome: 'KM Total',
        valor: '1456',
        tendencia: 1,
        unidade: 'km'
      },
      {
        nome: 'Insuficientes',
        valor: '24',
        tendencia: -1,
        unidade: '%'
      },
      {
        nome: 'RPM Médio',
        valor: '2210',
        tendencia: 1,
        unidade: 'rpm'
      },
      {
        nome: 'Linhas',
        valor: '12',
        tendencia: 0,
        unidade: ''
      }
    ];
  }

  updateCharts(): void {
    if (this.viewMode === 'heatmap') {
      this.updateHeatmap();
    } else {
      this.updateBarChart();
    }
    
    // Atualizar gráficos gerais de desempenho
    this.atualizarGraficosGerais();
  }

  updateHeatmap(): void {
    if (this.insuficientesData.length === 0) return;

    const cardsPorLinha = 5;
    const categorias: string[] = [];
    const series: ApexAxisChartSeries = [];

    // Gerar categorias de colunas vazias
    for (let i = 0; i < cardsPorLinha; i++) {
      categorias.push(``);
    }

    // Dividir os dados em grupos de 5 para formar linhas (gráficas)
    const grupos = [];
    for (let i = 0; i < this.insuficientesData.length; i += cardsPorLinha) {
      grupos.push(this.insuficientesData.slice(i, i + cardsPorLinha));
    }

    grupos.forEach((grupo, index) => {
      const dataRow = categorias.map((cat, idx) => {
        const item = grupo[idx];
        return {
          x: cat,
          y: item ? item.percentual : 0,
        };
      });

      series.push({
        name: `Linha ${index + 1}`,
        data: dataRow,
      });
    });

    this.heatmapOptions = {
      ...this.heatmapOptions,
      chart: {
        ...(this.heatmapOptions.chart || {}),
        type: 'heatmap',
        height: grupos.length * 80,
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const seriesIndex = config.seriesIndex;
            const dataPointIndex = config.dataPointIndex;
            
            if (seriesIndex !== undefined && dataPointIndex !== undefined) {
              this.onChartClick({ seriesIndex, dataPointIndex });
            }
          }
        }
      },
      series,
      xaxis: {
        labels: { show: false },
        title: { text: '' },
      },
      tooltip: {
        custom: ({ seriesIndex, dataPointIndex }) => {
          const itemIndex = seriesIndex * cardsPorLinha + dataPointIndex;
          const dadosLinha = this.insuficientesData[itemIndex];
          if (!dadosLinha) return '<div class="custom-tooltip">Sem dados</div>';

          return `
            <div class="p-2 bg-gray-800 shadow-lg rounded-md border border-gray-700 text-white">
              <div class="font-bold mb-1">Linha: ${dadosLinha.linha}</div>
              <div>Quantidade: ${dadosLinha.quantidade}</div>
              <div>Percentual: ${dadosLinha.percentual}%</div>
              <div class="text-xs text-gray-300 mt-1">Clique para ver detalhes</div>
            </div>
          `;
        },
      },
    };
  }

  updateBarChart(): void {
    if (this.insuficientesData.length === 0) return;

    const linhas = this.insuficientesData.map((item) => item.linha);
    const percentuais = this.insuficientesData.map((item) => item.percentual);

    this.barChartOptions = {
      ...this.barChartOptions,
      series: [{ name: 'Percentual', data: percentuais }],
      xaxis: {
        ...this.barChartOptions.xaxis,
        categories: linhas,
      },
      chart: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...this.barChartOptions.chart!,
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            if (config.dataPointIndex !== undefined && config.dataPointIndex >= 0) {
              const dadosLinha = this.insuficientesData[config.dataPointIndex];
              if (dadosLinha) {
                this.selecionarLinha(dadosLinha.linha);
              }
            }
          }
        }
      }
    };
  }

  atualizarGraficosGerais(): void {
    // Datas para o eixo X (últimos 7 dias)
    const datas = Array.from({ length: 7 }, (_, i) => {
      const data = new Date();
      data.setDate(data.getDate() - (6 - i));
      return `${data.getDate()}/${data.getMonth() + 1}`;
    });
    
    // Taxa de Insuficientes
    const pontuacao = Math.floor(65 + Math.random() * 30);
    this.pontuacaoChartOptions.series = [pontuacao];
    
    // Giro do Motor
    this.giroChartOptions.series = [
      {
        name: 'Giro do Motor',
        data: datas.map(() => Math.floor(1600 + Math.random() * 800))
      }
    ];
    
    this.giroChartOptions.xaxis = {
      categories: datas,
      labels: {
        style: { colors: '#fff' }
      }
    };
    
    // Consumo (km/l)
    this.consumoChartOptions.series = [
      {
        name: 'Consumo (km/l)',
        data: datas.map(() => +(2.5 + Math.random() * 1.2).toFixed(2))
      }
    ];
    
    this.consumoChartOptions.xaxis = {
      categories: datas,
      labels: {
        style: { colors: '#fff' }
      }
    };
    
    // Uso de Freio e Pedal    
    this.freioChartOptions.series = [
      {
        name: 'Freio',
        data: datas.map(() => Math.floor(15 + Math.random() * 40))
      },
      {
        name: 'Pedal',
        data: datas.map(() => Math.floor(20 + Math.random() * 45))
      }
    ];
    
    this.freioChartOptions.xaxis = {
      categories: datas,
      labels: {
        style: { colors: '#fff' }
      }
    };
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'heatmap' ? 'barras' : 'heatmap';
    setTimeout(() => this.updateCharts(), 0);
  }

  exportarDados(): void {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Linha,Quantidade,Percentual,Motoristas\n' +
      this.insuficientesData
        .map(
          (row) =>
            `${row.linha},${row.quantidade},${row.percentual},"${(
              row.motoristas || []
            ).join('; ')}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'insuficientes_por_linha.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Métodos para gerenciar a seleção
  onChartClick(event: { seriesIndex: number; dataPointIndex: number }): void {
    const cardsPorLinha = 5;
    const itemIndex = event.seriesIndex * cardsPorLinha + event.dataPointIndex;
    
    // Verificar se o índice é válido
    if (itemIndex >= 0 && itemIndex < this.insuficientesData.length) {
      const dadosLinha = this.insuficientesData[itemIndex];
      if (dadosLinha) {
        this.selecionarLinha(dadosLinha.linha);
      }
    }
  }
  
  selecionarLinha(linha: string): void {
    // Se já estava selecionada, desselecionar
    if (this.linhaSelecionada === linha) {
      this.resetSelecoes();
      this.cdr.detectChanges();
      return;
    }
    
    this.linhaSelecionada = linha;
    this.motoristaSelecionado = null;
    
    // Encontrar a linha nos dados
    const dadosLinha = this.insuficientesData.find(item => item.linha === linha);
    if (dadosLinha && dadosLinha.motoristas && dadosLinha.motoristas.length > 0) {
      this.motoristasSelecionados = dadosLinha.motoristas;
    } else {
      this.motoristasSelecionados = [];
    }
    this.cdr.detectChanges();
  }
  
  selecionarMotorista(motorista: string): void {
    this.motoristaSelecionado = motorista;
    this.carregarDadosMotorista(motorista);
  }
  
  resetSelecoes(): void {
    this.linhaSelecionada = null;
    this.motoristasSelecionados = [];
    this.motoristaSelecionado = null;
  }
  
  carregarDadosMotorista(motorista: string): void {
    // Datas para o eixo X (últimos 7 dias)
    const datas = Array.from({ length: 7 }, (_, i) => {
      const data = new Date();
      data.setDate(data.getDate() - (6 - i));
      return `${data.getDate()}/${data.getMonth() + 1}`;
    });
    
    // Giro do Motor
    this.giroChartOptions.series = [
      {
        name: 'Giro do Motor',
        data: datas.map(() => Math.floor(1600 + Math.random() * 800))
      }
    ];
    
    this.giroChartOptions.xaxis = {
      categories: datas,
      labels: {
        style: { colors: '#fff' }
      }
    };
    
    // Consumo (km/l)
    this.consumoChartOptions.series = [
      {
        name: 'Consumo (km/l)',
        data: datas.map(() => +(2.5 + Math.random() * 1.2).toFixed(2))
      }
    ];
    
    this.consumoChartOptions.xaxis = {
      categories: datas,
      labels: {
        style: { colors: '#fff' }
      }
    };
    
    // Uso de Freio e Pedal
    this.freioChartOptions.series = [
      {
        name: 'Freio',
        data: datas.map(() => Math.floor(15 + Math.random() * 40))
      },
      {
        name: 'Pedal',
        data: datas.map(() => Math.floor(20 + Math.random() * 45))
      }
    ];
    
    this.freioChartOptions.xaxis = {
      categories: datas,
      labels: {
        style: { colors: '#fff' }
      }
    };
  }
}