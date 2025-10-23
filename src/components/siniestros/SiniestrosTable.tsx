"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Siniestro } from "@/types/siniestro.interface";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import TableActions, { TableAction } from "@/components/common/TableActions";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface SiniestrosTableProps {
  data: Siniestro[];
  onEdit?: (siniestro: Siniestro) => void;
  onDelete?: (siniestro: Siniestro) => void;
  onView?: (siniestro: Siniestro) => void;
}

export default function SiniestrosTable({
  data,
  onEdit,
  onDelete,
  onView,
}: SiniestrosTableProps) {
  // Definir acciones personalizadas para siniestros
  const siniestroActions: TableAction<Siniestro>[] = [
    {
      label: "Ver",
      icon: <Eye className="mr-2 h-4 w-4" />,
      onClick: onView || (() => {}),
      show: !!onView,
    },
    {
      label: "Editar",
      icon: <Pencil className="mr-2 h-4 w-4" />,
      onClick: onEdit || (() => {}),
      show: !!onEdit,
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: onDelete || (() => {}),
      variant: "destructive",
      show: !!onDelete,
    },
  ];

  const columns: ColumnDef<Siniestro>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "contratante",
      header: "Contratante",
      cell: ({ row }) => (
        <div
          className="font-medium max-w-xs truncate"
          title={row.getValue("contratante")}
        >
          {row.getValue("contratante")}
        </div>
      ),
    },
    {
      accessorKey: "titular",
      header: "Titular",
      cell: ({ row }) => (
        <div
          className="font-medium max-w-xs truncate"
          title={row.getValue("titular")}
        >
          {row.getValue("titular")}
        </div>
      ),
    },
    {
      accessorKey: "poliza",
      header: "Póliza",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("poliza")}</div>
      ),
    },
    {
      accessorKey: "cia",
      header: "Cia",
      cell: ({ row }) => <div className="text-sm">{row.getValue("cia")}</div>,
    },
    {
      accessorKey: "fec_stro",
      header: "Fec.Stro",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("fec_stro")).toLocaleDateString("es-ES")}
        </div>
      ),
    },
    {
      accessorKey: "causa",
      header: "Causa",
      cell: ({ row }) => (
        <div
          className="text-sm max-w-xs truncate"
          title={row.getValue("causa")}
        >
          {row.getValue("causa")}
        </div>
      ),
    },
    {
      accessorKey: "siniestro_no",
      header: "Siniestro No.",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("siniestro_no")}</div>
      ),
    },
    {
      accessorKey: "provision",
      header: "Provisión",
      cell: ({ row }) => (
        <div className="text-sm font-medium">
          S/{" "}
          {Number(row.getValue("provision")).toLocaleString("es-PE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("estado") as string;
        const getEstadoVariant = (estado: string) => {
          switch (estado.toLowerCase()) {
            case "pagado":
              return "default";
            case "aprobado":
              return "secondary";
            case "en proceso":
              return "outline";
            case "pendiente":
              return "outline";
            case "rechazado":
              return "destructive";
            default:
              return "outline";
          }
        };
        return <Badge variant={getEstadoVariant(estado)}>{estado}</Badge>;
      },
    },
    {
      accessorKey: "ejec",
      header: "Ejec",
      cell: ({ row }) => (
        <div className="text-sm max-w-xs truncate" title={row.getValue("ejec")}>
          {row.getValue("ejec")}
        </div>
      ),
    },
    {
      accessorKey: "ramo",
      header: "Ramo",
      cell: ({ row }) => <div className="text-sm">{row.getValue("ramo")}</div>,
    },
    {
      accessorKey: "placa",
      header: "Placa",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("placa") || "-"}</div>
      ),
    },
    {
      accessorKey: "fec_gestion",
      header: "Fec.Gestión",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.getValue("fec_gestion")
            ? new Date(row.getValue("fec_gestion")).toLocaleDateString("es-ES")
            : "-"}
        </div>
      ),
    },
    {
      accessorKey: "prox_gestion",
      header: "Prox.Gestión",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.getValue("prox_gestion")
            ? new Date(row.getValue("prox_gestion")).toLocaleDateString("es-ES")
            : "-"}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <TableActions item={row.original} actions={siniestroActions} />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Buscar siniestros..."
      entityName="siniestros"
    />
  );
}
