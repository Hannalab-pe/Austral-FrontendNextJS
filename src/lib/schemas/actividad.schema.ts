import { z } from 'zod';

/**
 * Schema de validación para formularios de Actividad
 */

export const actividadSchema = z.object({
    // Información básica
    tipoActividad: z.enum([
        'LLAMADA',
        'REUNION',
        'EMAIL',
        'VISITA',
        'SEGUIMIENTO',
        'PRESENTACION',
        'NEGOCIACION',
        'CIERRE',
        'POST_VENTA',
        'QUEJA',
        'SOLICITUD',
        'OTRO'
    ], {
        message: 'Debe seleccionar un tipo de actividad válido',
    }),

    titulo: z.string()
        .min(3, 'El título debe tener al menos 3 caracteres')
        .max(200, 'El título no puede exceder 200 caracteres'),

    descripcion: z.string()
        .max(1000, 'La descripción no puede exceder 1000 caracteres')
        .optional(),

    // Fechas y duración
    fechaActividad: z.string()
        .min(1, 'Debe seleccionar una fecha de actividad'),

    duracionMinutos: z.number()
        .min(1, 'La duración mínima es 1 minuto')
        .max(480, 'La duración máxima es 8 horas (480 minutos)')
        .optional(),

    // Resultados y seguimiento
    resultado: z.string()
        .max(500, 'El resultado no puede exceder 500 caracteres')
        .optional(),

    proximaAccion: z.string()
        .max(500, 'La próxima acción no puede exceder 500 caracteres')
        .optional(),

    fechaProximaAccion: z.string()
        .optional(),
});

export type ActividadFormData = z.infer<typeof actividadSchema>;

// Schema para actualización (todos los campos opcionales)
export const updateActividadSchema = actividadSchema.partial();

export type UpdateActividadFormData = z.infer<typeof updateActividadSchema>;