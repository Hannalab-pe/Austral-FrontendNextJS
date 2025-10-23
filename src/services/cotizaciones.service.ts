import {
  DetalleSeguro,
  DetalleSeguroVehicular,
  DetalleSeguroSalud,
  DetalleSeguroSCTR,
} from "@/types/api.types";
import {
  getDetalleSeguroByLeadId,
  getDetalleSeguroByTipo,
} from "@/lib/constants/mock-cotizaciones";

const API_BASE_URL = "https://austral-backendnestjs-production.up.railway.app";

/**
 * Servicio para gestionar operaciones relacionadas con cotizaciones
 */
export class CotizacionesService {
  /**
   * Obtiene detalles de seguro para SCTR basado en el lead
   */
  static async getDetalleSCTR(leadId: string): Promise<DetalleSeguroSCTR> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/detalle-seguro-sctr/${leadId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      console.log("API not available, using mock data for SCTR");
      // Fallback to mock data
      const mockData = getDetalleSeguroByLeadId(leadId);
      if (mockData && "razon_social" in mockData)
        return mockData as DetalleSeguroSCTR;

      // Generic fallback
      return {
        id: "fallback-" + Date.now(),
        lead_id: leadId,
        razon_social: "Empresa S.A.C.",
        ruc: "12345678901",
        numero_trabajadores: 50,
        monto_planilla: 150000,
        actividad_negocio: "Construcción",
        tipo_seguro: "SCTR",
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
      };
    }
  }

  /**
   * Obtiene detalles de seguro de salud basado en el lead
   */
  static async getDetalleSalud(leadId: string): Promise<DetalleSeguroSalud> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/detalle-seguro-salud/${leadId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      console.log("API not available, using mock data for Salud");
      // Fallback to mock data
      const mockData = getDetalleSeguroByLeadId(leadId);
      if (mockData && "edad" in mockData) return mockData as DetalleSeguroSalud;

      // Generic fallback
      return {
        lead_id: leadId,
        edad: 30,
        sexo: "Masculino",
        grupo_familiar: "Nuclear",
        estado_clinico: "Bueno",
        zona_trabajo_vivienda: "Lima",
        preferencia_plan: "Básico",
        coberturas: "Consulta médica, Hospitalización",
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        reembolso: true,
      };
    }
  }

  /**
   * Obtiene detalles de seguro de auto basado en el lead
   */
  static async getDetalleAuto(leadId: string): Promise<DetalleSeguroVehicular> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/detalle-seguro-auto/lead/${leadId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      console.log("API not available, using mock data for Auto");
      // Fallback to mock data
      const mockData = getDetalleSeguroByLeadId(leadId);
      if (mockData && "marca_auto" in mockData)
        return mockData as DetalleSeguroVehicular;

      // Generic fallback
      return {
        id: "fallback-" + Date.now(),
        lead_id: leadId,
        marca_auto: "N/A",
        ano_auto: 0,
        modelo_auto: "N/A",
        placa_auto: "N/A",
        tipo_uso: "Particular",
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        lead: {
          id_lead: leadId,
          nombre: "Usuario",
          apellido: "Fallback",
          telefono: "000 000 000",
        },
      };
    }
  }

  /**
   * Método genérico para obtener detalles basado en tipo de seguro
   */
  static async getDetalleSeguro(
    tipoSeguro: string,
    leadId: string
  ): Promise<DetalleSeguro> {
    // Normalizar el tipo de seguro
    const normalizedTipo = this.normalizeTipoSeguro(tipoSeguro);

    console.log(
      `CotizacionesService: Getting detalle for tipo "${tipoSeguro}" -> normalized "${normalizedTipo}" for lead ${leadId}`
    );

    switch (normalizedTipo) {
      case "sctr":
        return this.getDetalleSCTR(leadId);
      case "auto":
        return this.getDetalleAuto(leadId);
      case "salud":
        return this.getDetalleSalud(leadId);
      default:
        console.log(
          `Tipo de seguro "${tipoSeguro}" not directly supported, using generic fallback`
        );
        // Para tipos no soportados, usar datos mock genéricos
        const mockData = getDetalleSeguroByLeadId(leadId);
        if (mockData) return mockData;

        return getDetalleSeguroByTipo(tipoSeguro);
    }
  }

  /**
   * Normaliza diferentes formatos de tipo de seguro
   */
  private static normalizeTipoSeguro(tipoSeguro: string): string {
    const lowerTipo = tipoSeguro.toLowerCase().trim();

    // Mapeos directos
    if (lowerTipo === "sctr") return "sctr";
    if (lowerTipo === "salud" || lowerTipo.includes("salud")) return "salud";
    if (
      lowerTipo === "auto" ||
      lowerTipo.includes("vehicular") ||
      lowerTipo.includes("auto") ||
      lowerTipo.includes("transporte")
    )
      return "auto";

    // Si no coincide exactamente, intentar encontrar coincidencias parciales
    if (lowerTipo.includes("sctr")) return "sctr";
    if (lowerTipo.includes("salud")) return "salud";
    if (
      lowerTipo.includes("vehicular") ||
      lowerTipo.includes("auto") ||
      lowerTipo.includes("transporte") ||
      lowerTipo.includes("mercancías")
    )
      return "auto";

    return lowerTipo; // Devolver como está si no se puede normalizar
  }
}
