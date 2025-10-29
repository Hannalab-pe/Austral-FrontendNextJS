'use client';

import { useState } from 'react';
import { useCompania } from '@/lib/hooks/useCompanias';
import {
  useProductosByCompania,
  useActivateProducto,
  useDeactivateProducto,
  useDeleteProducto,
} from '@/lib/hooks/useProductos';
import { ProductoSeguro } from '@/types/producto.interface';
import ProductoCard from './ProductoCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Building2,
  Package,
  Plus,
  Search,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProductosCompaniaClientProps {
  idCompania: string;
}

export default function ProductosCompaniaClient({
  idCompania,
}: ProductosCompaniaClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    'all'
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<ProductoSeguro | null>(
    null
  );

  // Queries
  const {
    data: compania,
    isLoading: isLoadingCompania,
    isError: isErrorCompania,
  } = useCompania(idCompania);
  const {
    data: productos,
    isLoading: isLoadingProductos,
    isError: isErrorProductos,
  } = useProductosByCompania(idCompania);

  // Mutations
  const activateMutation = useActivateProducto();
  const deactivateMutation = useDeactivateProducto();
  const deleteMutation = useDeleteProducto();

  // Filtrar productos
  const filteredProductos = productos?.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigoProducto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && producto.estaActivo) ||
      (statusFilter === 'inactive' && !producto.estaActivo);

    return matchesSearch && matchesStatus;
  });

  // Estadísticas
  const stats = {
    total: productos?.length || 0,
    activos: productos?.filter((p) => p.estaActivo).length || 0,
    inactivos: productos?.filter((p) => !p.estaActivo).length || 0,
  };

  // Handlers
  const handleView = (producto: ProductoSeguro) => {
    router.push(`/admin/productos/${producto.idProducto}`);
  };

  const handleEdit = (producto: ProductoSeguro) => {
    router.push(`/admin/productos/${producto.idProducto}/editar`);
  };

  const handleDelete = (producto: ProductoSeguro) => {
    setSelectedProducto(producto);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProducto) return;

    try {
      await deleteMutation.mutateAsync(selectedProducto.idProducto);
      setDeleteDialogOpen(false);
      setSelectedProducto(null);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleActivate = async (producto: ProductoSeguro) => {
    try {
      await activateMutation.mutateAsync(producto.idProducto);
    } catch (error) {
      console.error('Error al activar producto:', error);
    }
  };

  const handleDeactivate = async (producto: ProductoSeguro) => {
    try {
      await deactivateMutation.mutateAsync(producto.idProducto);
    } catch (error) {
      console.error('Error al desactivar producto:', error);
    }
  };

  const handleCreateNew = () => {
    router.push(`/admin/companias/${idCompania}/productos/nuevo`);
  };

  // Estados de carga y error
  if (isLoadingCompania || isLoadingProductos) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isErrorCompania || isErrorProductos || !compania) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar la información. Por favor, intenta nuevamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/companias">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Compañías
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Productos de {compania.nombre}
              </h1>
              <p className="text-gray-600 mt-1">
                Gestiona los productos de seguros de esta compañía
              </p>
            </div>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Productos Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Productos Inactivos</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactivos}</p>
              </div>
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: 'all' | 'active' | 'inactive') =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid de Productos */}
      {filteredProductos && filteredProductos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProductos.map((producto) => (
            <ProductoCard
              key={producto.idProducto}
              producto={producto}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'No hay productos que coincidan con los filtros aplicados'
                : 'Aún no hay productos registrados para esta compañía'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button
                onClick={handleCreateNew}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Producto
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el producto "{selectedProducto?.nombre}". Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
