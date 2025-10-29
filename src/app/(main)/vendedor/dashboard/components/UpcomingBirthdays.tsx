'use client';

import { Cliente } from '@/types/cliente.interface';
import { Calendar, User } from 'lucide-react';

interface UpcomingBirthdaysProps {
  birthdays: Cliente[];
}

export function UpcomingBirthdays({ birthdays }: UpcomingBirthdaysProps) {
  if (birthdays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
        <Calendar className="h-8 w-8 mb-2" />
        <p className="text-sm">No hay cumpleaños próximos</p>
      </div>
    );
  }

  const getDaysUntilBirthday = (cumpleanos: Date | string) => {
    const hoy = new Date();
    const fechaCumple = new Date(cumpleanos);
    const cumpleEsteAnio = new Date(hoy.getFullYear(), fechaCumple.getMonth(), fechaCumple.getDate());

    // Si ya pasó este año, calcular para el próximo año
    if (cumpleEsteAnio < hoy) {
      cumpleEsteAnio.setFullYear(hoy.getFullYear() + 1);
    }

    const diffTime = cumpleEsteAnio.getTime() - hoy.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const getBirthdayMessage = (days: number) => {
    if (days === 0) return '¡Hoy!';
    if (days === 1) return 'Mañana';
    return `En ${days} días`;
  };

  return (
    <div className="space-y-4">
      {birthdays.slice(0, 8).map((cliente) => {
        const days = getDaysUntilBirthday(cliente.cumpleanos!);
        const nombreCompleto = cliente.nombreCompleto ||
          `${cliente.nombres || ''} ${cliente.apellidos || ''}`.trim() ||
          cliente.razonSocial ||
          'Cliente sin nombre';

        return (
          <div key={cliente.idCliente} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {nombreCompleto}
              </p>
              <p className="text-xs text-muted-foreground">
                {cliente.cumpleanos && formatDate(cliente.cumpleanos)}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className={`text-xs font-medium ${
                days === 0 ? 'text-green-600' :
                days <= 7 ? 'text-orange-600' : 'text-blue-600'
              }`}>
                {getBirthdayMessage(days)}
              </p>
            </div>
          </div>
        );
      })}

      {birthdays.length > 8 && (
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            +{birthdays.length - 8} cumpleaños más
          </p>
        </div>
      )}
    </div>
  );
}