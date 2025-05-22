export interface TripAnalysisData {
  cpo1: string;
  val1: string;
  cpo2: string;
  val2: string;
}

export interface Metric {
  label: string;
  value: number;
  previousValue: number;
  color: string;
}

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
  odometroInicial: number;
  odometroFinal: number;
  velocidadeMedia: number;
  rota: Array<{lat: number, lng: number}>;
  paradas: Array<{lat: number, lng: number, tempo: number}>;
  hinisql: string;
  hfimsql: string;
  nmmodelo: string;
  nmmodonibus: string;
  stsprob: string;
  odoini: number;
  odofim: number;
  dst: number;
  litpar: number;
  kml: number;
  tfp: number;
  efal: number;
} 