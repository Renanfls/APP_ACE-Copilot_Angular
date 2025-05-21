import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matAddRound,
  matAvTimerRound,
  matBarChartRound,
  matBatteryAlertRound,
  matCalendarTodayRound,
  matClearRound,
  matDarkModeRound,
  matDirectionsCarRound,
  matDownloadRound,
  matFilterAltRound,
  matGridViewRound,
  matInsightsRound,
  matLightModeRound,
  matLocalGasStationRound,
  matMapRound,
  matPedalBikeRound,
  matRefreshRound,
  matRemoveRound,
  matScheduleRound,
  matSearchOffRound,
  matSearchRound,
  matSpeedRound,
  matTrendingDownRound,
  matTrendingUpRound
} from '@ng-icons/material-icons/round';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { TripAnalysisService, TripData } from '../../services/trip-analysis.service';

interface TripAnalysisData {
  cpo1: string;
  val1: string;
  cpo2: string;
  val2: string;
}

@Component({
  selector: 'app-trip-analysis',
  templateUrl: './trip-analysis.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    DatePipe,
    NgIconComponent,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    GoogleMapsModule,
    BaseChartDirective,
    FormsModule,
    MatSelectModule
  ],
  viewProviders: [
    provideIcons({
      matSpeedRound,
      matLocalGasStationRound,
      matAvTimerRound,
      matBatteryAlertRound,
      matLightModeRound,
      matDarkModeRound,
      matTrendingUpRound,
      matTrendingDownRound,
      matDirectionsCarRound,
      matClearRound,
      matSearchRound,
      matDownloadRound,
      matSearchOffRound,
      matPedalBikeRound,
      matFilterAltRound,
      matScheduleRound,
      matMapRound,
      matAddRound,
      matRemoveRound,
      matRefreshRound,
      matInsightsRound,
      matGridViewRound,
      matBarChartRound,
      matCalendarTodayRound
    }),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: rgb(249, 250, 251);
      color: var(--md-sys-color-on-background);
    }

    .dark :host {
      background-color: rgb(17, 24, 39);
    }

    /* Material Design 3 Card Styles */
    .surface-container-highest {
      background-color: var(--md-sys-color-surface-container-highest);
      box-shadow: var(--md-sys-elevation-2);
      border-radius: 1rem;
      overflow: hidden;
    }

    .surface-container-high {
      background-color: var(--md-sys-color-surface-container-high);
      box-shadow: var(--md-sys-elevation-1);
      border-radius: 1rem;
      overflow: hidden;
    }

    /* Material Design 3 Card Content Styles */
    .mat-mdc-card {
      border-radius: 1rem !important;
      overflow: hidden;
    }

    .mat-mdc-card-content {
      padding: 1rem;
    }

    /* Material Design 3 Form Field Styles */
    ::ng-deep .mat-mdc-form-field {
      --mdc-outlined-text-field-container-shape: 1rem;
      --mdc-outlined-text-field-outline-color: var(--md-sys-color-outline);
      --mdc-outlined-text-field-focus-outline-color: #F59E0B;
      --mdc-outlined-text-field-hover-outline-color: #F59E0B;
      --mdc-outlined-text-field-focus-label-text-color: #F59E0B;
      --mdc-outlined-text-field-label-text-color: var(--md-sys-color-on-surface-variant);
      --mdc-outlined-text-field-input-text-color: var(--md-sys-color-on-surface);
      --mdc-outlined-text-field-disabled-outline-color: var(--md-sys-color-outline);
      --mdc-outlined-text-field-disabled-label-text-color: var(--md-sys-color-on-surface-variant);
    }

    ::ng-deep .mat-mdc-form-field.mat-mdc-form-field-type-mat-input .mdc-notched-outline__notch {
      border-right: none;
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-start,
    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-end {
      border-radius: 1rem !important;
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-flex {
      background-color: var(--md-sys-color-surface-container-highest);
      border-radius: 1rem !important;
      min-height: 56px;
      padding: 0 !important;
      gap: 0;
      align-items: center;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      padding: 0 !important;
    }

    ::ng-deep .mat-mdc-form-field-infix {
      padding: 8px 0 !important;
      min-height: 48px !important;
    }

    ::ng-deep .mdc-text-field--outlined {
      padding: 0 16px !important;
    }

    ::ng-deep .mat-mdc-form-field-icon-suffix {
      padding: 0 !important;
      margin-right: -8px !important;
    }

    ::ng-deep .mat-mdc-form-field-icon-suffix > .mat-icon {
      padding: 0 !important;
      margin: 0 !important;
    }

    ::ng-deep .mat-datepicker-toggle {
      margin-right: -12px !important;
    }

    ::ng-deep .mat-mdc-form-field input.mat-mdc-input-element {
      padding: 8px 16px !important;
    }

    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      padding: 0 16px !important;
    }

    ::ng-deep .mat-mdc-form-field-hint-wrapper, 
    ::ng-deep .mat-mdc-form-field-error-wrapper {
      padding: 0 16px !important;
    }

    ::ng-deep .mat-mdc-form-field-label {
      padding-left: 16px !important;
      margin-top: -4px !important;
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline .mdc-notched-outline--upgraded .mdc-floating-label--float-above {
      --mat-mdc-form-field-label-transform: translateY(-34px) scale(0.75);
      transform: var(--mat-mdc-form-field-label-transform);
    }

    /* Material Design 3 Button Styles */
    ::ng-deep .mat-mdc-button.mat-primary {
      --mdc-filled-button-container-color: #F59E0B;
      --mdc-filled-button-label-text-color: #000000;
      border-radius: 0.5rem;
    }

    ::ng-deep .mat-mdc-button.mat-stroked {
      --mdc-outlined-button-outline-color: var(--md-sys-color-outline);
      --mdc-outlined-button-label-text-color: var(--md-sys-color-on-surface);
      border-radius: 0.5rem;
    }

    /* Material Design 3 Table Styles */
    ::ng-deep .mat-mdc-table {
      background: transparent;
      --mat-table-background-color: transparent;
      border-radius: 0.5rem;
      overflow: hidden;
    }

    ::ng-deep .mat-mdc-header-row {
      background-color: var(--md-sys-color-surface-container-low);
    }

    ::ng-deep .mat-mdc-row {
      transition: background-color 0.2s ease;
    }

    ::ng-deep .mat-mdc-row:hover {
      background-color: var(--md-sys-color-surface-container);
    }

    /* Material Design 3 Typography */
    ::ng-deep .mat-mdc-card-title {
      font-family: var(--md-sys-typescale-headline-small-font-family-name);
      font-weight: var(--md-sys-typescale-headline-small-font-weight);
      font-size: var(--md-sys-typescale-headline-small-font-size);
      line-height: var(--md-sys-typescale-headline-small-line-height);
      color: var(--md-sys-color-on-surface);
    }

    /* Status Badge Styles */
    .status-badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Empty State Styles */
    .empty-state-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: var(--md-sys-color-surface-container-low);
      color: var(--md-sys-color-on-surface-variant);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .empty-state-text {
      color: var(--md-sys-color-on-surface-variant);
      font-size: var(--md-sys-typescale-body-large-font-size);
      line-height: var(--md-sys-typescale-body-large-line-height);
    }

    /* Button Toggle Styles */
    ::ng-deep .mat-button-toggle-group {
      border-radius: 9999px;
      overflow: hidden;
      position: relative;
      border: none !important;
      background-color: var(--md-sys-color-surface-container-highest);
      padding: 4px;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
    }

    ::ng-deep .mat-button-toggle {
      border: none !important;
      background: transparent;
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
      margin: 0 2px;
      border-radius: 9999px;
    }

    ::ng-deep .mat-button-toggle-button {
      border-radius: 9999px;
    }

    ::ng-deep .mat-button-toggle-checked {
      color: var(--md-sys-color-on-primary) !important;
      background: transparent !important;
    }

    ::ng-deep .mat-button-toggle-group .mat-button-toggle-checked::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #F59E0B;
      z-index: -1;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: left;
      border-radius: 9999px;
      box-shadow: 0 2px 4px rgba(245, 158, 11, 0.1);
    }

    ::ng-deep .mat-button-toggle-group .mat-button-toggle:not(.mat-button-toggle-checked) {
      color: var(--md-sys-color-on-surface-variant);
    }

    ::ng-deep .mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
      line-height: 32px;
      padding: 0 16px;
      font-weight: 500;
      border-radius: 9999px;
    }

    ::ng-deep .mat-button-toggle-group .mat-button-toggle:first-child.mat-button-toggle-checked ~ .mat-button-toggle-checked::before {
      transform: translateX(-100%);
    }

    ::ng-deep .mat-button-toggle-group .mat-button-toggle:last-child.mat-button-toggle-checked::before {
      transform: translateX(0);
    }

    ::ng-deep .mat-button-toggle-group.mat-button-toggle-group-appearance-standard {
      border-radius: 9999px;
      background: var(--md-sys-color-surface-container-low);
      padding: 4px;
    }

    ::ng-deep .mat-button-toggle .mat-button-toggle-button::after {
      display: none !important;
    }

    ::ng-deep .mat-button-toggle-checked .mat-button-toggle-button::after {
      display: none !important;
    }

    ::ng-deep .mat-button-toggle-focus-overlay {
      display: none;
    }

    ::ng-deep .mat-button-toggle .mat-ripple {
      display: none;
    }

    .dark ::ng-deep .mat-button-toggle-group {
      background-color: var(--md-sys-color-surface-container-low);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    /* Progress Bar Styles */
    ::ng-deep .mat-mdc-progress-bar {
      border-radius: 0.5rem;
    }

    /* Tooltip Styles */
    ::ng-deep .mat-mdc-tooltip {
      border-radius: 0.5rem !important;
    }

    /* Menu Styles */
    ::ng-deep .mat-mdc-menu-panel {
      border-radius: 0.5rem !important;
    }

    /* Select Styles */
    ::ng-deep .mat-mdc-select-panel {
      border-radius: 0.5rem !important;
    }

    /* Dialog Styles */
    ::ng-deep .mat-mdc-dialog-container {
      border-radius: 0.5rem !important;
    }

    /* Responsive Table Styles */
    @media (max-width: 767px) {
      ::ng-deep .mat-mdc-paginator {
        background: transparent;
      }

      ::ng-deep .mat-mdc-paginator-page-size {
        display: none !important;
      }

      ::ng-deep .mat-mdc-paginator-range-label {
        margin: 0 12px !important;
      }

      ::ng-deep .mat-mdc-table {
        border: none;
        box-shadow: none;
      }

      ::ng-deep .mat-mdc-row {
        padding: 8px;
        margin-bottom: 8px;
        border-radius: 8px;
        background-color: var(--md-sys-color-surface-container-high);
      }

      ::ng-deep .mat-mdc-header-row {
        display: none;
      }

      ::ng-deep .mat-mdc-row {
        flex-direction: column;
        align-items: start;
        padding: 16px;
      }

      ::ng-deep .mat-mdc-cell {
        width: 100%;
        text-align: left;
        padding: 4px 0;
        border-bottom: none;
      }

      ::ng-deep .mat-mdc-cell:before {
        content: attr(data-label);
        float: left;
        font-weight: 500;
        color: var(--md-sys-color-on-surface-variant);
        margin-right: 8px;
      }
    }

    .TitleClass {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    .HeaderCenter {
      text-align: center;
    }
    .BodyCenter {
      text-align: center;
    }
    .form-container {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    mat-form-field {
      width: 100%;
    }
    .mat-elevation-z8 {
      width: 100%;
      margin-bottom: 1rem;
    }
  `]
})
export class TripAnalysisComponent implements OnInit, AfterViewInit, OnDestroy {
  filterForm: FormGroup;
  displayedColumns: string[] = [
    'data',
    'inicio',
    'fim',
    'mecanica',
    'modelo',
    'versao',
    'status',
    'km',
    'distancia',
    'litros',
    'litrosParado',
    'kmPorLitro',
    'giro',
    'freio',
    'pedal',
    'odometroInicial',
    'odometroFinal'
  ];

  // Add new property for Analise de Viagem table columns
  analiseColumns: string[] = ['campo1', 'valor1', 'campo2', 'valor2'];

  dataSource = new MatTableDataSource<TripData>();
  previousPeriodData: TripData[] = [];
  isDarkMode = true;
  isLoading = false;
  updateAvailable = false;
  currentYear = new Date().getFullYear();
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  totalItems = 0;
  displayedData: TripData[] = [];
  metrics = [
    { 
      name: 'Giro',
      value: 0,
      icon: 'matAvTimerRound',
      color: '#F472B6', // Pink-400
      label: ''
    },
    { 
      name: 'Freio',
      value: 0,
      icon: 'matBatteryAlertRound',
      color: '#FB923C', // Orange-400
      label: ''
    },
    { 
      name: 'Pedal',
      value: 0,
      icon: 'matPedalBikeRound',
      color: '#A78BFA', // Violet-400
      label: ''
    }
  ];

  // Google Maps properties
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild('googleMap') googleMap!: GoogleMap;
  center: google.maps.LatLngLiteral = { lat: -23.550520, lng: -46.633308 }; // São Paulo
  zoom = 12;
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP
  };
  startMarkerOptions: google.maps.MarkerOptions = {
    ...this.markerOptions,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: '#34D399',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
    }
  };
  endMarkerOptions: google.maps.MarkerOptions = {
    ...this.markerOptions,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: '#F43F5E',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
    }
  };
  stopMarkerOptions: google.maps.MarkerOptions = {
    ...this.markerOptions,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: '#F59E0B',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
    }
  };
  routePath: google.maps.LatLngLiteral[] = [];
  stopPoints: google.maps.LatLngLiteral[] = [];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#F59E0B',
    strokeOpacity: 1.0,
    strokeWeight: 3,
    geodesic: true
  };

  selectedMarkerContent: string = '';
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Chart configuration
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Giro',
        backgroundColor: '#F472B620',
        borderColor: '#F472B6',
        pointBackgroundColor: '#F472B6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#F472B6',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Freio',
        backgroundColor: '#FB923C20',
        borderColor: '#FB923C',
        pointBackgroundColor: '#FB923C',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#FB923C',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Pedal',
        backgroundColor: '#A78BFA20',
        borderColor: '#A78BFA',
        pointBackgroundColor: '#A78BFA',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#A78BFA',
        fill: 'origin',
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.4
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          color: 'rgb(107, 114, 128)'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  public lineChartType: ChartType = 'line';

  directionsRenderer: google.maps.DirectionsRenderer | null = null;
  mapOptions: google.maps.MapOptions = {
    zoom: 13,
    center: { lat: -23.5505, lng: -46.6333 }, // Praça da Sé
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  private markers: google.maps.Marker[] = [];

  isAdmin = true;
  veiculoIV: string = '';
  dateRangeIV: Date[] = [];
  dadosViagem: TripAnalysisData[] = [];
  lblUltConIV: string = '';
  empresa: number = 165; // Empresa fixa como 165
  veiculos: Array<{value: string, label: string}> = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly tripAnalysisService: TripAnalysisService,
    private http: HttpClient,
    private authSrv: AuthService
  ) {
    this.filterForm = this.fb.group({
      placa: ['47457', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      data: [new Date('2024-05-20'), Validators.required],
      horaInicial: ['06:00', Validators.required],
      horaFinal: ['12:00', [Validators.required, this.horaFinalValidator()]]
    });

    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.updateTheme();
  }

  private horaFinalValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) {
        return null;
      }
      
      const horaInicial = control.parent.get('horaInicial')?.value;
      const horaFinal = control.value;
      
      if (!horaInicial || !horaFinal) {
        return null;
      }

      const [horaInicialHour, horaInicialMin] = horaInicial.split(':').map(Number);
      const [horaFinalHour, horaFinalMin] = horaFinal.split(':').map(Number);
      
      const inicialMinutes = horaInicialHour * 60 + horaInicialMin;
      const finalMinutes = horaFinalHour * 60 + horaFinalMin;
      
      if (finalMinutes <= inicialMinutes) {
        return { horaFinalInvalida: true };
      }
      
      return null;
    };
  }

  ngOnInit(): void {
    // Carrega os dados iniciais
    this.loadData();
    // Adiciona listener para mudanças no tamanho da tela
    this.handleScreenSize();
    window.addEventListener('resize', () => this.handleScreenSize());
    this.loadVeiculos();
  }

  ngAfterViewInit() {
    this.updateChartData();
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    // Aguarda um momento para garantir que o mapa foi inicializado
    setTimeout(() => {
      this.initializeDirectionsRenderer();
      this.updateMapRoute();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Remove o listener quando o componente é destruído
    window.removeEventListener('resize', () => this.handleScreenSize());
  }

  private handleScreenSize(): void {
    if (window.innerWidth < 768) { // Mobile breakpoint
      this.pageSize = 1;
      this.pageSizeOptions = [1];
    } else {
      this.pageSize = 10;
      this.pageSizeOptions = [5, 10, 25, 100];
    }
    
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
      this.paginator.pageSizeOptions = this.pageSizeOptions;
      // Não recarrega os dados aqui para evitar chamadas desnecessárias
      this.updateDisplayedData();
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    // Salva a preferência do tema
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  private updateTheme(): void {
    // Remove ambas as classes primeiro
    document.body.classList.remove('dark', 'dark-theme');
    // Adiciona a classe correta
    if (this.isDarkMode) {
      document.body.classList.add('dark', 'dark-theme');
    }
  }

  loadData(): void {
    this.isLoading = true;
    const filters = this.filterForm.value;
    
    this.tripAnalysisService.getTripData(filters).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource<TripData>(data);
        this.totalItems = data.length;
        this.dataSource.paginator = this.paginator;
        this.pageIndex = 0; // Reset to first page when loading new data
        this.isLoading = false;
        this.updateMetrics();
        this.updateChartData();
        this.updateMapRoute(); // Atualiza a rota no mapa
      },
      error: (error) => {
        console.error('Error loading trip data:', error);
        this.isLoading = false;
      }
    });
  }

  private updateDisplayedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.displayedData = this.dataSource.data.slice(startIndex, startIndex + this.pageSize);
  }

  loadPreviousPeriodData(): void {
    // Get data from previous period for comparison
    const currentFilters = this.filterForm.value;
    const previousPeriodFilters = this.calculatePreviousPeriodFilters(currentFilters);
    
    this.tripAnalysisService.getTripData(previousPeriodFilters).subscribe(
      data => {
        this.previousPeriodData = data;
      }
    );
  }

  calculatePreviousPeriodFilters(currentFilters: any): any {
    // Calculate the previous period based on current filters
    const previousFilters = { ...currentFilters };
    
    if (currentFilters.horaInicial && currentFilters.horaFinal) {
      // Convert time strings to minutes for calculation
      const getMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const startMinutes = getMinutes(currentFilters.horaInicial);
      const endMinutes = getMinutes(currentFilters.horaFinal);
      const periodMinutes = endMinutes - startMinutes;

      // Calculate previous period times
      const previousEndMinutes = startMinutes;
      const previousStartMinutes = previousEndMinutes - periodMinutes;

      // Convert back to time strings
      const minutesToTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      };

      previousFilters.horaFinal = minutesToTime(previousEndMinutes);
      previousFilters.horaInicial = minutesToTime(previousStartMinutes);
    }

    return previousFilters;
  }

  onDateChange(event: any, field: string): void {
    if (event instanceof MatDatepickerInputEvent) {
      this.filterForm.get(field)?.setValue(event.value);
    } else {
      // Handle native date input event
      const date = new Date(event.target.value);
      this.filterForm.get(field)?.setValue(date);
    }
  }

  onTimeChange(event: Event, field: string): void {
    const target = event.target as HTMLInputElement;
    this.filterForm.get(field)?.setValue(target.value);
  }

  applyFilter(): void {
    this.loadData();
    this.loadPreviousPeriodData();
  }

  resetFilters(): void {
    this.filterForm.reset({
      placa: '47457',
      data: new Date('2024-05-20'),
      horaInicial: '06:00',
      horaFinal: '12:00'
    });
    this.loadData();
    this.loadPreviousPeriodData();
  }

  exportToExcel(): void {
    const currentData = this.getCurrentPageData();
    if (currentData) {
      const exportData = {
        'Data': new Date(currentData.inicio).toLocaleDateString('pt-BR'),
        'Hora Início': new Date(currentData.inicio).toLocaleTimeString('pt-BR'),
        'Hora Fim': new Date(currentData.fim).toLocaleTimeString('pt-BR'),
        'Mecânica': currentData.mecanica,
        'Modelo': currentData.modelo || '-',
        'Versão': currentData.versao,
        'Status': currentData.status,
        'KM': currentData.km?.toFixed(1),
        'Distância (km)': currentData.distancia?.toFixed(1),
        'Litros': currentData.litros?.toFixed(1),
        'Litros Parado': currentData.litrosParado,
        'KM/Litro': currentData.kmPorLitro?.toFixed(2),
        'Giro (%)': currentData.giro,
        'Freio (%)': currentData.freio,
        'Pedal (%)': currentData.pedal,
        'Odômetro Inicial': currentData.odometroInicial?.toFixed(1),
        'Odômetro Final': currentData.odometroFinal?.toFixed(1)
      };

      this.tripAnalysisService.exportToExcel([exportData]);
    }
  }

  getTotalDistance(): number {
    return this.dataSource.data.reduce((total, trip) => total + (trip.distancia || 0), 0);
  }

  getDistanceChange(): number {
    const currentTotal = this.getTotalDistance();
    const previousTotal = this.previousPeriodData.reduce((total, trip) => total + (trip.distancia || 0), 0);
    return previousTotal ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) : 0;
  }

  getAverageFuelConsumption(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + (trip.kmPorLitro || 0), 0) / trips.length * 100) / 100;
  }

  getFuelConsumptionChange(): number {
    const currentAvg = this.getAverageFuelConsumption();
    const previousAvg = this.previousPeriodData.length ?
      this.previousPeriodData.reduce((total, trip) => total + (trip.kmPorLitro || 0), 0) / this.previousPeriodData.length : 0;
    return previousAvg ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100) : 0;
  }

  getAverageSpeed(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + (trip.velocidadeMedia || 0), 0) / trips.length);
  }

  getSpeedChange(): number {
    const currentAvg = this.getAverageSpeed();
    const previousAvg = this.previousPeriodData.length ?
      this.previousPeriodData.reduce((total, trip) => total + (trip.velocidadeMedia || 0), 0) / this.previousPeriodData.length : 0;
    return previousAvg ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100) : 0;
  }

  getAverageBrakeUsage(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + (trip.freio || 0), 0) / trips.length);
  }

  getBrakeUsageChange(): number {
    const currentAvg = this.getAverageBrakeUsage();
    const previousAvg = this.previousPeriodData.length ?
      this.previousPeriodData.reduce((total, trip) => total + (trip.freio || 0), 0) / this.previousPeriodData.length : 0;
    return previousAvg ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100) : 0;
  }

  getAverageRPM(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + (trip.giro || 0), 0) / trips.length);
  }

  getRPMChange(): number {
    const currentAvg = this.getAverageRPM();
    const previousAvg = this.previousPeriodData.length ?
      this.previousPeriodData.reduce((total, trip) => total + (trip.giro || 0), 0) / this.previousPeriodData.length : 0;
    return previousAvg ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100) : 0;
  }

  getAveragePedalUsage(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + (trip.pedal || 0), 0) / trips.length);
  }

  getPedalChange(): number {
    const currentAvg = this.getAveragePedalUsage();
    const previousAvg = this.previousPeriodData.length ?
      this.previousPeriodData.reduce((total, trip) => total + (trip.pedal || 0), 0) / this.previousPeriodData.length : 0;
    return previousAvg ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100) : 0;
  }

  refreshData(): void {
    this.loadData();
    this.loadPreviousPeriodData();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedData();
    setTimeout(() => {
      this.updateMapRoute();
    }, 100);
  }

  getPaginationText(): string {
    if (this.totalItems === 0) return '0-0 de 0';
    
    const startIndex = this.pageIndex * this.pageSize + 1;
    const endIndex = Math.min(startIndex + this.pageSize - 1, this.totalItems);
    return `${startIndex}-${endIndex} de ${this.totalItems}`;
  }

  getDriverScore(): number {
    return Math.round((
      this.getFuelEconomyScore() +
      this.getSmoothDrivingScore() +
      this.getBrakeEfficiencyScore() +
      this.getRPMControlScore()
    ) / 4);
  }

  getScoreChange(): number {
    return 5; // Example value, implement actual calculation
  }

  getScoreChangeClass(): string {
    const change = this.getScoreChange();
    return change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500';
  }

  getFuelEconomyScore(): number {
    return 85; // Example value, implement actual calculation
  }

  getSmoothDrivingScore(): number {
    return 78; // Example value, implement actual calculation
  }

  getBrakeEfficiencyScore(): number {
    return 92; // Example value, implement actual calculation
  }

  getRPMControlScore(): number {
    return 88; // Example value, implement actual calculation
  }

  viewDetailedReport(): void {
    // Implement detailed report view
  }

  dismissUpdate(): void {
    this.updateAvailable = false;
  }

  updateApp(): void {
    // Implement app update logic
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      console.log('Map clicked:', event.latLng.toJSON());
    }
  }

  onMarkerClick(marker: MapMarker, content: string): void {
    this.selectedMarkerContent = content;
    this.infoWindow.open(marker);
  }

  zoomIn(): void {
    if (this.googleMap?.googleMap) {
      const currentZoom = this.googleMap.googleMap.getZoom() || 0;
      this.googleMap.googleMap.setZoom(currentZoom + 1);
    }
  }

  zoomOut(): void {
    if (this.googleMap?.googleMap) {
      const currentZoom = this.googleMap.googleMap.getZoom() || 0;
      this.googleMap.googleMap.setZoom(currentZoom - 1);
    }
  }

  resetView(): void {
    if (this.googleMap?.googleMap) {
      const currentTrip = this.getCurrentPageData();
      if (currentTrip && currentTrip.rota && currentTrip.rota.length > 0) {
        // Recalcular a rota
        this.updateMapRoute();
      }
    }
  }

  getMarkerIcon(type: 'start' | 'end' | 'stop'): google.maps.Icon {
    const baseSize = type === 'stop' ? 24 : 32;
    return {
      url: `assets/icons/${type}-marker.svg`,
      scaledSize: new google.maps.Size(baseSize, baseSize)
    };
  }

  private updateChartData(): void {
    if (this.dataSource.data.length === 0) return;

    this.lineChartData.labels = this.dataSource.data.map(trip => 
      new Date(trip.inicio).toLocaleDateString('pt-BR')
    );

    this.lineChartData.datasets[0].data = this.dataSource.data.map(trip => trip.giro);
    this.lineChartData.datasets[1].data = this.dataSource.data.map(trip => trip.freio);
    this.lineChartData.datasets[2].data = this.dataSource.data.map(trip => trip.pedal);

    this.chart?.update();
  }

  updateMetrics(): void {
    if (this.dataSource.data.length === 0) return;

    // Update metrics values based on current data
    this.metrics = [
      { 
        name: 'Giro',
        value: this.getAverageRPM(),
        icon: 'matAvTimerRound',
        color: '#F472B6', // Pink-400
        label: ''
      },
      { 
        name: 'Freio',
        value: this.getAverageBrakeUsage(),
        icon: 'matBatteryAlertRound',
        color: '#FB923C', // Orange-400
        label: ''
      },
      { 
        name: 'Pedal',
        value: this.getAveragePedalUsage(),
        icon: 'matPedalBikeRound',
        color: '#A78BFA', // Violet-400
        label: ''
      }
    ];
  }

  nextDay(): void {
    if (this.pageIndex < this.dataSource.data.length - 1) {
      this.pageIndex++;
      this.paginator.pageIndex = this.pageIndex;
      this.updateMapRoute();
    }
  }

  previousDay(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.paginator.pageIndex = this.pageIndex;
      this.updateMapRoute();
    }
  }

  getCurrentPageData(): TripData | null {
    const startIndex = this.pageIndex * this.pageSize;
    return this.dataSource.data[startIndex] || null;
  }

  getCurrentDayInfo(): string {
    const currentData = this.getCurrentPageData();
    if (currentData) {
      return new Date(currentData.inicio).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }
    return '';
  }

  updateMapRoute(): void {
    const currentTrip = this.getCurrentPageData();
    if (currentTrip && currentTrip.rota && currentTrip.rota.length > 1 && this.googleMap?.googleMap) {
      const origin = currentTrip.rota[0];
      const destination = currentTrip.rota[currentTrip.rota.length - 1];
      
      // Limpar marcadores existentes
      this.clearCustomMarkers();

      // Calcular a rota usando o serviço de Directions
      this.tripAnalysisService.calculateRouteWithWaypoints(origin, destination, currentTrip.paradas)
        .then((result) => {
          if (this.directionsRenderer && this.googleMap?.googleMap) {
            this.directionsRenderer.setDirections(result);

            // Adicionar marcadores personalizados
            this.addCustomMarkers(this.googleMap.googleMap, origin, destination, currentTrip.paradas);

            // Ajustar o zoom para mostrar toda a rota
            const bounds = new google.maps.LatLngBounds();
            result.routes[0].legs.forEach(leg => {
              leg.steps.forEach(step => {
                step.path.forEach(point => bounds.extend(point));
              });
            });
            this.googleMap.googleMap.fitBounds(bounds);

            // Adicionar um pequeno padding ao bounds
            const padding = { top: 50, right: 50, bottom: 50, left: 50 };
            this.googleMap.googleMap.fitBounds(bounds, padding);
          }
        })
        .catch((error) => {
          console.error('Erro ao calcular a rota:', error);
          // Em caso de erro, pelo menos mostrar os pontos no mapa
          this.showMarkersWithoutRoute(currentTrip);
        });
    }
  }

  private showMarkersWithoutRoute(trip: TripData) {
    if (this.googleMap?.googleMap) {
      const bounds = new google.maps.LatLngBounds();
      
      // Adicionar todos os pontos ao bounds
      trip.rota.forEach(point => bounds.extend(point));
      trip.paradas.forEach(point => bounds.extend(point));
      
      // Adicionar marcadores
      this.addCustomMarkers(this.googleMap.googleMap, trip.rota[0], trip.rota[trip.rota.length - 1], trip.paradas);
      
      // Ajustar o mapa para mostrar todos os pontos
      this.googleMap.googleMap.fitBounds(bounds);
    }
  }

  private addCustomMarkers(map: google.maps.Map, origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral, stops: Array<{lat: number, lng: number, tempo: number}>) {
    // Adicionar marcador de início
    const startMarker = new google.maps.Marker({
      position: origin,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#34D399',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      title: 'Início da Viagem'
    });
    this.markers.push(startMarker);

    // Adicionar marcadores de parada
    stops.forEach((stop, index) => {
      const stopMarker = new google.maps.Marker({
        position: { lat: stop.lat, lng: stop.lng },
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#F59E0B',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: `Parada ${index + 1} - ${stop.tempo} minutos`
      });
      this.markers.push(stopMarker);
    });

    // Adicionar marcador de destino
    const endMarker = new google.maps.Marker({
      position: destination,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#F43F5E',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      title: 'Destino'
    });
    this.markers.push(endMarker);
  }

  private clearCustomMarkers() {
    // Limpar marcadores existentes
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  private initializeDirectionsRenderer() {
    if (this.googleMap?.googleMap) {
      if (this.directionsRenderer) {
        this.directionsRenderer.setMap(null);
        this.directionsRenderer = null;
      }
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#F59E0B',
          strokeOpacity: 1.0,
          strokeWeight: 4
        }
      });
      this.directionsRenderer.setMap(this.googleMap.googleMap);
    }
  }

  loadVeiculos() {
    const graphqlQuery = {
      query: `
        {
          getVeiculos(token:"TKNAPI2100", sEmpresaId:${this.empresa}) {
            placa
          }
        }
      `
    };

    this.http.post(this.getPath('graphql'), graphqlQuery).subscribe({
      next: (response: any) => {
        if (response?.data?.getVeiculos) {
          this.veiculos = response.data.getVeiculos.map((v: any) => ({
            value: v.placa,
            label: v.placa
          }));
        }
      },
      error: (error) => {
        console.error('Erro ao carregar veículos:', error);
        alert('Erro ao carregar lista de veículos');
      }
    });
  }

  getConsumoV4() {
    if (!this.veiculoIV) {
      alert("Selecione o veiculo");
      return;
    }
    
    if (!this.dateRangeIV || this.dateRangeIV.length !== 2) {
      alert("Selecione o periodo");
      return;
    }

    const firstDate = new Date(this.dateRangeIV[0]);
    const secondDate = new Date(this.dateRangeIV[1]);
    const agora = new Date();

    if ((agora.getTime() - firstDate.getTime()) > 24 * 60 * 60 * 1000) {
      alert("Inicio nao pode ser anterior a 24 horas");
      return;
    }

    const dtIni = formatDate(firstDate, "yyyy/MM/dd HH:mm", "en-US");
    const dtFim = formatDate(secondDate, "yyyy/MM/dd HH:mm", "en-US");

    this.dadosViagem = [];
    const graphqlQuery = {
      query: `{ 
        getConsumoV4(
          token: "TKNAPI2100",
          tipo: 1,
          periodo: 1,
          sEmpresaId: ${this.empresa},
          strVei: "${this.veiculoIV}",
          dtIni: "${dtIni}",
          dtFim: "${dtFim}",
          sUsrLog: ${this.authSrv.getUserId()}
        ) { 
          placa nmmodelo nmmodonibus nmEqpto dia hinisml hfimsml hinisql hfimsql
          km dst litros litpar kml kmldst tfp efal efaldst mdf pedal pedalo500
          vma vme dinisml dfimsml tpotor600 tpotor700 tpoEPP tpoMov tpoLig versao
          versao_subst corretor dt_corretor idveiculo odoini odofim tpotor400
          tpotor500 faixaspedal idmodelo tpoEFr rpmParCom rpmSemCon idEqpto
          stsprob idhistprob id_wftd_tipo problema reserva13 modo_ope comar ultCon
        }
      }`
    };

    this.http.post(this.getPath('graphql'), graphqlQuery).subscribe({
      next: (response: any) => {
        if (response?.data?.getConsumoV4) {
          const data = response.data.getConsumoV4;
          this.formatTripData(data);
          this.lblUltConIV = data.ultCon || '';
        }
      },
      error: (error) => {
        console.error('Erro na consulta:', error);
        alert('Erro ao buscar dados da viagem');
      }
    });
  }

  private formatTripData(data: any) {
    this.dadosViagem = [
      { cpo1: 'Placa', val1: data.placa || '-', cpo2: 'Modelo', val2: data.nmmodelo || '-' },
      { cpo1: 'Distância', val1: `${data.dst || '0'} km`, cpo2: 'Consumo', val2: `${data.litros || '0'} L` },
      { cpo1: 'KM/L', val1: data.kml || '0', cpo2: 'Pedal', val2: `${data.pedal || '0'}%` },
      { cpo1: 'Giro', val1: `${data.rpmParCom || '0'}%`, cpo2: 'Freio', val2: `${data.tpoEFr || '0'}%` }
    ];
  }

  private getPath(endpoint: string): string {
    return `${environment.apiUrl}/${endpoint}`;
  }
}