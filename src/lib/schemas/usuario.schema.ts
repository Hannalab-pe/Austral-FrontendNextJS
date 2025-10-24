import { z } from 'zod';

export const usuarioSchema = z.object({
    nombreUsuario: z
        .string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(50, 'Máximo 50 caracteres')
        .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guiones bajos'),
    email: z
        .string()
        .email('Email inválido')
        .max(255, 'Máximo 255 caracteres'),
    contrasena: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(255, 'Máximo 255 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        ),
    nombre: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'Máximo 100 caracteres'),
    apellido: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(100, 'Máximo 100 caracteres'),
    telefono: z
        .string()
        .min(7, 'Teléfono inválido')
        .max(20, 'Máximo 20 caracteres')
        .optional()
        .or(z.literal('')),
    documentoIdentidad: z
        .string()
        .min(8, 'Documento inválido')
        .max(20, 'Máximo 20 caracteres')
        .optional()
        .or(z.literal('')),
    idRol: z
        .string()
        .uuid('Debe seleccionar un rol')
        .min(1, 'El rol es requerido'),
});

export const updateUsuarioSchema = z.object({
    nombreUsuario: z
        .string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(50, 'Máximo 50 caracteres')
        .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guiones bajos')
        .optional(),
    email: z
        .string()
        .email('Email inválido')
        .max(255, 'Máximo 255 caracteres')
        .optional(),
    nombre: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'Máximo 100 caracteres')
        .optional(),
    apellido: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(100, 'Máximo 100 caracteres')
        .optional(),
    telefono: z
        .string()
        .min(7, 'Teléfono inválido')
        .max(20, 'Máximo 20 caracteres')
        .optional()
        .or(z.literal('')),
    documentoIdentidad: z
        .string()
        .min(8, 'Documento inválido')
        .max(20, 'Máximo 20 caracteres')
        .optional()
        .or(z.literal('')),
    idRol: z
        .string()
        .uuid('Debe seleccionar un rol')
        .optional(),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
export type UpdateUsuarioFormData = z.infer<typeof updateUsuarioSchema>;
