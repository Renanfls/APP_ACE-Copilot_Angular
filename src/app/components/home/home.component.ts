import { Component } from '@angular/core';
import { StatisticComponent } from '../statistic/statistic.component';

@Component({
  selector: 'app-home',
  imports: [StatisticComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
