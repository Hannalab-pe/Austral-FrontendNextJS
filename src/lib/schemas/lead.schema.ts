import { z } from 'zod';

/**
 * Schema de validación para formularios de Lead
 */

export const leadSchema = z.object({
    // Información Personal
    nombre: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),

    apellido: z.string()
        .max(100, 'El apellido no puede exceder 100 caracteres')
        .optional(),

    email: z.string()
        .email('Email inválido')
        .max(255, 'El email no puede exceder 255 caracteres')
        .optional()
        .or(z.literal('')),

    telefono: z.string()
        .min(7, 'El teléfono debe tener al menos 7 caracteres')
        .max(20, 'El teléfono no puede exceder 20 caracteres')
        .regex(/^[+\d\s()-]+$/, 'El teléfono solo puede contener números, espacios y los caracteres + - ( )'),

    fecha_nacimiento: z.string()
        .optional()
        .or(z.literal('')),

    // Información del Negocio
    tipo_seguro_interes: z.string()
        .max(100, 'El tipo de seguro no puede exceder 100 caracteres')
        .optional()
        .or(z.literal('')),

    presupuesto_aproximado: z.number()
        .min(0, 'El presupuesto no puede ser negativo')
        .max(9999999.99, 'El presupuesto excede el límite permitido')
        .optional()
        .or(z.nan()),

    puntaje_calificacion: z.number()
        .min(0, 'El puntaje mínimo es 0')
        .max(100, 'El puntaje máximo es 100')
        .optional()
        .default(0),

    prioridad: z.enum(['ALTA', 'MEDIA', 'BAJA'], {
        message: 'Debe seleccionar una prioridad válida',
    }).optional().default('MEDIA'),

    // Gestión
    id_estado: z.string()
        .uuid('Debe seleccionar un estado válido')
        .min(1, 'Debe seleccionar un estado'),

    id_fuente: z.string()
        .uuid('Debe seleccionar una fuente válida')
        .min(1, 'Debe seleccionar una fuente'),

    asignado_a_usuario: z.string()
        .uuid('Debe seleccionar un usuario válido')
        .optional()
        .or(z.literal('')),

    // Seguimiento
    proxima_fecha_seguimiento: z.string()
        .optional()
        .or(z.literal('')),

    notas: z.string()
        .max(5000, 'Las notas no pueden exceder 5000 caracteres')
        .optional()
        .or(z.literal('')),
});

export type LeadFormData = z.infer<typeof leadSchema>;

// Schema para actualización (todos los campos opcionales excepto el ID)
export const updateLeadSchema = leadSchema.partial().extend({
    id_lead: z.string().uuid('ID de lead inválido'),
});

export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;
