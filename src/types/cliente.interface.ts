export interface Cliente {
    idCliente: string;
    tipoPersona: 'NATURAL' | 'JURIDICO';
    razonSocial?: string;
    nombres?: string;
    apellidos?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    direccion: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    telefono1: string;
    telefono2?: string;
    whatsapp?: string;
    emailNotificaciones?: string;
    recibirNotificaciones: boolean;
    cumpleanos?: Date | string;
    estaActivo: boolean;
    fechaRegistro: Date | string;
    idLead?: string;
    asignadoA?: string;
    registradoPor?: string;
    // Relaciones
    contactos?: ClienteContacto[];
    documentos?: ClienteDocumento[];
    // Campos calculados para UI
    nombreCompleto?: string;
    asignadoANombre?: string;
    registradoPorNombre?: string;
}

export interface ClienteContacto {
    idContacto: string;
    idCliente: string;
    nombre: string;
    cargo?: string;
    telefono?: string;
    correo?: string;
    fechaCreacion: Date | string;
}

export interface ClienteDocumento {
    idDocumento: string;
    idCliente: string;
    tipoDocumento: string;
    urlArchivo: string;
    descripcion?: string;
    fechaSubida: Date | string;
    subidoPor: string;
}

export interface CreateClienteDto {
    tipoPersona: 'NATURAL' | 'JURIDICO';
    razonSocial?: string;
    nombres?: string;
    apellidos?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    direccion: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    telefono1: string;
    telefono2?: string;
    whatsapp?: string;
    emailNotificaciones?: string;
    recibirNotificaciones?: boolean;
    cumpleanos?: Date | string;
    idLead?: string;
    asignadoA?: string;
    contactos?: CreateClienteContactoDto[];
}

export interface UpdateClienteDto extends Partial<CreateClienteDto> {
    estaActivo?: boolean;
}

export interface CreateClienteContactoDto {
    nombre: string;
    cargo?: string;
    telefono?: string;
    correo?: string;
}

export interface CreateClienteDocumentoDto {
    tipoDocumento: string;
    urlArchivo: string;
    descripcion?: string;
}

export interface ClienteFiltros {
    estaActivo?: boolean;
    brokerAsignado?: string;
    registradoPor?: string;
    search?: string;
}

export interface ClientePaginado {
    data: Cliente[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ClienteStats {
    total: number;
    activos: number;
    inactivos: number;
}
