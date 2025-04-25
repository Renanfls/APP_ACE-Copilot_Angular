import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { matHome } from '@ng-icons/material-icons/baseline';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer-dsveiculos',
  standalone: true,
  viewProviders: [provideIcons({ matHome })],
  imports: [RouterModule,],
  template: `
    <footer class="container py-3 flex items-center justify-evenly z-40 relative text-xs md:text-sm font-bold">
      <div class="py-6 flex items-center justify-evenly w-full fixed bottom-0" style="background-color: #141416;">
        &nbsp;
      </div>
    </footer>
  `,
})
export class FooterDashVeiculosComponent {
  scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}
