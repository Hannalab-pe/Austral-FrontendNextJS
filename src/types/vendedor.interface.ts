export interface Vendedor {
  idVendedor?: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  documentoIdentidad?: string;
  porcentajeComision?: number;
  estaActivo?: boolean;
  fechaCreacion?: string;
}
