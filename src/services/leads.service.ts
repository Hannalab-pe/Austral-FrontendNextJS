import { Lead } from "@/types/lead.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_LEADS_SERVICE_URL || "/api";

/**
 * Función helper para transformar datos del backend al formato del frontend
 * El backend devuelve idLead (camelCase) pero el frontend usa id_lead (snake_case)
 */
function transformLeadFromBackend(lead: any): Lead {
  return {
    // Mapear idLead del backend a id_lead del frontend
    id_lead: lead.idLead || lead.id_lead,
    nombre: lead.nombre,
    apellido: lead.apellido,
    email: lead.email,
    telefono: lead.telefono,
    fecha_nacimiento: lead.fecha_nacimiento,
    tipo_seguro_interes: lead.tipo_seguro_interes,
    // Convertir presupuesto_aproximado de string a number
    presupuesto_aproximado: lead.presupuesto_aproximado
      ? typeof lead.presupuesto_aproximado === "string"
        ? parseFloat(lead.presupuesto_aproximado)
        : lead.presupuesto_aproximado
      : undefined,
    notas: lead.notas,
    puntaje_calificacion: lead.puntaje_calificacion,
    prioridad: lead.prioridad,
    fecha_primer_contacto: lead.fecha_primer_contacto,
    fecha_ultimo_contacto: lead.fecha_ultimo_contacto,
    proxima_fecha_seguimiento: lead.proxima_fecha_seguimiento,
    id_estado: lead.id_estado,
    id_fuente: lead.id_fuente,
    asignado_a_usuario: lead.asignado_a_usuario,
    esta_activo: lead.esta_activo,
    fecha_creacion: lead.fecha_creacion,
    // Relaciones expandidas
    estado: lead.estado,
    fuente: lead.fuente,
    usuarioAsignado: lead.usuarioAsignado,
  };
}

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

    const data: any[] = await response.json();

    // Transformar datos del backend al formato del frontend
    return data.map(transformLeadFromBackend);
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

    const lead: any = await response.json();

    // Transformar datos del backend al formato del frontend
    return transformLeadFromBackend(lead);
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

    const newLead: any = await response.json();

    return transformLeadFromBackend(newLead);
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

      const updatedLead: any = await response.json();

      return transformLeadFromBackend(updatedLead);
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

    const updatedLead: any = await response.json();

    return transformLeadFromBackend(updatedLead);
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