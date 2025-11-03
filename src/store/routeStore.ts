import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SavedRoute {
    id: string;
    query: string;
    googleMapsUrl: string;
    createdAt: Date;
    totalDistance?: number;
    estimatedTime?: number;
}

interface RouteStore {
    savedRoutes: SavedRoute[];
    addRoute: (route: Omit<SavedRoute, 'id' | 'createdAt'>) => void;
    removeRoute: (id: string) => void;
    clearRoutes: () => void;
}

/**
 * Store para rutas generadas con persistencia en localStorage
 */
export const useRouteStore = create<RouteStore>()(
    persist(
        (set, get) => ({
            savedRoutes: [],

            addRoute: (route) => {
                const newRoute: SavedRoute = {
                    ...route,
                    id: Date.now().toString(),
                    createdAt: new Date(),
                };
                set((state) => ({
                    savedRoutes: [newRoute, ...state.savedRoutes],
                }));
            },

            removeRoute: (id) => {
                set((state) => ({
                    savedRoutes: state.savedRoutes.filter((route) => route.id !== id),
                }));
            },

            clearRoutes: () => {
                set({ savedRoutes: [] });
            },
        }),
        {
            name: 'route-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                savedRoutes: state.savedRoutes,
            }),
        }
    )
);