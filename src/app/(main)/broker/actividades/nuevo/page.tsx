"use client";

import { useRouter } from "next/navigation";
import ActividadForm from "@/components/actividades/ActividadForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ActividadFormData } from "@/lib/schemas/actividad.schema";
import { useCreateActividad } from "@/lib/hooks/useActividades";
import { useAuthStore } from "@/store/authStore";

export default function NuevaActividadPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const createActividad = useCreateActividad();

  const handleSubmit = async (data: ActividadFormData) => {
    if (!user?.idUsuario) {
      return;
    }

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
      realizadaPorUsuario: user.idUsuario,
    };

    // Usar el hook de React Query para crear la actividad
    createActividad.mutate(actividadData, {
      onSuccess: () => {
        // Redirigir al calendario de actividades después de crear
        router.push("/broker/actividades");
      },
    });
  };

  const handleCancel = () => {
    router.push("/broker/actividades");
  };

  return (
    <div className="space-y-6 container mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Actividad</h1>
          <p className="text-gray-600 mt-1">
            Registra una nueva actividad en el sistema
          </p>
        </div>
      </div>

      {/* Formulario */}
      <ActividadForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createActividad.isPending}
      />
    </div>
  );
}
