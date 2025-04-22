import { Component, Input } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { matWorkspacePremium } from '@ng-icons/material-icons/baseline';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

interface Medal {
  name: string;
  minValue: number;
  color: string;
  icon: string;
}

@Component({
  standalone: true,
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css'],
  viewProviders: [provideIcons({ matWorkspacePremium })],
  imports: [CommonModule, NgIconComponent],
})
export class GaugeComponent {
  @Input() value = 0.00;
  @Input() label = '';
  @Input() fase = '';

  medals: Medal[] = [
    {
      name: 'Bronze C',
      minValue: 0,
      color: '#8F551C',
      icon: 'matWorkspacePremium',
    },
    {
      name: 'Prata C',
      minValue: 1.5,
      color: '#B2B2B2',
      icon: 'matWorkspacePremium',
    },
    {
      name: 'Ouro C',
      minValue: 3.5,
      color: '#D7B318',
      icon: 'matWorkspacePremium',
    }
  ];

  get visibleMedals(): Medal[] {
    switch (this.fase) {
      case 'Ouro C':
        return this.medals; // Todas
      case 'Ouro':
        return this.medals.slice(0, 2); // Prata + Bronze
      case 'Prata':
        return this.medals.slice(0, 1); // Bronze
      default:
        return []; // Nenhuma ou lógica extra se quiser tratar outros casos
    }
  }

  get currentMedal(): Medal {
    return [...this.medals].reverse().find(medal => this.value >= medal.minValue)!;
  }

  get rotation() {
    return (this.value / 5) * 180;
  }
}
