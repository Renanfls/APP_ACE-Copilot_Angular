import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matAvTimerRound,
  matBatteryAlertRound,
  matClearRound,
  matDarkModeRound,
  matDirectionsCarRound,
  matDownloadRound,
  matFilterAltRound,
  matLightModeRound,
  matLocalGasStationRound,
  matPedalBikeRound,
  matScheduleRound,
  matSearchOffRound,
  matSearchRound,
  matSpeedRound,
  matTrendingDownRound,
  matTrendingUpRound
} from '@ng-icons/material-icons/round';
import { TripAnalysisService, TripData } from '../../services/trip-analysis.service';

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
    DatePipe,
    NgIconComponent
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
      matScheduleRound
    })
  ],
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--md-sys-color-background);
      color: var(--md-sys-color-on-background);
    }

    /* Material Design 3 Card Styles */
    .surface-container-highest {
      background-color: var(--md-sys-color-surface-container-highest);
      border-radius: 28px;
      box-shadow: var(--md-sys-elevation-2);
    }

    .surface-container-high {
      background-color: var(--md-sys-color-surface-container-high);
      border-radius: 28px;
      box-shadow: var(--md-sys-elevation-1);
    }

    /* Material Design 3 Form Field Styles */
    ::ng-deep .mat-mdc-form-field {
      --mdc-filled-text-field-container-color: var(--md-sys-color-surface-container);
      --mdc-filled-text-field-focus-active-indicator-color: #F59E0B;
      --mdc-filled-text-field-hover-active-indicator-color: #F59E0B;
      --mdc-filled-text-field-focus-label-text-color: #F59E0B;
      --mdc-filled-text-field-label-text-color: var(--md-sys-color-on-surface-variant);
      --mdc-filled-text-field-input-text-color: var(--md-sys-color-on-surface);
      border-radius: 20px 20px 4px 4px;
    }

    ::ng-deep .mat-mdc-form-field-flex {
      border-radius: 20px 20px 4px 4px;
      padding: 0 16px !important;
    }

    ::ng-deep .mat-mdc-text-field-wrapper {
      border-radius: 20px 20px 4px 4px;
    }

    /* Material Design 3 Button Styles */
    ::ng-deep .mat-mdc-button.mat-primary {
      --mdc-filled-button-container-color: #F59E0B;
      --mdc-filled-button-label-text-color: #000000;
      border-radius: 20px;
    }

    ::ng-deep .mat-mdc-button.mat-stroked {
      --mdc-outlined-button-outline-color: var(--md-sys-color-outline);
      --mdc-outlined-button-label-text-color: var(--md-sys-color-on-surface);
      border-radius: 20px;
    }

    /* Material Design 3 Table Styles */
    ::ng-deep .mat-mdc-table {
      background: transparent;
      --mat-table-background-color: transparent;
      border-radius: 0;
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
  `]
})
export class TripAnalysisComponent implements OnInit {
  filterForm: FormGroup;
  displayedColumns: string[] = [
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
    'velocidadeMedia',
    'odometroInicial',
    'odometroFinal'
  ];
  dataSource = new MatTableDataSource<TripData>();
  previousPeriodData: TripData[] = [];
  isDarkMode = true;

  constructor(
    private fb: FormBuilder,
    private tripAnalysisService: TripAnalysisService
  ) {
    this.filterForm = this.fb.group({
      placa: ['48122', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      horaInicial: ['09:00', Validators.required],
      horaFinal: ['11:35', [Validators.required, this.horaFinalValidator()]]
    });

    // Default to dark mode
    this.isDarkMode = true;
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
    this.loadData();
    this.loadPreviousPeriodData();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.updateTheme();
  }

  private updateTheme(): void {
    document.documentElement.classList.toggle('dark', this.isDarkMode);
  }

  loadData(): void {
    this.tripAnalysisService.getTripData(this.filterForm.value).subscribe(
      data => {
        this.dataSource.data = data;
      }
    );
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

  onDateChange(event: MatDatepickerInputEvent<Date>, field: string): void {
    this.filterForm.get(field)?.setValue(event.value);
  }

  onTimeChange(event: any, field: string): void {
    this.filterForm.get(field)?.setValue(event.target.value);
  }

  applyFilter(): void {
    this.loadData();
    this.loadPreviousPeriodData();
  }

  resetFilters(): void {
    this.filterForm.reset({
      placa: '48122',
      horaInicial: '09:00',
      horaFinal: '11:35'
    });
    this.loadData();
    this.loadPreviousPeriodData();
  }

  exportToExcel(): void {
    this.tripAnalysisService.exportToExcel(this.dataSource.data);
  }

  // Summary card calculations
  getTotalDistance(): number {
    return this.dataSource.data.reduce((total, trip) => total + trip.distancia, 0);
  }

  getDistanceChange(): number {
    const currentTotal = this.getTotalDistance();
    const previousTotal = this.previousPeriodData.reduce((total, trip) => total + trip.distancia, 0);
    return previousTotal ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) : 0;
  }

  getAverageFuelConsumption(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + trip.kmPorLitro, 0) / trips.length * 100) / 100;
  }

  getFuelConsumptionChange(): number {
    const currentAvg = this.getAverageFuelConsumption();
    const previousAvg = this.previousPeriodData.length ? 
      this.previousPeriodData.reduce((total, trip) => total + trip.kmPorLitro, 0) / this.previousPeriodData.length : 0;
    return previousAvg ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100) : 0;
  }

  getAverageSpeed(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + trip.velocidadeMedia, 0) / trips.length);
  }

  getSpeedChange(): number {
    const currentAvg = this.getAverageSpeed();
    const previousAvg = this.previousPeriodData.length ? 
      this.previousPeriodData.reduce((total, trip) => total + trip.velocidadeMedia, 0) / this.previousPeriodData.length : 0;
    return previousAvg ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100) : 0;
  }

  getAverageBrakeUsage(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + trip.freio, 0) / trips.length);
  }

  getBrakeUsageChange(): number {
    const currentAvg = this.getAverageBrakeUsage();
    const previousAvg = this.previousPeriodData.length ? 
      this.previousPeriodData.reduce((total, trip) => total + trip.freio, 0) / this.previousPeriodData.length : 0;
    return previousAvg ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100) : 0;
  }

  getAverageRPM(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + trip.giro, 0) / trips.length);
  }

  getRPMChange(): number {
    const currentAvg = this.getAverageRPM();
    const previousAvg = this.previousPeriodData.length ? 
      this.previousPeriodData.reduce((total, trip) => total + trip.giro, 0) / this.previousPeriodData.length : 0;
    return previousAvg ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100) : 0;
  }

  getAveragePedalUsage(): number {
    const trips = this.dataSource.data;
    if (!trips.length) return 0;
    return Math.round(trips.reduce((total, trip) => total + trip.pedal, 0) / trips.length);
  }

  getPedalChange(): number {
    const currentAvg = this.getAveragePedalUsage();
    const previousAvg = this.previousPeriodData.length ? 
      this.previousPeriodData.reduce((total, trip) => total + trip.pedal, 0) / this.previousPeriodData.length : 0;
    return previousAvg ? Math.round(((currentAvg - previousAvg) / previousAvg) * 100) : 0;
  }
} 