"use client";

import { useParams, useRouter } from "next/navigation";
import { useActividad } from "@/lib/hooks/useActividades";
import ActividadFormEdit from "@/components/actividades/ActividadFormEdit";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LoadingContent } from "@/components/common/LoadingContent";

export default function EditarActividadPage() {
  const router = useRouter();
  const params = useParams();
  const actividadId = params.id as string;

  // Usar el hook especializado para obtener una actividad por ID
  const { actividad, isLoading, isError, error } = useActividad(actividadId);

  // Loading state
  if (isLoading) {
    return (
      <LoadingContent message="Cargando actividad..." />
    );
  }

  // Error state
  if (isError || !actividad) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar la actividad</p>
          <p className="text-gray-600 mb-4">
            {error?.message || "Actividad no encontrada"}
          </p>
          <Button onClick={() => router.push("/admin/actividades")} variant="outline">
            Volver al Calendario
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Actividad</h1>
          <p className="text-gray-600 mt-1">
            Modifica los datos de la actividad seleccionada
          </p>
        </div>
      </div>

      {/* Formulario */}
      <ActividadFormEdit actividad={actividad} />
    </div>
  );
}
