import { z } from 'zod';

/**
 * Schema de validación para formulario de Compañía de Seguros
 * Basado en CreateCompaniaSeguroDto del backend
 */
export const companiaSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres')
    .trim(),

  razonSocial: z
    .string()
    .max(300, 'La razón social no puede exceder 300 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  ruc: z
    .string()
    .regex(/^[0-9]*$/, 'El RUC debe contener solo números')
    .max(20, 'El RUC no puede exceder 20 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  direccion: z
    .string()
    .max(500, 'La dirección no puede exceder 500 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  telefono: z
    .string()
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .email('Email inválido')
    .max(255, 'El email no puede exceder 255 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  sitioWeb: z
    .string()
    .url('URL inválida')
    .max(255, 'La URL no puede exceder 255 caracteres')
    .trim()
    .optional()
    .or(z.literal(''))
    .or(z.string().length(0)),

  contactoPrincipal: z
    .string()
    .max(200, 'El nombre del contacto no puede exceder 200 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  telefonoContacto: z
    .string()
    .max(20, 'El teléfono del contacto no puede exceder 20 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),

  emailContacto: z
    .string()
    .email('Email inválido')
    .max(255, 'El email del contacto no puede exceder 255 caracteres')
    .trim()
    .optional()
    .or(z.literal(''))
    .or(z.string().length(0)),
});

/**
 * Tipo inferido del schema para usar en TypeScript
 */
export type CompaniaFormData = z.infer<typeof companiaSchema>;

/**
 * Schema para edición de compañía (todos los campos opcionales excepto nombre)
 */
export const editCompaniaSchema = companiaSchema.partial().extend({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres')
    .trim()
    .optional(),
  estaActivo: z.boolean().optional(),
});

export type EditCompaniaFormData = z.infer<typeof editCompaniaSchema>;
