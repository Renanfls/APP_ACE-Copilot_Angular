import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ConsumoV4Response } from '../models/consumo-v4.model';

interface GraphQLResponse<T> {
  data: {
    getConsumoV4: T[];
    getPreviousDay?: T[];
  };
}

interface Vehicle {
  placa: string;
  modelo: string;
  data: string;
  hinisql: string;
  hfimsql: string;
  nmmodelo: string;
  nmmodonibus: string;
  versao: string;
  stsprob: string;
  km: number;
  dst: number;
  litros: number;
  litpar: number;
  kml: number;
  tfp: number;
  efal: number;
  pedal: number;
  odoini: number;
  odofim: number;
}

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {
  private readonly apiUrl = `${environment.apiUrl}/graphql`;

  constructor(private http: HttpClient) {}

  getVehicles(params: {
    empresa: number;
    dataInicial: Date;
    dataFinal: Date;
  }): Observable<Vehicle[]> {
    const dtIni = this.formatDateToAmerican(params.dataInicial);
    const dtFim = this.formatDateToAmerican(params.dataFinal);

    const query = {
      query: `{ 
        getConsumoV4(
          token: "TKNAPI2100",
          sEmpresaId: ${params.empresa},
          strVei: "",
          strGrpVei: "",
          dtIni: "${dtIni}",
          dtFim: "${dtFim}",
          tipo: 1,
          versao: -1,
          filtro: 1,
          sUsrLog: 1,
          periodo: 0,
          mecanica: -1,
          maxRes: 0
        ) { 
          placa
        } 
      }`
    };

    return this.http
      .post<GraphQLResponse<ConsumoV4Response>>(this.apiUrl, query)
      .pipe(
        map(response => {
          if (!response?.data?.getConsumoV4) {
            throw new Error('Dados não encontrados');
          }
          // Remove duplicatas e mapeia para o formato Vehicle
          return Array.from(new Set(response.data.getConsumoV4.map(v => v.placa))).map(placa => {
            const vehicle = response.data.getConsumoV4.find(v => v.placa === placa);
            return {
              placa: placa,
              modelo: vehicle?.nmmodelo || '-',
              data: vehicle?.dia || '',
              hinisql: vehicle?.hinisql || '',
              hfimsql: vehicle?.hfimsql || '',
              nmmodelo: vehicle?.nmmodelo || '',
              nmmodonibus: vehicle?.nmmodonibus || '',
              versao: vehicle?.versao || '',
              stsprob: vehicle?.stsprob || '',
              km: parseFloat(vehicle?.km || '0'),
              dst: parseFloat(vehicle?.dst || '0'),
              litros: parseFloat(vehicle?.litros || '0'),
              litpar: parseFloat(vehicle?.litpar || '0'),
              kml: parseFloat(vehicle?.kml || '0'),
              tfp: parseFloat(vehicle?.tfp || '0'),
              efal: parseFloat(vehicle?.efal || '0'),
              pedal: parseFloat(vehicle?.pedal || '0'),
              odoini: parseFloat(vehicle?.odoini || '0'),
              odofim: parseFloat(vehicle?.odofim || '0')
            };
          });
        })
      );
  }

  getConsumoV4(params: {
    empresa: number;
    dataInicial: Date;
    dataFinal: Date;
    horaInicial?: string;
    horaFinal?: string;
  }): Observable<ConsumoV4Response[]> {
    // Validação das datas
    if (!params.dataInicial || !params.dataFinal) {
      throw new Error('Data inicial e final são obrigatórias');
    }

    // Validação da data futura
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999); // Define para o final do dia atual
    
    if (params.dataInicial > hoje) {
      throw new Error('A data inicial não pode ser uma data futura');
    }
    
    if (params.dataFinal > hoje) {
      throw new Error('A data final não pode ser uma data futura');
    }

    const dtIni = this.formatDateToAmerican(params.dataInicial);
    const dtFim = this.formatDateToAmerican(params.dataFinal);

    // Concatenate date with time if provided
    const dtIniCompleto = params.horaInicial ? `${dtIni} ${params.horaInicial}` : dtIni;
    const dtFimCompleto = params.horaFinal ? `${dtFim} ${params.horaFinal}` : dtFim;

    // Calcular data do dia anterior
    const previousDay = new Date(params.dataInicial);
    previousDay.setDate(previousDay.getDate() - 1);
    const dtIniPrevious = this.formatDateToAmerican(previousDay);
    const dtIniPreviousCompleto = params.horaInicial ? `${dtIniPrevious} ${params.horaInicial}` : dtIniPrevious;
    const dtFimPreviousCompleto = params.horaFinal ? `${dtIniPrevious} ${params.horaFinal}` : dtIniPrevious;

    // Log dos parâmetros formatados
    console.log('Parâmetros da consulta GraphQL:', {
      empresa: params.empresa,
      dtIni: dtIniCompleto,
      dtFim: dtFimCompleto
    });

    const query = {
      query: `{ 
        getConsumoV4(
          token: "TKNAPI2100",
          sEmpresaId: ${params.empresa},
          strVei: "",
          strGrpVei: "",
          dtIni: "${dtIniCompleto}",
          dtFim: "${dtFimCompleto}",
          tipo: 1,
          versao: -1,
          filtro: 1,
          sUsrLog: 1,
          periodo: 0,
          mecanica: -1,
          maxRes: 0
        ) { 
          placa nmmodelo nmmodonibus nmEqpto dia hinisql hfimsql km dst 
          litros litpar kml tfp efal pedal vme dinisml dfimsml versao 
          odoini odofim stsprob modo_ope
        }
        getPreviousDay: getConsumoV4(
          token: "TKNAPI2100",
          sEmpresaId: ${params.empresa},
          strVei: "",
          strGrpVei: "",
          dtIni: "${dtIniPreviousCompleto}",
          dtFim: "${dtFimPreviousCompleto}",
          tipo: 1,
          versao: -1,
          filtro: 1,
          sUsrLog: 1,
          periodo: 0,
          mecanica: -1,
          maxRes: 0
        ) {
          placa dia tfp efal pedal dst kml vme
        }
      }`
    };

    return this.http
      .post<GraphQLResponse<ConsumoV4Response>>(this.apiUrl, query)
      .pipe(
        map(response => {
          // Log da resposta
          console.log('Resposta da API GraphQL:', response);

          if (!response?.data?.getConsumoV4) {
            throw new Error('Resposta inválida da API');
          }

          const currentDayData = response.data.getConsumoV4;
          const previousDayData = response.data.getPreviousDay || [];

          if (!currentDayData.length && !previousDayData.length) {
            throw new Error('Nenhum dado encontrado para os parâmetros informados');
          }

          // Combinar os dados do dia atual com os dados do dia anterior
          return currentDayData.map(current => {
            const previous = previousDayData.find((prev: ConsumoV4Response) => prev.placa === current.placa);
            if (previous) {
              return {
                ...current,
                previousTfp: previous.tfp,
                previousEfal: previous.efal,
                previousPedal: previous.pedal
              };
            }
            return current;
          });
        })
      );
  }

  private formatDateToAmerican(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }
} 