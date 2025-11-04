export interface Poliza {
  idPoliza: number;
  contratante: string;
  asegurado: string;
  cia: string; // Compañía
  ram: string; // Ramo
  prod: string; // Producto
  poliza: string;
  moneda: string; // Moneda
  vigenciaInicio: string; // Vigencia Inicio
  vigenciaFin: string; // Vigencia Fin
  subAgente: string;
  descripcionPoliza: string;
  estaActiva: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  // Campos adicionales para el formulario
  tipoVigencia: string;
  fechaEmision: string;
  comisionCompania: number;
  comisionSubAgente: number;
  descripcionAsegurado: string;
  ejecutivoCuenta: string;
  masInformacion: string;
}
