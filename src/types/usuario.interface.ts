export interface Usuario {
    idUsuario: string;
    nombreUsuario: string;
    email: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    documentoIdentidad?: string;
    estaActivo: boolean;
    ultimoAcceso?: Date | string;
    intentosFallidos: number;
    cuentaBloqueada: boolean;
    idRol: string;
    fechaCreacion: Date | string;
    // Relación con rol
    rol?: Rol;
    // Campos adicionales para mostrar en UI
    rolNombre?: string;
    nombreCompleto?: string;
}

export interface CreateUsuarioDto {
    nombreUsuario: string;
    email: string;
    contrasena: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    documentoIdentidad?: string;
    idRol: string;
}

export interface UpdateUsuarioDto {
    nombreUsuario?: string;
    email?: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    documentoIdentidad?: string;
    idRol?: string;
}

export interface UsuarioFiltros {
    estaActivo?: boolean;
    idRol?: string;
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
    idRol: string;
    nombre: string;
    descripcion?: string;
    nivelAcceso: number;
    estaActivo: boolean;
    fechaCreacion: Date | string;
}

export interface Vista {
    idVista: string;
    nombre: string;
    descripcion?: string;
    ruta: string;
    estaActiva: boolean;
    fechaCreacion: Date | string;
}

export interface BrokerVendedor {
    idBroker: string;
    idVendedor: string;
    porcentajeComision: number;
    estaActivo: boolean;
    fechaAsignacion: Date | string;
    // Relaciones
    broker?: Usuario;
    vendedor?: Usuario;
}
