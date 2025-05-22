import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-trip-results',
    template: `
        <div class="p-4">
            <h2 class="text-2xl font-semibold mb-4">Resultados da Análise</h2>
            <pre>{{ queryParams | json }}</pre>
        </div>
    `,
    standalone: true,
    imports: [CommonModule]
})
export class TripResultsComponent implements OnInit {
    queryParams: any;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.queryParams = this.route.snapshot.queryParams;
    }
} 