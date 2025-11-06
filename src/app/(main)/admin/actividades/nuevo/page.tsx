"use client";

import { useRouter } from "next/navigation";
import ActividadForm from "@/components/actividades/ActividadForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NuevaActividadPage() {
  const router = useRouter();

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
      <ActividadForm />
    </div>
  );
}