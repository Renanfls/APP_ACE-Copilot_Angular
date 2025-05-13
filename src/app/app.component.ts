import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'app-ace-copilot';

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Theme service will handle the initial theme setup in its constructor
  }
}
