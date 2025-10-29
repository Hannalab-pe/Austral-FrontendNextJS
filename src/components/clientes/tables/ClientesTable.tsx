"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Cliente } from "@/types/cliente.interface";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/DataTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useClientes, useDeactivateCliente } from "@/lib/hooks/useClientes";
import {
  Eye,
  Loader2,
  MessageCircle,
  Trash2,
  FileText,
  Pencil,
} from "lucide-react";
import { useState } from "react";

interface ClientesTableProps {
  data: Cliente[];
  onDelete?: (cliente: Cliente) => void;
  onView?: (cliente: Cliente) => void;
}

export default function ClientesTable({
  onDelete,
  onView,
}: ClientesTableProps) {
  const router = useRouter();
  // Usar el hook de TanStack Query para obtener clientes
  const {
    data: clientes,
    isLoading,
    isError,
    error,
  } = useClientes({
    esta_activo: true, // Solo clientes activos por defecto
  });

  // Hook para desactivar clientes
  const deactivateCliente = useDeactivateCliente();

  // Estado para el dialog de confirmación
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  // Funciones para manejar el dialog de eliminación
  const handleDeleteClick = (cliente: Cliente) => {
    setClienteToDelete(cliente);
  };

  const handleConfirmDelete = async () => {
    if (!clienteToDelete) return;

    try {
      await deactivateCliente.mutateAsync(clienteToDelete.idCliente);
      setClienteToDelete(null);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  const handleCancelDelete = () => {
    setClienteToDelete(null);
  };

  const columns: ColumnDef<Cliente>[] = [
    {
      accessorKey: "fechaRegistro",
      header: "Fecha de Registro",
      cell: ({ row }) => {
        const fecha = row.original.fechaRegistro;
        if (!fecha) return <span className="text-xs text-gray-400">-</span>;

        try {
          const fechaDate = typeof fecha === "string" ? new Date(fecha) : fecha;
          return (
            <div className="text-sm">
              {format(fechaDate, "dd/MM/yyyy", { locale: es })}
            </div>
          );
        } catch {
          return <span className="text-xs text-gray-400">-</span>;
        }
      },
    },
    {
      accessorKey: "razonSocial",
      header: "Nombre o Razón Social",
      cell: ({ row }) => {
        const cliente = row.original;
        const nombre =
          cliente.tipoPersona === "NATURAL"
            ? `${cliente.nombres || ""} ${cliente.apellidos || ""}`.trim()
            : cliente.razonSocial || "";

        return <div className="text-sm">{nombre || "Sin información"}</div>;
      },
    },
    {
      accessorKey: "tipoDocumento",
      header: "T. de Documento",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.tipoDocumento}</div>
      ),
    },
    {
      accessorKey: "numeroDocumento",
      header: "N. Documento",
      cell: ({ row }) => (
        <div className="text-sm font-mono">{row.original.numeroDocumento}</div>
      ),
    },
    {
      accessorKey: "telefono1",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="text-sm text-blue-600">{row.original.telefono1}</div>
      ),
    },
    {
      accessorKey: "emailNotificaciones",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.emailNotificaciones || "-"}</div>
      ),
    },
    {
      accessorKey: "direccion",
      header: "Dirección",
      cell: ({ row }) => {
        const direccion = [
          row.original.direccion,
          row.original.distrito,
          row.original.provincia,
          row.original.departamento,
        ]
          .filter(Boolean)
          .join(", ");

        return (
          <div className="max-w-xs truncate text-sm" title={direccion}>
            {direccion || "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const cliente = row.original;

        return (
          <div className="flex items-center gap-2">
            {/* Botón de WhatsApp */}
            {cliente.whatsapp && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-green-600 border-green-300 hover:bg-green-50"
                onClick={() => {
                  const cleanNumber = cliente.whatsapp!.replace(
                    /[\s\-\(\)]/g,
                    ""
                  );
                  const whatsappUrl = `https://wa.me/${cleanNumber}`;
                  window.open(whatsappUrl, "_blank");
                }}
                title="Contactar por WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            )}

            {/* Botón Ver */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-blue-600 border-blue-300 hover:bg-blue-50"
              onClick={() =>
                router.push(`/vendedor/clientes/${cliente.idCliente}`)
              }
              title="Ver cliente"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {/* Botón Crear Póliza */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-blue-600 border-blue-300 hover:bg-blue-50"
              onClick={() =>
                router.push(`/vendedor/polizas/${cliente.idCliente}`)
              }
              title="Ver/Crear pólizas"
            >
              <FileText className="h-4 w-4" />
            </Button>

            {/* Botón Editar */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-amber-600 border-amber-300 hover:bg-amber-50"
              onClick={() =>
                router.push(`/vendedor/clientes/${cliente.idCliente}/editar`)
              }
              title="Editar cliente"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            {/* Botón Desactivar */}
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => handleDeleteClick(cliente)}
              disabled={deactivateCliente.isPending}
              title="Desactivar cliente"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <div className="text-gray-600">Cargando clientes...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">
            Error al cargar clientes
          </div>
          <div className="text-gray-600">
            {error?.message || "Error desconocido"}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && (!clientes || clientes.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">
            No hay clientes asignados
          </div>
          <div className="text-gray-400">
            No se encontraron clientes asignados a tu cuenta.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={clientes || []}
        searchPlaceholder="Buscar por nombre, email o documento..."
        entityName="clientes"
      />

      {/* Dialog de confirmación para desactivar cliente */}
      <ConfirmDialog
        open={!!clienteToDelete}
        onOpenChange={(open) => !open && handleCancelDelete()}
        title="Eliminar Cliente"
        description="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
        confirmText="Eliminar Cliente"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        isLoading={deactivateCliente.isPending}
        variant="destructive"
      />
    </>
  );
}
