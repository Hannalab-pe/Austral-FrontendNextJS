import { EstadoLead } from '@/types/lead.interface';

/**
 * Estados de Lead para el flujo del proceso de ventas
 * Estos representan las columnas del Kanban
 */
export const MOCK_ESTADOS_LEAD: EstadoLead[] = [
    {
        id_estado: '1',
        nombre: 'Nuevo',
        descripcion: 'Leads recién ingresados al sistema',
        color_hex: '#10B981', // Verde
        orden_proceso: 1,
        es_estado_final: false,
        esta_activo: true,
    },
    {
        id_estado: '2',
        nombre: 'Contactado',
        descripcion: 'Primer contacto realizado',
        color_hex: '#3B82F6', // Azul
        orden_proceso: 2,
        es_estado_final: false,
        esta_activo: true,
    },
    {
        id_estado: '3',
        nombre: 'Calificado',
        descripcion: 'Lead calificado como prospecto viable',
        color_hex: '#8B5CF6', // Púrpura
        orden_proceso: 3,
        es_estado_final: false,
        esta_activo: true,
    },
    {
        id_estado: '4',
        nombre: 'Propuesta Enviada',
        descripcion: 'Cotización o propuesta enviada al cliente',
        color_hex: '#F59E0B', // Ámbar
        orden_proceso: 4,
        es_estado_final: false,
        esta_activo: true,
    },
    {
        id_estado: '5',
        nombre: 'En Negociación',
        descripcion: 'Negociando términos y condiciones',
        color_hex: '#EC4899', // Rosa
        orden_proceso: 5,
        es_estado_final: false,
        esta_activo: true,
    },
    {
        id_estado: '6',
        nombre: 'Ganado',
        descripcion: 'Lead convertido en cliente',
        color_hex: '#059669', // Verde oscuro
        orden_proceso: 6,
        es_estado_final: true,
        esta_activo: true,
    },
    {
        id_estado: '7',
        nombre: 'Perdido',
        descripcion: 'Lead no convertido',
        color_hex: '#EF4444', // Rojo
        orden_proceso: 7,
        es_estado_final: true,
        esta_activo: true,
    },
];

/**
 * Obtener estado por ID
 */
export const getEstadoLeadById = (id: string): EstadoLead | undefined => {
    return MOCK_ESTADOS_LEAD.find((estado) => estado.id_estado === id);
};

/**
 * Obtener estados activos ordenados
 */
export const getEstadosLeadActivos = (): EstadoLead[] => {
    return MOCK_ESTADOS_LEAD.filter((estado) => estado.esta_activo).sort(
        (a, b) => a.orden_proceso - b.orden_proceso
    );
};

/**
 * Obtener solo estados no finales (para el flujo)
 */
export const getEstadosLeadNoFinales = (): EstadoLead[] => {
    return MOCK_ESTADOS_LEAD.filter(
        (estado) => estado.esta_activo && !estado.es_estado_final
    ).sort((a, b) => a.orden_proceso - b.orden_proceso);
};
