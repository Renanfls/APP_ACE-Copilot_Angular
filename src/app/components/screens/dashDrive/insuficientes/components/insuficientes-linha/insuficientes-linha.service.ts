import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Motorista {
  nome: string;
  matricula: string;
  percentualInsuficiencia: number;
}

export interface InsuficentesData {
  linha: string;
  quantidade: number;
  percentual: number;
  motoristas?: Motorista[];
}

export interface IndicadorMotorista {
  nome: string;
  valor: string;
  tendencia: number; // positivo: melhora, negativo: piora, zero: estável
  unidade: string;
}

export interface DesempenhoMotorista {
  pontuacao: number;
  kml: number[];
  kmTotal: number[];
  freio: number[];
  pedal: number[];
  giroMotor: number[];
  datas: string[];
  indicadores: IndicadorMotorista[];
}

@Injectable({
  providedIn: 'root'
})
export class InsuficentesLinhaService {
  private apiUrl = 'assets/data'; // Caminho para os arquivos JSON mockados

  constructor(private http: HttpClient) { }

  getInsuficentesData(filtros?: any): Observable<InsuficentesData[]> {
    // Construir query params com os filtros se necessário
    const url = `${this.apiUrl}/insuficientes-linha.json`;
    
    return this.http.get<InsuficentesData[]>(url).pipe(
      map(data => this.ordenarPorNumeroLinha(data)),
      catchError(error => {
        console.error('Erro ao buscar dados de insuficiência por linha:', error);
        return of([]); // Retorna array vazio em caso de erro
      })
    );
  }

  getMotoristasPorLinha(linha: string): Observable<Motorista[]> {
    const url = `${this.apiUrl}/motoristas-linha-${linha}.json`;
    
    return this.http.get<Motorista[]>(url).pipe(
      catchError(error => {
        console.error(`Erro ao buscar motoristas da linha ${linha}:`, error);
        return of([]); // Retorna array vazio em caso de erro
      })
    );
  }

  getDesempenhoMotorista(matricula: string): Observable<DesempenhoMotorista> {
    const url = `${this.apiUrl}/desempenho-motorista-${matricula}.json`;
    
    return this.http.get<DesempenhoMotorista>(url).pipe(
      catchError(error => {
        console.error(`Erro ao buscar desempenho do motorista ${matricula}:`, error);
        // Retorna dados mockados em caso de erro
        return of(this.gerarDadosDesempenhoMockados());
      })
    );
  }

  private ordenarPorNumeroLinha(dados: InsuficentesData[]): InsuficentesData[] {
    return dados.sort((a, b) => parseInt(a.linha) - parseInt(b.linha));
  }

  // Método para gerar dados mockados de desempenho caso o arquivo não exista
  private gerarDadosDesempenhoMockados(): DesempenhoMotorista {
    // Gerar datas dos últimos 7 dias
    const datas = Array.from({ length: 7 }, (_, i) => {
      const data = new Date();
      data.setDate(data.getDate() - (6 - i));
      return `${data.getDate()}/${data.getMonth() + 1}`;
    });
    
    return {
      pontuacao: Math.floor(65 + Math.random() * 30),
      kml: datas.map(() => +(1.8 + Math.random() * 1.7).toFixed(2)),
      kmTotal: datas.map(() => Math.floor(120 + Math.random() * 80)),
      freio: datas.map(() => Math.floor(15 + Math.random() * 40)),
      pedal: datas.map(() => Math.floor(20 + Math.random() * 45)),
      giroMotor: datas.map(() => Math.floor(1600 + Math.random() * 800)),
      datas: datas,
      indicadores: [
        {
          nome: 'Pontuação',
          valor: `${Math.floor(70 + Math.random() * 25)}`,
          tendencia: Math.random() > 0.5 ? 1 : -1,
          unidade: '%'
        },
        {
          nome: 'KM/L',
          valor: (2 + Math.random() * 1.5).toFixed(2),
          tendencia: Math.random() > 0.5 ? 1 : -1,
          unidade: 'km/l'
        },
        {
          nome: 'Total KM',
          valor: `${Math.floor(1200 + Math.random() * 800)}`,
          tendencia: 0,
          unidade: 'km'
        },
        {
          nome: 'Freio',
          valor: `${Math.floor(20 + Math.random() * 40)}`,
          tendencia: Math.random() > 0.7 ? 1 : -1,
          unidade: '%'
        },
        {
          nome: 'Pedal',
          valor: `${Math.floor(30 + Math.random() * 40)}`,
          tendencia: Math.random() > 0.5 ? 1 : -1,
          unidade: '%'
        },
        {
          nome: 'Giro',
          valor: `${Math.floor(1800 + Math.random() * 600)}`,
          tendencia: Math.random() > 0.6 ? -1 : 1,
          unidade: 'rpm'
        }
      ]
    };
  }
}