'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Actividad, TIPOS_ACTIVIDAD, COLORES_ACTIVIDAD } from '@/types/actividad.interface';

interface ActivitiesChartProps {
  activities: Actividad[];
}

export function ActivitiesChart({ activities }: ActivitiesChartProps) {
  // Contar actividades por tipo
  const activityCounts = activities.reduce((acc, activity) => {
    const tipo = activity.tipoActividad;
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convertir a formato para recharts
  const data = Object.entries(activityCounts).map(([tipo, count]) => ({
    tipo: TIPOS_ACTIVIDAD[tipo as keyof typeof TIPOS_ACTIVIDAD] || tipo,
    cantidad: count,
    color: COLORES_ACTIVIDAD[tipo as keyof typeof COLORES_ACTIVIDAD] || '#6B7280',
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No hay actividades registradas
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="tipo"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Tipo
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {label}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Cantidad
                      </span>
                      <span className="font-bold">
                        {payload[0].value}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="cantidad"
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}