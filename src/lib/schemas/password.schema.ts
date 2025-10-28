import { z } from 'zod';

/**
 * Schema para validación de cambio de contraseña
 */
export const changePasswordSchema = z.object({
  contrasenaActual: z.string()
    .min(1, 'La contraseña actual es requerida'),

  contrasenaNueva: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede exceder 50 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),

  confirmarContrasena: z.string()
    .min(1, 'Debe confirmar la contraseña'),
}).refine((data) => data.contrasenaNueva === data.confirmarContrasena, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarContrasena'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
