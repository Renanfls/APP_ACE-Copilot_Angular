import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
  matBusinessRound,
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
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Metric, TripAnalysisData, TripData } from '../../models/trip-analysis.model';
import { AuthService } from '../../services/auth.service';
import { CacheService } from '../../services/cache.service';
import { GraphQLService } from '../../services/graphql.service';
import { TripAnalysisService } from '../../services/trip-analysis.service';
import { TripDataMapperService } from '../../services/trip-data-mapper.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd/MM/yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

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
      matCalendarTodayRound,
      matBusinessRound
    }),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #1d1d1d;
      color: var(--md-sys-color-on-background);
    }

    .dark :host {
      background-color: #1d1d1d;
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
      --mdc-outlined-text-field-outline-color: transparent;
      --mdc-outlined-text-field-focus-outline-color: transparent;
      --mdc-outlined-text-field-hover-outline-color: transparent;
      --mdc-outlined-text-field-focus-label-text-color: #F59E0B;
      --mdc-outlined-text-field-label-text-color: var(--md-sys-color-on-surface-variant);
      --mdc-outlined-text-field-input-text-color: var(--md-sys-color-on-surface);
      --mdc-outlined-text-field-disabled-outline-color: transparent;
      --mdc-outlined-text-field-disabled-label-text-color: var(--md-sys-color-on-surface-variant);
    }

    ::ng-deep .mat-mdc-form-field.mat-mdc-form-field-type-mat-input .mdc-notched-outline__notch,
    ::ng-deep .mat-mdc-form-field.mat-mdc-form-field-type-mat-select .mdc-notched-outline__notch {
      border: none;
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline {
      display: none;
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
      background-color: var(--md-sys-color-surface-container-low);
      border-radius: 1rem;
    }

    ::ng-deep .mat-mdc-form-field-infix {
      padding: 8px 16px !important;
      min-height: 48px !important;
    }

    /* Select Field Specific Styles */
    ::ng-deep .mat-mdc-select-trigger {
      padding: 0 16px;
    }

    ::ng-deep .mat-mdc-form-field-type-mat-select .mat-mdc-form-field-flex {
      background-color: var(--md-sys-color-surface-container-low);
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
  metrics: Metric[] = [];

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

  directionsRenderer?: google.maps.DirectionsRenderer;
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
  veiculos: Array<{value: string, label: string}> = [];

  // Add new property for companies
  companies: Array<{value: number, label: string}> = [
    { value: 165, label: 'Empresa Principal' }
  ];

  vehicles: Array<{
    placa: string;
    modelo: string;
    data: string;
    hinisql: string;
    hfimsql: string;
    nmmodelo: string;
    nmmodonibus: string;
    versao: string;
    stsprob: string;
    km: number;
    dst: number;
    litros: number;
    litpar: number;
    kml: number;
    tfp: number;
    efal: number;
    pedal: number;
    odoini: number;
    odofim: number;
  }> = [];
  isLoadingVehicles = false;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly tripAnalysisService: TripAnalysisService,
    private readonly graphQLService: GraphQLService,
    private readonly tripDataMapper: TripDataMapperService,
    private readonly cacheService: CacheService,
    private http: HttpClient,
    private authSrv: AuthService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.filterForm = this.fb.group({
      empresa: [165, [Validators.required, Validators.min(1)]],
      placa: ['', Validators.required],
      dataInicial: [new Date(), Validators.required],
      dataFinal: [new Date(), Validators.required],
      horaInicial: ['06:00', Validators.required],
      horaFinal: ['12:00', [Validators.required, this.horaFinalValidator()]]
    }, { validators: this.dateRangeValidator });

    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.updateTheme();

    // Set locale for date adapter
    this.dateAdapter.setLocale('pt-BR');
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

  private dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const dataInicial = group.get('dataInicial')?.value;
    const dataFinal = group.get('dataFinal')?.value;
    
    if (!dataInicial || !dataFinal) {
      return null;
    }

    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    if (dataFinal < dataInicial) {
      return { dateRange: true };
    }

    if (dataInicial > hoje) {
      return { futureStartDate: true };
    }

    if (dataFinal > hoje) {
      return { futureEndDate: true };
    }

    return null;
  }

  ngOnInit(): void {
    // Carrega os dados iniciais
    this.loadVehicles();
    
    // Adiciona listener para mudanças no tamanho da tela
    this.handleScreenSize();
    window.addEventListener('resize', () => this.handleScreenSize());

    // Subscribe to company changes with debounce
    this.filterForm.get('empresa')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500), // Wait 500ms after the user stops typing
      distinctUntilChanged()
    ).subscribe(value => {
      if (value) {
        this.loadVehicles();
      }
    });
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
    this.destroy$.next();
    this.destroy$.complete();
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
    if (!this.filterForm.valid) {
      if (this.filterForm.errors?.['dateRange']) {
        alert('A data final não pode ser menor que a data inicial');
        return;
      }
      if (this.filterForm.errors?.['futureStartDate']) {
        alert('A data inicial não pode ser uma data futura');
        return;
      }
      if (this.filterForm.errors?.['futureEndDate']) {
        alert('A data final não pode ser uma data futura');
        return;
      }
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.isLoading = true;
    const filters = this.filterForm.value;
    
    // Gerar chave de cache baseada nos parâmetros da empresa e datas
    const cacheKey = this.cacheService.generateCacheKey({
      empresa: filters.empresa,
      dataInicial: filters.dataInicial,
      dataFinal: filters.dataFinal
    });

    // Tentar obter dados do cache
    const cachedData = this.cacheService.get<any[]>(cacheKey);
    if (cachedData) {
      console.log('Usando dados do cache');
      this.processData(cachedData, filters);
      return;
    }

    try {
      this.graphQLService.getConsumoV4({
        empresa: filters.empresa,
        dataInicial: filters.dataInicial,
        dataFinal: filters.dataFinal
      }).subscribe({
        next: (response: any) => {
          console.log('Resposta completa da API:', response);
          // Garantir que temos um array de dados para processar
          const consumoList = Array.isArray(response) ? response : [];
          
          // Armazenar dados no cache
          this.cacheService.set<any[]>(cacheKey, consumoList);
          this.processData(consumoList, filters);
        },
        error: (error) => {
          console.error('Erro na requisição:', error);
          this.isLoading = false;
          
          let errorMessage = 'Erro ao carregar dados da viagem.';
          
          if (error.message) {
            errorMessage += ` ${error.message}`;
          }
          
          if (error.status === 0) {
            errorMessage = 'Erro de conexão com o servidor. Verifique sua conexão com a internet.';
          } else if (error.status === 401) {
            errorMessage = 'Sessão expirada. Por favor, faça login novamente.';
          } else if (error.status === 403) {
            errorMessage = 'Você não tem permissão para acessar estes dados.';
          }
          
          alert(errorMessage + ' Por favor, tente novamente.');
        }
      });
    } catch (error) {
      console.error('Erro ao preparar requisição:', error);
      this.isLoading = false;
      alert(error instanceof Error ? error.message : 'Erro ao preparar a requisição. Por favor, verifique os dados informados.');
    }
  }

  private processData(consumoList: any[], filters: any): void {
    // Log para debug inicial
    console.log('Processando dados:', {
      totalRegistros: consumoList.length,
      primeiroRegistro: consumoList[0],
      filtros: filters
    });

    // Filtrar por veículo
    const filteredData = consumoList.filter(consumo => {
      // Verificar se o registro é válido
      if (!consumo || typeof consumo !== 'object') {
        console.log('Registro inválido:', consumo);
        return false;
      }

      // Filtro por veículo
      const matchesVehicle = consumo.placa?.toString() === filters.placa?.toString();
      if (!matchesVehicle) {
        return false;
      }

      // Se chegou aqui, o veículo corresponde
      console.log('Dados do veículo encontrado:', {
        placa: consumo.placa,
        modelo: consumo.nmmodelo,
        data: consumo.data,
        hora: consumo.hinisql
      });
      return true;
    });

    // Log dos dados filtrados
    console.log('Resultados da filtragem:', {
      totalFiltrados: filteredData.length,
      primeiroFiltrado: filteredData[0]
    });

    if (filteredData.length === 0) {
      this.isLoading = false;
      alert('Nenhum dado encontrado para os filtros selecionados');
      return;
    }

    try {
      // Mapear todos os dados filtrados para TripData
      const tripDataList = filteredData.map(data => this.tripDataMapper.mapConsumoToTripData(data));
      console.log('Dados mapeados:', tripDataList);

      // Atualizar o dataSource com os dados filtrados
      this.dataSource = new MatTableDataSource<TripData>(tripDataList);
      
      // Usar o primeiro item para a análise detalhada
      const selectedData = filteredData[0];
      console.log('Item selecionado para análise:', selectedData);

      // Mapear dados para análise
      this.dadosViagem = this.tripDataMapper.mapConsumoToAnalysisData(selectedData);
      console.log('Dados de análise:', this.dadosViagem);

      // Atualizar informações da tabela
      this.totalItems = filteredData.length;
      this.dataSource.paginator = this.paginator;
      this.pageIndex = 0;

      // Atualizar métricas e visualizações
      this.updateMetrics();
      this.updateChartData();
      this.updateMapRoute();
      
      // Atualizar a lista de veículos com apenas o veículo filtrado
      this.veiculos = [{
        value: filters.placa,
        label: `${filters.placa} - ${selectedData.nmmodelo || ''}`
      }];
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      alert('Erro ao processar os dados do veículo. Por favor, tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  resetFilters(): void {
    const today = new Date();
    this.filterForm.patchValue({
      empresa: 165,
      placa: '47457',
      dataInicial: today,
      dataFinal: today,
      horaInicial: '06:00',
      horaFinal: '12:00'
    });
    this.applyFilter();
  }

  private updateDisplayedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.displayedData = this.dataSource.data.slice(startIndex, startIndex + this.pageSize);
  }

  loadPreviousPeriodData(): void {
    const currentFilters = this.filterForm.value;
    const previousPeriodFilters = this.calculatePreviousPeriodFilters(currentFilters);
    
    this.tripAnalysisService.getTripData(previousPeriodFilters).subscribe({
      next: (data) => {
        this.previousPeriodData = data;
        this.updateMetrics(); // Atualizar métricas com os dados do período anterior
      },
      error: (error) => {
        console.error('Error loading previous period data:', error);
      }
    });
  }

  calculatePreviousPeriodFilters(currentFilters: any): any {
    const { placa, data, horaInicial, horaFinal } = currentFilters;
    const previousDate = new Date(data);
    previousDate.setDate(previousDate.getDate() - 1); // Pega o dia anterior

    return {
      placa,
      data: previousDate,
      horaInicial,
      horaFinal
    };
  }

  onDateChange(event: any, controlName: string): void {
    const control = this.filterForm.get(controlName);
    if (control) {
      control.setValue(event.value);
      control.markAsTouched();
    }
  }

  onTimeChange(event: Event, field: string): void {
    const target = event.target as HTMLInputElement;
    this.filterForm.get(field)?.setValue(target.value);
  }

  applyFilter(): void {
    if (this.filterForm.valid) {
      this.loadData();
      this.loadPreviousPeriodData(); // Carrega dados do período anterior para comparação
    }
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
    if (!this.previousPeriodData?.[0]) return 0;
    const currentDistance = this.dataSource.data[0]?.distancia || 0;
    const previousDistance = this.previousPeriodData[0].distancia;
    return this.calculatePercentageChange(currentDistance, previousDistance);
  }

  getFuelConsumptionChange(): number {
    if (!this.previousPeriodData?.[0]) return 0;
    const currentConsumption = this.dataSource.data[0]?.litros || 0;
    const previousConsumption = this.previousPeriodData[0].litros;
    return this.calculatePercentageChange(currentConsumption, previousConsumption);
  }

  getSpeedChange(): number {
    if (!this.previousPeriodData?.[0]) return 0;
    const currentSpeed = this.dataSource.data[0]?.velocidadeMedia || 0;
    const previousSpeed = this.previousPeriodData[0].velocidadeMedia;
    return this.calculatePercentageChange(currentSpeed, previousSpeed);
  }

  getBrakeUsageChange(): number {
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      return 0;
    }
    const currentBrake = this.dataSource.data[0].freio;
    const previousBrake = this.dataSource.data[1]?.freio || currentBrake;
    return this.calculatePercentageChange(currentBrake, previousBrake);
  }

  getRPMChange(): number {
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      return 0;
    }
    const currentRPM = this.dataSource.data[0].giro;
    const previousRPM = this.dataSource.data[1]?.giro || currentRPM;
    return this.calculatePercentageChange(currentRPM, previousRPM);
  }

  getPedalChange(): number {
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      return 0;
    }
    const currentPedal = this.dataSource.data[0].pedal;
    const previousPedal = this.dataSource.data[1]?.pedal || currentPedal;
    return this.calculatePercentageChange(currentPedal, previousPedal);
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Number(((current - previous) / previous * 100).toFixed(1));
  }

  getAverageFuelConsumption(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + (trip.kmPorLitro || 0), 0) / trips.length * 100) / 100;
  }

  getAverageSpeed(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + (trip.velocidadeMedia || 0), 0) / trips.length);
  }

  getAverageBrakeUsage(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + (trip.freio || 0), 0) / trips.length);
  }

  getAverageRPM(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + (trip.giro || 0), 0) / trips.length);
  }

  getAveragePedalUsage(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + (trip.pedal || 0), 0) / trips.length);
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
    if (this.dataSource.data.length > 0) {
      const data = this.dataSource.data[0];
      
      this.lineChartData = {
        labels: ['Giro', 'Freio', 'Pedal'],
        datasets: [
          {
            data: [
              data.tfp || 0,
              data.efal || 0,
              data.pedal || 0
            ],
            label: 'Desempenho',
            backgroundColor: ['#34D399', '#F59E0B', '#F43F5E'],
            borderColor: '#F59E0B',
            fill: false
          }
        ]
      };
    }
  }

  updateMetrics(): void {
    if (this.dataSource.data.length > 0) {
      const currentData = this.dataSource.data[0];
      const previousData = this.previousPeriodData?.[0];

      // Atualizar métricas com comparação ao período anterior
      this.metrics = [
        {
          label: 'Distância',
          value: currentData.distancia,
          previousValue: previousData?.distancia || 0,
          color: '#34D399'
        },
        {
          label: 'Consumo',
          value: currentData.litros,
          previousValue: previousData?.litros || 0,
          color: '#F59E0B'
        },
        {
          label: 'Velocidade',
          value: currentData.velocidadeMedia,
          previousValue: previousData?.velocidadeMedia || 0,
          color: '#F43F5E'
        }
      ];
    }
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
    if (this.dataSource.data.length > 0 && this.googleMap && this.directionsRenderer) {
      const tripData = this.dataSource.data[0];
      const { rota, paradas } = tripData;

      if (rota.length >= 2) {
        const origin = rota[0];
        const destination = rota[rota.length - 1];
        const waypoints = paradas.map(parada => ({
          lat: parada.lat,
          lng: parada.lng
        }));

        this.tripAnalysisService.calculateRouteWithWaypoints(origin, destination, waypoints)
          .then(result => {
            if (result && this.directionsRenderer) {
              this.directionsRenderer.setDirections(result);
            }
          });
      }
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
    if (this.googleMap) {
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        map: this.googleMap.googleMap,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#F59E0B',
          strokeWeight: 5
        }
      });
    }
  }

  loadVehicles(): void {
    this.isLoadingVehicles = true;
    const filters = this.filterForm.value;

    // Reset vehicle selection when company changes
    this.filterForm.patchValue({
      placa: ''
    }, { emitEvent: false });

    this.graphQLService.getVehicles({
      empresa: filters.empresa,
      dataInicial: filters.dataInicial,
      dataFinal: filters.dataFinal
    }).subscribe({
      next: (vehicles) => {
        // Update vehicles array
        this.vehicles = vehicles;
        
        // Update vehicle options for the select
        this.veiculos = vehicles.map(vehicle => ({
          value: vehicle.placa,
          label: `${vehicle.placa} - ${vehicle.nmmodelo || ''}`
        }));
        
        this.isLoadingVehicles = false;
        
        // If there are vehicles, select the first one
        if (vehicles.length > 0) {
          this.filterForm.patchValue({
            placa: vehicles[0].placa
          });
        }
      },
      error: (error) => {
        console.error('Erro ao carregar veículos:', error);
        this.isLoadingVehicles = false;
        alert('Erro ao carregar lista de veículos. Por favor, tente novamente.');
      }
    });
  }

  getConsumoV4(): void {
    if (this.veiculoIV && this.dateRangeIV[0] && this.dateRangeIV[1]) {
      this.graphQLService.getConsumoV4({
        empresa: 165,
        dataInicial: this.dateRangeIV[0],
        dataFinal: this.dateRangeIV[1]
      }).subscribe({
        next: (response) => {
          this.dadosViagem = this.tripDataMapper.mapConsumoToAnalysisData(response[0]);
        },
        error: (error) => {
          console.error('Erro ao carregar dados:', error);
          alert('Erro ao carregar dados da análise');
        }
      });
    } else {
      alert('Por favor, selecione o veículo e o período');
    }
  }

  private getStatus(response: any): string {
    return response.stsprob ? 'Problema' : 'Ok';
  }

  private generateDummyRoute(): Array<{lat: number, lng: number}> {
    return [
      { lat: -23.550520, lng: -46.633308 },
      { lat: -23.555520, lng: -46.638308 }
    ];
  }

  private generateDummyStops(): Array<{lat: number, lng: number, tempo: number}> {
    return [
      { lat: -23.552520, lng: -46.635308, tempo: 5 }
    ];
  }
}