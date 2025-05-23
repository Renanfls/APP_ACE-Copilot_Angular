export interface TripAnalysisData {
  cpo1: string;
  val1: string;
  cpo2: string;
  val2: string;
}

export interface Metric {
  label: string;
  color: string;
  current: number;
  previous: number;
  change: number;
}

export interface TripData {
  // Campos principais
  inicio: Date;
  fim: Date;
  mecanica: string;
  modelo: string;
  versao: string;
  status: string;
  stsprob: string;
  placa: string;
  dia: string;

  // Métricas de distância e consumo
  km: number;
  distancia: number;
  dst: number;
  litros: number;
  litrosParado: number;
  litpar: number;
  kmPorLitro: number;
  kml: number;
  odometroInicial: number;
  odometroFinal: number;
  velocidadeMedia: number;

  // Métricas de desempenho
  tfp: number;
  efal: number;
  pedal: number;
  giro?: number;
  freio?: number;

  // Dados do dia anterior para comparação
  previousTfp?: number;
  previousEfal?: number;
  previousPedal?: number;

  // Dados de localização
  rota: Array<{lat: number, lng: number}>;
  paradas: Array<{lat: number, lng: number, tempo: number}>;

  // Campos adicionais do GraphQL
  hinisql: string;
  hfimsql: string;
  nmmodelo: string;
  nmmodonibus: string;
  odoini: number;
  odofim: number;
} 