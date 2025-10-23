export interface Siniestro {
  id: number;
  contratante: string;
  titular: string;
  poliza: string;
  cia: string; // Compañía
  fec_stro: string; // Fecha de Siniestro
  causa: string;
  siniestro_no: string; // Número de Siniestro
  provision: number;
  estado: string;
  ejec: string; // Ejecutivo
  ramo: string;
  placa: string;
  fec_gestion: string; // Fecha de Gestión
  prox_gestion: string; // Próxima Gestión
  esta_activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}
