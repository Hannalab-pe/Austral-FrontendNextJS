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
import { MapPin, Route, Clock, Car, Navigation, Sparkles, ArrowRight } from 'lucide-react';

export default function GeneradorRutasPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<RutaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header mejorado */}
        <div className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Navigation className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Generador de Rutas Inteligente
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Optimiza tus rutas de visita y ahorra tiempo en tus desplazamientos
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Optimización automática</span>
            </div>
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-green-500" />
              <span>Rutas eficientes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Ahorro de tiempo</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Panel de entrada mejorado */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <span>Describe tu ruta</span>
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Cuéntanos los lugares que necesitas visitar y te ayudaremos a encontrar la ruta más eficiente
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="query" className="text-base font-medium">
                  Lugares a visitar
                </Label>
                <Textarea
                  id="query"
                  placeholder="Ejemplo:
• Visitar cliente en Av. Corrientes 1234, Buenos Aires
• Entregar documentos en Calle Florida 567, Buenos Aires
• Reunión en Córdoba 890, Rosario
• Recoger mercadería en Av. Santa Fe 111, Córdoba

O simplemente: 'Visitar clientes en Buenos Aires, Córdoba y Rosario'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={12}
                  className="resize-none text-base leading-relaxed border-2 focus:border-blue-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleGenerateRoute();
                    }
                  }}
                />
              </div>

              <Button
                onClick={handleGenerateRoute}
                disabled={loading}
                size="lg"
                className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Calculando ruta óptima...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Route className="h-5 w-5" />
                    <span>Generar Ruta Inteligente</span>
                  </div>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Panel de resultados mejorado */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Route className="h-5 w-5 text-green-600" />
                </div>
                <span>Tu Ruta Optimizada</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!response && !loading && (
                <div className="text-center py-16 space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full mx-auto flex items-center justify-center">
                      <Navigation className="h-12 w-12 text-blue-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700">¡Comienza tu viaje!</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      Describe los lugares que necesitas visitar y nuestra IA te ayudará a encontrar la ruta más eficiente para optimizar tu tiempo y reducir costos.
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4 text-sm text-gray-400">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600">
                      🚀 Rápido
                    </Badge>
                    <Badge variant="secondary" className="bg-green-50 text-green-600">
                      💰 Eficiente
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-50 text-purple-600">
                      🎯 Optimizado
                    </Badge>
                  </div>
                </div>
              )}

              {loading && (
                <div className="text-center py-16 space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-200 rounded-full mx-auto"></div>
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full animate-spin border-t-transparent mx-auto"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700">Calculando la ruta perfecta</h3>
                    <p className="text-gray-500">Analizando distancias, tiempos y optimizando el orden de visita...</p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}

              {response && (
                <div className="space-y-6">
                  {/* Información general con mejor diseño */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Origen</p>
                          <p className="text-sm text-blue-700 font-medium">{response.origin}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center space-x-3">
                        <Car className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-900">Distancia Total</p>
                          <p className="text-lg font-bold text-green-700">{response.total_distance_km} km</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-orange-900">Tiempo Estimado</p>
                          <p className="text-lg font-bold text-orange-700">{response.estimated_time_min} min</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-center space-x-3">
                        <Route className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium text-purple-900">Paradas</p>
                          <p className="text-lg font-bold text-purple-700">{response.optimized_order.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Orden optimizado mejorado */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg flex items-center space-x-2">
                      <ArrowRight className="h-5 w-5 text-blue-600" />
                      <span>Orden Optimizado de Visita</span>
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {response.optimized_order.map((location, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-md"
                        >
                          <span className="font-bold text-lg">{index + 1}</span>
                          <span className="font-medium">{location}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Pasos detallados mejorados */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg flex items-center space-x-2">
                      <Navigation className="h-5 w-5 text-green-600" />
                      <span>Detalles del Recorrido</span>
                    </h4>
                    <div className="space-y-3">
                      {response.steps.map((step, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {step.from} <ArrowRight className="inline h-4 w-4 mx-1" /> {step.to}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {step.distance} • {step.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Botón de Google Maps mejorado */}
                  <Button
                    onClick={handleOpenGoogleMaps}
                    size="lg"
                    variant="outline"
                    className="w-full h-12 text-lg font-medium border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600"
                  >
                    <MapPin className="h-5 w-5 mr-3" />
                    Ver Ruta Completa en Google Maps
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}