/**
 * Query Keys para TanStack Query
 * 
 * Este archivo centraliza todas las keys usadas en las queries para mantener
 * consistencia y facilitar la invalidación de caché.
 * 
 * Patrón:
 * - all: ['entidad'] - Base para todas las queries de una entidad
 * - lists: ['entidad', 'list'] - Para todas las listas
 * - list: ['entidad', 'list', filtros] - Para una lista específica con filtros
 * - details: ['entidad', 'detail'] - Para todos los detalles
 * - detail: ['entidad', 'detail', id] - Para un detalle específico
 */

import { UsuarioFiltros } from '@/types/usuario.interface';

// ============================================================================
// USUARIOS
// ============================================================================
export const usuariosKeys = {
    all: ['usuarios'] as const,
    lists: () => [...usuariosKeys.all, 'list'] as const,
    list: (filters?: UsuarioFiltros) => [...usuariosKeys.lists(), { filters }] as const,
    paginated: (page: number, limit: number, filters?: UsuarioFiltros) =>
        [...usuariosKeys.lists(), 'paginated', { page, limit, filters }] as const,
    details: () => [...usuariosKeys.all, 'detail'] as const,
    detail: (id: string) => [...usuariosKeys.details(), id] as const,
    stats: () => [...usuariosKeys.all, 'stats'] as const,
    byRole: (id_rol: string) => [...usuariosKeys.all, 'by-role', id_rol] as const,
};

// ============================================================================
// ROLES
// ============================================================================
export const rolesKeys = {
    all: ['roles'] as const,
    lists: () => [...rolesKeys.all, 'list'] as const,
    list: () => [...rolesKeys.lists()] as const,
    details: () => [...rolesKeys.all, 'detail'] as const,
    detail: (id: string) => [...rolesKeys.details(), id] as const,
};

// ============================================================================
// VISTAS
// ============================================================================
export const vistasKeys = {
    all: ['vistas'] as const,
    lists: () => [...vistasKeys.all, 'list'] as const,
    list: () => [...vistasKeys.lists()] as const,
    details: () => [...vistasKeys.all, 'detail'] as const,
    detail: (id: string) => [...vistasKeys.details(), id] as const,
    byRol: (idRol: string) => [...vistasKeys.all, 'by-rol', idRol] as const,
};

// ============================================================================
// CLIENTES (para uso futuro)
// ============================================================================
export const clientesKeys = {
    all: ['clientes'] as const,
    lists: () => [...clientesKeys.all, 'list'] as const,
    list: (filters?: any) => [...clientesKeys.lists(), { filters }] as const,
    details: () => [...clientesKeys.all, 'detail'] as const,
    detail: (id: string) => [...clientesKeys.details(), id] as const,
};

// ============================================================================
// LEADS (para uso futuro)
// ============================================================================
export const leadsKeys = {
    all: ['leads'] as const,
    lists: () => [...leadsKeys.all, 'list'] as const,
    list: (filters?: any) => [...leadsKeys.lists(), { filters }] as const,
    details: () => [...leadsKeys.all, 'detail'] as const,
    detail: (id: string) => [...leadsKeys.details(), id] as const,
};

// ============================================================================
// PRODUCTOS (para uso futuro)
// ============================================================================
export const productosKeys = {
    all: ['productos'] as const,
    lists: () => [...productosKeys.all, 'list'] as const,
    list: (filters?: any) => [...productosKeys.lists(), { filters }] as const,
    details: () => [...productosKeys.all, 'detail'] as const,
    detail: (id: string) => [...productosKeys.details(), id] as const,
};

// ============================================================================
// TAREAS (para uso futuro)
// ============================================================================
export const tareasKeys = {
    all: ['tareas'] as const,
    lists: () => [...tareasKeys.all, 'list'] as const,
    list: (filters?: any) => [...tareasKeys.lists(), { filters }] as const,
    details: () => [...tareasKeys.all, 'detail'] as const,
    detail: (id: string) => [...tareasKeys.details(), id] as const,
};

// ============================================================================
// ACTIVIDADES (para uso futuro)
// ============================================================================
export const actividadesKeys = {
    all: ['actividades'] as const,
    lists: () => [...actividadesKeys.all, 'list'] as const,
    list: (filters?: any) => [...actividadesKeys.lists(), { filters }] as const,
    details: () => [...actividadesKeys.all, 'detail'] as const,
    detail: (id: string) => [...actividadesKeys.details(), id] as const,
};

// ============================================================================
// NOTIFICACIONES (para uso futuro)
// ============================================================================
export const notificacionesKeys = {
    all: ['notificaciones'] as const,
    lists: () => [...notificacionesKeys.all, 'list'] as const,
    list: (filters?: any) => [...notificacionesKeys.lists(), { filters }] as const,
    unread: () => [...notificacionesKeys.all, 'unread'] as const,
    count: () => [...notificacionesKeys.all, 'count'] as const,
};
