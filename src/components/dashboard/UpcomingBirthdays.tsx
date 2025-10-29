'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Cliente } from '@/types/cliente.interface';
import { Calendar, Gift } from 'lucide-react';
import { format, differenceInDays, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';

interface UpcomingBirthdaysProps {
  birthdays: Cliente[];
}

export function UpcomingBirthdays({ birthdays }: UpcomingBirthdaysProps) {
  if (birthdays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
        <Gift className="h-8 w-8 mb-2" />
        <p className="text-sm">No hay cumpleaños próximos</p>
      </div>
    );
  }

  const getBirthdayMessage = (cumpleanos: Date | string) => {
    const fecha = new Date(cumpleanos);
    const hoy = new Date();
    const cumpleEsteAnio = new Date(hoy.getFullYear(), fecha.getMonth(), fecha.getDate());

    // Si ya pasó este año, considerar el próximo año
    if (cumpleEsteAnio < hoy) {
      cumpleEsteAnio.setFullYear(hoy.getFullYear() + 1);
    }

    const diasRestantes = differenceInDays(cumpleEsteAnio, hoy);

    if (diasRestantes === 0) return '¡Hoy!';
    if (diasRestantes === 1) return 'Mañana';
    if (diasRestantes <= 7) return `En ${diasRestantes} días`;
    return format(cumpleEsteAnio, 'dd/MM', { locale: es });
  };

  const getInitials = (cliente: Cliente) => {
    if (cliente.tipoPersona === 'NATURAL') {
      const nombres = cliente.nombres?.split(' ') || [];
      const apellidos = cliente.apellidos?.split(' ') || [];
      return `${nombres[0]?.[0] || ''}${apellidos[0]?.[0] || ''}`.toUpperCase();
    }
    return cliente.razonSocial?.[0]?.toUpperCase() || 'C';
  };

  return (
    <div className="space-y-4">
      {birthdays.slice(0, 10).map((cliente) => (
        <div key={cliente.idCliente} className="flex items-center space-x-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">
              {getInitials(cliente)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {cliente.nombreCompleto || cliente.nombres || cliente.razonSocial}
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {cliente.cumpleanos && format(new Date(cliente.cumpleanos), 'dd/MM/yyyy', { locale: es })}
              </span>
            </div>
          </div>
          <div className="text-xs font-medium text-right">
            {cliente.cumpleanos && getBirthdayMessage(cliente.cumpleanos)}
          </div>
        </div>
      ))}

      {birthdays.length > 10 && (
        <div className="text-center text-xs text-muted-foreground pt-2 border-t">
          Y {birthdays.length - 10} más...
        </div>
      )}
    </div>
  );
}