'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClienteStats } from '@/types/cliente.interface';
import { Users, UserCheck, UserX } from 'lucide-react';

interface DashboardMetricsProps {
  stats: ClienteStats;
}

export function DashboardMetrics({ stats }: DashboardMetricsProps) {
  const metrics = [
    {
      title: 'Total Clientes',
      value: stats.total,
      icon: Users,
      description: 'Clientes registrados en el sistema',
    },
    {
      title: 'Clientes Activos',
      value: stats.activos,
      icon: UserCheck,
      description: 'Clientes actualmente activos',
    },
    {
      title: 'Clientes Inactivos',
      value: stats.inactivos,
      icon: UserX,
      description: 'Clientes actualmente inactivos',
    },
  ];

  return (
    <>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}