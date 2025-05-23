import { Injectable } from '@angular/core';
import { ConsumoV4Response } from '../models/consumo-v4.model';
import { TripAnalysisData, TripData } from '../models/trip-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class TripDataMapperService {
  mapConsumoToTripData(data: any): TripData {
    return {
      inicio: new Date(`${data.dia} ${data.hinisql}`),
      fim: new Date(`${data.dia} ${data.hfimsql}`),
      mecanica: data.nmmodelo || '-',
      modelo: data.nmmodelo || '-',
      versao: data.versao || '-',
      status: data.stsprob || '-',
      stsprob: data.stsprob || '-',
      placa: data.placa || '-',
      dia: data.dia || '-',
      km: parseFloat(data.km) || 0,
      distancia: parseFloat(data.dst) || 0,
      dst: parseFloat(data.dst) || 0,
      litros: parseFloat(data.litros) || 0,
      litrosParado: parseFloat(data.litpar) || 0,
      litpar: parseFloat(data.litpar) || 0,
      kmPorLitro: parseFloat(data.kml) || 0,
      kml: parseFloat(data.kml) || 0,
      odometroInicial: parseFloat(data.odoini) || 0,
      odometroFinal: parseFloat(data.odofim) || 0,
      velocidadeMedia: parseFloat(data.vma) || 0,
      tfp: parseFloat(data.tfp) || 0,
      efal: parseFloat(data.efal) || 0,
      pedal: parseFloat(data.pedal) || 0,
      giro: parseFloat(data.tfp) || 0,
      freio: parseFloat(data.efal) || 0,
      previousTfp: data.previousTfp ? parseFloat(data.previousTfp) : undefined,
      previousEfal: data.previousEfal ? parseFloat(data.previousEfal) : undefined,
      previousPedal: data.previousPedal ? parseFloat(data.previousPedal) : undefined,
      rota: this.generateDummyRoute(),
      paradas: this.generateDummyStops(),
      hinisql: data.hinisql || '',
      hfimsql: data.hfimsql || '',
      nmmodelo: data.nmmodelo || '',
      nmmodonibus: data.nmmodonibus || '',
      odoini: parseFloat(data.odoini) || 0,
      odofim: parseFloat(data.odofim) || 0
    };
  }

  mapConsumoToAnalysisData(consumo: ConsumoV4Response): TripAnalysisData[] {
    if (!consumo) {
      throw new Error('Dados de consumo inválidos');
    }

    return [
      { cpo1: 'Placa', val1: consumo.placa || '-', cpo2: 'Modelo', val2: consumo.nmmodelo || '-' },
      { 
        cpo1: 'Distância', 
        val1: `${parseFloat(consumo.dst || '0').toFixed(1)} km`, 
        cpo2: 'Consumo', 
        val2: `${parseFloat(consumo.litros || '0').toFixed(1)} L` 
      },
      { 
        cpo1: 'KM/L', 
        val1: parseFloat(consumo.kml || '0').toFixed(2), 
        cpo2: 'Pedal', 
        val2: consumo.pedal || '0%' 
      },
      { 
        cpo1: 'Giro', 
        val1: `${consumo.tfp || '0%'}`, 
        cpo2: 'Freio', 
        val2: `${consumo.efal || '0'}%` 
      }
    ];
  }

  private getStatus(consumo: ConsumoV4Response): string {
    return consumo.stsprob ? 'Problema' : 'Ok';
  }

  private generateDummyRoute(): Array<{lat: number, lng: number}> {
    return [
      { lat: -23.550520, lng: -46.633308 },
      { lat: -23.555520, lng: -46.638308 }
    ];
  }

  private generateDummyStops(): Array<{lat: number, lng: number, tempo: number}> {
    return [
      { lat: -23.552520, lng: -46.635308, tempo: 5 }
    ];
  }
} 