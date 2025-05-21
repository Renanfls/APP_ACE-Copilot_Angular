import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { utils, WorkBook, WorkSheet, writeFile } from 'xlsx';

export interface TripData {
  inicio: string;
  fim: string;
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
  rota: Array<{lat: number, lng: number}>;
  paradas: Array<{lat: number, lng: number, tempo: number}>;
}

@Injectable({
  providedIn: 'root'
})
export class TripAnalysisService {
  private directionsService: google.maps.DirectionsService;

  constructor(private http: HttpClient) {
    this.directionsService = new google.maps.DirectionsService();
  }

  getTripData(filters: any): Observable<TripData[]> {
    // Simula dados de exemplo com uma rota real em São Paulo
    const mockData: TripData[] = [
      {
        inicio: '2024-03-15T09:00:00',
        fim: '2024-03-15T11:35:00',
        mecanica: 'VOLVO',
        modelo: 'FH 540',
        versao: '2024',
        status: 'Ok',
        km: 150.5,
        distancia: 145.8,
        litros: 45.2,
        litrosParado: 2.5,
        kmPorLitro: 3.22,
        giro: 75,
        freio: 15,
        pedal: 65,
        velocidadeMedia: 85,
        odometroInicial: 125000,
        odometroFinal: 125145.8,
        rota: [
          { lat: -23.5505, lng: -46.6333 }, // Praça da Sé (Início)
          { lat: -23.5577, lng: -46.6369 }, // Rua 25 de Março
          { lat: -23.5461, lng: -46.6364 }, // Mercado Municipal
          { lat: -23.5338, lng: -46.6265 }, // Brás
          { lat: -23.5248, lng: -46.6361 }, // Luz
          { lat: -23.5127, lng: -46.6466 }, // Barra Funda
          { lat: -23.5067, lng: -46.6639 }, // Perdizes
          { lat: -23.5105, lng: -46.6858 }, // Lapa
          { lat: -23.5016, lng: -46.7110 }  // Vila Leopoldina (Destino)
        ],
        paradas: [
          { lat: -23.5461, lng: -46.6364, tempo: 20 }, // Parada no Mercado Municipal - 20 minutos
          { lat: -23.5248, lng: -46.6361, tempo: 15 }, // Parada na Luz - 15 minutos
          { lat: -23.5105, lng: -46.6858, tempo: 25 }  // Parada na Lapa - 25 minutos
        ]
      }
    ];

    return of(mockData);
  }

  calculateRouteWithWaypoints(origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral, waypoints: google.maps.LatLngLiteral[]): Promise<google.maps.DirectionsResult> {
    const waypointsList = waypoints.map(point => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      stopover: true
    }));

    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      waypoints: waypointsList,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    };

    return this.directionsService.route(request);
  }

  exportToExcel(data: any[]): void {
    if (data.length > 0) {
      const date = data[0]['Data'];
      const mecanica = data[0]['Mecânica'];
      const fileName = `analise_viagem_${mecanica}_${date.replace(/\//g, '-')}.xlsx`;
      
      const worksheet: WorkSheet = utils.json_to_sheet(data);
      const workbook: WorkBook = { Sheets: { 'Dados da Viagem': worksheet }, SheetNames: ['Dados da Viagem'] };
      writeFile(workbook, fileName);
    }
  }
} 