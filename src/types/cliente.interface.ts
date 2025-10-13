export interface Cliente {
    id_cliente: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    telefono_secundario?: string;
    documento_identidad: string;
    tipo_documento: TipoDocumento;
    fecha_nacimiento: Date | string;
    direccion: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    ocupacion?: string;
    empresa?: string;
    estado_civil?: EstadoCivil;
    contacto_emergencia_nombre?: string;
    contacto_emergencia_telefono?: string;
    contacto_emergencia_relacion?: string;
    esta_activo: boolean;
    fecha_registro: Date | string;
    id_lead?: string;
    broker_asignado?: string;
    broker_nombre?: string; // Para mostrar en la tabla
}

export type TipoDocumento = 'DNI' | 'CE' | 'PASAPORTE' | 'RUC';

export type EstadoCivil = 'SOLTERO' | 'CASADO' | 'DIVORCIADO' | 'VIUDO' | 'CONVIVIENTE';

export interface CreateClienteDto {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    telefono_secundario?: string;
    documento_identidad: string;
    tipo_documento: TipoDocumento;
    fecha_nacimiento: Date | string;
    direccion: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    ocupacion?: string;
    empresa?: string;
    estado_civil?: EstadoCivil;
    contacto_emergencia_nombre?: string;
    contacto_emergencia_telefono?: string;
    contacto_emergencia_relacion?: string;
    id_lead?: string;
    broker_asignado?: string;
}

export interface UpdateClienteDto extends Partial<CreateClienteDto> {
    esta_activo?: boolean;
}
