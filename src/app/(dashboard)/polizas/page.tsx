"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PolizasTable from "@/components/polizas/PolizasTable";
import { mockPolizas } from "@/lib/constants/mock-polizas";
import { Poliza } from "@/types/poliza.interface";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function PolizasPage() {
  const router = useRouter();
  const [polizas, setPolizas] = useState<Poliza[]>(mockPolizas);

  const handleView = (poliza: Poliza) => {
    // TODO: Implementar vista de detalles
    toast.info(`Ver detalles de póliza ${poliza.poliza}`);
  };

  const handleEdit = (poliza: Poliza) => {
    // TODO: Implementar edición
    router.push(`/polizas/${poliza.id_poliza}/editar`);
  };

  const handleDelete = (poliza: Poliza) => {
    // TODO: Implementar confirmación y eliminación
    if (confirm(`¿Estás seguro de eliminar la póliza ${poliza.poliza}?`)) {
      setPolizas(polizas.filter((p) => p.id_poliza !== poliza.id_poliza));
      toast.success("Póliza eliminada exitosamente");
    }
  };

  const handleRenovar = (poliza: Poliza) => {
    // TODO: Implementar renovación de póliza
    toast.info(`Renovar póliza ${poliza.poliza}`);
  };

  const handleAnular = (poliza: Poliza) => {
    // TODO: Implementar anulación de póliza
    if (confirm(`¿Estás seguro de anular la póliza ${poliza.poliza}?`)) {
      setPolizas(
        polizas.map((p) =>
          p.id_poliza === poliza.id_poliza ? { ...p, esta_activa: false } : p
        )
      );
      toast.success("Póliza anulada exitosamente");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Pólizas</h1>
          <p className="text-gray-600">
            Gestiona la información de tus pólizas
          </p>
        </div>
        <Button
          className="bg-blue-700 hover:bg-blue-800 transition-all duration-200"
          onClick={() => router.push("/polizas/nueva-poliza")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nueva Póliza
        </Button>
      </div>

      <PolizasTable
        data={polizas}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRenovar={handleRenovar}
        onAnular={handleAnular}
      />
    </div>
  );
}
