import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { matWorkspacePremium } from '@ng-icons/material-icons/baseline';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  standalone: true,
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css'],
  viewProviders: [provideIcons({ matWorkspacePremium })],
  imports: [CommonModule, NgIconComponent], // <- Isso resolve o problema
})
export class GaugeComponent {
  @Input() value: number = 2.38; // Make this an Input
  label: string = 'Insuficiente';

  get rotation() {
    return (this.value / 5) * 180;
  }
}
