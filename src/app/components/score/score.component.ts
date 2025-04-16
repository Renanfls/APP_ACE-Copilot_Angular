import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  matArrowDownward,
  matArrowForwardIos,
  matArrowUpward,
  matHelp,
  matWorkspacePremium,
} from '@ng-icons/material-icons/baseline';
import { CardTurnoComponent } from '../card-turno.component';
import { GaugeComponent } from '../gauge/gauge.component';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent,
    GaugeComponent,
    CardTurnoComponent,
  ],
  templateUrl: './score.component.html',
  styleUrl: './score.component.css',
  viewProviders: [
    provideIcons({
      matArrowForwardIos,
      matArrowDownward,
      matHelp,
      matWorkspacePremium,
      matArrowUpward,
    }),
  ],
})
export class ScoreComponent {}
