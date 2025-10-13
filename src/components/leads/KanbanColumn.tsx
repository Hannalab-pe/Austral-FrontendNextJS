import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Lead } from '@/types/lead.interface';
import LeadCard from './LeadCard';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
  columnId: string;
  titulo: string;
  color: string;
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
}

export default function KanbanColumn({
  columnId,
  titulo,
  color,
  leads,
  onLeadClick,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg">
      {/* Header de la columna */}
      <div 
        className="px-4 py-3 rounded-t-lg"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">
            {titulo}
          </h3>
          <Badge 
            variant="secondary" 
            className="bg-white/90 text-gray-900 font-semibold"
          >
            {leads.length}
          </Badge>
        </div>
      </div>

      {/* Área de drop para las cards */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 overflow-y-auto min-h-[200px] transition-colors ${
              snapshot.isDraggingOver 
                ? 'bg-blue-50 border-2 border-dashed border-blue-300' 
                : 'bg-gray-50'
            }`}
            style={{ maxHeight: 'calc(100vh - 280px)' }}
          >
            {leads.length === 0 && !snapshot.isDraggingOver ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                <p>No hay leads en esta etapa</p>
              </div>
            ) : (
              leads.map((lead, index) => (
                <Draggable 
                  key={lead.id_lead} 
                  draggableId={lead.id_lead} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${
                        snapshot.isDragging 
                          ? 'opacity-50 rotate-2 scale-105' 
                          : 'opacity-100'
                      } transition-all`}
                    >
                      <LeadCard 
                        lead={lead} 
                        onClick={() => onLeadClick?.(lead)}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
