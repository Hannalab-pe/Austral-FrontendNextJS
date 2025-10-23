import { DetalleSeguro } from "@/types/api.types";

/**
 * Datos mock de detalles de seguros para cotizaciones
 */
export const MOCK_DETALLES_SEGURO: Record<string, DetalleSeguro> = {
  // Seguro de Salud
  "lead-4": {
    lead_id: "lead-4",
    edad: 35,
    sexo: "Femenino",
    grupo_familiar: "Nuclear (pareja + 2 hijos)",
    estado_clinico: "Bueno",
    zona_trabajo_vivienda: "Lima Metropolitana",
    preferencia_plan: "Premium",
    coberturas: "Consulta médica, Hospitalización, Cirugías, Medicamentos",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    reembolso: true,
  },

  // Seguro Vehicular
  "lead-1": {
    id: "detalle-1",
    lead_id: "lead-1",
    marca_auto: "Toyota",
    ano_auto: 2020,
    modelo_auto: "Corolla",
    placa_auto: "ABC-123",
    tipo_uso: "Particular",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    lead: {
      id_lead: "lead-1",
      nombre: "Juan",
      apellido: "Pérez",
      telefono: "999 888 777",
    },
  },
  "lead-6": {
    id: "detalle-6",
    lead_id: "lead-6",
    marca_auto: "BMW",
    ano_auto: 2023,
    modelo_auto: "X3",
    placa_auto: "BMW-456",
    tipo_uso: "Particular",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    lead: {
      id_lead: "lead-6",
      nombre: "María",
      apellido: "González",
      telefono: "999 777 666",
    },
  },
  "lead-12": {
    id: "detalle-12",
    lead_id: "lead-12",
    marca_auto: "Nissan",
    ano_auto: 2019,
    modelo_auto: "Sentra",
    placa_auto: "NIS-789",
    tipo_uso: "Particular",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    lead: {
      id_lead: "lead-12",
      nombre: "Carlos",
      apellido: "Rodríguez",
      telefono: "999 666 555",
    },
  },

  // SCTR
  "lead-3": {
    id: "detalle-3",
    lead_id: "lead-3",
    razon_social: "Constructora del Sur S.A.C.",
    ruc: "20512345678",
    numero_trabajadores: 45,
    monto_planilla: 180000,
    actividad_negocio: "Construcción de Edificios",
    tipo_seguro: "SCTR",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
  },

  // Seguro de Vida
  "lead-2": {
    id: "detalle-2",
    lead_id: "lead-2",
    marca_auto: "N/A",
    ano_auto: 0,
    modelo_auto: "N/A",
    placa_auto: "N/A",
    tipo_uso: "Personal",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    lead: {
      id_lead: "lead-2",
      nombre: "Ana",
      apellido: "López",
      telefono: "999 444 333",
    },
  },
  "lead-8": {
    id: "detalle-8",
    lead_id: "lead-8",
    marca_auto: "N/A",
    ano_auto: 0,
    modelo_auto: "N/A",
    placa_auto: "N/A",
    tipo_uso: "Personal",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    lead: {
      id_lead: "lead-8",
      nombre: "Pedro",
      apellido: "Martínez",
      telefono: "999 333 222",
    },
  },

  // Seguro Hogar
  "lead-5": {
    id: "detalle-5",
    lead_id: "lead-5",
    marca_auto: "N/A",
    ano_auto: 0,
    modelo_auto: "N/A",
    placa_auto: "N/A",
    tipo_uso: "Residencial",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    lead: {
      id_lead: "lead-5",
      nombre: "Luis",
      apellido: "Sánchez",
      telefono: "999 222 111",
    },
  },
  "lead-10": {
    id: "detalle-10",
    lead_id: "lead-10",
    marca_auto: "N/A",
    ano_auto: 0,
    modelo_auto: "N/A",
    placa_auto: "N/A",
    tipo_uso: "Residencial",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    lead: {
      id_lead: "lead-10",
      nombre: "Carmen",
      apellido: "Díaz",
      telefono: "999 111 000",
    },
  },

  // Seguro de Salud Premium
  "lead-11": {
    lead_id: "lead-11",
    edad: 45,
    sexo: "Masculino",
    grupo_familiar: "Extendido (pareja + 3 hijos + padres)",
    estado_clinico: "Excelente",
    zona_trabajo_vivienda: "Lima Centro",
    preferencia_plan: "Premium Plus",
    coberturas:
      "Todo incluido: Consultas, Hospitalización, Cirugías, Medicamentos, Odontología, Oftalmología",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    reembolso: true,
  },

  // Seguro Empresarial
  "lead-7": {
    id: "detalle-7",
    lead_id: "lead-7",
    marca_auto: "N/A",
    ano_auto: 0,
    modelo_auto: "N/A",
    placa_auto: "N/A",
    tipo_uso: "Empresarial",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    lead: {
      id_lead: "lead-7",
      nombre: "Tech",
      apellido: "Startup S.A.C.",
      telefono: "999 000 999",
    },
  },

  // Seguro Transporte
  "lead-9": {
    id: "detalle-9",
    lead_id: "lead-9",
    marca_auto: "Volvo",
    ano_auto: 2022,
    modelo_auto: "FH16",
    placa_auto: "VOL-001",
    tipo_uso: "Transporte de Mercancías",
    fecha_creacion: "2025-10-22T10:00:00Z",
    fecha_actualizacion: "2025-10-22T10:00:00Z",
    lead: {
      id_lead: "lead-9",
      nombre: "Transportes",
      apellido: "Rápidos S.A.",
      telefono: "998 999 000",
    },
  },
};

/**
 * Obtener detalle de seguro por lead ID
 */
export const getDetalleSeguroByLeadId = (
  leadId: string
): DetalleSeguro | null => {
  return MOCK_DETALLES_SEGURO[leadId] || null;
};

/**
 * Obtener detalle de seguro por tipo (fallback genérico)
 */
export const getDetalleSeguroByTipo = (tipo: string): DetalleSeguro => {
  const tipoLower = tipo.toLowerCase();

  const baseVehicularData = {
    id: "mock-" + Date.now(),
    lead_id: "mock-lead",
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    lead: {
      id_lead: "mock-lead",
      nombre: "Usuario",
      apellido: "Mock",
      telefono: "000 000 000",
    },
  };

  const baseSaludData = {
    lead_id: "mock-lead",
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
  };

  const baseSCTRData = {
    id: "mock-" + Date.now(),
    lead_id: "mock-lead",
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
  };

  if (tipoLower.includes("salud")) {
    return {
      ...baseSaludData,
      edad: 30,
      sexo: "Masculino",
      grupo_familiar: "Nuclear",
      estado_clinico: "Bueno",
      zona_trabajo_vivienda: "Lima",
      preferencia_plan: "Básico",
      coberturas: "Consulta médica, Hospitalización",
      reembolso: true,
    };
  }

  if (tipoLower.includes("sctr")) {
    return {
      ...baseSCTRData,
      razon_social: "Empresa Constructora S.A.C.",
      ruc: "20123456789",
      numero_trabajadores: 50,
      monto_planilla: 200000,
      actividad_negocio: "Construcción",
      tipo_seguro: "SCTR",
    };
  }

  if (
    tipoLower.includes("vehicular") ||
    tipoLower.includes("auto") ||
    tipoLower.includes("transporte")
  ) {
    return {
      ...baseVehicularData,
      marca_auto: "Toyota",
      ano_auto: 2020,
      modelo_auto: "Corolla",
      placa_auto: "ABC-123",
      tipo_uso: "Particular",
    };
  }

  // Default - vehicular
  return {
    ...baseVehicularData,
    marca_auto: "N/A",
    ano_auto: 0,
    modelo_auto: "N/A",
    placa_auto: "N/A",
    tipo_uso: "General",
  };
};
