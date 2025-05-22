import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { TripData } from '../models/trip-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class TripAnalysisService {
  constructor(private http: HttpClient) {}

  getTripData(filters: any): Observable<TripData[]> {
    // Implementação futura para buscar dados históricos
    return of([]);
  }

  calculateRouteWithWaypoints(
    origin: google.maps.LatLngLiteral,
    destination: google.maps.LatLngLiteral,
    waypoints: google.maps.LatLngLiteral[]
  ): Promise<google.maps.DirectionsResult> {
    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin,
          destination,
          waypoints: waypoints.map(point => ({ location: point, stopover: true })),
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            resolve(result);
          } else {
            reject(new Error(`Failed to calculate route: ${status}`));
          }
        }
      );
    });
  }

  exportToExcel(data: any[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'analise_viagem');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = `${fileName}_${new Date().getTime()}.xlsx`;
    link.click();
  }
} 