
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Clock,
  User,
  FileText,
  DollarSign,
  Calendar,
  MessageSquare,
  Star,
  Filter,
  MoreHorizontal,
  Eye,
  Trash2,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos de notificaciones
type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  avatar?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Datos de ejemplo estáticos
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Cliente registrado exitosamente',
    message: 'El cliente Juan Pérez García ha sido registrado en el sistema con el ID #CL-2024-001.',
    timestamp: '2024-10-29T10:30:00Z',
    read: false,
    priority: 'high',
    category: 'Clientes',
    avatar: 'JP',
    actionUrl: '/clientes/CL-2024-001'
  },
  {
    id: '2',
    type: 'info',
    title: 'Nueva cotización generada',
    message: 'Se ha generado una nueva cotización para el seguro vehicular por S/ 2,500.00',
    timestamp: '2024-10-29T08:45:00Z',
    read: true,
    priority: 'medium',
    category: 'Cotizaciones',
    avatar: 'CT',
    actionUrl: '/cotizaciones/CT-2024-003'
  },
];

// Función para obtener el icono según el tipo
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'info':
      return <Info className="w-5 h-5 text-blue-500" />;
    case 'system':
      return <Bell className="w-5 h-5 text-purple-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

// Función para obtener el color del badge según la prioridad
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Función para formatear la fecha
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Hace menos de 1 hora';
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} horas`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} días`;
  }
};

export default function NotificacionesPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  // Filtrar notificaciones según la pestaña seleccionada
  const filteredNotifications = notifications.filter(notification => {
    switch (selectedTab) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      case 'high':
        return notification.priority === 'high';
      default:
        return true;
    }
  });

  // Estadísticas
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    high: notifications.filter(n => n.priority === 'high').length,
    today: notifications.filter(n => {
      const today = new Date();
      const notificationDate = new Date(n.timestamp);
      return notificationDate.toDateString() === today.toDateString();
    }).length
  };

  // Marcar como leída
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Marcar todas como leídas
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Eliminar notificación
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notificaciones
          </h1>
          <p className="text-gray-600 mt-1">
            Mantente al día con las actualizaciones importantes de tu cuenta
          </p>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              Todas ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs sm:text-sm">
              No leídas ({stats.unread})
            </TabsTrigger>
            <TabsTrigger value="high" className="text-xs sm:text-sm">
              Prioridad Alta ({stats.high})
            </TabsTrigger>
            <TabsTrigger value="read" className="text-xs sm:text-sm">
              Leídas
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={stats.unread === 0}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Marcar todas como leídas
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay notificaciones
                </h3>
                <p className="text-gray-600">
                  {selectedTab === 'unread'
                    ? '¡Excelente! Has leído todas tus notificaciones.'
                    : 'No hay notificaciones en esta categoría.'
                  }
                </p>
              </div>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "transition-all duration-200 hover:shadow-md border-l-4",
                !notification.read && "bg-blue-50/30 border-blue-200",
                notification.type === 'success' && "border-l-green-500",
                notification.type === 'warning' && "border-l-yellow-500",
                notification.type === 'error' && "border-l-red-500",
                notification.type === 'info' && "border-l-blue-500",
                notification.type === 'system' && "border-l-purple-500"
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar/Icono */}
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    <AvatarImage src={notification.avatar} />
                    <AvatarFallback className={cn(
                      "text-white font-semibold",
                      notification.type === 'success' && "bg-green-500",
                      notification.type === 'warning' && "bg-yellow-500",
                      notification.type === 'error' && "bg-red-500",
                      notification.type === 'info' && "bg-blue-500",
                      notification.type === 'system' && "bg-purple-500"
                    )}>
                      {notification.avatar || 'N'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getNotificationIcon(notification.type)}
                          <h3 className={cn(
                            "font-semibold text-lg",
                            !notification.read && "text-gray-900",
                            notification.read && "text-gray-700"
                          )}>
                            {notification.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn("text-xs", getPriorityColor(notification.priority))}
                          >
                            {notification.priority === 'high' ? 'Alta' :
                             notification.priority === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                        </div>

                        <p className={cn(
                          "text-gray-600 mb-3 leading-relaxed",
                          !notification.read && "text-gray-800"
                        )}>
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {notification.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}

                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            Ver detalles
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Footer con información adicional */}
      {filteredNotifications.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-8">
          <p>Mostrando {filteredNotifications.length} notificaciones</p>
          <p className="mt-1">Las notificaciones se actualizan automáticamente cada 5 minutos</p>
        </div>
      )}
    </div>
  );
}