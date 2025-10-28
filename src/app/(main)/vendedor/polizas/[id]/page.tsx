"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Cliente } from "@/types/cliente.interface";
import { Poliza } from "@/types/poliza.interface";
import { ClienteInfo } from "@/components/polizas/ClienteInfo";
import { PolizasClienteTable } from "@/components/polizas/PolizasClienteTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus, Loader2, FileText } from "lucide-react";
import { clientesService } from "@/services/clientes.service";
import { toast } from "sonner";

export default function PolizasClientePage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar datos del cliente
        const clienteData = await clientesService.getById(clienteId);
        setCliente(clienteData);

        // TODO: Cargar pólizas del cliente cuando esté disponible el servicio
        // const polizasData = await polizasService.getByCliente(clienteId);
        // setPolizas(polizasData);

        // Por ahora, datos vacíos
        setPolizas([]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar los datos";
        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      loadData();
    }
  }, [clienteId]);

  const handleAgregarPoliza = () => {
    router.push(`/vendedor/polizas/${clienteId}/nueva-poliza`);
  };

  const handleEditPoliza = (poliza: Poliza) => {
    // TODO: Abrir modal o navegar a formulario de edición
    toast.info("Editar póliza", {
      description: `Editando póliza: ${poliza.poliza}`,
    });
  };

  const handleViewPoliza = (poliza: Poliza) => {
    // TODO: Abrir modal de detalles o navegar a vista de póliza
    toast.info("Ver póliza", {
      description: `Viendo póliza: ${poliza.poliza}`,
    });
  };

  const handleDeletePoliza = (poliza: Poliza) => {
    // TODO: Implementar eliminación de póliza
    toast.info("Eliminar póliza", {
      description: `Eliminando póliza: ${poliza.poliza}`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Cargando información del cliente...</p>
        </div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pólizas del Cliente</h1>
            <p className="text-muted-foreground">
              Gestiona las pólizas asociadas al cliente
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            {error || "No se pudo cargar la información del cliente"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pólizas del Cliente</h1>
            <p className="text-muted-foreground">
              Gestiona las pólizas asociadas al cliente
            </p>
          </div>
        </div>
        <Button onClick={handleAgregarPoliza}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Póliza
        </Button>
      </div>

      {/* Información del cliente */}
      <ClienteInfo cliente={cliente} />

      {/* Tabla de pólizas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pólizas Asociadas
          </CardTitle>
          <CardDescription>
            Lista de todas las pólizas registradas para este cliente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PolizasClienteTable
            polizas={polizas}
            isLoading={false}
            onEdit={handleEditPoliza}
            onView={handleViewPoliza}
            onDelete={handleDeletePoliza}
          />
        </CardContent>
      </Card>
    </div>
  );
}
