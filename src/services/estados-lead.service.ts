import { EstadoLead } from "@/types/lead.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_ESTADOS_LEAD_SERVICE_URL || "/api";

/**
 * Servicio para gestionar operaciones relacionadas con estados de lead
 */
export class EstadosLeadService {
  /**
   * Obtiene todos los estados de lead desde la API
   */
  static async getEstadosLead(): Promise<EstadoLead[]> {
    const response = await fetch(`${API_BASE_URL}/estados-lead`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener estados: ${response.status} ${response.statusText}`
      );
    }

    const data: EstadoLead[] = await response.json();
    return data;
  }

  /**
   * Obtiene un estado específico por ID
   */
  static async getEstadoLeadById(id: string): Promise<EstadoLead | null> {
    const response = await fetch(`${API_BASE_URL}/estados-lead/${id}`, {
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
        `Error al obtener estado: ${response.status} ${response.statusText}`
      );
    }

    const estado: EstadoLead = await response.json();
    return estado;
  }
}