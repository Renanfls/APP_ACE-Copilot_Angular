import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { StatisticComponent } from '../../statistic/statistic.component';
import { TaskComponent } from '../../task/task.component';

@Component({
  selector: 'app-game',
  imports: [
    StatisticComponent,
    FooterComponent,
    HeaderComponent,
    HlmButtonDirective,
    TaskComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {}
