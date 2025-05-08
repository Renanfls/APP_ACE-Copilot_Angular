import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { StatisticComponent } from '../../statistic/statistic.component';
import { TaskComponent } from '../../task/task.component';
import { FooterComponent } from "../../footer/footer.component";
import { HeaderComponent } from '../../header/header.component';
import { FaqDropdownComponent } from '../../faq/faq-dropdown.component';

@Component({
  selector: 'app-home',
  imports: [
    StatisticComponent,
    HlmButtonDirective,
    RouterModule,
    TaskComponent,
    FooterComponent,
    HeaderComponent,
    FaqDropdownComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
