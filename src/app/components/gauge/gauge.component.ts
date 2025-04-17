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
  imports: [CommonModule, NgIconComponent], // <- Isso resolve o problema
})
export class GaugeComponent {
  @Input() value = 2.38;
  @Input() medal1 = true; // Bronze
  @Input() medal2 = true; // Prata
  @Input() medal3 = true; // Ouro
  label = 'insuficiente';

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
    const flags = [this.medal1, this.medal2, this.medal3];
    return this.medals.filter((_, index) => flags[index]);
  }
  

  get currentMedal(): Medal {
    return [...this.medals].reverse().find(medal => this.value >= medal.minValue)!;
  }

  get rotation() {
    return (this.value / 5) * 180;
  }
}
