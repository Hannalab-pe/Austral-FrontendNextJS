'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { brokersService } from '@/services/brokers.service';
import { toast } from 'sonner';

interface BrokerMetrics {
  totalVendedores: number;
  vendedoresActivos: number;
  comisionTotalMes: number;
  comisionPromedio: number;
}

export default function BrokersDashboardClient() {
  const router = useRouter();
  // const { user } = useAuthStore(); // TODO: Usar para métricas personalizadas
  const [metrics, setMetrics] = useState<BrokerMetrics>({
    totalVendedores: 0,
    vendedoresActivos: 0,
    comisionTotalMes: 0,
    comisionPromedio: 0,
  });
  const [loading, setLoading] = useState(true);

  // Obtener métricas del broker actual
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const metricsData = await brokersService.getMetrics();
        setMetrics(metricsData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Error al obtener métricas';
        toast.error('Error al cargar métricas', {
          description: errorMessage,
        });
        console.error('Error obteniendo métricas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleNuevoVendedor = () => {
    router.push('/brokers/vendedores/nuevo');
  };

  const handleVerVendedores = () => {
    router.push('/brokers/vendedores');
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
          {/* Métricas principales */}
                <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Broker</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tus vendedores y administra comisiones
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalVendedores}</div>
            <p className="text-xs text-muted-foreground">
              Vendedores registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores Activos</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.vendedoresActivos}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant={metrics.vendedoresActivos === metrics.totalVendedores ? "default" : "secondary"}>
                {Math.round((metrics.vendedoresActivos / metrics.totalVendedores) * 100)}% activo
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comisión del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.comisionTotalMes.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comisión Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.comisionPromedio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Por vendedor activo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona tus vendedores de manera eficiente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleNuevoVendedor}
              className="w-full"
              size="lg"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Registrar Nuevo Vendedor
            </Button>

            <Button
              onClick={handleVerVendedores}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Users className="mr-2 h-4 w-4" />
              Ver Todos mis Vendedores
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Equipo</CardTitle>
            <CardDescription>
              Resumen del rendimiento de tu equipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Vendedores con ventas este mes</span>
                <Badge variant="default">3/4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Meta de comisión mensual</span>
                <Badge variant="secondary">75%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Vendedores nuevos este mes</span>
                <Badge variant="outline">1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}