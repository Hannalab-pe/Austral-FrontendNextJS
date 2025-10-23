/**
 * Interfaces y tipos para APIs
 */

export interface LeadInfo {
  id_lead: string;
  nombre: string;
  apellido: string;
  telefono: string;
}

// Interface para detalles de seguro vehicular
export interface DetalleSeguroVehicular {
  id: string;
  lead_id: string;
  marca_auto: string;
  ano_auto: number;
  modelo_auto: string;
  placa_auto: string;
  tipo_uso: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  lead: LeadInfo;
}

// Interface para detalles de seguro de salud
export interface DetalleSeguroSalud {
  lead_id: string;
  edad: number;
  sexo: string;
  grupo_familiar: string;
  estado_clinico: string;
  zona_trabajo_vivienda: string;
  preferencia_plan: string;
  coberturas: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  reembolso: boolean;
}

// Interface para detalles de seguro SCTR
export interface DetalleSeguroSCTR {
  id: string;
  lead_id: string;
  razon_social: string;
  ruc: string;
  numero_trabajadores: number;
  monto_planilla: number;
  actividad_negocio: string;
  tipo_seguro: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

// Union type para cualquier tipo de detalle de seguro
export type DetalleSeguro =
  | DetalleSeguroVehicular
  | DetalleSeguroSalud
  | DetalleSeguroSCTR;

// Type guard para determinar si es vehicular
export const isDetalleSeguroVehicular = (
  detalle: DetalleSeguro
): detalle is DetalleSeguroVehicular => {
  return "marca_auto" in detalle;
};

// Type guard para determinar si es salud
export const isDetalleSeguroSalud = (
  detalle: DetalleSeguro
): detalle is DetalleSeguroSalud => {
  return "edad" in detalle && "sexo" in detalle;
};

// Type guard para determinar si es SCTR
export const isDetalleSeguroSCTR = (
  detalle: DetalleSeguro
): detalle is DetalleSeguroSCTR => {
  return "razon_social" in detalle && "ruc" in detalle;
};
