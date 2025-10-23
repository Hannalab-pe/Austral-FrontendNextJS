export interface Poliza {
  id_poliza: number;
  contratante: string;
  asegurado: string;
  cia: string; // Compañía
  ram: string; // Ramo
  prod: string; // Producto
  poliza: string;
  mo: string; // Moneda
  vig_inicio: string; // Vigencia Inicio
  vig_fin: string; // Vigencia Fin
  sub_agente: string;
  descripcion_poliza: string;
  esta_activa: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  // Campos adicionales para el formulario
  tipo_vigencia: string;
  fecha_emision: string;
  comision_compania: number;
  comision_sub_agente: number;
  descripcion_asegurado: string;
  ejecutivo_cuenta: string;
  mas_informacion: string;
}
