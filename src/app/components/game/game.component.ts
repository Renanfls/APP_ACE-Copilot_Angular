import { Component } from '@angular/core';
import { StatisticComponent } from '../statistic/statistic.component';

@Component({
  selector: 'app-game',
  imports: [StatisticComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {

}
