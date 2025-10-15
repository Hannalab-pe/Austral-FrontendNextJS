import { FuenteLead } from "@/types/lead.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_FUENTES_LEAD_SERVICE_URL || "/api";

/**
 * Servicio para gestionar operaciones relacionadas con fuentes de lead
 */
export class FuentesLeadService {
  /**
   * Obtiene todas las fuentes de lead desde la API
   */
  static async getFuentesLead(): Promise<FuenteLead[]> {
    const response = await fetch(`${API_BASE_URL}/fuentes-lead`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener fuentes: ${response.status} ${response.statusText}`
      );
    }

    const data: FuenteLead[] = await response.json();
    return data;
  }

  /**
   * Obtiene una fuente específica por ID
   */
  static async getFuenteLeadById(id: string): Promise<FuenteLead | null> {
    const response = await fetch(`${API_BASE_URL}/fuentes-lead/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(
        `Error al obtener fuente: ${response.status} ${response.statusText}`
      );
    }

    const fuente: FuenteLead = await response.json();
    return fuente;
  }
}