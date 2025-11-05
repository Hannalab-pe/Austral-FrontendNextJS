"use client";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/common/DataTable";
import { VendedorResponse } from '@/services/vendedores.service';
import { useVendedores, useDeactivateVendedor, useActivateVendedor } from '@/lib/hooks/useVendedores';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Ban, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function VendedoresTable() {
  // Estado para filtros (por ahora solo activos)
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  // 1️⃣ Hook de Query para obtener datos
  const { data: vendedores, isLoading, isError } = useVendedores({ 
    estaActivo: mostrarInactivos ? undefined : true 
  });

  // 2️⃣ Hooks de Mutation para acciones
  const deactivateMutation = useDeactivateVendedor();
  const activateMutation = useActivateVendedor();

  // 3️⃣ Definir columnas de la tabla
  const columns: ColumnDef<VendedorResponse>[] = [
    {
      accessorKey: "nombreCompleto",
      header: "Nombre Completo",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.nombre} {row.original.apellido}
        </div>
      ),
    },
    {
      accessorKey: "nombreUsuario",
      header: "Usuario",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.original.nombreUsuario}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.telefono || '-'}
        </div>
      ),
    },
    {
      accessorKey: "porcentajeComision",
      header: "Comisión",
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          {row.original.porcentajeComision ? `${row.original.porcentajeComision}%` : '-'}
        </div>
      ),
    },
    {
      accessorKey: "estaActivo",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.estaActivo ? "default" : "secondary"}>
          {row.original.estaActivo ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      accessorKey: "fechaAsignacion",
      header: "Fecha Asignación",
      cell: ({ row }) => {
        try {
          return (
            <div className="text-sm text-muted-foreground">
              {format(new Date(row.original.fechaAsignacion), "dd/MM/yyyy", { locale: es })}
            </div>
          );
        } catch {
          return <div className="text-sm text-muted-foreground">-</div>;
        }
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const vendedor = row.original;
        const isDeactivating = deactivateMutation.isPending;
        const isActivating = activateMutation.isPending;

        return (
          <div className="flex gap-2">
            {/* Botón Ver */}
            <Button 
              variant="ghost" 
              size="sm"
              asChild
              title="Ver detalles"
            >
              <Link href={`/broker/vendedores/${vendedor.idUsuario}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>

            {/* Botón Editar */}
            <Button 
              variant="ghost" 
              size="sm"
              asChild
              title="Editar vendedor"
            >
              <Link href={`/broker/vendedores/${vendedor.idUsuario}/editar`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>

            {/* Botón Desactivar/Activar */}
            {vendedor.estaActivo ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    disabled={isDeactivating}
                    title="Desactivar vendedor"
                  >
                    {isDeactivating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Ban className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Desactivar vendedor?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción desactivará al vendedor <strong>{vendedor.nombre} {vendedor.apellido}</strong>.
                      El vendedor no podrá acceder al sistema, pero sus datos se mantendrán.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deactivateMutation.mutate(vendedor.idUsuario)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Desactivar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    disabled={isActivating}
                    title="Reactivar vendedor"
                  >
                    {isActivating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Reactivar vendedor?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción reactivará al vendedor <strong>{vendedor.nombre} {vendedor.apellido}</strong>.
                      El vendedor podrá volver a acceder al sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => activateMutation.mutate(vendedor.idUsuario)}
                    >
                      Reactivar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        );
      },
    },
  ];

  // 4️⃣ Manejar estados de carga y error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">Error al cargar vendedores</p>
          <p className="text-sm text-muted-foreground">Por favor, intenta nuevamente más tarde</p>
        </div>
      </div>
    );
  }

  // 5️⃣ Renderizar la tabla con DataTable
  return (
    <div className="space-y-4">
      {/* Filtro de activos/inactivos */}
      <div className="flex items-center gap-2">
        <Button
          variant={mostrarInactivos ? "outline" : "default"}
          size="sm"
          onClick={() => setMostrarInactivos(false)}
        >
          Activos
        </Button>
        <Button
          variant={mostrarInactivos ? "default" : "outline"}
          size="sm"
          onClick={() => setMostrarInactivos(true)}
        >
          Todos
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={vendedores ?? []}
        searchPlaceholder="Buscar vendedores..."
        entityName="vendedores"
        showSearch={true}
        showPagination={true}
        pageSize={10}
      />
    </div>
  );
}
