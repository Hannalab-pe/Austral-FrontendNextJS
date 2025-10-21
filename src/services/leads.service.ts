import { Lead } from "@/types/lead.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_LEADS_SERVICE_URL || "/api";

/**
 * Servicio para gestionar operaciones relacionadas con leads
 */
export class LeadsService {
  /**
   * Obtiene todos los leads desde la API
   */
  static async getLeads(): Promise<Lead[]> {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al obtener leads: ${response.status} ${response.statusText}`
      );
    }

    const data: Lead[] = await response.json();

    // Transformar datos si es necesario
    return data.map((lead) => ({
      ...lead,
      // Convertir presupuesto_aproximado de string a number si viene como string
      presupuesto_aproximado: lead.presupuesto_aproximado
        ? typeof lead.presupuesto_aproximado === "string"
          ? parseFloat(lead.presupuesto_aproximado)
          : lead.presupuesto_aproximado
        : undefined,
    }));
  }

  /**
   * Obtiene un lead específico por ID
   */
  static async getLeadById(id: string): Promise<Lead | null> {
    const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
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
        `Error al obtener lead: ${response.status} ${response.statusText}`
      );
    }

    const lead: Lead = await response.json();

    // Transformar datos si es necesario
    return {
      ...lead,
      presupuesto_aproximado: lead.presupuesto_aproximado
        ? typeof lead.presupuesto_aproximado === "string"
          ? parseFloat(lead.presupuesto_aproximado)
          : lead.presupuesto_aproximado
        : undefined,
    };
  }

  /**
   * Crea un nuevo lead
   */
  static async createLead(
    leadData: Omit<Lead, "id_lead" | "fecha_creacion">
  ): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error(
        `Error al crear lead: ${response.status} ${response.statusText}`
      );
    }

    const newLead: Lead = await response.json();

    return {
      ...newLead,
      presupuesto_aproximado: newLead.presupuesto_aproximado
        ? typeof newLead.presupuesto_aproximado === "string"
          ? parseFloat(newLead.presupuesto_aproximado)
          : newLead.presupuesto_aproximado
        : undefined,
    };
  }
  /**
   * Actualiza un lead existente
   */
  static async updateLead(id: string, leadData: Partial<Lead>): Promise<Lead> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(
          `Error al actualizar lead: ${response.status} ${response.statusText}`
        );
      }

      const updatedLead: Lead = await response.json();

      return {
        ...updatedLead,
        presupuesto_aproximado: updatedLead.presupuesto_aproximado
          ? typeof updatedLead.presupuesto_aproximado === "string"
            ? parseFloat(updatedLead.presupuesto_aproximado)
            : updatedLead.presupuesto_aproximado
          : undefined,
      };
    } catch (error) {
      console.error("Error updating lead:", error);
      throw new Error("No se pudo actualizar el lead.");
    }
  }

  /**
   * Actualiza el estado de un lead
   */
  static async updateLeadStatus(
    leadId: string,
    newEstadoId: string
  ): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}/leads/${leadId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_estado: newEstadoId }),
    });

    if (!response.ok) {
      throw new Error(
        `Error al actualizar estado: ${response.status} ${response.statusText}`
      );
    }

    const updatedLead: Lead = await response.json();

    return {
      ...updatedLead,
      presupuesto_aproximado: updatedLead.presupuesto_aproximado
        ? typeof updatedLead.presupuesto_aproximado === "string"
          ? parseFloat(updatedLead.presupuesto_aproximado)
          : updatedLead.presupuesto_aproximado
        : undefined,
    };
  }

  /**
   * Elimina un lead
   */
  static async deleteLead(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Error al eliminar lead: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw new Error("No se pudo eliminar el lead.");
    }
  }
}