"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Cliente } from "@/types/cliente.interface";
import { PolizaForm } from "@/components/polizas/PolizaForm";
import { PolizaFormData } from "@/lib/schemas/poliza.schema";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2 } from "lucide-react";
import { clientesService } from "@/services/clientes.service";
import { toast } from "sonner";

export default function NuevaPolizaPage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = params.id as string;

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCliente = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cargar datos del cliente
        const clienteData = await clientesService.getById(clienteId);
        setCliente(clienteData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar el cliente";
        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      loadCliente();
    }
  }, [clienteId]);

  const handleSubmit = async (data: PolizaFormData) => {
    try {
      setIsSubmitting(true);

      // TODO: Implementar servicio para crear póliza
      console.log("Datos de la póliza:", data);
      console.log("Cliente ID:", clienteId);

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Póliza creada", {
        description: "La póliza ha sido registrada exitosamente",
      });

      // Redirigir a la lista de pólizas del cliente
      router.push(`/vendedor/polizas/${clienteId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear la póliza";
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/vendedor/polizas/${clienteId}`);
  };

  // Obtener nombre del asegurado del cliente
  const aseguradoDefault = cliente
    ? cliente.tipoPersona === 'NATURAL'
      ? `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim()
      : cliente.razonSocial || ''
    : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Cargando información...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Añadir Póliza</h1>
            <p className="text-muted-foreground">
              Registra una nueva póliza para el cliente
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
    <div className="space-y-6 container mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Añadir Póliza</h1>
          <p className="text-muted-foreground">
            Cliente: <span className="font-semibold">{aseguradoDefault}</span>
          </p>
        </div>
      </div>

      {/* Formulario */}
      <PolizaForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting}
        aseguradoDefault={aseguradoDefault}
      />
    </div>
  );
}
