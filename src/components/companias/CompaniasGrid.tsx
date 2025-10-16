import { CompaniaSeguro } from '@/types/compania.interface';
import CompaniaCard from './CompaniaCard';

interface CompaniasGridProps {
  companias: CompaniaSeguro[];
  onView?: (compania: CompaniaSeguro) => void;
  onEdit?: (compania: CompaniaSeguro) => void;
  onDelete?: (compania: CompaniaSeguro) => void;
  onActivate?: (compania: CompaniaSeguro) => void;
  onDeactivate?: (compania: CompaniaSeguro) => void;
  onViewProducts?: (compania: CompaniaSeguro) => void;
}

export default function CompaniasGrid({
  companias,
  onView,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onViewProducts,
}: CompaniasGridProps) {
  if (companias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              No hay compañías de seguros
            </h3>
            <p className="text-gray-600 mt-1">
              Comienza agregando tu primera compañía de seguros
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companias.map((compania) => (
        <CompaniaCard
          key={compania.idCompania}
          compania={compania}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          onViewProducts={onViewProducts}
        />
      ))}
    </div>
  );
}
