import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface TripData {
  inicio: Date;
  fim: Date;
  mecanica: string;
  modelo: string;
  versao: string;
  status: string;
  km: number;
  distancia: number;
  litros: number;
  litrosParado: number;
  kmPorLitro: number;
  giro: number;
  freio: number;
  pedal: number;
  velocidadeMedia: number;
  odometroInicial: number;
  odometroFinal: number;
}

@Injectable({
  providedIn: 'root'
})
export class TripAnalysisService {
  private sampleData: TripData[] = [
    {
      inicio: new Date('2025-05-20T09:00:00'),
      fim: new Date('2025-05-20T11:32:00'),
      mecanica: '1721L',
      modelo: '',
      versao: '6131',
      status: 'Ok',
      km: 34.2,
      distancia: 34.1,
      litros: 16.3,
      litrosParado: 1.4,
      kmPorLitro: 2.09,
      giro: 6,
      freio: 17,
      pedal: 14,
      velocidadeMedia: 13.64, // Calculated: distance / time in hours
      odometroInicial: 142518.6,
      odometroFinal: 142552.9
    }
  ];

  constructor() {}

  getTripData(filters?: any): Observable<TripData[]> {
    // In a real application, this would make an HTTP request with the filters
    return of(this.sampleData);
  }

  exportToExcel(data: TripData[]): void {
    // Implement Excel export logic here
    console.log('Exporting data to Excel:', data);
  }
} 