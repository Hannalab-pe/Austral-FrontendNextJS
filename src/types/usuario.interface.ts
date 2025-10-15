export interface Usuario {
    id_usuario: string;
    nombre_usuario: string;
    email: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    documento_identidad?: string;
    id_asociado?: string;
    supervisor_id?: string;
    esta_activo: boolean;
    ultimo_acceso?: Date | string;
    intentos_fallidos: number;
    cuenta_bloqueada: boolean;
    id_rol: string;
    fecha_creacion: Date | string;
    // Campos adicionales para mostrar en UI
    rol_nombre?: string;
    nombre_completo?: string;
}

export interface CreateUsuarioDto {
    nombre_usuario: string;
    email: string;
    contrasena: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    documento_identidad?: string;
    id_asociado?: string;
    supervisor_id?: string;
    id_rol: string;
}

export interface UpdateUsuarioDto {
    nombre_usuario?: string;
    email?: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    documento_identidad?: string;
    id_asociado?: string;
    supervisor_id?: string;
    id_rol?: string;
}

export interface UsuarioFiltros {
    esta_activo?: boolean;
    id_rol?: string;
    search?: string;
}

export interface UsuarioPaginado {
    data: Usuario[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface UsuarioStats {
    total: number;
    activos: number;
    inactivos: number;
    bloqueados: number;
}

export interface Rol {
    id_rol: string;
    nombre: string;
    descripcion?: string;
    nivel_acceso: number;
    esta_activo: boolean;
    fecha_creacion: Date | string;
}
