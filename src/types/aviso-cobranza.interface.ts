import { EstadoAvisoCobranza } from "./enums";

export interface AvisoCobranza {
  idAvisoCobranza: string;
  idPrima: string;
  fechaVencimiento: string;
  monto: number;
  estado: EstadoAvisoCobranza;
  fechaPago?: string;
  observaciones?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}
