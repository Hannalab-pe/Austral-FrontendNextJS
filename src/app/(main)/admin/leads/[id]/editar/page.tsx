"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import LeadFormEdit from "@/components/leads/LeadFormEdit";
import { useLeads } from "@/lib/hooks/useLeads";

/**
 * Página de edición de lead
 * Client Component - Carga el lead y muestra formulario de edición
 */
export default function EditarLeadPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  // ==========================================
  // HOOKS - Obtener lead específico
  // ==========================================

  const { leads, isLoading, isError } = useLeads();
  const lead = leads?.find((l) => l.id_lead === leadId);

  // ==========================================
  // RENDER - Estados de carga y error
  // ==========================================

  if (isLoading) {
    return (
      <div className="w-full min-h-screen py-8 px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Cargando lead...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="w-full min-h-screen py-8 px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">Lead no encontrado</p>
              <Button onClick={() => router.push("/admin/leads")} variant="outline">
                Volver a Leads
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER - Página de edición
  // ==========================================

  return (
    <div className="w-full min-h-screen py-8 px-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/leads/${leadId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-900">Editar Lead</h1>
            <p className="text-gray-600 mt-2">
              Actualiza la información de {lead.nombre} {lead.apellido}
            </p>
          </div>
        </div>

        {/* Formulario de edición */}
        <LeadFormEdit lead={lead} />
      </div>
    </div>
  );
}
