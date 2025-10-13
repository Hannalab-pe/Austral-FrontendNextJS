import { Lead } from '@/types/lead.interface';

/**
 * Datos mock de Leads para testing
 */
export const MOCK_LEADS: Lead[] = [
    // Estado: Nuevo (1)
    {
        id_lead: 'lead-1',
        nombre: 'Carlos',
        apellido: 'Mendoza',
        email: 'carlos.mendoza@email.com',
        telefono: '+51 987 654 321',
        fecha_nacimiento: '1985-03-15',
        tipo_seguro_interes: 'Seguro Vehicular',
        presupuesto_aproximado: 1500,
        notas: 'Interesado en seguro todo riesgo para auto nuevo',
        puntaje_calificacion: 75,
        prioridad: 'ALTA',
        fecha_primer_contacto: '2025-10-01T10:00:00Z',
        fecha_ultimo_contacto: '2025-10-01T10:00:00Z',
        proxima_fecha_seguimiento: '2025-10-12T14:00:00Z',
        id_estado: '1',
        id_fuente: 'f1',
        asignado_a_usuario: 'u1',
        esta_activo: true,
        fecha_creacion: '2025-10-01T10:00:00Z',
    },
    {
        id_lead: 'lead-2',
        nombre: 'María',
        apellido: 'Torres',
        email: 'maria.torres@email.com',
        telefono: '+51 965 432 187',
        tipo_seguro_interes: 'Seguro de Vida',
        presupuesto_aproximado: 800,
        notas: 'Busca cobertura familiar',
        puntaje_calificacion: 60,
        prioridad: 'MEDIA',
        fecha_primer_contacto: '2025-10-03T11:30:00Z',
        fecha_ultimo_contacto: '2025-10-03T11:30:00Z',
        proxima_fecha_seguimiento: '2025-10-13T10:00:00Z',
        id_estado: '1',
        id_fuente: 'f2',
        asignado_a_usuario: 'u2',
        esta_activo: true,
        fecha_creacion: '2025-10-03T11:30:00Z',
    },
    {
        id_lead: 'lead-3',
        nombre: 'Roberto',
        apellido: 'Silva',
        email: 'r.silva@empresa.com',
        telefono: '+51 945 678 912',
        tipo_seguro_interes: 'SCTR',
        presupuesto_aproximado: 5000,
        notas: 'Empresa constructora con 50 trabajadores',
        puntaje_calificacion: 90,
        prioridad: 'ALTA',
        fecha_primer_contacto: '2025-10-05T09:00:00Z',
        fecha_ultimo_contacto: '2025-10-05T09:00:00Z',
        proxima_fecha_seguimiento: '2025-10-11T15:00:00Z',
        id_estado: '1',
        id_fuente: 'f4',
        esta_activo: true,
        fecha_creacion: '2025-10-05T09:00:00Z',
    },

    // Estado: Contactado (2)
    {
        id_lead: 'lead-4',
        nombre: 'Ana',
        apellido: 'Ramírez',
        email: 'ana.ramirez@email.com',
        telefono: '+51 912 345 678',
        fecha_nacimiento: '1990-07-22',
        tipo_seguro_interes: 'Seguro de Salud',
        presupuesto_aproximado: 1200,
        notas: 'Primera llamada realizada. Interesada en plan familiar.',
        puntaje_calificacion: 70,
        prioridad: 'ALTA',
        fecha_primer_contacto: '2025-09-28T14:00:00Z',
        fecha_ultimo_contacto: '2025-10-02T10:30:00Z',
        proxima_fecha_seguimiento: '2025-10-10T11:00:00Z',
        id_estado: '2',
        id_fuente: 'f1',
        asignado_a_usuario: 'u1',
        esta_activo: true,
        fecha_creacion: '2025-09-28T14:00:00Z',
    },
    {
        id_lead: 'lead-5',
        nombre: 'Luis',
        apellido: 'Paredes',
        telefono: '+51 934 567 890',
        tipo_seguro_interes: 'Seguro Hogar',
        presupuesto_aproximado: 600,
        notas: 'Contactado por WhatsApp. Prefiere comunicación por ese medio.',
        puntaje_calificacion: 55,
        prioridad: 'MEDIA',
        fecha_primer_contacto: '2025-09-30T16:00:00Z',
        fecha_ultimo_contacto: '2025-10-04T09:00:00Z',
        proxima_fecha_seguimiento: '2025-10-11T16:00:00Z',
        id_estado: '2',
        id_fuente: 'f8',
        asignado_a_usuario: 'u2',
        esta_activo: true,
        fecha_creacion: '2025-09-30T16:00:00Z',
    },

    // Estado: Calificado (3)
    {
        id_lead: 'lead-6',
        nombre: 'Patricia',
        apellido: 'Gutiérrez',
        email: 'patricia.gutierrez@email.com',
        telefono: '+51 923 456 789',
        fecha_nacimiento: '1982-11-30',
        tipo_seguro_interes: 'Seguro Vehicular',
        presupuesto_aproximado: 2000,
        notas: 'Lead calificado. Auto BMW 2023. Busca cobertura completa.',
        puntaje_calificacion: 85,
        prioridad: 'ALTA',
        fecha_primer_contacto: '2025-09-25T10:00:00Z',
        fecha_ultimo_contacto: '2025-10-01T15:00:00Z',
        proxima_fecha_seguimiento: '2025-10-09T14:00:00Z',
        id_estado: '3',
        id_fuente: 'f3',
        asignado_a_usuario: 'u1',
        esta_activo: true,
        fecha_creacion: '2025-09-25T10:00:00Z',
    },
    {
        id_lead: 'lead-7',
        nombre: 'Jorge',
        apellido: 'Vásquez',
        email: 'jorge.vasquez@startup.pe',
        telefono: '+51 956 789 012',
        tipo_seguro_interes: 'Seguro Empresarial',
        presupuesto_aproximado: 3500,
        notas: 'Startup tech con 15 empleados. Interesado en paquete completo.',
        puntaje_calificacion: 80,
        prioridad: 'ALTA',
        fecha_primer_contacto: '2025-09-20T11:00:00Z',
        fecha_ultimo_contacto: '2025-09-29T13:00:00Z',
        proxima_fecha_seguimiento: '2025-10-08T10:00:00Z',
        id_estado: '3',
        id_fuente: 'f6',
        asignado_a_usuario: 'u1',
        esta_activo: true,
        fecha_creacion: '2025-09-20T11:00:00Z',
    },

    // Estado: Propuesta Enviada (4)
    {
        id_lead: 'lead-8',
        nombre: 'Sandra',
        apellido: 'Morales',
        email: 'sandra.morales@email.com',
        telefono: '+51 967 890 123',
        fecha_nacimiento: '1988-05-18',
        tipo_seguro_interes: 'Seguro de Vida',
        presupuesto_aproximado: 1000,
        notas: 'Propuesta enviada el 01/10. Aguardando respuesta.',
        puntaje_calificacion: 75,
        prioridad: 'MEDIA',
        fecha_primer_contacto: '2025-09-22T09:00:00Z',
        fecha_ultimo_contacto: '2025-10-01T11:00:00Z',
        proxima_fecha_seguimiento: '2025-10-10T09:00:00Z',
        id_estado: '4',
        id_fuente: 'f2',
        asignado_a_usuario: 'u2',
        esta_activo: true,
        fecha_creacion: '2025-09-22T09:00:00Z',
    },
    {
        id_lead: 'lead-9',
        nombre: 'Fernando',
        apellido: 'Castro',
        email: 'f.castro@corporacion.com',
        telefono: '+51 978 901 234',
        tipo_seguro_interes: 'Seguro Transporte de Mercancías',
        presupuesto_aproximado: 8000,
        notas: 'Cotización enviada para flota de 10 camiones.',
        puntaje_calificacion: 90,
        prioridad: 'ALTA',
        fecha_primer_contacto: '2025-09-18T08:00:00Z',
        fecha_ultimo_contacto: '2025-09-30T16:00:00Z',
        proxima_fecha_seguimiento: '2025-10-08T15:00:00Z',
        id_estado: '4',
        id_fuente: 'f10',
        asignado_a_usuario: 'u1',
        esta_activo: true,
        fecha_creacion: '2025-09-18T08:00:00Z',
    },

    // Estado: En Negociación (5)
    {
        id_lead: 'lead-10',
        nombre: 'Claudia',
        apellido: 'Flores',
        email: 'claudia.flores@email.com',
        telefono: '+51 989 012 345',
        tipo_seguro_interes: 'Seguro Hogar',
        presupuesto_aproximado: 700,
        notas: 'Negociando cobertura adicional por terremoto.',
        puntaje_calificacion: 70,
        prioridad: 'MEDIA',
        fecha_primer_contacto: '2025-09-15T10:00:00Z',
        fecha_ultimo_contacto: '2025-10-03T14:00:00Z',
        proxima_fecha_seguimiento: '2025-10-09T11:00:00Z',
        id_estado: '5',
        id_fuente: 'f1',
        asignado_a_usuario: 'u2',
        esta_activo: true,
        fecha_creacion: '2025-09-15T10:00:00Z',
    },
    {
        id_lead: 'lead-11',
        nombre: 'Ricardo',
        apellido: 'Díaz',
        email: 'ricardo.diaz@email.com',
        telefono: '+51 990 123 456',
        fecha_nacimiento: '1975-09-10',
        tipo_seguro_interes: 'Seguro de Salud Premium',
        presupuesto_aproximado: 2500,
        notas: 'Ajustando deducible y copagos. Muy interesado.',
        puntaje_calificacion: 85,
        prioridad: 'ALTA',
        fecha_primer_contacto: '2025-09-12T11:00:00Z',
        fecha_ultimo_contacto: '2025-10-04T10:00:00Z',
        proxima_fecha_seguimiento: '2025-10-07T14:00:00Z',
        id_estado: '5',
        id_fuente: 'f3',
        asignado_a_usuario: 'u1',
        esta_activo: true,
        fecha_creacion: '2025-09-12T11:00:00Z',
    },

    // Estado: Ganado (6)
    {
        id_lead: 'lead-12',
        nombre: 'Elena',
        apellido: 'Soto',
        email: 'elena.soto@email.com',
        telefono: '+51 901 234 567',
        tipo_seguro_interes: 'Seguro Vehicular',
        presupuesto_aproximado: 1800,
        notas: '¡Póliza emitida! Convertido en cliente el 05/10.',
        puntaje_calificacion: 100,
        prioridad: 'ALTA',
        fecha_primer_contacto: '2025-09-10T09:00:00Z',
        fecha_ultimo_contacto: '2025-10-05T12:00:00Z',
        id_estado: '6',
        id_fuente: 'f1',
        asignado_a_usuario: 'u1',
        esta_activo: false,
        fecha_creacion: '2025-09-10T09:00:00Z',
    },

    // Estado: Perdido (7)
    {
        id_lead: 'lead-13',
        nombre: 'Miguel',
        apellido: 'Rojas',
        email: 'miguel.rojas@email.com',
        telefono: '+51 912 345 679',
        tipo_seguro_interes: 'Seguro de Vida',
        presupuesto_aproximado: 500,
        notas: 'Rechazó la propuesta. Encontró mejor precio en competencia.',
        puntaje_calificacion: 40,
        prioridad: 'BAJA',
        fecha_primer_contacto: '2025-09-08T10:00:00Z',
        fecha_ultimo_contacto: '2025-10-02T09:00:00Z',
        id_estado: '7',
        id_fuente: 'f5',
        asignado_a_usuario: 'u2',
        esta_activo: false,
        fecha_creacion: '2025-09-08T10:00:00Z',
    },
];

/**
 * Obtener leads por estado
 */
export const getLeadsPorEstado = (estadoId: string): Lead[] => {
    return MOCK_LEADS.filter((lead) => lead.id_estado === estadoId);
};

/**
 * Obtener lead por ID
 */
export const getLeadById = (id: string): Lead | undefined => {
    return MOCK_LEADS.find((lead) => lead.id_lead === id);
};

/**
 * Obtener leads activos
 */
export const getLeadsActivos = (): Lead[] => {
    return MOCK_LEADS.filter((lead) => lead.esta_activo);
};

/**
 * Obtener leads por usuario asignado
 */
export const getLeadsPorUsuario = (usuarioId: string): Lead[] => {
    return MOCK_LEADS.filter((lead) => lead.asignado_a_usuario === usuarioId);
};

/**
 * Obtener leads por prioridad
 */
export const getLeadsPorPrioridad = (prioridad: string): Lead[] => {
    return MOCK_LEADS.filter((lead) => lead.prioridad === prioridad);
};
