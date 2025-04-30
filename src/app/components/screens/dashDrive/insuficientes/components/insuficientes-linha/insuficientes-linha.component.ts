// Componente completo com heatmap dividido em duas linhas
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexTheme,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  theme: ApexTheme;
  grid: ApexGrid;
  legend: ApexLegend;
  fill: ApexFill;
};

interface InsuficentesData {
  linha: string;
  quantidade: number;
  percentual: number;
  motoristas?: string[]; // Lista de motoristas para cada linha
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
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        const seriesIndex = opts.seriesIndex;
        const dataPointIndex = opts.dataPointIndex;
        const itemIndex = seriesIndex * 5 + dataPointIndex;
        const dadosLinha = this.insuficientesData[itemIndex];

        if (!dadosLinha) return '';
        return `${dadosLinha.linha}\n${val.toFixed(0)}%`; // \n para tentar quebra visual
      },
      style: {
        colors: ['#000'],
        fontSize: '12px',
        fontWeight: 'bold',
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0,
        colorScale: {
          ranges: [
            { from: 0, to: 10, color: '#FFCDD2', name: 'Baixo' },
            { from: 10.1, to: 30, color: '#E57373', name: 'Médio' },
            { from: 30.1, to: 100, color: '#B71C1C', name: 'Alto' },
          ],
        },
      },
    },
    xaxis: {
      type: 'category',
      categories: [],
      labels: {
        show: false, // Ocultar rótulos do eixo X
      },
      title: {
        text: '', // Remover título do eixo X
      },
    },
    legend: {
      show: false, // Remover legendas
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
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number, opts: any) => {
        const seriesIndex = opts.seriesIndex;
        const dataPointIndex = opts.dataPointIndex;
        const itemIndex = seriesIndex * 5 + dataPointIndex; // 5 é cardsPorLinha
        const dadosLinha = this.insuficientesData[itemIndex];

        if (!dadosLinha) return '';
        return `
        <div class="flex flex-col">
          <div>${dadosLinha.linha}</div>
          <div>${val}%</div>
        </div>
      `; // Exibe a linha e o percentual
      },
    },
    fill: {
      colors: ['#E53935'], // Cor vermelha para as barras
    },
    xaxis: {
      categories: [],
      title: { text: 'Linhas' },
    },
    yaxis: {
      title: { text: 'Quantidade' },
      labels: {
        formatter: (val: number) => val.toString(),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => val.toString(),
      },
    },
    legend: {
      position: 'top',
    },
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

  constructor(private fb: FormBuilder) {
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
    this.insuficientesData.sort(
      (a, b) => parseInt(a.linha) - parseInt(b.linha)
    );

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
      // Embaralhar a lista e selecionar a quantidade de motoristas necessária
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
      this.updateCharts();
      this.isLoading = false;
    }, 500);
  }

  updateCharts(): void {
    if (this.viewMode === 'heatmap') {
      this.updateHeatmap();
    } else {
      this.updateBarChart();
    }
  }

  updateHeatmap(): void {
    if (this.insuficientesData.length === 0) return;

    const totalQuantidade =
      this.insuficientesData.reduce((sum, item) => sum + item.quantidade, 0) ||
      1;

    const cardsPorLinha = 5;
    const categorias: string[] = [];
    const series: ApexAxisChartSeries = [];

    // Gerar categorias de colunas (ex: Slot 1, Slot 2, ..., Slot 5)
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
          y: item
            ? parseFloat(((item.quantidade / totalQuantidade) * 100).toFixed(2))
            : 0,
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
        height: grupos.length * 100, // altura proporcional à quantidade de linhas (gráficas)
      },
      series,
      xaxis: {
        labels: { show: true },
        title: { text: '' },
      },
      tooltip: {
        custom: ({ seriesIndex, dataPointIndex }) => {
          const itemIndex = seriesIndex * cardsPorLinha + dataPointIndex;
          const dadosLinha = this.insuficientesData[itemIndex];
          if (!dadosLinha) return '<div class="custom-tooltip">Sem dados</div>';

          const percentual = (
            (dadosLinha.quantidade / totalQuantidade) *
            100
          ).toFixed(2);

          return `
            <div class="custom-tooltip p-3">
              <span><b>Linha:</b> ${dadosLinha.linha}</span><br>
              <span><b>Quantidade:</b> ${dadosLinha.quantidade}</span><br>
              <span><b>Percentual do total:</b> ${percentual}%</span>
            </div>
          `;
        },
      },
    };
  }

  updateBarChart(): void {
    if (this.insuficientesData.length === 0) return;

    const linhas = this.insuficientesData.map((item) => item.linha);
    const quantidades = this.insuficientesData.map((item) => item.quantidade);

    this.barChartOptions = {
      ...this.barChartOptions,
      series: [{ name: 'Quantidade', data: quantidades }],
      xaxis: {
        ...this.barChartOptions.xaxis,
        categories: linhas,
      },
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
}
