import { Injectable } from '@angular/core';
import { ConsumoV4Response } from '../models/consumo-v4.model';
import { TripAnalysisData, TripData } from '../models/trip-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class TripDataMapperService {
  mapConsumoToTripData(consumo: ConsumoV4Response): TripData {
    if (!consumo) {
      throw new Error('Dados de consumo inválidos');
    }

    return {
      inicio: consumo.hinisql || '',
      fim: consumo.hfimsql || '',
      mecanica: consumo.nmmodelo || '-',
      modelo: consumo.nmmodonibus || '-',
      versao: consumo.versao || '-',
      status: this.getStatus(consumo),
      km: parseFloat(consumo.km) || 0,
      distancia: parseFloat(consumo.dst) || 0,
      litros: parseFloat(consumo.litros) || 0,
      litrosParado: parseFloat(consumo.litpar) || 0,
      kmPorLitro: parseFloat(consumo.kml) || 0,
      tfp: parseFloat((consumo.tfp || '0%').replace('%', '')) || 0,
      efal: parseFloat(consumo.efal?.toString() || '0') || 0,
      pedal: parseFloat((consumo.pedal || '0%').replace('%', '')) || 0,
      giro: parseFloat(consumo.rpmParCom) || 0,
      freio: parseFloat(consumo.tpoEFr) || 0,
      velocidadeMedia: parseFloat(consumo.vma) || 0,
      rota: this.generateDummyRoute(),
      paradas: this.generateDummyStops(),
      odometroInicial: parseFloat(consumo.odoini) || 0,
      odometroFinal: parseFloat(consumo.odofim) || 0,
      hinisql: consumo.hinisql || '',
      hfimsql: consumo.hfimsql || '',
      nmmodelo: consumo.nmmodelo || '',
      nmmodonibus: consumo.nmmodonibus || '',
      stsprob: consumo.stsprob || '',
      dst: parseFloat(consumo.dst) || 0,
      litpar: parseFloat(consumo.litpar) || 0,
      kml: parseFloat(consumo.kml) || 0,
      odoini: parseFloat(consumo.odoini) || 0,
      odofim: parseFloat(consumo.odofim) || 0
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