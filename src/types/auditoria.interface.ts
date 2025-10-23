export interface Auditoria {
    idAuditoria: string;
    tabla: string;
    idRegistro: string;
    accion: string;
    idUsuario?: string;
    ipAddress?: string;
    fechaAccion: Date | string;
    // Relación con usuario (opcional para mostrar información)
    usuario?: {
        idUsuario: string;
        nombreUsuario: string;
        nombre: string;
        apellido: string;
        email: string;
    };
}

export interface CreateAuditoriaDto {
    tabla: string;
    idRegistro: string;
    accion: string;
    idUsuario?: string;
    ipAddress?: string;
}

export interface AuditoriaFiltros {
    tabla?: string;
    accion?: string;
    fechaDesde?: Date | string;
    fechaHasta?: Date | string;
}

export interface AuditoriaPaginado {
    data: Auditoria[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface AuditoriaStats {
    totalRegistros: number;
    registrosHoy: number;
    accionesMasComunes: {
        accion: string;
        count: number;
    }[];
    tablasMasAuditadas: {
        tabla: string;
        count: number;
    }[];
}

// Tipos de acciones comunes para auditoría
export type AccionAuditoria =
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'VIEW'
    | 'EXPORT'
    | 'IMPORT'
    | 'ACTIVATE'
    | 'DEACTIVATE'
    | 'BLOCK'
    | 'UNBLOCK'
    | 'APPROVE'
    | 'REJECT'
    | 'ASSIGN'
    | 'UNASSIGN';

// Función helper para crear registros de auditoría
export const createAuditoriaEntry = (
    tabla: string,
    idRegistro: string,
    accion: AccionAuditoria,
    idUsuario?: string,
    ipAddress?: string
): CreateAuditoriaDto => ({
    tabla,
    idRegistro,
    accion,
    idUsuario,
    ipAddress,
});

// Constantes para nombres de tablas (para mantener consistencia)
export const AUDITORIA_TABLAS = {
    USUARIO: 'usuario',
    CLIENTE: 'cliente',
    LEAD: 'lead',
    POLIZA: 'poliza',
    PRODUCTO_SEGURO: 'producto_seguro',
    COMPANIA_SEGURO: 'compania_seguro',
    ROL: 'rol',
    VISTA: 'vista',
    PERMISO: 'permiso',
    NOTIFICACION: 'notificacion',
    TAREA: 'tarea',
    ACTIVIDAD: 'actividad',
    PETICION: 'peticion',
    SINIESTRO: 'siniestro',
    COMISION: 'comision',
    ASOCIADO: 'asociado',
    FUENTE_LEAD: 'fuente_lead',
    ESTADO_LEAD: 'estado_lead',
    ESTADO_POLIZA: 'estado_poliza',
    TIPO_SEGURO: 'tipo_seguro',
    TIPO_SINIESTRO: 'tipo_siniestro',
} as const;