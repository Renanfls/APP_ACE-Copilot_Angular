import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matHelp } from '@ng-icons/material-icons/baseline';
import { GaugeComponent } from '../gauge/gauge.component';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [
    CommonModule,
    GaugeComponent,
    NgIconComponent,
  ],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css',
  viewProviders: [
    provideIcons({
      matHelp,
    }),
  ],
})
export class StatisticComponent {
  isHelpDialogOpen = false;

  openHelpDialog() {
    this.isHelpDialogOpen = true;
  }

  closeHelpDialog() {
    this.isHelpDialogOpen = false;
  }
}
