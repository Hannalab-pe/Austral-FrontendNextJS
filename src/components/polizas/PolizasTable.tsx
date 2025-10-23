"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Poliza } from "@/types/poliza.interface";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import TableActions, { TableAction } from "@/components/common/TableActions";
import { RotateCcw, X, Pencil } from "lucide-react";

interface PolizasTableProps {
  data: Poliza[];
  onEdit?: (poliza: Poliza) => void;
  onDelete?: (poliza: Poliza) => void;
  onView?: (poliza: Poliza) => void;
  onRenovar?: (poliza: Poliza) => void;
  onAnular?: (poliza: Poliza) => void;
}

export default function PolizasTable({
  data,
  onEdit,
  onDelete,
  onView,
  onRenovar,
  onAnular,
}: PolizasTableProps) {
  // Definir acciones personalizadas para pólizas
  const polizaActions: TableAction<Poliza>[] = [
    {
      label: "Renovar",
      icon: <RotateCcw className="mr-2 h-4 w-4" />,
      onClick: onRenovar || (() => {}),
      show: !!onRenovar,
    },
    {
      label: "Anular",
      icon: <X className="mr-2 h-4 w-4" />,
      onClick: onAnular || (() => {}),
      variant: "destructive",
      show: !!onAnular,
    },
    {
      label: "Editar",
      icon: <Pencil className="mr-2 h-4 w-4" />,
      onClick: onEdit || (() => {}),
      show: !!onEdit,
    },
  ];
  const columns: ColumnDef<Poliza>[] = [
    {
      accessorKey: "contratante",
      header: "Contratante",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("contratante")}</div>
      ),
    },
    {
      accessorKey: "asegurado",
      header: "Asegurado",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("asegurado")}</div>
      ),
    },
    {
      accessorKey: "cia",
      header: "Cia",
      cell: ({ row }) => <div className="text-sm">{row.getValue("cia")}</div>,
    },
    {
      accessorKey: "ram",
      header: "Ram",
      cell: ({ row }) => <div className="text-sm">{row.getValue("ram")}</div>,
    },
    {
      accessorKey: "prod",
      header: "Prod",
      cell: ({ row }) => <div className="text-sm">{row.getValue("prod")}</div>,
    },
    {
      accessorKey: "poliza",
      header: "Póliza",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("poliza")}</div>
      ),
    },
    {
      accessorKey: "mo",
      header: "Mo",
      cell: ({ row }) => (
        <div className="text-sm font-medium">{row.getValue("mo")}</div>
      ),
    },
    {
      accessorKey: "vig_inicio",
      header: "Vig Inicio",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("vig_inicio")).toLocaleDateString("es-ES")}
        </div>
      ),
    },
    {
      accessorKey: "vig_fin",
      header: "Vig Fin",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("vig_fin")).toLocaleDateString("es-ES")}
        </div>
      ),
    },
    {
      accessorKey: "sub_agente",
      header: "Sub Agente",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.getValue("sub_agente") || "Sin asignar"}
        </div>
      ),
    },
    {
      accessorKey: "descripcion_poliza",
      header: "Descripción de la póliza",
      cell: ({ row }) => (
        <div
          className="max-w-xs truncate"
          title={row.getValue("descripcion_poliza")}
        >
          {row.getValue("descripcion_poliza")}
        </div>
      ),
    },
    {
      accessorKey: "esta_activa",
      header: "Estado",
      cell: ({ row }) => {
        const activa = row.getValue("esta_activa") as boolean;
        return (
          <Badge variant={activa ? "default" : "secondary"}>
            {activa ? "Activa" : "Inactiva"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <TableActions item={row.original} actions={polizaActions} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar pólizas..."
      entityName="pólizas"
    />
  );
}
