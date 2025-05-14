import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
    matAddCommentRound,
    matAddToHomeScreenRound,
    matArrowForwardIosRound,
    matConfirmationNumberRound,
    matLocalOfferRound,
    matLocalPlayRound,
    matQuizRound,
    matVideoLibraryRound
} from '@ng-icons/material-icons/round';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FaqDropdownComponent } from '../../faq/faq-dropdown.component';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { StatisticComponent } from '../../statistic/statistic.component';
import { TaskComponent } from '../../task/task.component';

interface Coupons {
  total: number;
  available: number;
  used: number;
}

interface DailyTask {
  label: string;
  quantity: number;
  current: number;
  icon: string;
  completed: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIconComponent,
    HlmButtonDirective,
    HeaderComponent,
    FooterComponent,
    StatisticComponent,
    TaskComponent,
    FaqDropdownComponent
  ],
  providers: [
    provideIcons({
      matConfirmationNumberRound,
      matLocalOfferRound,
      matArrowForwardIosRound,
      matAddToHomeScreenRound,
      matLocalPlayRound,
      matQuizRound,
      matAddCommentRound,
      matVideoLibraryRound
    })
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  coupons: Coupons = {
    total: 15,
    available: 10,
    used: 5
  };

  dailyTasks: DailyTask[] = [
    {
      label: 'Abrir o Aplicativo',
      quantity: 1,
      current: 1,
      icon: 'matAddToHomeScreenRound',
      completed: true
    },
    {
      label: 'Abrir Pontuação ACE',
      quantity: 1,
      current: 0,
      icon: 'matLocalPlayRound',
      completed: false
    },
    {
      label: 'Responder a um Quiz',
      quantity: 1,
      current: 0,
      icon: 'matQuizRound',
      completed: false
    },
    {
      label: 'Ler uma Dica de Economia',
      quantity: 1,
      current: 0,
      icon: 'matAddCommentRound',
      completed: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize any necessary data
  }

  get hasCompletedDailyTasks(): boolean {
    return this.dailyTasks.every(task => task.completed);
  }

  goToDailyTasks() {
    this.router.navigate(['/premiacoes']);
  }

  // Method to handle task completion
  onTaskComplete(taskLabel: string) {
    const task = this.dailyTasks.find(t => t.label === taskLabel);
    if (task) {
      task.current = task.quantity;
      task.completed = true;

      // Check if all tasks are completed to award bonus coupon
      if (this.hasCompletedDailyTasks) {
        this.awardBonusCoupon();
      }
    }
  }

  private awardBonusCoupon() {
    // Increment available and total coupons
    this.coupons.available++;
    this.coupons.total++;
    
    // Show success message (you can implement your preferred notification system)
    console.log('Parabéns! Você ganhou um cupom bônus por completar todas as tarefas diárias!');
  }
}
