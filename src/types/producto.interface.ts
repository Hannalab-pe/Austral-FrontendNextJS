/**
 * Interfaces y tipos para Productos de Seguros
 */

// ============================================================================
// TIPO SEGURO
// ============================================================================

export interface TipoSeguro {
  idTipoSeguro: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  requiereInspeccion?: boolean;
  duracionMinimaMeses?: number;
  duracionMaximaMeses?: number;
  estaActivo: boolean;
  fechaCreacion: Date;
}

export interface CreateTipoSeguroDto {
  nombre: string;
  descripcion?: string;
  categoria?: string;
  requiereInspeccion?: boolean;
  duracionMinimaMeses?: number;
  duracionMaximaMeses?: number;
}

export interface UpdateTipoSeguroDto {
  nombre?: string;
  descripcion?: string;
  categoria?: string;
  requiereInspeccion?: boolean;
  duracionMinimaMeses?: number;
  duracionMaximaMeses?: number;
}

// ============================================================================
// PRODUCTO SEGURO
// ============================================================================

export interface ProductoSeguro {
  idProducto: string;
  nombre: string;
  descripcion?: string;
  codigoProducto?: string;
  primaBase?: number;
  primaMinima?: number;
  primaMaxima?: number;
  porcentajeComision?: number;
  coberturaMaxima?: number;
  deducible?: number;
  edadMinima?: number;
  edadMaxima?: number;
  condicionesEspeciales?: string;
  estaActivo: boolean;
  fechaCreacion: Date;
  idCompania: string;
  idTipoSeguro: string;
  // Relaciones opcionales (cuando se incluyen en las consultas)
  compania?: {
    idCompania: string;
    nombre: string;
  };
  tipoSeguro?: {
    idTipoSeguro: string;
    nombre: string;
    categoria?: string;
  };
}

export interface CreateProductoSeguroDto {
  nombre: string;
  descripcion?: string;
  codigoProducto?: string;
  primaBase?: number;
  primaMinima?: number;
  primaMaxima?: number;
  porcentajeComision?: number;
  coberturaMaxima?: number;
  deducible?: number;
  edadMinima?: number;
  edadMaxima?: number;
  condicionesEspeciales?: string;
  idCompania: string;
  idTipoSeguro: string;
}

export interface UpdateProductoSeguroDto {
  nombre?: string;
  descripcion?: string;
  codigoProducto?: string;
  primaBase?: number;
  primaMinima?: number;
  primaMaxima?: number;
  porcentajeComision?: number;
  coberturaMaxima?: number;
  deducible?: number;
  edadMinima?: number;
  edadMaxima?: number;
  condicionesEspeciales?: string;
  idCompania?: string;
  idTipoSeguro?: string;
}

// ============================================================================
// TIPOS PARA FORMULARIOS
// ============================================================================

export type ProductoFormData = Omit<
  CreateProductoSeguroDto,
  'idCompania' | 'idTipoSeguro'
> & {
  idCompania: string;
  idTipoSeguro: string;
};
