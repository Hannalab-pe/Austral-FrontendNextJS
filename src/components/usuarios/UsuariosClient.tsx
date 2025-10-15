'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UsuariosTable from '@/components/usuarios/UsuariosTable';
import { Usuario } from '@/types/usuario.interface';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import {
  useUsuarios,
  useActivateUsuario,
  useDeactivateUsuario,
  useBlockUsuario,
  useUnblockUsuario,
} from '@/lib/hooks/useUsuarios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface UsuariosClientProps {
  initialData?: Usuario[];
}

export default function UsuariosClient({ initialData }: UsuariosClientProps) {
  const router = useRouter();
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    action: () => {},
  });

  // Queries y Mutations con TanStack Query
  const { data: usuarios = [], isLoading, refetch } = useUsuarios(undefined, initialData);
  const activateUsuario = useActivateUsuario();
  const deactivateUsuario = useDeactivateUsuario();
  const blockUsuario = useBlockUsuario();
  const unblockUsuario = useUnblockUsuario();

  // Handlers
  const handleView = (usuario: Usuario) => {
    // TODO: Implementar vista de detalles
    router.push(`/usuarios/${usuario.id_usuario}`);
  };

  const handleEdit = (usuario: Usuario) => {
    router.push(`/usuarios/${usuario.id_usuario}/editar`);
  };

  const handleDelete = (usuario: Usuario) => {
    setActionDialog({
      isOpen: true,
      title: '¿Eliminar usuario?',
      description: `¿Estás seguro de eliminar a ${usuario.nombre} ${usuario.apellido}? Esta acción no se puede deshacer.`,
      action: () => deactivateUsuario.mutate(usuario.id_usuario),
    });
  };

  const handleActivate = (usuario: Usuario) => {
    setActionDialog({
      isOpen: true,
      title: '¿Activar usuario?',
      description: `¿Estás seguro de activar a ${usuario.nombre} ${usuario.apellido}?`,
      action: () => activateUsuario.mutate(usuario.id_usuario),
    });
  };

  const handleDeactivate = (usuario: Usuario) => {
    setActionDialog({
      isOpen: true,
      title: '¿Desactivar usuario?',
      description: `¿Estás seguro de desactivar a ${usuario.nombre} ${usuario.apellido}? El usuario no podrá acceder al sistema.`,
      action: () => deactivateUsuario.mutate(usuario.id_usuario),
    });
  };

  const handleBlock = (usuario: Usuario) => {
    setActionDialog({
      isOpen: true,
      title: '¿Bloquear usuario?',
      description: `¿Estás seguro de bloquear a ${usuario.nombre} ${usuario.apellido}? El usuario no podrá iniciar sesión.`,
      action: () => blockUsuario.mutate(usuario.id_usuario),
    });
  };

  const handleUnblock = (usuario: Usuario) => {
    setActionDialog({
      isOpen: true,
      title: '¿Desbloquear usuario?',
      description: `¿Estás seguro de desbloquear a ${usuario.nombre} ${usuario.apellido}?`,
      action: () => unblockUsuario.mutate(usuario.id_usuario),
    });
  };

  const closeDialog = () => {
    setActionDialog({
      isOpen: false,
      title: '',
      description: '',
      action: () => {},
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Usuarios</h1>
          <p className="text-gray-600">Gestiona los usuarios del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Recargar
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 transition-all duration-200"
            onClick={() => router.push('/usuarios/nuevo')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
      ) : (
        <UsuariosTable
          data={usuarios}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
        />
      )}

      <Dialog open={actionDialog.isOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionDialog.title}</DialogTitle>
            <DialogDescription>{actionDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                actionDialog.action();
                closeDialog();
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
