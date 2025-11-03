
import { PrimaEstado } from './enums';

export interface Prima {
  idPrima: string;
  idPoliza: string;
  monto: number;
  fechaVencimiento: string; // ISO date
  fechaPago?: string; // ISO date
  estado: PrimaEstado;
  observaciones?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}
