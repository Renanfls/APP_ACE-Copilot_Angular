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
  tfp: number;
  efal: number;
  pedal: number;
  giro: number;
  freio: number;
  velocidadeMedia?: number;
  rota: Array<{lat: number, lng: number}>;
  paradas: Array<{lat: number, lng: number, tempo: number}>;
  odometroInicial: number;
  odometroFinal: number;
  hinisql: string;
  hfimsql: string;
  nmmodelo: string;
  nmmodonibus: string;
  stsprob: string;
  dst: number;
  litpar: number;
  kml: number;
  odoini: number;
  odofim: number;
}