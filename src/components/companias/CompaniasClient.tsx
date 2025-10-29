'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CompaniasGrid from '@/components/companias/CompaniasGrid';
import { CompaniaSeguro } from '@/types/compania.interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw, Search, Building2 } from 'lucide-react';
import {
  useCompanias,
  useActivateCompania,
  useDeactivateCompania,
  useDeleteCompania,
} from '@/lib/hooks/useCompanias';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CompaniasClientProps {
  initialData?: CompaniaSeguro[];
}

export default function CompaniasClient({
  initialData,
}: CompaniasClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
  });

  // Queries y Mutations con TanStack Query
  const { data: companias = [], isLoading, refetch } = useCompanias(initialData);
  const activateCompania = useActivateCompania();
  const deactivateCompania = useDeactivateCompania();
  const deleteCompania = useDeleteCompania();

  // Filtrado de compañías
  const filteredCompanias = companias.filter((compania) => {
    const matchesSearch =
      compania.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compania.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compania.ruc?.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && compania.estaActivo) ||
      (statusFilter === 'inactive' && !compania.estaActivo);

    return matchesSearch && matchesStatus;
  });

  // Handlers
  const handleView = (compania: CompaniaSeguro) => {
    router.push(`/admin/companias/${compania.idCompania}`);
  };

  const handleEdit = (compania: CompaniaSeguro) => {
    router.push(`/admin/companias/${compania.idCompania}/editar`);
  };

  const handleDelete = (compania: CompaniaSeguro) => {
    setActionDialog({
      isOpen: true,
      title: '¿Eliminar compañía?',
      description: `¿Estás seguro de eliminar "${compania.nombre}"? Esta acción no se puede deshacer.`,
      action: () => deleteCompania.mutate(compania.idCompania),
    });
  };

  const handleActivate = (compania: CompaniaSeguro) => {
    setActionDialog({
      isOpen: true,
      title: '¿Activar compañía?',
      description: `¿Estás seguro de activar "${compania.nombre}"?`,
      action: () => activateCompania.mutate(compania.idCompania),
    });
  };

  const handleDeactivate = (compania: CompaniaSeguro) => {
    setActionDialog({
      isOpen: true,
      title: '¿Desactivar compañía?',
      description: `¿Estás seguro de desactivar "${compania.nombre}"? Los productos asociados también se verán afectados.`,
      action: () => deactivateCompania.mutate(compania.idCompania),
    });
  };

  const handleViewProducts = (compania: CompaniaSeguro) => {
    router.push(`/admin/companias/${compania.idCompania}/productos`);
  };

  const closeDialog = () => {
    setActionDialog({
      isOpen: false,
      title: '',
      description: '',
      action: () => {},
    });
  };

  const confirmAction = () => {
    actionDialog.action();
    closeDialog();
  };

  // Estadísticas rápidas
  const stats = {
    total: companias.length,
    active: companias.filter((c) => c.estaActivo).length,
    inactive: companias.filter((c) => !c.estaActivo).length,
  };

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Compañías de Seguros
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona las compañías aseguradoras y sus productos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Recargar
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 transition-all duration-200"
            onClick={() => router.push('/admin/companias/nueva')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Compañía
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactivas</p>
              <p className="text-2xl font-bold text-gray-600">
                {stats.inactive}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Building2 className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, razón social o RUC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="inactive">Inactivas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filteredCompanias.length !== companias.length && (
          <p className="text-sm text-gray-600 mt-2">
            Mostrando {filteredCompanias.length} de {companias.length}{' '}
            compañías
          </p>
        )}
      </div>

      {/* Grid de Compañías */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-gray-600">Cargando compañías...</p>
          </div>
        </div>
      ) : (
        <CompaniasGrid
          companias={filteredCompanias}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          onViewProducts={handleViewProducts}
        />
      )}

      {/* Dialog de confirmación */}
      <Dialog open={actionDialog.isOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionDialog.title}</DialogTitle>
            <DialogDescription>{actionDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button onClick={confirmAction}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
