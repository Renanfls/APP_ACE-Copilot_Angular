import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { StatisticComponent } from '../../statistic/statistic.component';
import { TaskComponent } from '../../task/task.component';

@Component({
  selector: 'app-home',
  imports: [
    StatisticComponent,
    HlmButtonDirective,
    RouterModule,
    TaskComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
