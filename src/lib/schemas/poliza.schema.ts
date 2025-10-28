import { z } from 'zod';

/**
 * Schema para validación de formulario de póliza
 */
export const polizaSchema = z.object({
  // Campos obligatorios
  poliza: z.string()
    .min(1, 'El número de póliza es requerido')
    .max(100, 'El número de póliza no puede exceder 100 caracteres'),

  asegurado: z.string()
    .min(1, 'El asegurado es requerido')
    .max(200, 'El asegurado no puede exceder 200 caracteres'),

  cia: z.string()
    .min(1, 'La compañía es requerida'),

  ram: z.string()
    .min(1, 'El ramo es requerido'),

  prod: z.string()
    .min(1, 'El producto es requerido'),

  tipo_vigencia: z.string()
    .min(1, 'El tipo de vigencia es requerido'),

  vig_inicio: z.string()
    .min(1, 'La fecha de vigencia inicio es requerida'),

  vig_fin: z.string()
    .min(1, 'La fecha de vigencia fin es requerida'),

  fecha_emision: z.string()
    .min(1, 'La fecha de emisión es requerida'),

  mo: z.string()
    .min(1, 'La moneda es requerida'),

  // Campos opcionales
  contratante: z.string()
    .max(200, 'El contratante no puede exceder 200 caracteres')
    .optional(),

  sub_agente: z.string()
    .max(200, 'El sub agente no puede exceder 200 caracteres')
    .optional(),

  comision_compania: z.number()
    .min(0, 'La comisión no puede ser negativa')
    .max(100, 'La comisión no puede exceder 100%')
    .optional()
    .default(0),

  comision_sub_agente: z.number()
    .min(0, 'La comisión no puede ser negativa')
    .max(100, 'La comisión no puede exceder 100%')
    .optional()
    .default(0),

  descripcion_asegurado: z.string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional(),

  ejecutivo_cuenta: z.string()
    .max(200, 'El ejecutivo de cuenta no puede exceder 200 caracteres')
    .optional(),

  mas_informacion: z.string()
    .max(2000, 'La información adicional no puede exceder 2000 caracteres')
    .optional(),

  descripcion_poliza: z.string()
    .max(500, 'La descripción de la póliza no puede exceder 500 caracteres')
    .optional(),
}).refine((data) => {
  // Validar que la fecha de fin sea mayor que la de inicio
  const inicio = new Date(data.vig_inicio);
  const fin = new Date(data.vig_fin);
  return fin >= inicio;
}, {
  message: 'La fecha de vigencia fin debe ser mayor o igual a la fecha de inicio',
  path: ['vig_fin'],
});

export type PolizaFormData = z.infer<typeof polizaSchema>;

// Tipos de vigencia disponibles
export const TIPOS_VIGENCIA = [
  'ANUAL',
  'SEMESTRAL',
  'TRIMESTRAL',
  'MENSUAL',
  'OTRO',
] as const;

// Monedas disponibles
export const MONEDAS = [
  { value: 'PEN', label: 'Soles (PEN)' },
  { value: 'USD', label: 'Dólares (USD)' },
  { value: 'EUR', label: 'Euros (EUR)' },
] as const;
