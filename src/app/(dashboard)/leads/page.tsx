'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LeadsKanban from '@/components/leads/LeadsKanban';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { Lead } from '@/types/lead.interface';
import { toast } from 'sonner';

export default function LeadsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  // Manejar movimiento de lead entre columnas
  const handleLeadMove = (leadId: string, newEstadoId: string) => {
    console.log(`Lead ${leadId} movido a estado ${newEstadoId}`);
    // Aquí se haría la llamada a la API para actualizar el estado
  };

  // Manejar click en un lead
  const handleLeadClick = (lead: Lead) => {
    toast.info('Detalle del lead', {
      description: `${lead.nombre} ${lead.apellido || ''}`,
    });
    // Aquí se podría abrir un modal o navegar a la página de detalle
    // router.push(`/leads/${lead.id_lead}`);
  };

  // Estadísticas rápidas (por ahora mock, luego se pueden calcular desde el componente)
  const stats = {
    total: 0,
    activos: 0,
    alta_prioridad: 0,
  };

  return (
    <div className="space-y-6 overflow-hidden w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">
            Gestiona y da seguimiento a tus oportunidades de negocio
          </p>
        </div>
        <Button onClick={() => router.push('/leads/nuevo')}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lead
        </Button>
      </div>

      {/* Estadísticas */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total de Leads</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Leads Activos</p>
          <p className="text-2xl font-bold text-blue-600">{stats.activos}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Alta Prioridad</p>
          <p className="text-2xl font-bold text-red-600">{stats.alta_prioridad}</p>
        </div>
      </div> */}

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar leads por nombre, email, teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Vista Kanban */}
      <div className="bg-white border border-gray-200 rounded-lg w-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pipeline de Ventas</h2>
        </div>
        <div className="p-2">
          <LeadsKanban
            searchTerm={searchTerm}
            onLeadMove={handleLeadMove}
            onLeadClick={handleLeadClick}
          />
        </div>
      </div>
    </div>
  );
}
