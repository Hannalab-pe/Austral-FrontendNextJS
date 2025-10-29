
'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useClientes, useClientesStats } from '@/lib/hooks/useClientes';
import { useActividadesByUsuario } from '@/lib/hooks/useActividades';
import { useAuth } from '@/lib/hooks/useAuth';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { ActivitiesChart } from '@/components/dashboard/ActivitiesChart';
import { UpcomingBirthdays } from '@/components/dashboard/UpcomingBirthdays';

export default function DashboardPage() {
  const { user } = useAuth();

  // Obtener datos filtrados automáticamente por jerarquía del backend
  const { data: clientes = [], isLoading: loadingClientes } = useClientes();
  const { data: stats, isLoading: loadingStats } = useClientesStats();
  const { data: actividades = [], isLoading: loadingActividades } = useActividadesByUsuario(user?.idUsuario || '');

  // Filtrar cumpleaños próximos de los clientes del vendedor
  const getCumpleanosProximos = () => {
    if (!clientes.length) return [];

    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + 30); // Próximos 30 días

    return clientes
      .filter(cliente => cliente.cumpleanos && cliente.estaActivo)
      .filter(cliente => {
        const cumpleanos = new Date(cliente.cumpleanos!);
        const cumpleanosEsteAnio = new Date(hoy.getFullYear(), cumpleanos.getMonth(), cumpleanos.getDate());

        // Si ya pasó este año, considerar el próximo año
        if (cumpleanosEsteAnio < hoy) {
          cumpleanosEsteAnio.setFullYear(hoy.getFullYear() + 1);
        }

        return cumpleanosEsteAnio <= fechaLimite;
      })
      .sort((a, b) => {
        const fechaA = new Date(a.cumpleanos!);
        const fechaB = new Date(b.cumpleanos!);

        const hoy = new Date();
        const cumpleA = new Date(hoy.getFullYear(), fechaA.getMonth(), fechaA.getDate());
        const cumpleB = new Date(hoy.getFullYear(), fechaB.getMonth(), fechaB.getDate());

        if (cumpleA < hoy) cumpleA.setFullYear(hoy.getFullYear() + 1);
        if (cumpleB < hoy) cumpleB.setFullYear(hoy.getFullYear() + 1);

        return cumpleA.getTime() - cumpleB.getTime();
      })
      .slice(0, 10); // Limitar a 10 cumpleaños próximos
  };

  const cumpleanosProximos = getCumpleanosProximos();

  if (loadingClientes || loadingStats || loadingActividades) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[300px]" />
          <Skeleton className="col-span-3 h-[300px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido, {user?.nombre} {user?.apellido}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="h-[120px]" />}>
          <DashboardMetrics stats={stats || { total: 0, activos: 0, inactivos: 0 }} />
        </Suspense>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Mis Actividades por Tipo</CardTitle>
            <CardDescription>
              Distribución de actividades realizadas por mí en el sistema
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
              Clientes a mi cargo con cumpleaños en los próximos 30 días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px]" />}>
              <UpcomingBirthdays birthdays={cumpleanosProximos} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}