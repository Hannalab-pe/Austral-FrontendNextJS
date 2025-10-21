import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/leads",
        destination:
          "https://austral-backendnestjs-production.up.railway.app/leads",
      },
      {
        source: "/api/leads/:path*",
        destination:
          "https://austral-backendnestjs-production.up.railway.app/leads/:path*",
      },
      {
        source: "/api/estados-lead",
        destination:
          "https://austral-backendnestjs-production.up.railway.app/estados-lead",
      },
      {
        source: "/api/estados-lead/:path*",
        destination:
          "https://austral-backendnestjs-production.up.railway.app/estados-lead/:path*",
      },
      {
        source: "/api/fuentes-lead",
        destination:
          "https://austral-backendnestjs-production.up.railway.app/fuentes-lead",
      },
      {
        source: "/api/fuentes-lead/:path*",
        destination:
          "https://austral-backendnestjs-production.up.railway.app/fuentes-lead/:path*",
      },
    ];
  },
};

export default nextConfig;
