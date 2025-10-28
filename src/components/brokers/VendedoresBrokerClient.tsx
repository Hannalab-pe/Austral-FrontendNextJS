'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserPlus, Search, Eye, Edit, Mail, Phone, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { brokersService, VendedorBroker } from '@/services/brokers.service';
import { toast } from 'sonner';

export default function VendedoresBrokerClient() {
  const router = useRouter();
  const [vendedores, setVendedores] = useState<VendedorBroker[]>([]);
  const [filteredVendedores, setFilteredVendedores] = useState<VendedorBroker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, activos: 0 });

  // Obtener vendedores del broker actual
  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        setLoading(true);
        const response = await brokersService.getMyVendedores();
        setVendedores(response.vendedores);
        setFilteredVendedores(response.vendedores);
        setStats({ total: response.total, activos: response.activos });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al obtener vendedores';
        toast.error('Error al cargar vendedores', {
          description: errorMessage,
        });
        console.error('Error obteniendo vendedores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendedores();
  }, []);

  // Filtrar vendedores basado en el término de búsqueda
  useEffect(() => {
    if (!searchTerm) {
      setFilteredVendedores(vendedores);
    } else {
      const filtered = vendedores.filter(vendedor =>
        vendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendedor.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendedor.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVendedores(filtered);
    }
  }, [searchTerm, vendedores]);

  const handleNuevoVendedor = () => {
    router.push('/broker/vendedores/nuevo');
  };

  const handleEditarVendedor = (vendedorId: string) => {
    router.push(`/broker/vendedores/${vendedorId}/editar`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLastAccess = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mis Vendedores</h2>
          <p className="text-gray-600">
            Gestiona a los vendedores asignados a tu cuenta
          </p>
        </div>
        <Button onClick={handleNuevoVendedor} size="lg">
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Vendedor
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vendedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vendedores Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Comisión Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0
                ? (vendedores.reduce((sum, v) => sum + v.porcentajeComision, 0) / stats.total).toFixed(1)
                : '0'
              }%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de vendedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Vendedores</CardTitle>
          <CardDescription>
            Vendedores asignados a tu cuenta como Broker
          </CardDescription>

          {/* Barra de búsqueda */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar vendedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVendedores.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? 'No se encontraron vendedores' : 'No tienes vendedores registrados'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza registrando tu primer vendedor'
                }
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <Button onClick={handleNuevoVendedor}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Registrar Primer Vendedor
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Comisión</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead>Asignado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendedores.map((vendedor) => (
                    <TableRow key={vendedor.idUsuario}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {vendedor.nombre} {vendedor.apellido}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{vendedor.nombreUsuario}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {vendedor.email}
                          </div>
                          {vendedor.telefono && (
                            <div className="flex items-center text-sm">
                              <Phone className="h-3 w-3 mr-1" />
                              {vendedor.telefono}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {vendedor.porcentajeComision}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={vendedor.estaActivo ? "default" : "secondary"}>
                          {vendedor.estaActivo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatLastAccess(vendedor.ultimoAcceso)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(vendedor.fechaAsignacion)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditarVendedor(vendedor.idUsuario)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}