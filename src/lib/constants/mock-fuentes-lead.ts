import { FuenteLead } from '@/types/lead.interface';

/**
 * Fuentes de Lead - Canales de captación
 */
export const MOCK_FUENTES_LEAD: FuenteLead[] = [
    {
        id_fuente: 'f1',
        nombre: 'Sitio Web',
        descripcion: 'Formulario de contacto en el sitio web',
        tipo: 'DIGITAL',
        esta_activo: true,
        fecha_creacion: '2024-01-01T00:00:00Z',
    },
    {
        id_fuente: 'f2',
        nombre: 'Redes Sociales',
        descripcion: 'Facebook, Instagram, LinkedIn, etc.',
        tipo: 'DIGITAL',
        esta_activo: true,
        fecha_creacion: '2024-01-01T00:00:00Z',
    },
    {
        id_fuente: 'f3',
        nombre: 'Referido',
        descripcion: 'Cliente o contacto existente',
        tipo: 'REFERIDO',
        esta_activo: true,
        fecha_creacion: '2024-01-01T00:00:00Z',
    },
    {
        id_fuente: 'f4',
        nombre: 'Llamada Entrante',
        descripcion: 'Cliente contacta directamente por teléfono',
        tipo: 'TELEFONO',
        esta_activo: true,
        fecha_creacion: '2024-01-01T00:00:00Z',
    },
    {
        id_fuente: 'f5',
        nombre: 'Email',
        descripcion: 'Correo electrónico directo',
        tipo: 'EMAIL',
        esta_activo: true,
        fecha_creacion: '2024-01-01T00:00:00Z',
    },
    {
        id_fuente: 'f6',
        nombre: 'Campaña Publicitaria',
        descripcion: 'Google Ads, Facebook Ads, etc.',
        tipo: 'PUBLICIDAD',
        esta_activo: true,
        fecha_creacion: '2024-01-01T00:00:00Z',
    },
    {
        id_fuente: 'f7',
        nombre: 'Evento/Feria',
        descripcion: 'Eventos presenciales o ferias',
        tipo: 'EVENTO',
        esta_activo: true,
        fecha_creacion: '2024-01-01T00:00:00Z',
    },
    {
        id_fuente: 'f8',
        nombre: 'WhatsApp',
        descripcion: 'Mensajes por WhatsApp Business',
        tipo: 'DIGITAL',
        esta_activo: true,
        fecha_creacion: '2024-01-01T00:00:00Z',
    },
    {
        id_fuente: 'f9',
        nombre: 'Visita en Oficina',
        descripcion: 'Cliente visita la oficina directamente',
        tipo: 'PRESENCIAL',
        esta_activo: true,
        fecha_creacion: '2024-01-01T00:00:00Z',
    },
    {
        id_fuente: 'f10',
        nombre: 'Asociado',
        descripcion: 'Generado por un asociado comercial',
        tipo: 'ASOCIADO',
        esta_activo: true,
        fecha_creacion: '2024-01-01T00:00:00Z',
    },
];

/**
 * Obtener fuente por ID
 */
export const getFuenteLeadById = (id: string): FuenteLead | undefined => {
    return MOCK_FUENTES_LEAD.find((fuente) => fuente.id_fuente === id);
};

/**
 * Obtener fuentes activas
 */
export const getFuentesLeadActivas = (): FuenteLead[] => {
    return MOCK_FUENTES_LEAD.filter((fuente) => fuente.esta_activo);
};

/**
 * Obtener fuentes por tipo
 */
export const getFuentesLeadPorTipo = (tipo: string): FuenteLead[] => {
    return MOCK_FUENTES_LEAD.filter(
        (fuente) => fuente.esta_activo && fuente.tipo === tipo
    );
};
