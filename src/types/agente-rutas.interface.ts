// types/agente-rutas.interface.ts
export interface RutaQuery {
    query: string;
}

export interface RutaStep {
    from: string;
    to: string;
    distance: string;
    time: string;
}

export interface RutaResponse {
    origin: string;
    optimized_order: string[];
    total_distance_km: number;
    estimated_time_min: number;
    steps: RutaStep[];
    google_maps_url: string;
}