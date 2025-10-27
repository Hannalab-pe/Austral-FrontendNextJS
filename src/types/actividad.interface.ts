export interface Actividad {
    idActividad: string;
    tipoActividad: string;
    titulo: string;
    descripcion?: string;
    fechaActividad: Date | string;
    duracionMinutos?: number;
    resultado?: string;
    proximaAccion?: string;
    fechaProximaAccion?: Date | string;
    idLead?: string;
    idCliente?: string;
    idPoliza?: string;
    realizadaPorUsuario: string;
    fechaCreacion: Date | string;
    // Relaciones opcionales
    usuario?: {
        idUsuario: string;
        nombreUsuario: string;
        nombre: string;
        apellido: string;
        email: string;
    };
    lead?: {
        idLead: string;
        nombre: string;
        apellido?: string;
        email?: string;
    };
    cliente?: {
        idCliente: string;
        nombre: string;
        apellido: string;
        email: string;
    };
    poliza?: {
        idPoliza: string;
        numeroPoliza: string;
    };
}

export interface CreateActividadDto {
    tipoActividad: string;
    titulo: string;
    descripcion?: string;
    fechaActividad: string;
    duracionMinutos?: number;
    resultado?: string;
    proximaAccion?: string;
    fechaProximaAccion?: string;
    idLead?: string;
    idCliente?: string;
    idPoliza?: string;
    realizadaPorUsuario: string;
}

export interface UpdateActividadDto extends Partial<CreateActividadDto> {
    // Esta interfaz hereda todos los campos opcionales de CreateActividadDto
    // Se mantiene como interfaz separada para claridad semántica y posibles extensiones futuras
}

export interface ActividadFiltros {
    tipoActividad?: string;
    fechaDesde?: Date | string;
    fechaHasta?: Date | string;
    realizadaPorUsuario?: string;
    idLead?: string;
    idCliente?: string;
    idPoliza?: string;
}

// Tipos para el calendario
export interface ActividadCalendario {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource?: Actividad;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
}

// Tipos de actividades comunes
export type TipoActividad =
    | 'LLAMADA'
    | 'REUNION'
    | 'EMAIL'
    | 'VISITA'
    | 'SEGUIMIENTO'
    | 'PRESENTACION'
    | 'NEGOCIACION'
    | 'CIERRE'
    | 'POST_VENTA'
    | 'QUEJA'
    | 'SOLICITUD'
    | 'OTRO';

// Constantes para tipos de actividades
export const TIPOS_ACTIVIDAD = {
    LLAMADA: 'LLAMADA',
    REUNION: 'REUNION',
    EMAIL: 'EMAIL',
    VISITA: 'VISITA',
    SEGUIMIENTO: 'SEGUIMIENTO',
    PRESENTACION: 'PRESENTACION',
    NEGOCIACION: 'NEGOCIACION',
    CIERRE: 'CIERRE',
    POST_VENTA: 'POST_VENTA',
    QUEJA: 'QUEJA',
    SOLICITUD: 'SOLICITUD',
    OTRO: 'OTRO',
} as const;

// Colores para diferentes tipos de actividades
export const COLORES_ACTIVIDAD: Record<TipoActividad, string> = {
    LLAMADA: '#3B82F6', // Azul
    REUNION: '#10B981', // Verde
    EMAIL: '#F59E0B', // Amarillo
    VISITA: '#EF4444', // Rojo
    SEGUIMIENTO: '#8B5CF6', // Violeta
    PRESENTACION: '#06B6D4', // Cyan
    NEGOCIACION: '#F97316', // Naranja
    CIERRE: '#84CC16', // Verde lima
    POST_VENTA: '#6366F1', // Indigo
    QUEJA: '#EC4899', // Rosa
    SOLICITUD: '#14B8A6', // Teal
    OTRO: '#6B7280', // Gris
};