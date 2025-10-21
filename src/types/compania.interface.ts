export interface CompaniaSeguro {
  idCompania: string;
  nombre: string;
  razonSocial?: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  sitioWeb?: string;
  contactoPrincipal?: string;
  telefonoContacto?: string;
  emailContacto?: string;
  estaActivo: boolean;
  fechaCreacion: string;
}

export interface CreateCompaniaSeguroDto {
  nombre: string;
  razonSocial?: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  sitioWeb?: string;
  contactoPrincipal?: string;
  telefonoContacto?: string;
  emailContacto?: string;
}

export interface UpdateCompaniaSeguroDto {
  nombre?: string;
  razonSocial?: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  sitioWeb?: string;
  contactoPrincipal?: string;
  telefonoContacto?: string;
  emailContacto?: string;
  estaActivo?: boolean;
}
