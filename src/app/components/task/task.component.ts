import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { matAddToHomeScreenRound, matVideoLibraryRound, matAddCommentRound, matLocalPlayRound, matQuizRound, matSpeedRound } from '@ng-icons/material-icons/round';

interface Icon {
  status?: string;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-task',
  imports: [CommonModule, NgIconComponent],
  viewProviders: [provideIcons({ matAddToHomeScreenRound, matVideoLibraryRound, matAddCommentRound, matLocalPlayRound, matQuizRound, matSpeedRound })],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input() label = '';
  @Input() quantity = 0;
  @Input() current = 0; // Progresso atual
  @Input() icon = ''; // Nome do ícone (ex: 'matAddToHomeScreenRound')

  get status(): 'disable' | 'active' {
    return this.current >= this.quantity ? 'active' : 'disable';
  }

  get visibleIcon(): Icon {
    return {
      status: this.status,
      color: this.status === 'active' ? '#D7B318' : '#4F4F50',
      icon: this.icon,
    };
  }

  get progressPercentage(): number {
    return this.quantity > 0 ? (this.current / this.quantity) * 100 : 0;
  }

  get progressLabel(): string {
    return `${this.current} / ${this.quantity}`;
  }
}

