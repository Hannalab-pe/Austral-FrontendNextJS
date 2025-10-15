import { z } from 'zod';

/**
 * Schema de validación para el formulario de login
 */
export const loginSchema = z.object({
    usuario: z
        .string()
        .min(1, 'Usuario o email requerido')
        .trim(),
    contrasena: z
        .string()
        .min(1, 'Contraseña requerida'),
    recordarme: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
