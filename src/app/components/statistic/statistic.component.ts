import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matHelp } from '@ng-icons/material-icons/baseline';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Subscription } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { GaugeComponent } from '../gauge/gauge.component';

interface Turno {
  turno: string;
  start: string;
  end: string;
}

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [
    CommonModule,
    GaugeComponent,
    NgIconComponent,
    HlmButtonDirective,
  ],
  templateUrl: './statistic.component.html',
  styleUrl: './statistic.component.css',
  viewProviders: [
    provideIcons({
      matHelp,
    }),
  ],
})
export class StatisticComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription: Subscription | null = null;
  turnos: Turno[] = [
    {
      turno: 'Madrugada',
      start: '00:00',
      end: "05:59",
    },
    {
      turno: 'Manhã',
      start: '06:00',
      end: "11:59",
    },
    {
      turno: 'Intervalo',
      start: '12:00',
      end: "13:59",
    },
    {
      turno: 'Tarde',
      start: '14:00',
      end: "19:59",
    },
    {
      turno: 'Noite',
      start: '20:00',
      end: "23:59",
    },
  ];

  isHelpDialogOpen = false;

  constructor(private renderer: Renderer2, private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  openHelpDialog() {
    this.isHelpDialogOpen = true;
    this.renderer.addClass(document.body, 'overflow-hidden');
  }

  closeHelpDialog() {
    this.isHelpDialogOpen = false;
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }
}
