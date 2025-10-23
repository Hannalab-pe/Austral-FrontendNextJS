// Tipos para el sistema de permisos

export interface Vista {
    idVista: string;
    nombre: string;
    descripcion?: string;
    ruta: string;
    estaActiva: boolean;
    fechaCreacion: string;
}

export interface Permiso {
    idPermiso: string;
    nombre: string;
    descripcion?: string;
    estaActivo: boolean;
    fechaCreacion: string;
}

export interface Rol {
    idRol: string;
    nombre: string;
    descripcion?: string;
    nivelAcceso: number;
    estaActivo: boolean;
    fechaCreacion: string;
}

export interface RolVista {
    idRol: string;
    idVista: string;
    fechaCreacion: string;
    // Relaciones opcionales para facilitar el uso
    vista?: Vista;
    rol?: Rol;
}

export interface RolPermisoVista {
    idRol: string;
    idVista: string;
    idPermiso: string;
    fechaCreacion: string;
    // Relaciones opcionales
    vista?: Vista;
    rol?: Rol;
    permiso?: Permiso;
}

// DTOs para requests
export interface VerificarPermisoRequest {
    idUsuario: string;
    vista: string;
    permiso: string;
}

export interface VerificarVistaRequest {
    idUsuario: string;
    vista: string;
}

export interface VerificarRutaRequest {
    idUsuario: string;
    ruta: string;
}

// Responses
export interface VerificarPermisoResponse {
    tienePermiso: boolean;
    mensaje?: string;
}

export interface VerificarVistaResponse {
    tienePermiso: boolean;
    mensaje?: string;
}

export interface VerificarRutaResponse {
    tienePermiso: boolean;
    mensaje?: string;
}

// Listados
export interface VistasResponse {
    vistas: Vista[];
    total: number;
}

export interface PermisosResponse {
    permisos: Permiso[];
    total: number;
}

export interface RolesResponse {
    roles: Rol[];
    total: number;
}

// Estadísticas
export interface EstadisticasPermisos {
    totalVistas: number;
    totalPermisos: number;
    totalRoles: number;
    totalAsignaciones: number;
}