import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { clientesService } from '@/services/clientes.service';
import { actividadService } from '@/services/actividad.service';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { ActivitiesChart } from '@/components/dashboard/ActivitiesChart';
import { UpcomingBirthdays } from '@/components/dashboard/UpcomingBirthdays';

async function getDashboardData() {
  try {
    const [clienteStats, actividades, cumpleanos] = await Promise.all([
      clientesService.getStats(),
      actividadService.getAll(),
      clientesService.getCumpleanosProximos(30),
    ]);

    return {
      clienteStats,
      actividades,
      cumpleanos,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      clienteStats: { total: 0, activos: 0, inactivos: 0 },
      actividades: [],
      cumpleanos: [],
    };
  }
}

export default async function DashboardPage() {
  const { clienteStats, actividades, cumpleanos } = await getDashboardData();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-[120px]" />}>
          <DashboardMetrics stats={clienteStats} />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividades por Tipo</CardTitle>
            <CardDescription>
              Distribución de actividades realizadas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<Skeleton className="h-[300px]" />}>
              <ActivitiesChart activities={actividades} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Cumpleaños Próximos</CardTitle>
            <CardDescription>
              Clientes con cumpleaños en los próximos 30 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px]" />}>
              <UpcomingBirthdays birthdays={cumpleanos} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}