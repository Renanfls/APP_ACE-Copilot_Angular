import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
    matBusinessRound,
    matCalendarTodayRound,
    matCancelRound,
    matDirectionsCarRound,
    matExpandMoreRound,
    matFilterAltRound,
    matSearchRound
} from '@ng-icons/material-icons/round';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GraphQLService } from '../../../services/graphql.service';

interface Vehicle {
    placa: string;
}

@Component({
    selector: 'app-trip-filter',
    templateUrl: './trip-filter.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgIconComponent
    ],
    providers: [
        provideIcons({
            matBusinessRound,
            matCalendarTodayRound,
            matCancelRound,
            matDirectionsCarRound,
            matExpandMoreRound,
            matFilterAltRound,
            matSearchRound
        })
    ]
})
export class TripFilterComponent implements OnInit, OnDestroy {
    filterForm: FormGroup;
    vehicles: Vehicle[] = [];
    isLoadingVehicles = false;
    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private graphQLService: GraphQLService
    ) {
        this.filterForm = this.fb.group({
            empresa: ['', [Validators.required, Validators.min(1)]],
            placa: ['', Validators.required],
            dataInicial: ['', Validators.required],
            dataFinal: ['', Validators.required],
            horaInicial: ['', Validators.required],
            horaFinal: ['', Validators.required]
        }, {
            validators: [this.dateRangeValidator, this.timeRangeValidator]
        });
    }

    ngOnInit(): void {
        // Carregar veículos quando empresa mudar
        this.filterForm.get('empresa')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(empresa => {
                if (empresa) {
                    this.loadVehicles(empresa);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadVehicles(empresa: number): void {
        this.isLoadingVehicles = true;
        const today = new Date();
        const params = {
            empresa,
            dataInicial: today,
            dataFinal: today
        };

        this.graphQLService.getVehicles(params)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (vehicles) => {
                    this.vehicles = vehicles;
                    this.isLoadingVehicles = false;
                },
                error: () => {
                    this.isLoadingVehicles = false;
                }
            });
    }

    private dateRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
        const start = group.get('dataInicial')?.value;
        const end = group.get('dataFinal')?.value;

        if (start && end && new Date(end) < new Date(start)) {
            return { dateRange: true };
        }
        return null;
    }

    private timeRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
        const startDate = group.get('dataInicial')?.value;
        const endDate = group.get('dataFinal')?.value;
        const startTime = group.get('horaInicial')?.value;
        const endTime = group.get('horaFinal')?.value;

        if (startDate && endDate && startTime && endTime) {
            if (startDate === endDate && endTime <= startTime) {
                return { timeRange: true };
            }
        }
        return null;
    }

    resetFilters(): void {
        this.filterForm.reset();
    }

    onSubmit(): void {
        if (this.filterForm.valid) {
            const filters = this.filterForm.value;
            this.router.navigate(['/analise-viagem/results'], {
                queryParams: {
                    empresa: filters.empresa,
                    placa: filters.placa,
                    dataInicial: new Date(filters.dataInicial).toISOString(),
                    dataFinal: new Date(filters.dataFinal).toISOString(),
                    horaInicial: filters.horaInicial,
                    horaFinal: filters.horaFinal
                }
            });
        }
    }
} 