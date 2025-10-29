/**
 * Interfaces y t// Fuente Lead
export interface FuenteLead {
    idFuente: string;
    nombre: string;
    descripcion?: string;
    tipo?: string;
    estaActivo: boolean;
    fechaCreacion: string;
}

// Lead principal de Leads
 * Basado en el esquema de base de datos
 */

import { Usuario } from './usuario.interface';

// Enums
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';

// Estado Lead
export interface EstadoLead {
    id_estado: string;
    nombre: string;
    descripcion?: string;
    color_hex: string;
    orden_proceso: number;
    es_estado_final: boolean;
    esta_activo: boolean;
}

// Fuente Lead
export interface FuenteLead {
    id_fuente: string;
    nombre: string;
    descripcion?: string;
    tipo?: string;
    esta_activo: boolean;
    fecha_creacion: string;
}

// Usuario básico (para asignación)
export interface UsuarioBasico {
    id_usuario: string;
    nombre: string;
    apellido: string;
    email: string;
}

// Lead principal
export interface Lead {
    id_lead: string;
    nombre: string;
    apellido?: string;
    email?: string;
    telefono: string;
    fecha_nacimiento?: string;
    tipo_seguro_interes?: string;
    presupuesto_aproximado?: number;
    notas?: string;
    puntaje_calificacion: number;
    prioridad: Prioridad;
    fecha_primer_contacto: string;
    fecha_ultimo_contacto?: string;
    proxima_fecha_seguimiento?: string;
    id_estado: string;
    id_fuente: string;
    asignado_a_usuario?: string;
    esta_activo: boolean;
    fecha_creacion: string;

    // Relaciones expandidas (opcionales)
    estado?: EstadoLead;
    fuente?: FuenteLead;
    usuarioAsignado?: Usuario;
}

// DTOs
export interface CreateLeadDto {
    nombre: string;
    apellido?: string;
    email?: string;
    telefono: string;
    fecha_nacimiento?: string;
    tipo_seguro_interes?: string;
    presupuesto_aproximado?: number;
    notas?: string;
    puntaje_calificacion?: number;
    prioridad: Prioridad;
    proxima_fecha_seguimiento?: string;
    id_estado: string;
    id_fuente: string;
    asignado_a_usuario?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {
    id_lead: string;
}

// Para el Kanban
export interface KanbanColumn {
    id: string;
    titulo: string;
    color: string;
    orden: number;
    leads: Lead[];
}

export interface LeadFilters {
    busqueda?: string;
    prioridad?: Prioridad[];
    fuente?: string[];
    usuarioAsignado?: string[];
    fechaDesde?: string;
    fechaHasta?: string;
}

// Estadísticas de leads
export interface LeadStats {
    total: number;
    porEstado: Record<string, number>;
    porPrioridad: Record<Prioridad, number>;
    conversionRate: number;
    leadsSinAsignar: number;
}

// DTOs para EstadoLead
export interface CreateEstadoLeadDto {
    nombre: string;
    descripcion?: string;
    color_hex: string;
    orden_proceso: number;
    es_estado_final: boolean;
}

export interface UpdateEstadoLeadDto extends Partial<CreateEstadoLeadDto> {
    esta_activo?: boolean;
}

// DTOs para FuenteLead
export interface CreateFuenteLeadDto {
    nombre: string;
    descripcion?: string;
    tipo?: string;
}

export interface UpdateFuenteLeadDto extends Partial<CreateFuenteLeadDto> {
    esta_activo?: boolean;
}
