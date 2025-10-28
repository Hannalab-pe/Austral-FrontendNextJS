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
    idEstado: string;
    nombre: string;
    descripcion?: string;
    colorHex: string;
    ordenProceso: number;
    esEstadoFinal: boolean;
    estaActivo: boolean;
}

// Fuente Lead
export interface FuenteLead {
    idFuente: string;
    nombre: string;
    descripcion?: string;
    tipo?: string;
    estaActivo: boolean;
    fechaCreacion: string;
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
    idLead: string;
    nombre: string;
    apellido?: string;
    email?: string;
    telefono: string;
    fechaNacimiento?: string;
    tipoSeguroInteres?: string;
    presupuestoAproximado?: number;
    notas?: string;
    puntajeCalificacion: number;
    prioridad: Prioridad;
    fechaPrimerContacto: string;
    fechaUltimoContacto?: string;
    proximaFechaSeguimiento?: string;
    idEstado: string;
    idFuente: string;
    asignadoAUsuario?: string;
    estaActivo: boolean;
    fechaCreacion: string;

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
    fechaNacimiento?: string;
    tipoSeguroInteres?: string;
    presupuestoAproximado?: number;
    notas?: string;
    puntajeCalificacion?: number;
    prioridad: Prioridad;
    proximaFechaSeguimiento?: string;
    idEstado: string;
    idFuente: string;
    asignadoAUsuario?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {
    idLead: string;
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
    colorHex: string;
    ordenProceso: number;
    esEstadoFinal: boolean;
}

export interface UpdateEstadoLeadDto extends Partial<CreateEstadoLeadDto> {
    estaActivo?: boolean;
}

// DTOs para FuenteLead
export interface CreateFuenteLeadDto {
    nombre: string;
    descripcion?: string;
    tipo?: string;
}

export interface UpdateFuenteLeadDto extends Partial<CreateFuenteLeadDto> {
    estaActivo?: boolean;
}
