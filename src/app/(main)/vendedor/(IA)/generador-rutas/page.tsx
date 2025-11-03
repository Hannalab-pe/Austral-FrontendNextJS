'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { agenteRutasService } from '@/services/agente-rutas.service';
import { RutaQuery, RutaResponse } from '@/types/agente-rutas.interface';
import { MapPin, Route, Clock, Car, Navigation, ArrowRight, AlertCircle, ExternalLink, Save, Trash2, History } from 'lucide-react';
import { toast } from 'sonner';
import { useRouteStore } from '@/store/routeStore';

export default function GeneradorRutasPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<RutaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const { savedRoutes, addRoute, removeRoute, clearRoutes } = useRouteStore();

  const handleGenerateRoute = async () => {
    if (!query.trim()) {
      setError('Por favor describe los lugares que quieres visitar para generar tu ruta');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const rutaQuery: RutaQuery = { query: query.trim() };
      const result = await agenteRutasService.generateRoute(rutaQuery);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al generar la ruta');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGoogleMaps = () => {
    if (response?.google_maps_url) {
      window.open(response.google_maps_url, '_blank');
    }
  };

  const handleSaveRoute = () => {
    if (response) {
      addRoute({
        query,
        googleMapsUrl: response.google_maps_url,
        totalDistance: response.total_distance_km,
        estimatedTime: response.estimated_time_min,
      });
      toast.success('Ruta guardada exitosamente');
    }
  };

  const handleDeleteRoute = (routeId: string) => {
    removeRoute(routeId);
    toast.success('Ruta eliminada');
  };

  const handleClearRoutes = () => {
    clearRoutes();
    toast.success('Todas las rutas eliminadas');
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Profesional */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-slate-900 rounded-lg">
              <Navigation className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Optimizador de Rutas
              </h1>
              <p className="text-slate-600 mt-1">
                Planificación inteligente de trayectos para máxima eficiencia
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mt-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>Optimización automática</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Ahorro de tiempo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
              <span>Reducción de costos</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de Entrada */}
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 pb-5">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-700" />
                Configuración de Ruta
              </CardTitle>
              <p className="text-sm text-slate-600 mt-2 font-normal">
                Describe los puntos de parada en el orden que prefieras
              </p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="query" className="text-sm font-medium text-slate-700">
                  Destinos y ubicaciones
                </Label>
                <Textarea
                  id="query"
                  placeholder="Ejemplo: Comenzar en la oficina ubicada en Av. República de Panamá 3055, San Isidro. Luego ir al Centro de Distribución en Av. Javier Prado 5250, La Molina. Después visitar cliente en Av. Larco 1301, Miraflores..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={10}
                  className="resize-none text-sm leading-relaxed border-slate-200 focus:border-slate-900 focus:ring-slate-900 bg-slate-50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleGenerateRoute();
                    }
                  }}
                />
                <p className="text-xs text-slate-500">
                  Presiona <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs">Ctrl+Enter</kbd> para generar
                </p>
              </div>

              <Button
                onClick={handleGenerateRoute}
                disabled={loading}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm transition-all"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Optimizando ruta...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    <span>Generar Ruta Óptima</span>
                  </div>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Error al generar ruta</p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Panel de Resultados */}
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 pb-5">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Route className="h-5 w-5 text-slate-700" />
                Resultado de Optimización
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {!response && !loading && (
                <div className="text-center py-16 space-y-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center">
                    <Navigation className="h-10 w-10 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      Sin ruta generada
                    </h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Ingresa las ubicaciones que necesitas visitar y el sistema calculará la ruta más eficiente automáticamente.
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-0">
                      Optimización IA
                    </Badge>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-0">
                      Tiempo real
                    </Badge>
                  </div>
                </div>
              )}

              {loading && (
                <div className="text-center py-16 space-y-6">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-slate-900 rounded-full animate-spin border-t-transparent"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      Procesando información
                    </h3>
                    <p className="text-sm text-slate-600">
                      Calculando distancias y optimizando el orden de visitas
                    </p>
                  </div>
                </div>
              )}

              {response && (
                <div className="space-y-6">
                  {/* Métricas Clave */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-md border border-slate-200">
                          <Car className="h-4 w-4 text-slate-700" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-600">Distancia</p>
                          <p className="text-xl font-semibold text-slate-900">{response.total_distance_km} km</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-md border border-slate-200">
                          <Clock className="h-4 w-4 text-slate-700" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-600">Tiempo</p>
                          <p className="text-xl font-semibold text-slate-900">{response.estimated_time_min} min</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-slate-600" />
                      <p className="text-xs font-medium text-slate-600">Punto de origen</p>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{response.origin}</p>
                  </div>

                  <Separator className="bg-slate-100" />

                  {/* Secuencia Optimizada */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-1 h-4 bg-slate-900 rounded-full"></div>
                      Secuencia de visitas
                    </h4>
                    <div className="space-y-2">
                      {response.optimized_order.map((location: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg"
                        >
                          <div className="w-7 h-7 bg-slate-900 text-white rounded-md flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-900">{location}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  {/* Detalle de Trayectos */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-1 h-4 bg-slate-900 rounded-full"></div>
                      Detalle de trayectos
                    </h4>
                    <div className="space-y-2">
                      {response.steps.map((step: any, index: number) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="w-6 h-6 bg-slate-200 text-slate-700 rounded-md flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-medium text-slate-900 truncate">{step.from}</p>
                                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                                  <p className="text-sm font-medium text-slate-900 truncate">{step.to}</p>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                  <span>{step.distance}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  <span>{step.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-slate-100" />

                  {/* Botón de Google Maps */}
                  <Button
                    onClick={handleOpenGoogleMaps}
                    variant="outline"
                    className="w-full h-11 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-medium transition-all"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir en Google Maps
                  </Button>

                  {/* Botón de Guardar Ruta */}
                  <Button
                    onClick={handleSaveRoute}
                    className="w-full h-11 bg-green-600 hover:bg-green-500 text-white font-medium transition-all"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Ruta
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sección de Rutas Guardadas */}
        {savedRoutes.length > 0 && (
          <Card className="mt-8 border border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 pb-5">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <History className="h-5 w-5 text-slate-700" />
                Rutas Guardadas
              </CardTitle>
              <p className="text-sm text-slate-600 mt-2 font-normal">
                Historial de rutas optimizadas generadas
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {savedRoutes.map((route) => (
                  <div key={route.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-slate-600 flex-shrink-0" />
                          <p className="text-sm font-medium text-slate-900 truncate">{route.query}</p>
                        </div>
                        {route.totalDistance && route.estimatedTime && (
                          <div className="flex items-center gap-4 text-xs text-slate-600 mb-2">
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              {route.totalDistance} km
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {route.estimatedTime} min
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-slate-500">
                          Guardada el {new Date(route.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => window.open(route.googleMapsUrl, '_blank')}
                          variant="outline"
                          size="sm"
                          className="border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteRoute(route.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Button
                  onClick={handleClearRoutes}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar todas las rutas
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
     </div>
   )
}