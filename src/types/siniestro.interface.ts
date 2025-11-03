export type SiniestroEstado = 'REPORTADO' | 'EN_PROCESO' | 'CERRADO' | 'RECHAZADO';

export interface Siniestro {
  idSiniestro: string;
  idPoliza: string;
  numeroSiniestro: string;
  fechaOcurrencia: string; // ISO date
  descripcion: string;
  montoReclamado: number;
  montoPagado?: number;
  estado: SiniestroEstado;
  observaciones?: string;
  fechaReporte: string;
  fechaCierre?: string;
  fechaActualizacion: string;
}
