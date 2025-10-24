import { z } from 'zod';

// ============================================================================
// ESQUEMAS DE VALIDACIÓN PARA CLIENTES
// ============================================================================

/**
 * Esquema para validar la creación de un cliente
 */
export const createClienteSchema = z.object({
    // Datos personales obligatorios
    nombre: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),

    apellido: z.string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(100, 'El apellido no puede exceder 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras'),

    email: z.string()
        .email('Debe ser un email válido')
        .min(5, 'El email debe tener al menos 5 caracteres')
        .max(100, 'El email no puede exceder 100 caracteres')
        .toLowerCase(),

    telefono: z.string()
        .min(7, 'El teléfono debe tener al menos 7 dígitos')
        .max(20, 'El teléfono no puede exceder 20 caracteres')
        .regex(/^[0-9+\-\s()]+$/, 'El teléfono solo puede contener números y caracteres especiales válidos'),

    telefonoSecundario: z.string()
        .min(7, 'El teléfono debe tener al menos 7 dígitos')
        .max(20, 'El teléfono no puede exceder 20 caracteres')
        .regex(/^[0-9+\-\s()]+$/, 'El teléfono solo puede contener números y caracteres especiales válidos')
        .optional()
        .or(z.literal('')),

    documentoIdentidad: z.string()
        .min(8, 'El documento debe tener al menos 8 caracteres')
        .max(20, 'El documento no puede exceder 20 caracteres')
        .regex(/^[0-9A-Za-z\-]+$/, 'El documento solo puede contener números, letras y guiones'),

    tipoDocumento: z.enum(['DNI', 'CE', 'PASAPORTE', 'RUC'], {
        message: 'Seleccione un tipo de documento válido',
    }),

    // Acepta string del input type="date" y valida la edad
    fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es requerida').refine((val) => {
        const date = new Date(val);
        const age = new Date().getFullYear() - date.getFullYear();
        return age >= 18 && age <= 120;
    }, {
        message: 'El cliente debe ser mayor de 18 años',
    }),

    // Dirección
    direccion: z.string()
        .min(5, 'La dirección debe tener al menos 5 caracteres')
        .max(200, 'La dirección no puede exceder 200 caracteres'),

    distrito: z.string()
        .min(2, 'El distrito debe tener al menos 2 caracteres')
        .max(100, 'El distrito no puede exceder 100 caracteres')
        .optional()
        .or(z.literal('')),

    provincia: z.string()
        .min(2, 'La provincia debe tener al menos 2 caracteres')
        .max(100, 'La provincia no puede exceder 100 caracteres')
        .optional()
        .or(z.literal('')),

    departamento: z.string()
        .min(2, 'El departamento debe tener al menos 2 caracteres')
        .max(100, 'El departamento no puede exceder 100 caracteres')
        .optional()
        .or(z.literal('')),

    // Datos laborales (opcionales)
    ocupacion: z.string()
        .max(100, 'La ocupación no puede exceder 100 caracteres')
        .optional()
        .or(z.literal('')),

    empresa: z.string()
        .max(100, 'El nombre de la empresa no puede exceder 100 caracteres')
        .optional()
        .or(z.literal('')),

    estadoCivil: z.enum(['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO', 'CONVIVIENTE'], {
        message: 'Seleccione un estado civil válido',
    }).optional(),

    // Contacto de emergencia (opcional)
    contactoEmergenciaNombre: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras')
        .optional()
        .or(z.literal('')),

    contactoEmergenciaTelefono: z.string()
        .min(7, 'El teléfono debe tener al menos 7 dígitos')
        .max(20, 'El teléfono no puede exceder 20 caracteres')
        .regex(/^[0-9+\-\s()]+$/, 'El teléfono solo puede contener números y caracteres especiales válidos')
        .optional()
        .or(z.literal('')),

    contactoEmergenciaRelacion: z.string()
        .max(50, 'La relación no puede exceder 50 caracteres')
        .optional()
        .or(z.literal('')),

    // ID del lead de origen (opcional)
    idLead: z.string().uuid('Debe ser un UUID válido').optional().or(z.literal('')),
}).refine((data) => {
    // Si hay algún campo de contacto de emergencia, los otros dos también son requeridos
    const hasEmergencyNombre = data.contactoEmergenciaNombre && data.contactoEmergenciaNombre !== '';
    const hasEmergencyTelefono = data.contactoEmergenciaTelefono && data.contactoEmergenciaTelefono !== '';
    const hasEmergencyRelacion = data.contactoEmergenciaRelacion && data.contactoEmergenciaRelacion !== '';

    const emergencyFieldsCount = [hasEmergencyNombre, hasEmergencyTelefono, hasEmergencyRelacion].filter(Boolean).length;

    // Si hay alguno, deben estar los 3
    if (emergencyFieldsCount > 0 && emergencyFieldsCount < 3) {
        return false;
    }

    return true;
}, {
    message: 'Si proporciona un contacto de emergencia, debe completar nombre, teléfono y relación',
    path: ['contactoEmergenciaNombre'],
});

/**
 * Esquema para validar la actualización de un cliente
 * Todos los campos son opcionales
 */
export const updateClienteSchema = createClienteSchema.partial().extend({
    estaActivo: z.boolean().optional(),
});

/**
 * Tipo inferido del schema de creación
 */
export type CreateClienteFormData = z.infer<typeof createClienteSchema>;

/**
 * Tipo inferido del schema de actualización
 */
export type UpdateClienteFormData = z.infer<typeof updateClienteSchema>;

// Exportaciones legacy para compatibilidad
export const clienteSchema = createClienteSchema;
export type ClienteFormData = CreateClienteFormData;

// ============================================================================
// OPCIONES PARA SELECTS
// ============================================================================

export const TIPOS_DOCUMENTO = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
    { value: 'RUC', label: 'RUC' },
] as const;

export const ESTADOS_CIVILES = [
    { value: 'SOLTERO', label: 'Soltero/a' },
    { value: 'CASADO', label: 'Casado/a' },
    { value: 'DIVORCIADO', label: 'Divorciado/a' },
    { value: 'VIUDO', label: 'Viudo/a' },
    { value: 'CONVIVIENTE', label: 'Conviviente' },
] as const;

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convierte los datos del formulario al formato esperado por la API
 * Convierte campos vacíos a undefined para que no se envíen
 */
export const formatClienteForApi = (data: CreateClienteFormData | UpdateClienteFormData) => {
    return {
        ...data,
        telefonoSecundario: data.telefonoSecundario || undefined,
        distrito: data.distrito || undefined,
        provincia: data.provincia || undefined,
        departamento: data.departamento || undefined,
        ocupacion: data.ocupacion || undefined,
        empresa: data.empresa || undefined,
        estadoCivil: data.estadoCivil || undefined,
        contactoEmergenciaNombre: data.contactoEmergenciaNombre || undefined,
        contactoEmergenciaTelefono: data.contactoEmergenciaTelefono || undefined,
        contactoEmergenciaRelacion: data.contactoEmergenciaRelacion || undefined,
        idLead: data.idLead || undefined,
    };
};

