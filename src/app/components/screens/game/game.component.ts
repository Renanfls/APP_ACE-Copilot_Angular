import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { StatisticComponent } from '../../statistic/statistic.component';
import { TaskComponent } from '../../task/task.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HlmButtonDirective,
    FooterComponent,
    HeaderComponent,
    StatisticComponent,
    TaskComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {}
