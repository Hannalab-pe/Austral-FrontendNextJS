"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ActividadForm from "@/components/actividades/ActividadForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ActividadFormData } from "@/lib/schemas/actividad.schema";
import type { Actividad, TipoActividad } from "@/types/actividad.interface";
import { useUpdateActividad } from "@/lib/hooks/useActividades";
import { actividadService } from "@/services/actividad.service";

export default function EditarActividadPage() {
  const router = useRouter();
  const params = useParams();
  const actividadId = params.id as string;
  const updateActividad = useUpdateActividad();

  const [actividad, setActividad] = useState<Actividad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar la actividad existente
  useEffect(() => {
    const loadActividad = async () => {
      try {
        setLoading(true);
        setError(null);

        const actividadData = await actividadService.getById(actividadId);
        setActividad(actividadData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        toast.error("Error al cargar actividad", {
          description: errorMessage,
        });
        console.error("Error loading actividad:", err);
      } finally {
        setLoading(false);
      }
    };

    if (actividadId) {
      loadActividad();
    }
  }, [actividadId]);

  const handleSubmit = async (data: ActividadFormData) => {
    // Crear el objeto actividad con los datos del formulario
    const actividadData = {
      tipoActividad: data.tipoActividad,
      titulo: data.titulo,
      fechaActividad: new Date(data.fechaActividad).toISOString(),
      duracionMinutos: data.duracionMinutos,
      descripcion: data.descripcion,
      resultado: data.resultado,
      proximaAccion: data.proximaAccion,
      fechaProximaAccion: data.fechaProximaAccion
        ? new Date(data.fechaProximaAccion).toISOString()
        : undefined,
    };

    // Usar el hook de React Query para actualizar la actividad
    updateActividad.mutate(
      { id: actividadId, data: actividadData },
      {
        onSuccess: () => {
          // Redirigir al calendario de actividades después de actualizar
          router.push("/broker/actividades");
        },
      }
    );
  };

  const handleCancel = () => {
    router.push("/broker/actividades");
  };

  // Preparar los datos iniciales para el formulario
  const initialData: Partial<ActividadFormData> | undefined = actividad ? {
    tipoActividad: actividad.tipoActividad as TipoActividad,
    titulo: actividad.titulo,
    fechaActividad: actividad.fechaActividad ? new Date(actividad.fechaActividad).toISOString().slice(0, 16) : '',
    duracionMinutos: actividad.duracionMinutos,
    descripcion: actividad.descripcion,
    resultado: actividad.resultado,
    proximaAccion: actividad.proximaAccion,
    fechaProximaAccion: actividad.fechaProximaAccion ? new Date(actividad.fechaProximaAccion).toISOString().slice(0, 16) : '',
  } : undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando actividad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar la actividad</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reintentar
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
      <ActividadForm
        onSubmit={handleSubmit}
        initialData={initialData}
        onCancel={handleCancel}
      />
    </div>
  );
}
