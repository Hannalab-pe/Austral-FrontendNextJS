"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { UserProfile } from "@/types/auth.interface";
import { PerfilInfo } from "@/components/perfil/PerfilInfo";
import { CambiarContrasenaForm } from "@/components/perfil/CambiarContrasenaForm";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PerfilPage() {
  const { getUserProfile } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar el perfil";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [getUserProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        <Alert>
          <AlertDescription>No se pudo cargar la información del perfil</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Grid de componentes */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Información del perfil */}
        <div className="md:col-span-1">
          <PerfilInfo profile={profile} />
        </div>

        {/* Cambiar contraseña */}
        <div className="md:col-span-1">
          <CambiarContrasenaForm />
        </div>
      </div>
    </div>
  );
}