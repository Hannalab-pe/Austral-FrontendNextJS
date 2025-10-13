import { z } from 'zod';

export const clienteSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100, 'Máximo 100 caracteres'),
    apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100, 'Máximo 100 caracteres'),
    email: z.string().email('Email inválido'),
    telefono: z.string().min(7, 'Teléfono inválido').max(20, 'Máximo 20 caracteres'),
    telefono_secundario: z.string().max(20, 'Máximo 20 caracteres').optional(),
    documento_identidad: z.string().min(8, 'Documento inválido').max(20, 'Máximo 20 caracteres'),
    tipo_documento: z.enum(['DNI', 'CE', 'PASAPORTE', 'RUC'], {
        message: 'Seleccione un tipo de documento válido',
    }),
    fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
    direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    distrito: z.string().optional(),
    provincia: z.string().optional(),
    departamento: z.string().optional(),
    ocupacion: z.string().max(150, 'Máximo 150 caracteres').optional(),
    empresa: z.string().max(200, 'Máximo 200 caracteres').optional(),
    estado_civil: z.enum(['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'CONVIVIENTE']).optional(),
    contacto_emergencia_nombre: z.string().max(200, 'Máximo 200 caracteres').optional(),
    contacto_emergencia_telefono: z.string().max(20, 'Máximo 20 caracteres').optional(),
    contacto_emergencia_relacion: z.string().max(50, 'Máximo 50 caracteres').optional(),
    broker_asignado: z.string().uuid('ID de broker inválido').optional(),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
