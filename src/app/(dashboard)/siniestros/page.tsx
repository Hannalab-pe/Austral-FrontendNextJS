"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiniestrosTable from "@/components/siniestros/SiniestrosTable";
import { mockSiniestros } from "@/lib/constants/mock-siniestros";
import { Siniestro } from "@/types/siniestro.interface";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function SiniestrosPage() {
  const router = useRouter();
  const [siniestros, setSiniestros] = useState<Siniestro[]>(mockSiniestros);

  const handleView = (siniestro: Siniestro) => {
    // TODO: Implementar vista de detalles
    toast.info(`Ver detalles del siniestro ${siniestro.siniestro_no}`);
  };

  const handleEdit = (siniestro: Siniestro) => {
    // TODO: Implementar edición
    router.push(`/siniestros/${siniestro.id}/editar`);
  };

  const handleDelete = (siniestro: Siniestro) => {
    // TODO: Implementar confirmación y eliminación
    if (
      confirm(
        `¿Estás seguro de eliminar el siniestro ${siniestro.siniestro_no}?`
      )
    ) {
      setSiniestros(siniestros.filter((s) => s.id !== siniestro.id));
      toast.success("Siniestro eliminado exitosamente");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Siniestros</h1>
          <p className="text-gray-600">
            Gestiona la información de tus siniestros
          </p>
        </div>
        <Button
          className="bg-blue-700 hover:bg-blue-800 transition-all duration-200"
          onClick={() => router.push("/siniestros/nuevo-siniestro")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Siniestro
        </Button>
      </div>

      <SiniestrosTable
        data={siniestros}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
