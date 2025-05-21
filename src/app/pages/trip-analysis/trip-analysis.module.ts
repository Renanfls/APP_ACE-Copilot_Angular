import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
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
import { NgChartsModule } from 'ng2-charts';
import { TripAnalysisComponent } from './trip-analysis.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    NgChartsModule,
    NgIconsModule.withIcons({
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
    }),
    RouterModule.forChild([
      {
        path: '',
        component: TripAnalysisComponent
      }
    ])
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    NgChartsModule,
    NgIconsModule
  ]
})
export class TripAnalysisModule { } 