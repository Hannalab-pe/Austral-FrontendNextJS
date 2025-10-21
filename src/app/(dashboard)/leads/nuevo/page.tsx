"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LeadForm from "@/components/leads/LeadForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { EstadoLead, FuenteLead } from "@/types/lead.interface";
import type { LeadFormData } from "@/lib/schemas/lead.schema";
import { LeadsService } from "@/services/leads.service";
import { EstadosLeadService } from "@/services/estados-lead.service";
import { FuentesLeadService } from "@/services/fuentes-lead.service";
import { toast } from "sonner";

export default function NuevoLeadPage() {
  const router = useRouter();
  const [estados, setEstados] = useState<EstadoLead[]>([]);
  const [fuentes, setFuentes] = useState<FuenteLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar estados y fuentes desde la API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar estados y fuentes en paralelo
        const [estadosData, fuentesData] = await Promise.all([
          EstadosLeadService.getEstadosLead(),
          FuentesLeadService.getFuentesLead(),
        ]);

        setEstados(estadosData);
        setFuentes(fuentesData);

        // Mostrar notificación si se están usando datos mock
        const isUsingMockData =
          fuentesData.length > 0 &&
          fuentesData[0]?.fecha_creacion?.includes("2025-10-13");
        if (isUsingMockData) {
          toast.info("Modo Desarrollo", {
            description: "Usando datos de ejemplo. La API no está disponible.",
          });
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        toast.error("Error al cargar datos", {
          description: errorMessage,
        });
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (data: LeadFormData) => {
    try {
      // Crear el objeto lead con los datos del formulario
      const leadData = {
        nombre: data.nombre,
        apellido: data.apellido || undefined,
        email: data.email || undefined,
        telefono: data.telefono,
        fecha_nacimiento: data.fecha_nacimiento || undefined,
        tipo_seguro_interes: data.tipo_seguro_interes || undefined,
        presupuesto_aproximado: data.presupuesto_aproximado,
        notas: data.notas || undefined,
        puntaje_calificacion: data.puntaje_calificacion || 0,
        prioridad: data.prioridad || "MEDIA",
        proxima_fecha_seguimiento: data.proxima_fecha_seguimiento || undefined,
        id_estado: data.id_estado,
        id_fuente: data.id_fuente,
        asignado_a_usuario: data.asignado_a_usuario || undefined,
        esta_activo: true, // Por defecto los nuevos leads están activos
        fecha_primer_contacto: new Date().toISOString(),
      };

      // Llamar al servicio para crear el lead
      const newLead = await LeadsService.createLead(leadData);

      // Agregar el lead creado a la lista local (si se creó localmente)
      if (newLead.id_lead.startsWith("lead-mock-")) {
        toast.success("Lead creado (Modo Desarrollo)", {
          description: `${data.nombre} ${
            data.apellido || ""
          } ha sido agregado localmente.`,
        });
      } else {
        toast.success("Lead registrado exitosamente", {
          description: `${data.nombre} ${
            data.apellido || ""
          } ha sido agregado al sistema`,
        });
      }

      // Redirigir a la lista de leads
      setTimeout(() => {
        router.push("/leads");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      toast.error("Error al crear lead", {
        description: errorMessage,
      });
      console.error("Error creating lead:", error);
    }
  };

  const handleCancel = () => {
    router.push("/leads");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar los datos</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Lead</h1>
          <p className="text-gray-600 mt-1">
            Registra una nueva oportunidad de negocio
          </p>
        </div>
      </div>

      {/* Formulario */}
      <LeadForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        estados={estados}
        fuentes={fuentes}
      />
    </div>
  );
}
